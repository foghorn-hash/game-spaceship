# 🛸 Plasma Void 3D – WordPress-lisäosa & Asennusohje

**Plasma Void 3D** on moderni Three.js/WebGL -pohjainen 3D-avaruusräiskintäpeli, jossa ohjataan 2D-neonalusta (`ship.png`), ammutaan 3D-kiihdytettyjä plasmapuikkoja (`minute.png`) ja tuhotaan vaikeutuvia 3D-sotalaivoja dynaamisilla ääniefekteillä ja synthwave-taustamusiikilla.

> **💡 PÄIVITYS v1.1.0 (Korjaus "Error: Page not found" -virheeseen):**
> Aiempi versio yritti hakea peliä ulkoisesta testiosoitteesta, mikä aiheutti kuvakaappauksessa näkyneen *"Error: Page not found"* -ilmoituksen. 
> **Päivitetyssä versiossa koko peli on pakattu suoraan lisäosan sisään (`wp-content/plugins/plasma-void-3d/game/`)**, joten se toimii 100 % paikallisesti ja itsenäisesti omalla palvelimellasi ilman ulkoisia palvelinriippuvuuksia tai 404-virheitä!

---

## 📦 Sisällysluettelo

1. [Nopea asennus / päivitys WordPressiin](#1-nopea-asennus--päivitys-suositeltu)
2. [Lyhytkoodi ja käyttö sivulla](#2-lyhytkoodi-ja-käyttö-sivulla)
3. [Lisäosan asetukset hallintapaneelissa](#3-lisäosan-asetukset-hallintapaneelissa)
4. [Pelin ohjaimet ja toiminnot](#4-pelin-ohjaimet)
5. [MIT-Lisenssi & Julkaisu App Storessa / Google Playssa](#5-mit-lisenssi--julkaisu-app-storessa--google-playssa)
6. [Vianmääritys](#6-vianmääritys)

---

## 1. Nopea asennus / päivitys (Suositeltu)

Projektin mukana toimitetaan valmis itsenäinen WordPress-lisäosapaketti:
📁 **`public/plasma-void-3d.zip`**

### Vaiheet:
1. Lataa päivitetty `plasma-void-3d.zip` (koko peli on sisällytetty zip-pakettiin).
2. Kirjaudu WordPress-hallintapaneeliisi (esim. `omasivusto.fi/wp-admin`).
3. Siirry kohtaan **Lisäosat** (Plugins) → **Lisää uusi** (Add New).
4. Klikkaa sivun ylälaidasta **Lataa lisäosa** (Upload Plugin).
5. Valitse `plasma-void-3d.zip` ja klikkaa **Asenna nyt** (Install Now).
6. Jos vanha versio oli jo asennettuna, valitse: **Korvaa nykyinen ladatulla** (*Replace current with uploaded*).
7. Klikkaa **Ota lisäosa käyttöön** (*Activate Plugin*).

---

## 2. Lyhytkoodi ja käyttö sivulla

Voit liittää pelin mille tahansa sivulle tai artikkeliin (Gutenberg-lohkoeditori, Elementor, Divi tai Classic Editor):

### Peruskäyttö (suositus):
```text
[plasma_void_3d]
```

### Mukautetulla koolla ja täysnäyttöpainikkeella:
```text
[plasma_void_3d width="100%" height="720px" fullscreen="true"]
```

### Koko ruudun korkuinen näkymä:
```text
[plasma_void_3d height="85vh" fullscreen="true"]
```

### Lyhytkoodin kaikki parametrit:
| Parametri | Oletusarvo | Kuvaus | Esimerkki |
|---|---|---|---|
| `height` | `680px` | Pelikentän korkeus | `height="750px"` tai `height="85vh"` |
| `width` | `100%` | Pelikentän leveys | `width="960px"` |
| `fullscreen` | `true` | Näytetäänkö koko näyttö -painike | `fullscreen="false"` |
| `class` | `""` | Oma CSS-luokkanimi säiliölle | `class="custom-game-frame"` |
| `url` | *sisäänrakennettu* | Valinnainen oma ulkoinen osoite | Jätä tyhjäksi käyttääksesi paikallista peliä |

---

## 3. Lisäosan asetukset hallintapaneelissa

Voit muokata lisäosan yleisasetuksia WordPressin päävalikosta:
> **Asetukset** → **Plasma Void 3D**

- **Sisäänrakennettu peli:** Näyttää automaattisesti vihreän vahvistuksen `✓ Sisäänrakennettu itsenäinen peli: KÄYTÖSSÄ`.
- **Oletuskorkeus:** Voit vaihtaa oletuskorkeuden (esim. `700px`).
- **Mukautettu URL:** Jätä tyhjäksi, jolloin käytetään aina lisäosan omaa paikallista pelitiedostoa.

---

## 4. Pelin ohjaimet

* **Tietokoneella (Näppäimistö & Hiiri):**
  - `W`, `A`, `S`, `D` tai **Nuolinäppäimet**: Ohjaa alusta 3D-avaruudessa
  - **Välilyönti**: Ammu 3D-kiihdytettyjä plasmapuikkoja
  - **Shift**: Turbo-kiihdytys / Boost
  - `P` tai `Esc`: Tauko (Pause)
  - Äänet ja musiikki: Mykistyskytkimet suoraan pelin alareunan ohjauspalkissa

* **Mobiililaitteilla (Kosketusnäyttö):**
  - Virtuaalinen suuntaohjain vasemmassa alakulmassa
  - **AMMU**- ja **BOOST**-toimintopainikkeet oikeassa alakulmassa

---

## 5. MIT-Lisenssi & Julkaisu App Storessa / Google Playssa

Peli on lisensoitu **MIT-lisenssillä** (Copyright (c) 2026 Matti Kiviharju).
Tarkemmat lisenssitiedostot:
* 📄 [`LICENSE`](./LICENSE) — Virallinen MIT-lisenssiteksti.
* 📚 [`LICENSE-FAQ.md`](./LICENSE-FAQ.md) — Kattava UKK pelin julkaisemisesta Apple App Storessa ja Google Playssä (kaupallistaminen, DRM, Capacitor-mobiilipakettiohjeet).

### Pääkohdat pähkinänkuoressa:
1. **App Store & Google Play -yhteensopivuus:** MIT on 100 % sallittu ja yhteensopiva kummassakin sovelluskaupassa (toisin kuin GPL, MIT ei sisällä DRM-kieltoja).
2. **Kaupallistaminen:** Saat myydä peliä maksullisena, käyttää mainoksia tai lisätä sovelluksen sisäisiä ostoja (IAP).
3. **Suljettu lähdekoodi:** Sinun ei tarvitse jakaa pelin lähdekoodia julkaistessasi sovelluksen.
4. **Attribuutio:** Riittää, että pelin valikossa tai tietoruudussa näkyy tekijätieto ja lisenssimaininta (sisällytetty peliin suoraan).

---

## 6. Vianmääritys

* **Miksi aiemmin tuli "Error: Page not found"?**
  - Aiempi versio yritti ladata peliä kehitysympäristön väliaikaisesta Cloud Run -osoitteesta. Uudessa versiossa **1.1.0** peli sijaitsee WordPressin omalla palvelimella hakemistossa `/wp-content/plugins/plasma-void-3d/game/index.html`, jolloin 404-virhettä ei voi tulla.

* **Äänet eivät kuulu heti sivun auettua:**
  - Kaikki modernit selaimet vaativat käyttäjän ensimmäisen vuorovaikutuksen (klikkaus pelin "ALOITA TAISTELU" -nappiin) ennen kuin äänet saavat soida automaattisesti.

* **Koko näyttö (Fullscreen) mobiilissa:**
  - Yläpalkin `⛶ Koko näyttö` -painike avaa pelin koko laitteen näytölle parasta pelattavuutta varten.

---

*Kehitetty Three.js:llä ja Web Audio API:lla.*
