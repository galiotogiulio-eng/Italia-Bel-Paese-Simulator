# Pubblicazione automatica Cloudflare — Italia Bel Paese Simulator

La pubblicazione è gestita da `.github/workflows/deploy.yml` e interessa **solo** il Worker `italia-bel-paese-simulator`. Non usa e non modifica il progetto Railfy.

## Configurazione iniziale (una sola volta)

1. Cloudflare → My Profile → API Tokens → Create Token. Usa il template **Edit Cloudflare Workers** oppure un token personalizzato con **Account → Workers Scripts → Edit**, limitato al tuo account. Il token non va mai scritto in file GitHub pubblici.
2. GitHub → questo repository → Settings → Secrets and variables → Actions → New repository secret. Aggiungi:
   - `IBPS_CLOUDFLARE_API_TOKEN`: token Cloudflare
   - `IBPS_CLOUDFLARE_ACCOUNT_ID`: Account ID Cloudflare (in Dashboard → Account details)
3. Apri GitHub → Actions → Deploy Italia Bel Paese Simulator → Run workflow.

## Comportamento

- Su ogni push a `main` che modifica il gioco, avvia test.
- Se mancano le credenziali, segnala il problema e non pubblica.
- Con credenziali valide, carica `dist/` sul Worker e produce `/release.json` contenente il commit.
- Verifica che l'URL pubblico `https://italia-bel-paese-simulator.dbcit.workers.dev/release.json` restituisca il commit previsto.
- Se il controllo fallisce, l'Action risulta rossa: non dichiara riuscita una pubblicazione non verificata.

Dopo il primo deploy verificato, è possibile disattivare le build Git-integrated di Cloudflare per evitare due sistemi di pubblicazione concorrenti, **senza toccare altri Worker**.
