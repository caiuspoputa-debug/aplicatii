# Aplicații — descărcări comune

Pagină statică GitHub Pages pentru **Agenda Salon**, **Husa blocare ecran**, **Agenda Frizerie**, **TRUST MC**, **Geometrie Roți** și **SMS Forward**. Afișează numai edițiile curente, câte o opțiune per platformă disponibilă. Salon, Husa, Geometrie Roți și SMS Forward au exclusiv APK Android.

Adresa publicată: https://caiuspoputa-debug.github.io/aplicatii/

## Distribuție

- Salon Android: ultima distribuție APK existentă din `agenda-salon`.
- Husa Android: APK-ul semnat și cele două ghiduri PDF sunt servite direct din `downloads/husa/1.1.5/`, pentru a evita eroarea 504 de pe ruta GitHub Releases. Fișierele sunt identice cu distribuția `husa-blocare-ecran`, verificate prin SHA-256. La actualizare, publică fișierele versiunii noi aici și schimbă cele trei linkuri din pagină și catalog.
- Frizerie Android: APK-ul semnat din distribuția `tool-upload-iphone`.
- Frizerie iPhone: deschide PWA la adresa originală. Originea, manifestul, stocarea și service worker-ul aplicației rămân la locul lor.
- Trust Android și iPhone: deschid instalatorul existent `trust-mc-apps/descarca/` cu platforma corespunzătoare. Parola și protecția descărcării sunt păstrate; acest depozit nu conține APK Trust necriptat sau parole.
- SMS Forward Android: APK-ul semnat este servit din `downloads/sms-forward/1.5/`. Instrucțiunile de instalare și activare se găsesc în `sms-forward-instalare.html`; PIN-ul se comunică separat.

`catalog.json` documentează versiunile, dimensiunile și SHA-256 verificate. Pentru o ediție viitoare, actualizează intrarea existentă și etichetele/linkurile din `index.html`, în loc să adaugi în pagină ediții mai vechi. Verifică ediția reală a APK-ului și linkul public înainte de publicare. Păstrează versiunea web distinctă de versiunea Android.

Pagina nu are scripturi, formulare, iframe, service worker, analytics sau acces la stocarea aplicațiilor. Conține doar legături de instalare și instrucțiuni. Nu copiază agende sau backupuri.

## Geometrie Roți - identitatea personală

Începând cu 0.4.0, identificatorul este `ro.caiuspoputa.geometrieroti`, iar certificatul este `CN=Caius Poputa, OU=Independent Developer` (SHA-256 `95c79cbc9e68e31611c477f8cc27050a682b4ee616a5c25d6cbc40005f1d2bf6`). Prima instalare se face separat față de versiunile 0.3.x. O agendă goală nu necesită transfer.

Actualizatorul noii aplicații citește exclusiv `geometrie-caiuspoputa-android-update.json`, cu `applicationId`, versiune, dimensiune, SHA-256 și URL-ul exact al APK-ului. Actualizează acest fișier pentru edițiile viitoare ale noii aplicații, folosind același identificator și certificat personal. `geometrie-android-update.json` rămâne destinat aplicației vechi; nu anunța acolo APK-ul cu identificatorul nou.

Publică întâi APK-ul și documentele în release-ul GitHub, verifică descărcările, apoi actualizează catalogul și manifestul. Cheia privată și parola nu se publică.

## Actualizări Husa

`husa-android-update.json` este citit de Husa începând cu 1.1.2. Publică APK-ul și cele două PDF-uri în directorul versiunii și actualizează simultan manifestul, catalogul și linkurile din pagină. Manifestul conține versiunea, identificatorul, certificatul, dimensiunea, SHA-256 și adresa directă Pages. Nu înlocui fișierul unei versiuni deja publicate.

Husa 1.1.3 verifică versiunea din același manifest și deschide descărcarea în browser. Instalatorul intern și REQUEST_INSTALL_PACKAGES au fost eliminate.

Husa 1.1.4 adaugă aprindere alternativă și diagnostic pentru afișaj; efectul în Somn trebuie confirmat pe telefon. Detecția magnetică este păstrată, iar descărcarea verificată și instalatorul Android sunt reintegrate în aplicație.

Husa 1.1.5 elimină instalatorul intern, permisiunea REQUEST_INSTALL_PACKAGES și FileProvider-ul de actualizare după reapariția avertizării pe 1.1.4. Verificarea zilnică și descărcarea prin browser sunt păstrate, iar aprinderea și detecția magnetică sunt neschimbate.

## Actualizări SMS Forward

`sms-forward-android-update.json` este citit de SMS Forward începând cu versiunea 1.5. Publică APK-ul semnat într-un director nou sub `downloads/sms-forward/` și actualizează simultan manifestul, catalogul, linkul din pagină și ghidul de instalare. Păstrează identificatorul `ro.local.smsprincipal` și certificatul aceleiași aplicații. Versiunile deja publicate rămân nemodificate.

Manifestul conține versiunea, identificatorul aplicației, certificatul, dimensiunea, SHA-256 și URL-ul APK-ului. Câmpurile `versionName` și `version`, respectiv `apkUrl` și `url`, trebuie să aibă valori identice. Aplicația deschide descărcarea în browser; instalarea se confirmă în Android.
