# 🚚 TruckLovers Premium - Ghid de Lansare Cap-Coadă

Salut! Am pregătit acest ghid special pentru tine, ca să poți pune aplicația pe telefoanele tiriștilor cât mai repede.

## PASUL 1: Cum scoți codul și îl pui pe GitHub
Deoarece ești în acest mediu de dezvoltare, trebuie să duci codul pe contul tău de GitHub:

1.  **Creează un cont pe GitHub.com** (dacă nu ai deja).
2.  Apasă pe butonul **"New"** (sau "+" în colțul dreapta sus) -> **New Repository**.
3.  Pune-i numele `truck-lovers`. Alege **Public** și apasă **Create Repository**.
4.  **Cum uploadezi fără comenzi complicate:**
    *   Pe pagina noului repository, vei vedea un link mic: "uploading an existing file". Apasă pe el.
    *   Descarcă codul de aici (din interfața curentă ar trebui să ai o opțiune de Download ZIP).
    *   Trage (Drag & Drop) toate fișierele din folderul descărcat în fereastra de pe GitHub.
    *   Apasă **"Commit changes"**. Gata, codul e online!

## PASUL 2: Cum o testezi prima dată (LIVE)
Cea mai simplă metodă de testare este să o urci pe Vercel (este site-ul lor de hosting):

1.  Intră pe [Vercel.com](https://vercel.com) și loghează-te cu contul de GitHub.
2.  Apasă pe **"Add New"** -> **Project**.
3.  Importă repository-ul `truck-lovers`.
4.  **IMPORTANT (Baza de date):** Mergi pe [Neon.tech](https://neon.tech), fă un proiect gratuit de PostgreSQL, copiază "Connection String"-ul.
5.  În Vercel, la secțiunea **Environment Variables**, adaugă:
    *   `DATABASE_URL` = link-ul tău de la Neon.
6.  Apasă **Deploy**. În 2 minute vei avea un link (ex: `truck-lovers.vercel.app`) pe care îl poți deschide pe orice telefon să îl testezi.

## PASUL 3: Cum o transformi în aplicație de mobil (Android/iOS)
Vom folosi o metodă numită "PWA" sau "Capacitor".

### Metoda Rapidă (PWA):
1.  Odată ce site-ul e pe Vercel, deschide link-ul pe telefon (pe Chrome pe Android sau Safari pe iPhone).
2.  Apasă pe meniul browserului (3 puncte sau butonul Share) și alege **"Add to Home Screen"** (Adaugă pe ecranul principal).
3.  Aplicația va apărea pe desktop-ul telefonului tău cu iconița TruckLovers și se va deschide fără barele browserului, exact ca o aplicație nativă.

### Metoda pentru App Store / Play Store:
1.  Instalează **Node.js** pe calculatorul tău.
2.  Descarcă codul de pe GitHub pe calculator.
3.  Deschide un terminal (CMD) în folderul proiectului și scrie:
    *   `npm install`
    *   `npm run build`
    *   `npx cap init`
    *   `npx cap add android` (pentru Android)
4.  Deschide proiectul în **Android Studio** și apasă "Build APK".

---
### Notă pentru "Nimic Fake":
*   **Harta:** Folosește date reale de pe OpenStreetMap.
*   **Chat:** Mesajele se salvează în baza de date reală (Neon).
*   **Swipe:** Sistemul de potrivire este real și bazat pe datele utilizatorilor.

Creat cu mândrie pentru comunitatea tiriștilor. 
**Premium Experience by Piztolash**
