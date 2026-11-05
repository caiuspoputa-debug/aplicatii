# Aplicații — descărcări comune

Pagină statică GitHub Pages pentru **Agenda Salon**, **Agenda Frizerie** și **TRUST MC**. Afișează numai edițiile curente, câte o opțiune per platformă disponibilă. Salon are exclusiv APK Android; nu oferă și nu promite o versiune iPhone.

Adresa publicată: https://caiuspoputa-debug.github.io/aplicatii/

## Distribuție

- Salon Android: ultima distribuție APK existentă din `agenda-salon`.
- Frizerie Android: APK-ul semnat din distribuția `tool-upload-iphone`.
- Frizerie iPhone: deschide PWA la adresa originală. Originea, manifestul, stocarea și service worker-ul aplicației rămân la locul lor.
- Trust Android și iPhone: deschid instalatorul existent `trust-mc-apps/descarca/` cu platforma corespunzătoare. Parola și protecția descărcării sunt păstrate; acest depozit nu conține APK Trust necriptat sau parole.

`catalog.json` documentează versiunile, dimensiunile și SHA-256 verificate. Pentru o ediție viitoare, actualizează intrarea existentă și etichetele/linkurile din `index.html`, în loc să adaugi în pagină ediții mai vechi. Verifică ediția reală a APK-ului și linkul public înainte de publicare. Păstrează versiunea web distinctă de versiunea Android.

Pagina nu are scripturi, formulare, iframe, service worker, analytics sau acces la stocarea aplicațiilor. Conține doar legături de instalare și instrucțiuni. Nu copiază agende sau backupuri.
