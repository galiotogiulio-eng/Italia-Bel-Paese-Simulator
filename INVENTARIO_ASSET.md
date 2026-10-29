# Inventario asset — V0.1

| Risorsa | Dove è conservata | Formato / origine |
|---|---|---|
| Duomo, Galleria, palazzi circostanti | `dist/modules/engine.js` | Geometrie originali generate durante l’esecuzione |
| Monumento equestre | `dist/modules/engine.js` | Geometrie originali semplificate |
| Avatar, NPC, piccioni animati | `dist/modules/engine.js` | Modelli e animazioni procedurali |
| Palco e folla dimostrativi | `dist/modules/engine.js` e `events.js` | Generazione e attivazione da codice |
| Pavimentazione e materiali | `dist/modules/engine.js` | Texture Canvas generata da codice; materiali Three.js |
| Icone, carta di selezione e mappa | `dist/index.html`, `app.js`, `style.css` | SVG, CSS e disegno da codice |
| Geometria geografica | `dist/assets/world.json` | Natural Earth / world-atlas, TopoJSON locale |
| Three.js r170 | `dist/vendor/three.module.js` | Dipendenza già inclusa, licenza MIT |
| Licenza Three.js | `dist/vendor/THREE-LICENSE.txt` | Testo di licenza originale |
| Riferimenti e attribuzioni | `dist/assets/ATTRIBUTION.md` | Fonti e licenze documentate |
| Font Manrope e DM Sans | Import CSS da Google Fonts | Opzionali, non inclusi come binari; font di sistema come alternativa |

Non ci sono asset 3D binari o immagini di texture esterni omessi. I modelli e le texture procedurali si ricreano attraverso i sorgenti inclusi. Le caratteristiche della modalità CPU sono volutamente ridotte rispetto al rendering GPU.
