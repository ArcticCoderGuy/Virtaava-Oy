/**
 * ============================================
 * EVÄSTEKÄYTÄNTÖ-HALLINTA - VIRTAAVA OY
 * ============================================
 * 
 * Tämä tiedosto hoitaa GDPR-yhteensopivan evästekäytännön hallinnan.
 * Käyttäjä voi hyväksyä tai hylätä evästeet sekä muokata asetuksia.
 * 
 * EVÄSTEKATEGORIAT:
 * 1. Välttämättömät (necessary) - Aina päällä, sivuston toiminnan kannalta kriittiset
 * 2. Analytiikka (analytics) - Käyttäjä voi valita, Google Analytics yms.
 * 
 * TALLENNUSPAIKKA:
 * - Käyttää localStorage tallentamaan käyttäjän valinnat
 * - Tallentaa myös aikaleiman ja version
 * 
 * YLLÄPITO:
 * - Lisää uusia evästekategorioita tarvittaessa (esim. marketing, functional)
 * - Päivitä version-numero kun muutat evästekäytäntöä
 * - Lisää oikea Google Analytics -koodi loadAnalytics-metodiin
 */

class CookieConsent {
    /**
     * Konstruktori - Alustetaan evästehallinta
     */
    constructor() {
        this.init();
    }

    /**
     * Pääalustusmetodi
     * - Hakee DOM-elementit
     * - Tarkistaa onko käyttäjä jo tehnyt valinnan
     * - Asettaa event listenerit
     * - Lataa analytiikan jos lupa annettu
     */
    init() {
        // Hae kaikki tarvittavat DOM-elementit
        const banner = document.getElementById('cookie-banner');         // Evästebanneri sivun alareunassa
        const modal = document.getElementById('cookie-modal');           // Asetukset-modaali
        const acceptBtn = document.getElementById('cookie-accept');      // "Hyväksy kaikki" -nappi
        const rejectBtn = document.getElementById('cookie-reject');      // "Vain välttämättömät" -nappi
        const settingsBtn = document.getElementById('cookie-settings');  // "Asetukset" -nappi
        const saveBtn = document.getElementById('cookie-save');          // "Tallenna asetukset" -nappi modalissa
        const cancelBtn = document.getElementById('cookie-cancel');      // "Peruuta" -nappi modalissa
        const analyticsToggle = document.getElementById('analytics-toggle'); // Analytiikka on/off -kytkin
        
        /**
         * Tarkista onko käyttäjä jo tehnyt evästepäätöksen
         * Jos ei, näytä banneri 1 sekunnin viiveellä
         * YLLÄPITO: Muuta viivettä tarvittaessa (nyt 1000ms)
         */
        const cookieConsent = localStorage.getItem('cookie-consent');
        if (!cookieConsent) {
            setTimeout(() => {
                banner?.classList.remove('translate-y-full'); // Liukuanimaatio ylös
            }, 1000);
        }
        
        /**
         * "Hyväksy kaikki" -napin toiminta
         * - Hyväksyy kaikki evästekategoriat
         * - Piilottaa bannerin
         */
        acceptBtn?.addEventListener('click', () => {
            this.setConsent({ analytics: true }); // Hyväksy analytiikka
            banner?.classList.add('translate-y-full'); // Piilota banneri
        });
        
        /**
         * "Vain välttämättömät" -napin toiminta
         * - Hyväksyy vain välttämättömät evästeet
         * - Hylkää analytiikkaevästeet
         */
        rejectBtn?.addEventListener('click', () => {
            this.setConsent({ analytics: false }); // Hylkää analytiikka
            banner?.classList.add('translate-y-full'); // Piilota banneri
        });
        
        /**
         * "Asetukset" -napin toiminta
         * - Avaa asetusmodaalin
         * - Lataa nykyiset asetukset
         */
        settingsBtn?.addEventListener('click', () => {
            modal?.classList.remove('hidden'); // Näytä modaali
            const consent = this.getConsent();
            // Aseta kytkimen tila nykyisten asetusten mukaan
            if (analyticsToggle) analyticsToggle.checked = consent?.analytics || false;
        });
        
        /**
         * "Tallenna asetukset" -napin toiminta modalissa
         * - Tallentaa käyttäjän valinnat
         * - Sulkee modaalin ja bannerin
         */
        saveBtn?.addEventListener('click', () => {
            this.setConsent({ analytics: analyticsToggle?.checked || false });
            modal?.classList.add('hidden'); // Piilota modaali
            banner?.classList.add('translate-y-full'); // Piilota banneri
        });
        
        /**
         * "Peruuta" -napin toiminta modalissa
         * - Sulkee modaalin tallentamatta muutoksia
         */
        cancelBtn?.addEventListener('click', () => {
            modal?.classList.add('hidden');
        });
        
        /**
         * Sulje modaali kun klikataan taustan päällä
         * (Käyttäjäystävällisyys)
         */
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
        
        /**
         * Lataa analytiikka jos käyttäjä on aiemmin antanut luvan
         * Tämä tapahtuu sivun latautuessa
         */
        if (cookieConsent) {
            const consent = this.getConsent();
            if (consent?.analytics) {
                this.loadAnalytics();
            }
        }
    }
    
