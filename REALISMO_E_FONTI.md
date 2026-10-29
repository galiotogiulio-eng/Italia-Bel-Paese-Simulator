# Italia Bel Paese Simulator — policy fedeltà al reale

## Scopo
Simulatore immersivo di città italiane, con geografia autentica e facciate fedeli quando sono disponibili fonti verificabili e riutilizzabili.

## Regole
1. Nessun negozio, insegna, indirizzo o attività commerciale inventata presentata come reale.
2. Edifici e strade da dati geografici con fonte e provenienza; non ricostruire un quartiere fittizio quando il caricamento fallisce.
3. Le facciate fotograficamente o architettonicamente fedeli richiedono dataset/modelli/fotografie idonei con diritti di utilizzo. Una volumetria OSM non equivale a una facciata autentica.
4. Dove l'altezza manca, segnalare l'altezza stimata; non dichiararla reale.
5. La scena Piazza Duomo originaria resta un PROTOTIPO illustrativo, non un rilievo fedele, fino alla sostituzione con asset verificati.
6. Mostrare i nomi delle attività solo se acquisiti da OSM o altre fonti documentabili, con attenzione a data dell'ultimo aggiornamento.
7. Attribuzione © OpenStreetMap contributors, ODbL e rispetto delle licenze dei futuri asset.

## Limiti attuali
- I dati OSM non contengono tutte le facciate, altezze, attività e punti vendita.
- Overpass pubblica non garantisce disponibilità o tempi; per il prodotto finale servono dataset ottimizzati statici sul nostro hosting, aggiornati e con attribuzione corretta.
- La città esterna a Piazza Duomo è caricata a zone e non ha ancora collisioni fisiche affidabili.
- Non sono presenti modelli di facciate reali verificati, né interni commerciali.
- Il prototipo Piazza Duomo conserva alcuni modelli interpretativi e deve essere etichettato come tale.

## Prossime tappe
1. Dataset Milano centrale versionato, importato da estratti OSM in file statici su Cloudflare, con controllo coordinate e attribuzione.
2. Gestione geometria 3D robusta dei poligoni, altezza solo se misurata altrimenti volume dichiarato stimato.
3. Catalogo degli asset architettonici autentici (fonte, licenza, edificio, data) e caricamento mirato.
4. POI commerciali reali con posizione, tipo, ultimo aggiornamento e nessuna vetrina sintetica spacciata per reale.
5. Test end-to-end di rendering e performance su desktop e mobile.
