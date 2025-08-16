# 📘 VIRTAAVA OY - SIVUSTON YLLÄPITO-OHJE

## 🚀 Pikaohje ylläpitäjälle

Tämä ohje on tarkoitettu sivuston ylläpitäjälle, joka päivittää sisältöjä ja tekee pieniä muutoksia. Kaikki tiedostot on kommentoitu huolellisesti suomeksi.

---

## 📁 Tiedostorakenne

```
Virtaava Oy/
├── index.html           # Pääsivu (kaikki sisältö täällä)
├── script.js           # Sivuston toiminnallisuudet
├── cookie-consent.js   # Evästekäytäntö
├── styles.css          # Omat tyylit (tyhjä, käytetään Tailwindia)
├── img/
│   ├── logo1.png       # Yrityksen logo
│   └── hero-fysioterapia.jpg  # Hero-kuva
├── CLAUDE.md           # Projektin tila ja historia
└── YLLAPITO-OHJE.md    # Tämä tiedosto
```

---

## 🔧 Yleisimmät ylläpitotehtävät

### 1. 📝 Tekstien muuttaminen

**Missä:** `index.html`

Kaikki tekstit löytyvät suoraan HTML-tiedostosta. Etsi muutettava teksti CTRL+F hakutoiminnolla ja vaihda se.

```html
<!-- Esimerkki: Otsikon muuttaminen -->
<h1>Luotettava kumppani terveydessäsi</h1>
<!-- Muuta näin: -->
<h1>Uusi otsikko tähän</h1>
```

### 2. 📞 Yhteystietojen päivittäminen

**Missä:** `index.html`

Yhteystiedot esiintyvät useassa paikassa. **Muista päivittää kaikki!**

Hae ja korvaa kaikki esiintymät:
- **Puhelin:** `044 247 6464` ja `0442476464`
- **Sähköposti:** `info@hyvinvointivirtaava.fi`
- **Y-tunnus:** `[Y-tunnus tähän]`

Paikat missä yhteystiedot esiintyvät:
- Hero-osio (rivi ~119-125)
- Yhteystiedot-osio (rivi ~606-635)
- Footer (rivi ~801-810)

### 3. 🎨 Logon vaihtaminen

**Missä:** `img/logo1.png`

1. Nimeä uusi logo samalla nimellä: `logo1.png`
2. Korvaa vanha tiedosto `img/`-kansiossa
3. Logo näkyy automaattisesti navigaatiossa

**Logon koko:** Määritelty HTML:ssä rivillä ~49
```html
<img src="img/logo1.png" alt="Virtaava Oy - Hyvinvointi" 
     class="h-32 md:h-36 lg:h-40 w-auto">
```
- Pieni näyttö: h-32 (128px korkeus)
- Keskikokoinen: h-36 (144px)
- Iso näyttö: h-40 (160px)

### 4. 🖼️ Hero-kuvan vaihtaminen

**Missä:** `img/hero-fysioterapia.jpg`

1. Optimoi kuva ensin (max 500KB, 1920px leveys)
2. Nimeä: `hero-fysioterapia.jpg`
3. Korvaa vanha tiedosto

### 5. 🏢 Toimipisteiden tiedot

**Missä:** `index.html` rivit ~437-556

Jokainen toimipiste on omassa `<div>`-elementissään:

```html
<!-- Kemi toimipiste -->
<div class="bg-gradient-to-br from-blue-50...">
    <h3>Kemi</h3>
    <p>Päätoimipiste</p>
    <!-- Aukioloajat -->
    <div>Ma-Pe: 8:00-17:00</div>
</div>
```

### 6. 🔗 Ajanvarauslinkin päivittäminen

**Missä:** `index.html`

Hae: `https://varaa.nettiajat.fi/3894`
Korvaa kaikki esiintymät uudella linkillä (esiintyy ~8 kertaa)

### 7. 📋 Palveluiden muokkaaminen

**Missä:** `index.html` rivit ~156-298

Jokainen palvelu on korttina:

```html
<div class="bg-white p-8 rounded-xl...">
    <h3>Palvelun nimi</h3>
    <p>Palvelun kuvaus</p>
</div>
```

---

## 🎨 Värien muuttaminen

**Missä:** `index.html` rivit ~14-39 (Tailwind config)

Pääväri (cyan-sininen) määritelty:
```javascript
'medical-blue': '#0891b2',  // Muuta hex-koodi tähän
```

