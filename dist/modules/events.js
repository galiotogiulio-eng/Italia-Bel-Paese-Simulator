// UTC instants are authoritative. Never infer concert times from news headlines.
export function eventPhase(event, now = Date.now()) {
  if (!event || (!event.verified && !event.demo) || !Number.isFinite(Date.parse(event.start))) return 'idle';
  const start=Date.parse(event.start), end=Date.parse(event.end);
  if (!Number.isFinite(end) || end<=start || now>=end) return 'idle';
  if (now>=start) return 'live';
  return now>=start-30*60*1000?'preparing':'idle';
}
export class EventScheduler {
  constructor(){this.events=[];this.demo=null;}
  load(events){this.events=events.filter(e=>e.verified&&e.locationId==='piazza-duomo'&&e.source&&e.start&&e.end);}
  startDemo(){this.demo={demo:true,id:'local-stage-demo',start:new Date(Date.now()+12000).toISOString(),end:new Date(Date.now()+72000).toISOString()};}
  stopDemo(){this.demo=null;}
  state(now=Date.now()){const event=this.demo||this.events.find(e=>eventPhase(e,now)!=='idle');return {phase:eventPhase(event,now),demo:!!event?.demo,event};}
}
