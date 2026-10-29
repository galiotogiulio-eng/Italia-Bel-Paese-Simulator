// Local-only static server. No external packages; no publication or remote writes.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 try {
  const url=new URL(req.url,'http://127.0.0.1');
  const name=decodeURIComponent(url.pathname);
  let file=resolve(root,'.'+name);
  if(file!==resolve(root)&&!file.startsWith(resolve(root)+sep)){res.writeHead(403);res.end('Accesso negato');return;}
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(error){res.writeHead(error instanceof URIError?400:404);res.end('File non disponibile');}
});
server.on('error',error=>{console.error('Impossibile avviare il server:',error.message);process.exitCode=1;});
server.listen(8080,'127.0.0.1',()=>console.log('ITALIA BEL PAESE SIMULATOR V0.1 — apri http://127.0.0.1:8080/ nel browser. Ctrl+C per chiudere.'));
