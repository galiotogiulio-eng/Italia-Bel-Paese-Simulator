# ITALIA VIVA V0.1 — sorgenti completi

Questo pacchetto conserva tutti i 19 file del commit pubblicato, oltre a questa guida, un avviatore locale e un inventario degli asset. Il sito attualmente online non viene modificato dall’esportazione.

## Conservare il progetto su GitHub

1. Estrai lo ZIP sul computer.
2. Crea un nuovo repository GitHub chiamato, per esempio, `italia-viva`. Scegli tu se privato o pubblico.
3. Carica **il contenuto** della cartella estratta, mantenendo sottocartelle e nomi. Non caricare soltanto il file ZIP se vuoi modificare i singoli file dal repository.
4. Includi anche `.openai/hosting.json` se vuoi conservare il riferimento al sito originale. Questo file contiene l’identificativo del sito e la directory statica, non credenziali.
5. Conserva la cronologia delle modifiche con i commit. In questo ZIP non è inclusa la directory `.git` del repository Sites.

Alternativa da terminale, nella cartella estratta, dopo aver creato un repository GitHub vuoto:

```sh
git init
git add .
git commit -m "Importa ITALIA VIVA V0.1"
git branch -M main
git remote add origin https://github.com/TUO-UTENTE/italia-viva.git
git push -u origin main
```

Sostituisci `TUO-UTENTE` con il tuo nome GitHub. L’eventuale autenticazione a GitHub avviene con i tuoi normali strumenti; nessuna chiave o token è inclusa nel pacchetto.

## Avviare il gioco sul computer

Serve un browser moderno e, per il piccolo server incluso, Node.js 20 o successivo installato sul computer. Il runtime Node.js e il browser non sono inclusi nello ZIP. Non serve Python e non occorre scaricare pacchetti npm per giocare.

Su Windows fai doppio clic su `AVVIA_WINDOWS.bat`; lascia la finestra aperta e visita l’indirizzo mostrato, `http://127.0.0.1:8080/`.

Su altri sistemi, o da terminale:

```sh
node avvia.mjs
```

Il server ascolta solo sul computer locale. Chiudilo con Ctrl+C. In alternativa puoi servire direttamente la cartella `dist/` con un qualsiasi server HTTP statico. Il doppio clic su `dist/index.html` come file locale non è sufficiente per i moduli ES e il caricamento della mappa.

Per eseguire i test, dalla cartella principale:

```sh
npm run check
```

## Dove modificare

| File | Contenuto |
|---|---|
| `dist/index.html` | Schermate e struttura dell’interfaccia |
| `dist/style.css` | Stile e adattamento alle dimensioni dello schermo |
| `dist/modules/engine.js` | Scena Three.js, edifici, avatar, piccioni, NPC, controlli e texture procedurali |
| `dist/modules/software-renderer.js` | Alternativa 3D via CPU quando manca WebGL |
| `dist/modules/geography.js` | Dati geografici e disposizione indicativa della piazza |
| `dist/modules/weather.js` | Ora Europe/Rome, meteo esterno e fallback simulato |
| `dist/modules/events.js` | Eventi verificati e sequenza dimostrativa separata |
| `dist/modules/data.js` | Archivio editoriale di notizie e agenda |
| `dist/modules/transport.js` | Chat locale e punto di estensione per il futuro multiplayer |
| `dist/modules/economy.js` | Modulo futuro disabilitato, senza transazioni |
| `dist/modules/app.js` | Navigazione, mappa e collegamento dei moduli |
| `dist/vendor/` | Three.js già incluso e relativa licenza |
| `dist/assets/` | Mappa geografica e attribuzioni |
| `.openai/hosting.json` | Riferimento alla configurazione Sites originale |
| `tests/core.test.mjs` | Test automatici |

## Modelli, texture e dipendenze

Gli edifici, la statua, gli avatar, i passanti e i piccioni sono generati dal codice: non esistono file `.glb`, `.gltf`, `.obj` o texture fotografiche da recuperare. Le geometrie complete e la generazione della pavimentazione sono in `engine.js`. Tutto il codice necessario per ricrearli è incluso. Consulta anche `INVENTARIO_ASSET.md`.

Three.js r170 è già incluso localmente; non serve `npm install`. Non ci sono dipendenze Node di terzi né una fase di compilazione. Non esistono `node_modules` o lockfile da esportare per questa versione.

Connessioni esterne opzionali:

- Meteo Open-Meteo: richiede Internet; in caso di errore compare esplicitamente una simulazione.
- Font Google Fonts: richiedono Internet; in loro assenza si usano font di sistema.
- I collegamenti alle fonti giornalistiche e geografiche richiedono Internet. Notizie e agenda incluse sono una selezione del 29 ottobre 2026, senza aggiornamento automatico.

La mappa e la libreria grafica sono invece già nello ZIP.

## Riprendere il lavoro in un’altra conversazione ChatGPT

Puoi allegare questo ZIP, oppure fornire il repository quando gli strumenti della conversazione possono accedervi. Conservare i sorgenti su GitHub non garantisce, da solo, che qualunque conversazione possa leggerli, scriverli o pubblicarli automaticamente: dipende dagli strumenti e dai permessi disponibili in quella conversazione. Se non può scrivere sul repository, puoi chiedere file completi da sostituire o una patch e caricarli manualmente.

Prompt da riutilizzare:

> Questo è il progetto ITALIA VIVA V0.1. Leggi GUIDA_GITHUB.md, README.md ed EXPORT_METADATA.json. Modifica i sorgenti mantenendo la struttura modulare. Non modificare né pubblicare sul sito Sites esistente senza una mia richiesta esplicita. Le geometrie sono provvisorie; chat ed eventi demo devono restare chiaramente riconoscibili.

## Pubblicazione separata

Questo ZIP non contiene automazioni GitHub Actions, credenziali o comandi che aggiornano il sito Sites. Il caricamento in un nuovo repository GitHub non è configurato qui per aggiornare Sites. Qualsiasi pubblicazione futura è un’operazione distinta. La configurazione originale viene conservata per documentazione e riuso autorizzato; non eseguire un deploy per il solo fatto di averla trovata nel repository.

## Stato del prototipo

Ricostruzione procedurale provvisoria, non un rilievo fedele. Esplorazione singolo giocatore; chat solo locale. Interni dei negozi dimostrati con schede testuali. Economia disabilitata. Nessun concerto reale in piazza caricato. Il percorso GPU Three.js richiede WebGL; nel browser di verifica della prima pubblicazione è stata verificata la modalità CPU perché WebGL era disattivato.

I file originali corrispondono al commit indicato in EXPORT_METADATA.json. Gli hash SHA-256 consentono di verificarli.
