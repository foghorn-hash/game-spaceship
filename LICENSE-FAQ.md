# 📜 MIT-Lisenssi & UKK (FAQ) – Julkaisu Apple App Storessa ja Google Playssä

Tämä dokumentti käsittelee **Plasma Void 3D** -pelin MIT-lisenssiä ja antaa kattavat vastaukset kysymyksiin, jotka liittyvät pelin kaupallistamiseen ja julkaisemiseen **Apple App Storessa (iOS / iPadOS / macOS)** sekä **Google Play Storessa (Android)**.

---

## 📌 1. Mikä on MIT-lisenssi ja mitä se sallii?

MIT-lisenssi on yksi maailman suosituimmista ja sallivimmista (*permissive*) avoimen lähdekoodin lisensseistä.

### MIT sallii:
* **Kaupallisen käytön:** Voit myydä peliä, laittaa siihen mainoksia tai myydä sovelluksen sisäisiä ostoja (In-App Purchases).
* **Jakelun ja julkaisun:** Voit julkaista pelin millä tahansa alustalla, verkkosivulla, sovelluskaupassa tai laitealustalla.
* **Muokkaamisen ja jatkokehityksen:** Voit muuttaa pelin sääntöjä, grafiikoita, koodia ja ääniä vapaasti.
* **Suljetun lähdekoodin (*Proprietary*):** Sinun **ei** tarvitse julkaista lähdekoodiasi tai tehdä siitä avointa, kun jaat tai myyt käännettyä peliä.
* **Alilisensoinnin (*Sublicense*):** Voit liittää koodin osaksi laajempaa kaupallista tuotetta omien ehtojesi mukaisesti.

### MIT-lisenssin ainoa vaatimus:
* Alkuperäinen tekijänoikeusilmoitus ja lisenssiteksti tulee säilyttää ohjelmiston mukana (esim. pelin "Tietoja / Credits" -ruudussa tai asennuspaketissa).

---

## 🍎 2. Saako pelin julkaista Apple App Storessa?

### **Kyllä, 100 % laillisesti ja ongelmitta.**

### Miksi MIT toimii App Storessa (toisin kuin GPL)?
* Tiukemmat copyleft-lisenssit (kuten **GPLv2 / GPLv3**) ovat usein ristiriidassa Applen App Store EULA:n ja DRM-suojauksen (FairPlay) kanssa, koska GPL kieltää lisärajoitteiden asettamisen ja vaatii lähdekoodin jakelua.
* **MIT-lisenssissä ei ole copyleft-ehtoja, lähdekoodin jakeluvelvoitetta eikä DRM-kieltoja.**
* Apple hyväksyy rutiininomaisesti MIT-lisensoituja sovelluksia ja komponentteja App Storeen.

### Mitä Apple edellyttää kehittäjältä:
1. **Apple Developer Program -tili:** Vuosimaksu (n. 99 USD/vuosi).
2. **Käyttöehdot ja tietosuojaseloste:** App Store vaatii linkin tietosuojaselosteeseen (Privacy Policy) store-sivulle.
3. **Attribuutio:** Sisällytä lisenssiteksti ja käytettyjen kirjastojen maininnat sovelluksen sisälle (esim. pelin valikon "Credits / Lisenssit" -painikkeeseen).

---

## 🤖 3. Saako pelin julkaista Google Play Storessa?

### **Kyllä, täysin vapaasti.**

Google Play Storessa MIT-lisensoidun ohjelmiston julkaisemiselle ei ole mitään juridisia esteitä:
* Google Playn kehittäjäsopimus (*Developer Distribution Agreement, DDA*) sallii avoimen lähdekoodin komponentteja hyödyntävien ja MIT-lisensoitujen pelien julkaisun ja myynnin.
* Voit valita, julkaisetko pelin ilmaiseksi, maksullisena vai mainosrahoitteisena.

### Mitä Google edellyttää kehittäjältä:
1. **Google Play Console -tili:** Kertamaksu (25 USD).
2. **Tietosuojaseloste:** Google vaatii tietosuojakäytännön, erityisesti jos pelissä käytetään mainoksia tai analytiikkaa.
3. **Android App Bundle (.aab):** Google Play vaatii sovellukset `.aab`-muodossa nykyisin APK:n sijaan.

---

## 💰 4. Kaupallistaminen ja tulot

### Voinko tienata pelillä rahaa?
**Kyllä.** MIT-lisenssi ei aseta mitään rajoituksia ansaintamalleille:

1. **Maksullinen lataus (Premium App):** Voit asettaa pelille kiinteän hinnan (esim. 1,99 € tai 4,99 €) App Storessa ja Google Playssa. Kaikki tulot kuuluvat sinulle (miinus kaupan 15–30 % komissio).
2. **Mainokset:** Voit lisätä natiivimobiiliversioon mainosverkoston SDK:n (kuten Google AdMob tai Unity Ads) välimainoksille tai palkintovideoille.
3. **Sovelluksen sisäiset ostot (In-App Purchases / IAP):** Voit myydä kosmeettisia aluksia, uusia aseita tai erikoistasoja.
4. **Mainokseton versio:** Voit tarjota maksullisen päivityksen mainosten poistoon.