Muut värit cyan-skaalassa:
```javascript
'cyan': {
    50: '#ecfeff',   // Erittäin vaalea
    600: '#0891b2',  // Pääväri
    900: '#164e63'   // Erittäin tumma
}
```

---

## 🍪 Evästekäytäntö ja Google Analytics

**Missä:** `cookie-consent.js`

### Google Analytics käyttöönotto:

1. Hanki Measurement ID Google Analyticsista (muotoa G-XXXXXXXXXX)
2. Avaa `cookie-consent.js`
3. Etsi rivi ~189-214 (loadAnalytics-metodi)
4. Poista kommenttimerkit `/* */`
5. Korvaa `G-XXXXXXXXXX` oikealla ID:llä

```javascript
// Ennen:
/*
if (typeof gtag !== 'undefined') {
    ...
}
*/

// Jälkeen:
if (typeof gtag !== 'undefined') {
    gtag('config', 'G-TEIDÄIDTÄHÄN');
}
```

---

## 📱 Mobiilivalikon muokkaaminen

**Missä:** `index.html` rivit ~73-84

Mobiilivalikko näkyy vain pienillä näytöillä:
```html
<div class="md:hidden" id="mobile-menu">
    <a href="#palvelut">Palvelut</a>
    <a href="#tietoa">Tietoa meistä</a>
    <!-- Lisää uusia linkkejä tähän -->
</div>
```

---

## 🚨 Lomakkeen toiminta

**HUOM:** Lomake käyttää `mailto:`-toimintoa, joka avaa käyttäjän sähköpostiohjelman.

**Toiminta:** 
1. Käyttäjä täyttää lomakkeen
2. "Lähetä viesti" avaa sähköpostiohjelman
3. Viesti on esitäytetty lomakkeen tiedoilla

**Jos haluat oikean backend-integraation:**
- Tarvitset palvelimen (esim. Netlify Forms, Formspree)
- Muokkaa `script.js` tiedoston `handleFormSubmit`-metodia (rivi ~196)

---

## 💾 Varmuuskopiointi

**Ennen muutoksia:**
1. Kopioi koko `Virtaava Oy` -kansio
2. Nimeä kopio päivämäärällä: `Virtaava_Oy_backup_2025-01-26`

---

## 🐛 Yleisimmät ongelmat

### Logo ei näy
- Tarkista tiedostonimi: `img/logo1.png`
- Tarkista tiedostopolku HTML:ssä

### Tekstit eivät päivity
- Tyhjennä selaimen välimuisti (CTRL+SHIFT+R)
- Tarkista että tallensit tiedoston

### Mobiilimenu ei toimi
- Tarkista että `script.js` on ladattu
- Katso selaimen konsoli virheistä (F12)

### Evästebanneri ei näy
- Tyhjennä localStorage: Avaa konsoli (F12) ja kirjoita:
  ```javascript
  localStorage.removeItem('cookie-consent')
  ```

---

## 📞 Kehittäjän yhteystiedot

Jos tarvitset apua isompiin muutoksiin:

**Fox in the Code**
- Web: www.foxinthecode.fi
- Kehittäjä maininta footerissa

---

## 🔍 Hyödyllisiä työkaluja

- **Kuvien optimointi:** [TinyPNG](https://tinypng.com/)
- **Värikoodit:** [HTML Color Codes](https://htmlcolorcodes.com/)
- **Tailwind CSS luokat:** [Tailwind Docs](https://tailwindcss.com/docs)
- **Koodin validointi:** [W3C Validator](https://validator.w3.org/)

---

## 📝 Muistilista päivityksille

Kun päivität sivustoa, muista:

- [ ] Varmuuskopioi ensin
- [ ] Päivitä yhteystiedot KAIKKIALTA
- [ ] Testaa mobiilissa
- [ ] Testaa lomake
- [ ] Tyhjennä selaimen välimuisti
- [ ] Tarkista että kaikki linkit toimivat
- [ ] Päivitä CLAUDE.md tiedostoon mitä muutit

---

## 🎯 Nopeat komennot kehittäjille

```bash
# Käynnistä kehityspalvelin
npm run dev

# Avaa selaimessa
http://localhost:3000

# Git-komennot
git add .
git commit -m "Päivitetty yhteystiedot"
git push origin master
```

---

**Viimeksi päivitetty:** 26.1.2025  
**Versio:** 1.0