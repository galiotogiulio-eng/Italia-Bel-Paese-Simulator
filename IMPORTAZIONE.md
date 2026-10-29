# Importazione completata

I sorgenti di Italia Viva V0.1 sono stati estratti nella cartella `dist/` del repository. La versione ZIP originale è stata eliminata.

## Avvio e distribuzione
- Il gioco parte da `dist/index.html`.
- Cloudflare Workers usa `wrangler.jsonc` con `assets.directory: ./dist`.
- Il comando di deploy è `npx wrangler deploy` senza estrazione ZIP.
- I test sono nella cartella `tests/`.

Non inserire credenziali o chiavi API nel repository pubblico.
