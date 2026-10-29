# 🛸 Plasma Void 3D – Peli, Älypuhelinversio & Google Play -Julkaisuohje

**Plasma Void 3D** on moderni Three.js/WebGL -pohjainen 3D-avaruusräiskintäpeli, jossa ohjataan 2D-neonalusta (`ship.png`), ammutaan 3D-kiihdytettyjä plasmapuikkoja (`minute.png`) ja tuhotaan vaikeutuvia 3D-sotalaivoja dynaamisilla ääniefekteillä, haptisella tärinällä ja synthwave-taustamusiikilla.

Peli on optimoitu toimimaan sulavasti **älypuhelimilla (Android & iOS)**, **WordPress-sivustoilla** ja se on nyt valmiiksi konfiguroitu natiivina Android-projektina julkaistavaksi ja myytäväksi **Google Play Storessa**.

---

## 📱 Älypuhelinoptimoinnit (Mobile & Smartphone Features)

Peli sisältää täyden natiivitasoisen mobiilikokemuksen:
1. **Virtuaalinen 360° Analoginen Joystick (Vasen peukalo):**
   - Sulava analoginen ohjaustatti, jolla alusta voi liikuttaa mihin tahansa suuntaan tarkasti.
2. **Ergonomiset Taistelupainikkeet (Oikea peukalo):**
   - **AMMU-painike:** Suuri, hehkuva plasmapainike (pidä pohjassa jatkuvaan tuleen tai napauta).
   - **AUTOTULI-kytkin (Auto-Fire ON/OFF):** Mahdollistaa pelin pelaamisen yhdellä kädellä ilman sormen väsymistä!
   - **BOOST-painike:** Syöksyvä turbo-kiihdytys vihollisten tulen väistämiseen.
3. **Haptinen Tärinäpalaute (Haptic Feedback):**
   - Tukee sekä Android/Capacitor-natiivitärinää että Web Vibration APIa.
   - Pienet tärähdykset ammuttaessa, selkeä tärinä osumissa ja raskas jyrinä vihollissotalaivan räjähtäessä.
4. **Dynaaminen Kameran Kehystys (Muotokuva & Vaakatila):**
   - Peli mukauttaa kameran etäisyyden ja katselukulman automaattisesti älypuhelimen pystynäytölle (Portrait). Pelaaja ja vihollinen eivät koskaan karkaa näytön reunojen ulkopuolelle.
5. **Turva-alueet (Safe Area Insets):**
   - Mittaristot huomioivat puhelinten kamerareiät ja näyttölovet (`viewport-fit=cover`).

---

## 📦 Sisällysluettelo

