"use strict";
/* ============================================================
   O-E Adventure — AudioKit
   A tiny generative "soft music" engine built on the Web Audio API.
   No audio files are needed, so it works offline and loads instantly.
   Calm pad chords (Cmaj7 · Am7 · Fmaj7 · G6) + gentle bell-like notes,
   softened with a low-pass filter and a warm echo.
   ============================================================ */
const AudioKit=(()=>{
  let ctx=null,musicBus=null,timer=null,playing=false,nextTime=0,step=0,vol=.4,ducked=false,lastBar=-1;
  const STEP=.5;                 // seconds per eighth-note step (8 steps = one 4s bar)
  const mtof=n=>440*Math.pow(2,(n-69)/12);
  // chord voicings (MIDI) for the pad, and higher notes for the soft bells
  const PADS=[[48,55,64,71],[45,52,60,67],[41,48,57,64],[43,50,59,64]];
  const BELLS=[[72,76,79,83],[69,72,76,79],[69,72,76,81],[67,71,74,76]];
  const PATTERN=[0,2,1,3,2,1,3,2];

  function getCtx(){
    if(ctx)return ctx;
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    ctx=new AC();
    musicBus=ctx.createGain();musicBus.gain.value=0;
    const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1700;lp.Q.value=.3;
    const dry=ctx.createGain();dry.gain.value=1;
    const delay=ctx.createDelay(1.5);delay.delayTime.value=.62;
    const fb=ctx.createGain();fb.gain.value=.38;
    const wet=ctx.createGain();wet.gain.value=.34;
    const dlp=ctx.createBiquadFilter();dlp.type="lowpass";dlp.frequency.value=1100;
    musicBus.connect(lp);lp.connect(dry);dry.connect(ctx.destination);
    lp.connect(delay);delay.connect(dlp);dlp.connect(fb);fb.connect(delay);dlp.connect(wet);wet.connect(ctx.destination);
    return ctx;
  }
  function level(){return vol*.16*(ducked?.3:1);}
  function pad(notes,t,len){
    notes.forEach((m,i)=>{[-4,4].forEach(det=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=i===0?"sine":"triangle";o.frequency.value=mtof(m);o.detune.value=det;
      const peak=(i===0?.5:.28)/2;
      g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+1.4);g.gain.setValueAtTime(peak,t+len-.6);g.gain.linearRampToValueAtTime(.0001,t+len+1.2);
      o.connect(g);g.connect(musicBus);o.start(t);o.stop(t+len+1.3);});});
  }
  function bell(m,t){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=mtof(m);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.34,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+1.8);
    o.connect(g);g.connect(musicBus);o.start(t);o.stop(t+1.9);
    const o2=ctx.createOscillator(),g2=ctx.createGain();o2.type="sine";o2.frequency.value=mtof(m+12);
    g2.gain.setValueAtTime(.0001,t);g2.gain.exponentialRampToValueAtTime(.06,t+.015);g2.gain.exponentialRampToValueAtTime(.0001,t+.7);
    o2.connect(g2);g2.connect(musicBus);o2.start(t);o2.stop(t+.8);
  }
  function scheduleStep(n,t){
    const bar=Math.floor(n/8)%4,pos=n%8;
    if(pos===0)pad(PADS[bar],t,8*STEP);
    if(pos%2===0?Math.random()<.62:Math.random()<.18)bell(BELLS[bar][PATTERN[pos]%4],t+(Math.random()*.03));
  }
  function tick(){
    if(!playing||!ctx)return;
    while(nextTime<ctx.currentTime+1.5){scheduleStep(step,nextTime);nextTime+=STEP;step++;}
  }
  function start(){
    const c=getCtx();if(!c)return false;
    if(c.state==="suspended")c.resume();
    if(playing){setVolume(vol);return true;}
    playing=true;nextTime=c.currentTime+.15;
    if(step%8!==0)step+=8-(step%8); // always begin on a bar line
    timer=setInterval(tick,250);tick();
    musicBus.gain.cancelScheduledValues(c.currentTime);musicBus.gain.setValueAtTime(musicBus.gain.value,c.currentTime);
    musicBus.gain.linearRampToValueAtTime(level(),c.currentTime+2.5); // gentle fade-in
    return true;
  }
  function stop(){
    if(!playing)return;playing=false;clearInterval(timer);timer=null;
    if(ctx&&musicBus){musicBus.gain.cancelScheduledValues(ctx.currentTime);musicBus.gain.setValueAtTime(musicBus.gain.value,ctx.currentTime);musicBus.gain.linearRampToValueAtTime(0,ctx.currentTime+.8);}
  }
  function setVolume(v){vol=Math.max(0,Math.min(1,v));if(ctx&&musicBus&&playing){musicBus.gain.cancelScheduledValues(ctx.currentTime);musicBus.gain.setTargetAtTime(level(),ctx.currentTime,.25);}}
  function duck(on){ducked=!!on;if(ctx&&musicBus&&playing){musicBus.gain.cancelScheduledValues(ctx.currentTime);musicBus.gain.setTargetAtTime(level(),ctx.currentTime,.2);}}
  // save battery: pause everything while the app is hidden
  document.addEventListener("visibilitychange",()=>{
    if(!ctx)return;
    if(document.hidden){ctx.suspend&&ctx.suspend();}
    else if(playing||ctx.state==="suspended"){ctx.resume&&ctx.resume();}
  });
  return {ctx:getCtx,start,stop,setVolume,duck,isPlaying:()=>playing};
})();
