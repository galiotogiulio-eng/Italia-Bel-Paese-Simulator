// Replace with an authenticated transport and an authoritative server for multiplayer.
// No artificial users, remote messages or persistent identities in V0.1.
export class LocalTransport extends EventTarget {
 constructor(){super();this.mode='local';}
 send(payload){this.dispatchEvent(new CustomEvent('message',{detail:{...payload,local:true}}));}
 disconnect(){}
}