    /**
     * Tallentaa käyttäjän evästeasetukset
     * @param {Object} preferences - Käyttäjän valinnat {analytics: boolean}
     * 
     * TALLENNETTU DATA:
     * - necessary: aina true (välttämättömät evästeet)
     * - analytics: käyttäjän valinta
     * - timestamp: milloin valinta tehtiin
     * - version: evästekäytännön versio
     * 
     * YLLÄPITO: Lisää uusia kategorioita tähän (esim. marketing, functional)
     */
    setConsent(preferences) {
        const consent = {
            necessary: true,              // Välttämättömät evästeet aina päällä
            analytics: preferences.analytics, // Analytiikkaevästeet
            timestamp: Date.now(),        // Milloin valinta tehtiin
            version: '1.0'                // Evästekäytännön versio
        };
        
        // Tallenna localStorageen JSON-muodossa
        localStorage.setItem('cookie-consent', JSON.stringify(consent));
        
        // Aktivoi tai poista analytiikka valinnan mukaan
        if (consent.analytics) {
            this.loadAnalytics();
        } else {
            this.removeAnalytics();
        }
    }
    
    /**
     * Hakee käyttäjän evästeasetukset
     * @returns {Object|null} - Tallennetut asetukset tai null jos ei ole asetettu
     */
    getConsent() {
        const consent = localStorage.getItem('cookie-consent');
        return consent ? JSON.parse(consent) : null;
    }
    
    /**
     * Lataa analytiikkapalvelut (Google Analytics, Matomo, jne.)
     * 
     * YLLÄPITO: 
     * 1. Poista kommentit GA4-koodista
     * 2. Lisää oikea Measurement ID (G-XXXXXXXXXX)
     * 3. Lisää muita analytiikkapalveluita tarvittaessa
     * 
     * ESIMERKKI Google Analytics 4:
     * <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     */
    loadAnalytics() {
        console.log('📊 Analytics loaded with user consent');
        
        // POISTA KOMMENTIT JA LISÄÄ OMA MEASUREMENT ID:
        /*
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            
            // Lähetä page_view tapahtuma
            gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname
            });
        } else {
            // Lataa Google Analytics -skripti dynaamisesti
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
        }
        */
    }
    
    /**
     * Poistaa analytiikkapalvelut ja evästeet
     * 
     * TOIMINTA:
     * - Estää analytiikan tiedonkeruun
     * - Poistaa mahdolliset jo asetetut evästeet
     * 
     * YLLÄPITO: Lisää evästeiden poisto tarvittaessa
     */
    removeAnalytics() {
        console.log('🚫 Analytics disabled by user');
        
        // POISTA KOMMENTIT KUN GOOGLE ANALYTICS KÄYTÖSSÄ:
        /*
        // Estä Google Analytics -tiedonkeruu
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        // Poista Google Analytics -evästeet
        document.cookie.split(";").forEach(function(c) { 
            if (c.indexOf('_ga') === 0 || c.indexOf('_gid') === 0) {
                document.cookie = c.replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            }
        });
        */
    }
}

/**
 * ============================================
 * ALUSTUS
 * ============================================
 */

// Alusta evästehallinta kun DOM on valmis
// Tämä varmistaa että kaikki HTML-elementit ovat ladattu
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});

/**
 * ============================================
 * YLLÄPITO-OHJEET
 * ============================================
 * 
 * 1. GOOGLE ANALYTICS KÄYTTÖÖNOTTO:
 *    - Hanki Measurement ID Google Analytics -konsolista
 *    - Korvaa G-XXXXXXXXXX oikealla ID:llä
 *    - Poista kommentit loadAnalytics() ja removeAnalytics() -metodeista
 * 
 * 2. UUSIEN EVÄSTEKATEGORIOIDEN LISÄYS:
 *    - Lisää uusi toggle HTML:ään (esim. marketing-toggle)
 *    - Lisää kategoria setConsent() -metodiin
 *    - Käsittele uusi kategoria init() -metodissa
 * 
 * 3. EVÄSTEKÄYTÄNNÖN PÄIVITYS:
 *    - Muuta version-numero setConsent() -metodissa
 *    - Harkitse vanhojen valintojen nollaamista version vaihtuessa
 * 
 * 4. TESTAUS:
 *    - Tyhjennä localStorage: localStorage.removeItem('cookie-consent')
 *    - Lataa sivu uudelleen ja testaa kaikki napit
 *    - Tarkista että valinnat säilyvät sivun päivityksessä
 */