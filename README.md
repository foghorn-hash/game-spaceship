# 🛸 Plasma Void 3D – Asennusohje WordPress-sivustolle

**Plasma Void 3D** on moderni Three.js/WebGL -pohjainen 3D-avaruusräiskintäpeli, jossa ohjataan 2D-neonalusta (`ship.png`), ammutaan 3D-kiihdytettyjä plasmapuikkoja (`minute.png`) ja tuhotaan vaikeutuvia 3D-sotalaivoja dynaamisilla ääniefekteillä ja synthwave-taustamusiikilla.

Tämä ohje neuvoo, miten asennat ja upotat pelin WordPress-sivustollesi.

---

## 📦 Sisällysluettelo

1. [Tapa 1: WordPress-lisäosa (Suositeltu ja helpoin)](#1-tapa-1-valmis-wordpress-lisäosa-suositeltu)
2. [Tapa 2: Suora HTML-upotus (Ilman lisäosaa)](#2-tapa-2-suora-html-upotus-ilman-lisäosaa)
3. [Tapa 3: Pelin kääntäminen ja ajaminen omalta palvelimelta](#3-tapa-3-pelin-kääntäminen-omalle-palvelimelle-staattinen-build)
4. [Lyhytkoodin ([plasma_void_3d]) parametrit](#lyhytkoodin-parametrit)
5. [Pelin ohjaimet ja toiminnot](#pelin-ohjaimet)
6. [Usein kysytyt kysymykset ja vianmääritys](#vianmääritys)

---

## 1. Tapa 1: Valmis WordPress-lisäosa (Suositeltu)

Projektin mukana toimitetaan valmis WordPress-lisäosa kansiossa `/wordpress-plugin/plasma-void-3d/` sekä valmiiksi pakattuna ZIP-tiedostona `public/plasma-void-3d.zip`.

### Asennusvaiheet:

### Vaihtoehto A: Asennus ZIP-tiedostona WordPressin hallintapaneelista
1. Lataa `plasma-void-3d.zip` (löytyy tämän sovelluksen kansiosta `public/plasma-void-3d.zip`).
2. Kirjaudu WordPress-hallintapaneeliin (esim. `omasivusto.fi/wp-admin`).
3. Siirry valikkoon **Lisäosat** (Plugins) → **Lisää uusi** (Add New).
4. Klikkaa sivun yläreunasta painiketta **Lataa lisäosa** (Upload Plugin).
5. Valitse tietokoneeltasi `plasma-void-3d.zip` ja klikkaa **Asenna nyt** (Install Now).
6. Klikkaa **Ota lisäosa käyttöön** (Activate Plugin).

### Vaihtoehto B: Asennus FTP:llä tai cPanelin Tiedostonhallinnalla
1. Kopioi kansio `wordpress-plugin/plasma-void-3d` palvelimellesi polkuun:
   ```text
   /wp-content/plugins/plasma-void-3d/
   ```
2. Mene WordPressin hallintaan: **Lisäosat** → **Asennetut lisäosat** ja klikkaa *Ota käyttöön*.

---

### Pelin lisääminen sivulle lyhytkoodilla:

Avaa mikä tahansa sivu tai artikkeli (Gutenberg-lohkoeditori, Elementor, Divi tai Classic Editor):

1. **Gutenberg-editori:**
   - Lisää lohko **Lyhytkoodi** (Shortcode).
   - Kirjoita kenttään:
     ```text
     [plasma_void_3d]
     ```

2. **Elementor / Divi / Sivurakentajat:**
   - Lisää sivulle **Lyhytkoodi**- tai **HTML**-elementti.
   - Liitä arvoksi:
     ```text
     [plasma_void_3d height="700px" fullscreen="true"]
     ```

3. Tallenna ja julkaise sivu. Peli käynnistyy heti tyylikkäässä tummassa säiliössä täysnäyttöpainikkeineen!

---

## 2. Tapa 2: Suora HTML-upotus (Ilman lisäosaa)

Jos et halua asentaa erillistä lisäosaa, voit upottaa pelin suoraan käyttämällä HTML-iframea:

1. Avaa WordPress-sivusi editorissa.
2. Lisää **Mukautettu HTML** -lohko (Custom HTML) ja liitä seuraava koodi:

```html
<div style="position: relative; width: 100%; max-width: 1000px; margin: 20px auto; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid rgba(236,72,153,0.3); background: #000;">
  <iframe 
    src="https://ais-pre-ku3wybz4wkl3ab4576aqvu-421769122930.europe-west2.run.app" 
    style="width: 100%; height: 680px; border: none; display: block;" 
    allow="autoplay; fullscreen; xr-spatial-tracking"
    loading="lazy">
  </iframe>
</div>
```

---

## 3. Tapa 3: Pelin kääntäminen omalle palvelimelle (Staattinen build)

Jos haluat ajaa peliä 100 % omalla palvelimellasi ilman ulkoista verkko-osoitetta:

1. Aja projektin juurihakemistossa build-komento:
   ```bash
   npm run build
   ```
   Tämä luo `dist/`-kansion, joka sisältää kaikki valmiiksi paketoidut tiedostot:
   - `index.html`
   - `assets/*.js` ja `assets/*.css`
   - `assets/aistudio/minute_06a99cad.png`
   - `assets/aistudio/ship_f10530f0.png`

2. Siirrä `dist/`-kansion sisältö WordPress-palvelimellesi, esimerkiksi alihakemistoon:
   ```text
   /var/www/html/peli/
   ```
   (tai WordPressin hakemistoon `/wp-content/uploads/peli/`)

3. Tämän jälkeen peli avautuu osoitteesta `https://omasivusto.fi/peli/`, ja voit upottaa sen lyhytkoodilla:
   ```text
   [plasma_void_3d url="https://omasivusto.fi/peli/" height="700px"]
   ```

---

## Lyhytkoodin parametrit

Lisäosa tukee useita käteviä parametreja:

| Parametri | Oletusarvo | Kuvaus | Esimerkki |
|---|---|---|---|
| `url` | *Sovelluksen URL* | Pelin verkko-osoite | `url="https://omasivusto.fi/peli/"` |
| `height` | `680px` | Pelikentän korkeus | `height="800px"` tai `height="85vh"` |
| `width` | `100%` | Pelikentän leveys | `width="900px"` |
| `fullscreen` | `true` | Näytetäänkö koko näyttö -painike | `fullscreen="false"` |
| `class` | `""` | Oma CSS-luokka säiliölle | `class="my-game-box"` |

### Esimerkkejä:

* **Täyden ruudun pelikokemus:**
  ```text
  [plasma_void_3d height="85vh" fullscreen="true"]
  ```

* **Kompakti upotus sivupalkkiin tai kapealle palstalle:**
  ```text
  [plasma_void_3d height="500px" fullscreen="false"]
  ```

---

## Pelin ohjaimet

* **Tietokoneella (Näppäimistö & Hiiri):**
  - `W`, `A`, `S`, `D` tai **Nuolinäppäimet**: Ohjaa alusta 3D-tilassa
  - **Välilyönti**: Ammu 3D-kiihdytettyjä plasmapuikkoja
  - **Shift**: Turbo-kiihdytys / Boost
  - `P` tai `Esc`: Tauko (Pause)
  - Äänet ja musiikki: Mykistyskytkimet suoraan pelin alareunan ohjauspalkissa

* **Mobiililaitteilla (Kosketusnäyttö):**
  - Virtuaalinen suuntaohjain vasemmassa alakulmassa
  - **AMMU**- ja **BOOST**-toimintopainikkeet oikeassa alakulmassa

---

## Vianmääritys

1. **Äänet eivät kuulu heti sivun latauduttua:**
   - Nykyaikaiset verkkoselaimet (Chrome, Safari, Firefox) estävät äänten automaattisen toiston (*Autoplay Policy*). Äänet ja taustamusiikki aktivoituvat heti, kun pelaaja klikkaa *"ALOITA TAISTELU"* tai koskettaa näyttöä.

2. **Koko näyttö (Fullscreen) ei toimi:**
   - Varmista, että iframessa on attribuutti `allow="fullscreen"`. WordPress-lisäosa asettaa tämän automaattisesti.

3. **HTTPS-vaatimus:**
   - Jos WordPress-sivustosi käyttää HTTPS-yhteyttä, myös pelin URL-osoitteen on oltava `https://` (Mixed Content -eston välttämiseksi).

---

*Kehitetty Three.js:llä ja Web Audio API:lla.*
