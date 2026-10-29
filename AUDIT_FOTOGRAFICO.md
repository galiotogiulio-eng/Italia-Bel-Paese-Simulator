# Audit fotografico universale — primo test
Il sistema applica ESATTAMENTE la stessa procedura a Milano, Palermo e Roma, senza ricerche manuali su ogni città.
## Avvio
GitHub → Actions → **Audit photographs — Milan Palermo Rome** → **Run workflow**.
Il risultato scaricabile è **italian-city-photo-coverage** contenente `photo-coverage.json`.
In alternativa, con Node 22: `node tools/photo-coverage-audit.mjs`.
Non è necessario collegare Google né utilizzare Street View. Mapillary sarà aggiunta solo dopo l'ottenimento di un token API autorizzato.
## Che cosa misuriamo
9 punti per città (griglia attorno al centro) x due fonti (Panoramax e KartaView).
Contiamo ID unici delle fotografie nelle risposte campione e rileviamo errori e limiti di paginazione.
**NON misuriamo ancora**: copertura di singoli edifici, facciate inquadrate, disponibilità di texture legali, o ricostruibilità fotogrammetrica.
Il campo `unavailable` indica errore di rete/API, **non** assenza di fotografie.
Le API hanno limiti di utilizzo; il test va eseguito soltanto occasionalmente e in modo responsabile.
## Prossimo criterio di idoneità
Solo dopo la misurazione delle fotografie: intersecare dataset edifici Overture/OSM e foto con orientamento;
verificare licenze, angoli, visibilità, data e qualità.
Non spacciare il conteggio di foto come percentuale di facciate ricostruibili.