---

## 🔍 5. Pitääkö minun antaa lähdekoodini kenellekään?

### **Ei.**
Toisin kuin GPL-lisenssissä, MIT-lisenssissä **ei ole lähdekoodin luovutusvelvollisuutta**.
* Voit pitää tekemäsi parannukset, lisäkoodin ja pelin toteutuksen täysin suljettuna.
* Jaat loppukäyttäjille ja sovelluskauppaan ainoastaan käännetyn mobiilisovelluspaketin (`.ipa` iOS:lle ja `.aab` Androidille).

---

## 🏷️ 6. Miten lisenssin attribuutiovelvoite (Credit) täytetään sovelluksessa?

MIT-lisenssin ainoa vaatimus on:
> *"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software."*

Tämän täyttäminen mobiilipelissä on hyvin helppoa:
1. Lisää peliin pieni **"Info" / "Tekijät" (Credits)** -ruutu tai -painike (esimerkiksi aloitusruutuun tai alareunan valikkoon).
2. Näytä siinä tekijänoikeusilmoitus:
   ```text
   Plasma Void 3D
   Copyright (c) 2026 Matti Kiviharju
   Licensed under the MIT License.
   
   Third-Party Libraries:
   - Three.js (MIT License) - Copyright (c) 2010-2026 three.js authors
   - React & React-DOM (MIT License) - Copyright (c) Meta Platforms, Inc.
   - Lucide Icons (ISC / MIT License)
   ```
3. Tämä täyttää 100 % juridiset vaatimukset sekä Applen että Googlen näkökulmasta.

---

## 📦 7. Miten tämä WebGL-peli paketoidaan natiiviksi mobiilisovellukseksi?

Tämä peli on rakennettu modernilla verkkoteknologialla (HTML5, WebGL, Three.js, React). Sen muuntaminen natiiviksi iOS- ja Android-sovellukseksi on suoraviivaista.

### Suositeltu työkalu: **Capacitor (CapacitorJS / Ionic)**

Capacitor käärii pelin natiiviin `WKWebView` (iOS) ja `Android WebView` -säilöön, jolloin WebGL-kiihdytys toimii 60 fps -nopeudella suoraan laitteen grafiikkapiirillä.

#### Nopeat asennusvaiheet:

1. **Käännä peli tuotantovalmiiksi:**
   ```bash
   npm run build
   ```
   (Tämä luo `dist/`-kansion)

2. **Asenna Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init "Plasma Void 3D" "com.plasmavoid.game" --web-dir dist
   ```

3. **Lisää iOS ja Android -alustat:**
   ```bash
   npm install @capacitor/ios @capacitor/android
   npx cap add ios
   npx cap add android
   ```

4. **Synkronoi peli alustoille:**
   ```bash
   npx cap sync
   ```

5. **Avaa kehitystyökalut:**
   * **iOS (vaatii Macin):**
     ```bash
     npx cap open ios
     ```
     Avaa Xcode-projektin. Siellä voit määrittää sovelluskuvakkeet, testata laitteella ja lähettää buildin App Store Connectiin.
   * **Android:**
     ```bash
     npx cap open android
     ```
     Avaa Android Studio -projektin. Siellä voit luoda allekirjoitetun `.aab`-julkaisupaketin Google Play Consoleen.

---

## 🎨 8. Tavaramerkit ja pelin grafiikat

* **Koodi vs. Brändi:** MIT-lisenssi kattaa sovelluksen koodin. Se ei kuitenkaan automaattisesti luovuta pelin nimeä, logoa tai tavaramerkkioikeuksia muille.
* Voit suojata pelin nimen *"Plasma Void 3D"* ja omat bränditunnuksesi normaalisti tavaramerkillä.
* Pelin mukana toimitetut uniikit grafiikat (`ship_f10530f0.png` ja `minute_06a99cad.png`) ovat suojattuja teoksia, joiden jakeluoikeudet määrität itse.

---

## ✅ 9. Muistilista ennen sovelluskauppaan lähettämistä

- [x] **Lisenssitiedosto:** `LICENSE` luotu juureen MIT-ehdoilla.
- [ ] **Tietosuojaseloste (Privacy Policy):** Yksinkertainen verkkosivu, jossa kerrotaan, ettei peli kerää luvattomia henkilötietoja.
- [ ] **Ikärajaluokitus (Content Rating):** Vastaa App Storen ja Google Playn kyselyyn (Sci-fi fantasy violence / lievä avaruusräiskintä, ei verta, yleensä PEGI 3 / 7 tai ESRB Everyone 10+).
- [ ] **Kuvakkeet ja kuvakaappaukset:** Valmistele App Storen (1024x1024 px kuvake ja laiteruutukaappaukset) ja Google Playn (512x512 px kuvake ja 1024x500 px ominaisuusgrafiikka).
- [ ] **Attribuutio:** Varmista, että pelin valikossa tai asetuksissa näkyy tekijätieto ja lisenssimaininta.

---

*Tämä dokumentti on tarkoitettu yleiseksi oppaaksi MIT-lisenssin ja sovelluskauppojen yhteensopivuudesta.*
