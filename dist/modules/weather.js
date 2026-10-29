import {MILAN} from './geography.js';
export const WEATHER_MODES=['sun','cloud','rain','fog','night'];
export const labels={sun:'Sereno',cloud:'Nuvoloso',rain:'Pioggia',fog:'Nebbia',night:'Notte'};
export function weatherMode(code){return code>=51?'rain':code===45||code===48?'fog':code>=2?'cloud':'sun';}
export class WeatherService {
 constructor(){this.data={simulated:true,mode:'sun',temperature:18,wind:8,visibility:10000,updatedAt:null};}
 async refresh(){try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+MILAN.lat+'&longitude='+MILAN.lon+'&current=temperature_2m,weather_code,wind_speed_10m,is_day&hourly=visibility&forecast_days=1&timezone=Europe%2FRome',{signal:AbortSignal.timeout(7000)});if(!r.ok)throw Error('Weather HTTP '+r.status);const d=await r.json();const c=d.current;if(!c||!Number.isFinite(c.temperature_2m)||!Number.isFinite(c.weather_code)||!Number.isFinite(c.wind_speed_10m)||!c.time)throw Error('Invalid weather');let index=d.hourly?.time?.findIndex(t=>t.slice(0,13)===c.time.slice(0,13));this.data={simulated:false,mode:weatherMode(c.weather_code),temperature:c.temperature_2m,wind:c.wind_speed_10m,visibility:index>=0?d.hourly.visibility[index]:null,updatedAt:c.time,day:!!c.is_day};}
 catch(e){this.data={...this.data,simulated:true,updatedAt:null};}return this.data;}
}
export function milanTime(date=new Date()){return new Intl.DateTimeFormat('it-IT',{timeZone:MILAN.timeZone,hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(date);}
export function milanHour(date=new Date()){return Number(new Intl.DateTimeFormat('en-GB',{timeZone:MILAN.timeZone,hour:'2-digit',hourCycle:'h23'}).format(date));}
