# Aplicații — descărcări comune

Pagină statică GitHub Pages pentru **Agenda Salon**, **Agenda Frizerie**, **TRUST MC** și **Geometrie Roți**. Afișează numai edițiile curente, câte o opțiune per platformă disponibilă. Salon și Geometrie Roți au exclusiv APK Android.

Adresa publicată: https://caiuspoputa-debug.github.io/aplicatii/

## Distribuție

- Salon Android: ultima distribuție APK existentă din `agenda-salon`.
- Frizerie Android: APK-ul semnat din distribuția `tool-upload-iphone`.
- Frizerie iPhone: deschide PWA la adresa originală. Originea, manifestul, stocarea și service worker-ul aplicației rămân la locul lor.
- Trust Android și iPhone: deschid instalatorul existent `trust-mc-apps/descarca/` cu platforma corespunzătoare. Parola și protecția descărcării sunt păstrate; acest depozit nu conține APK Trust necriptat sau parole.

`catalog.json` documentează versiunile, dimensiunile și SHA-256 verificate. Pentru o ediție viitoare, actualizează intrarea existentă și etichetele/linkurile din `index.html`, în loc să adaugi în pagină ediții mai vechi. Verifică ediția reală a APK-ului și linkul public înainte de publicare. Păstrează versiunea web distinctă de versiunea Android.

Pagina nu are scripturi, formulare, iframe, service worker, analytics sau acces la stocarea aplicațiilor. Conține doar legături de instalare și instrucțiuni. Nu copiază agende sau backupuri.

## Geometrie Roți - identitatea personală

Începând cu 0.4.0, identificatorul este `ro.caiuspoputa.geometrieroti`, iar certificatul este `CN=Caius Poputa, OU=Independent Developer` (SHA-256 `95c79cbc9e68e31611c477f8cc27050a682b4ee616a5c25d6cbc40005f1d2bf6`). Prima instalare se face separat față de versiunile 0.3.x. O agendă goală nu necesită transfer.

Actualizatorul noii aplicații citește exclusiv `geometrie-caiuspoputa-android-update.json`, cu `applicationId`, versiune, dimensiune, SHA-256 și URL-ul exact al APK-ului. Actualizează acest fișier pentru edițiile viitoare ale noii aplicații, folosind același identificator și certificat personal. `geometrie-android-update.json` rămâne destinat aplicației vechi; nu anunța acolo APK-ul cu identificatorul nou.

Publică întâi APK-ul și documentele în release-ul GitHub, verifică descărcările, apoi actualizează catalogul și manifestul. Cheia privată și parola nu se publică.