1. [Pelin saaminen myyntiin Google Playhin (Vaihe vaiheelta)](#1-pelin-saaminen-myyntiin-google-playhin)
2. [Valmis Android-projekti ja kääntäminen (.aab)](#2-valmis-android-projekti-ja-kääntäminen-aab)
3. [WordPress-lisäosa ja asennus](#3-wordpress-lisäosa-ja-asennus)
4. [Pelin ohjaimet (Mobiili & Tietokone)](#4-pelin-ohjaimet)
5. [MIT-Lisenssi ja Tekijänoikeudet](#5-mit-lisenssi-ja-tekijänoikeudet)

---

## 1. Pelin saaminen myyntiin Google Playhin

Voit asettaa pelin myyntiin Google Play Storeen maksullisena sovelluksena (Paid App) tai tarjota sitä ilmaiseksi. Tässä on tarkka vaiheittainen ohje:

### Vaihe 1: Luo Google Play Console -kehittäjätili
1. Mene osoitteeseen: [play.google.com/console](https://play.google.com/console/signup)
2. Kirjaudu Google-tililläsi.
3. Maksa kertaluonteinen rekisteröitymismaksu **25 USD**.
4. Suorita henkilöllisyyden ja kehittäjäprofiilin vahvistus (Googlen vaatimus kehittäjille).
5. **Aseta kauppiasprofiili (Payments Profile):**
   - Jos haluat myydä peliä, siirry kohdassa *Settings* → *Developer account* → *Payment settings* ja luo kauppiastili, johon liität pankkitilisi myyntitulojen vastaanottamista varten.

---

### Vaihe 2: Luo uusi sovellus Google Play Consolessa
1. Klikkaa Play Consolessa **Create app** (Luo sovellus).
2. Täytä perustiedot:
   - **App name:** `Plasma Void 3D - Kosminen Taistelu` (tai `Plasma Void 3D - Space Combat`)
   - **Default language:** Suomi (tai Englanti)
   - **App or Game:** Valitse **Game** (Peli)
   - **Free or Paid:** Valitse **Paid** (Maksullinen), jos haluat myydä peliä (esim. 1,49 € tai 2,99 €), tai **Free**.
3. Hyväksy ilmoitukset ja napsauta **Create app**.

---

### Vaihe 3: Täytä kaupan pakolliset tiedot (Store Listing & Policy)

Google vaatii seuraavat kohdat ennen julkaisua:

1. **Kauppasivun tekstit ja grafiikat (Main Store Listing):**
   - **Lyhyt kuvaus:** Vauhdikas 3D-avaruusräiskintä älypuhelimille! Ammu kiihdytettyjä plasmapuikkoja ja tuhoa kehittyvät sotalaivat.
   - **Täysi kuvaus:** Kerro pelin ominaisuuksista (3D Three.js -grafiikat, kosketusohjaus virtuaalisella joystickillä, autotuli, haptinen tärinä, vaikeutuvat viholliset).
   - **Sovelluskuvake:** 512 x 512 px PNG (32-bittinen, enintään 1024 kt).
   - **Ominaisuusgrafiikka (Feature graphic):** 1024 x 500 px JPEG tai PNG.
   - **Kuvakaappaukset (Screenshots):** Vähintään 4 kuvakaappausta älypuhelimelta (sekä halutessasi 7" ja 10" tableteilta).
2. **Tietosuojakäytäntö (Privacy Policy):**
   - Linkitä yksinkertainen tietosuojaseloste (esim. verkkosivullasi tai ilmaisella GitHub Pages / Google Docs -sivulla), jossa todetaan: *"Peli ei kerää eikä jaa henkilötietoja kolmansille osapuolille."*
3. **Ikärajakysely (Content Rating):**
   - Vastaa IARC-kyselyyn: Pelityyppi on peli / arcade-avaruusräiskintä. Väkivalta on lievää sci-fi / pikseli- ja avaruusalusammuntaa ilman verta. Peli saa tyypillisesti luokituksen **PEGI 3** tai **PEGI 7**.
4. **Kohderyhmä (Target Audience):**
   - Valitse ikäryhmät (esim. 13+ tai kaikki iät).
5. **Tietoturva (Data Safety):**
   - Vastaa: Sovellus ei kerää käyttäjätietoja ("No user data collected").

---

### Vaihe 4: Hinnoittelu ja myynti (Pricing & Distribution)
1. Siirry Play Consolessa kohtaan **App pricing** (Sovelluksen hinnoittelu).
2. Aseta perushinta (esim. **1,99 €**). Google laskee automaattisesti paikalliset valuuttahinnat ja verot eri maille.
3. Valitse maat, joissa peli on myynnissä (esim. Suomi, EU tai maailmanlaajuisesti).

---

## 2. Valmis Android-projekti ja kääntäminen (.aab)

Projektin juurihakemistossa on valmiiksi konfiguroitu natiivi Android-projekti:
📁 **`android/`** (Capacitor Android -projekti, pakettitunnus: `com.plasmavoid.game`)

### Vaihe A: Käännä web-koodi ja synkronoi
Projektin juurihakemistossa aja komento:
```bash
npm run build:android
```
Tämä kääntää optimoidun Three.js-verkkopelin ja kopioi sen suoraan Android-projektin varoihin (`android/app/src/main/assets/public`).

---

### Vaihe B: Avaa Android Studiossa ja luo julkaisupaketti (.aab)

1. Avaa kansio `android/` **Android Studio** -ohjelmassa:
   ```bash
   npx cap open android
   ```
   (tai avaa Android Studio ja valitse *Open an Existing Project* → valitse projektin `android`-kansio).

2. **Luo allekirjoitettu julkaisupaketti (Signed Bundle):**
   - Mene ylävalikkoon: **Build** → **Generate Signed Bundle / APK...**
   - Valitse **Android App Bundle** (`.aab`) ja klikkaa *Next*.
   - **Key store path:** Valitse olemassa oleva `.jks`-avaintiedostosi tai klikkaa *Create new...* luodaksesi uuden allekirjoitusavaimen.
     *(Tärkeää: Ota avaintiedosto ja salasanat talteen – tarvitset samaa avainta tuleviin päivityksiin!)*
   - Valitse Build Variant: **release**.
   - Klikkaa **Create**.

3. Android Studio luo tiedoston:
   ```text
   android/app/release/app-release.aab
   ```

---

### Vaihe C: Lataa .aab Google Play Consoleen ja julkaise!

1. Mene Play Consolessa sovelluksesi sivulle kohtaan:
   - **Production** (Tuotanto) tai **Internal testing** (Sisäinen testaus).
2. Klikkaa **Create new release** (Luo uusi julkaisu).
3. Vedä ja pudota luomasi `app-release.aab` latauskenttään.
4. Anna julkaisulle nimi (esim. `1.0.0 - Ensimmäinen julkaisu`) ja julkaisutiedot.
5. Klikkaa **Next** → **Save** → **Review and rollout**.
6. Google tarkistaa sovelluksen (tarkistus kestää yleensä 1–3 arkipäivää). Hyväksynnän jälkeen peli ilmestyy suoraan Google Playhin myyntiin!

---

## 3. WordPress-lisäosa ja asennus

Jos haluat tarjota peliä myös omalla verkkosivullasi:
Projektin mukana toimitetaan valmis itsenäinen lisäosapaketti:
📁 **`public/plasma-void-3d.zip`**

1. Lataa `public/plasma-void-3d.zip`.
2. WordPressissä: **Lisäosat** → **Lisää uusi** → **Lataa lisäosa** → Ota käyttöön.
3. Liitä mille tahansa sivulle lyhytkoodi:
   ```text
   [plasma_void_3d height="720px" fullscreen="true"]
   ```

---

## 4. Pelin ohjaimet

* **Älypuhelimella (Mobiili):**
  - **Vasen peukalo:** Virtuaalinen analoginen joystick (360° liikkuminen).
  - **Oikea peukalo:** AMMU (vihreä plasmapainike), AUTOTULI-kytkin ja BOOST.
  - **Yläpalkki:** Pika-pause, ääni- ja tärinäasetukset.

* **Tietokoneella:**
  - `W`, `A`, `S`, `D` tai **Nuolinäppäimet**: Liiku 3D-tilassa
  - **Välilyönti** tai **Hiiren vasen painike**: Ammu 3D-kiihdytettyjä plasmapuikkoja
  - **Shift**: Turbo-kiihdytys / Boost
  - `P` tai `Esc`: Tauko (Pause)

---

## 5. MIT-Lisenssi ja Tekijänoikeudet

Peli on lisensoitu sallivalla **MIT-lisenssillä** (Copyright (c) 2026 Matti Kiviharju).
* Saat myydä peliä Google Playssa ja pitää 100 % voitoistasi (miinus Googlen komissio).
* Sinun ei tarvitse avata koodia julkiseksi.
* Lisätietoja tiedostoissa: [`LICENSE`](./LICENSE) ja [`LICENSE-FAQ.md`](./LICENSE-FAQ.md).
