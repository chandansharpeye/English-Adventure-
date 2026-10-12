"use strict";
/* ============================================================
   English Adventure v2
   Requires data.js (LEVELS, PAIRS, WORDS, TIPS, RANKS, BADGES + helpers)
   ============================================================ */
const STORAGE_KEY="english-adventure-progress-v1"; // same key as v1 so old progress is kept
const HEART_MS=20*60*1000, HEART_COST=30, SPEED_SECONDS=15, DAILY_BONUS=20;
const $=id=>document.getElementById(id);
const keyFor=d=>d.toLocaleDateString("en-CA");
const todayKey=()=>keyFor(new Date());
const yesterdayKey=()=>{const d=new Date();d.setDate(d.getDate()-1);return keyFor(d);};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a,n){return shuffle(a.slice()).slice(0,n);}
function rand(a){return a[Math.floor(Math.random()*a.length)];}
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function norm(s){return String(s).toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9' ]+/g," ").replace(/\s+/g," ").trim();}

/* ---------------- State ---------------- */
const freshState=()=>({xp:0,hearts:5,streak:0,lastActive:null,completed:[],dailyCompleted:0,dailyDate:null,bestAccuracy:0,totalAnswered:0,totalCorrect:0,mode:"odia-en",wordIndex:0,
  wordDate:null,dailyGoal:1,dailyBonusDate:null,activeDays:[],mistakes:[],wordsSeen:[],badges:[],heartTime:0,heartDay:null,perfectCount:0,bestCombo:0,speedBest:0,mistakesFixed:0,
  stories:[],srs:{},profile:{name:"",age:"",source:"",reason:"",level:"",daily:"",tourDone:false},settings:{robotVoice:true,robotLang:"en",sound:true,music:true,autoRead:true,theme:"auto",musicVol:.4,sfxVol:.6,bannerDismissed:false}});
function sanitize(m){const f=freshState();
  ["completed","activeDays","mistakes","wordsSeen","badges","stories"].forEach(k=>{if(!Array.isArray(m[k]))m[k]=f[k];});
  if(!m.srs||typeof m.srs!=="object")m.srs={};
  m.profile={...f.profile,...(m.profile&&typeof m.profile==="object"?m.profile:{})};
  ["xp","hearts","streak","dailyCompleted","bestAccuracy","totalAnswered","totalCorrect","wordIndex","dailyGoal","heartTime","perfectCount","bestCombo","speedBest","mistakesFixed"].forEach(k=>{if(typeof m[k]!=="number"||!isFinite(m[k]))m[k]=f[k];});
  m.hearts=Math.max(0,Math.min(5,m.hearts));m.dailyGoal=[1,2,3].includes(m.dailyGoal)?m.dailyGoal:1;
  if(m.mode!=="odia-en"&&m.mode!=="en-odia")m.mode="odia-en";
  m.settings={...f.settings,...(m.settings&&typeof m.settings==="object"?m.settings:{})};
  ["musicVol","sfxVol"].forEach(k=>{const v=+m.settings[k];m.settings[k]=isFinite(v)?Math.max(0,Math.min(1,v)):f.settings[k];});
  return m;}
function loadState(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY));if(s&&typeof s==="object")return sanitize({...freshState(),...s});}catch{}return freshState();}
let state=loadState();
let session=null,timerId=null,storageWarned=false;
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{if(!storageWarned){storageWarned=true;showToast("Progress could not be saved on this browser.");}}}

/* ---------------- Lessons helpers ---------------- */
function allLessons(){return LEVELS.flatMap(level=>level.lessons.map(lesson=>({...lesson,levelId:level.id,levelName:level.name,levelIcon:level.icon})));}
function isUnlocked(lesson){const list=allLessons();const i=list.findIndex(x=>x.id===lesson.id);return i===0||state.completed.includes(list[i-1].id)||state.completed.includes(lesson.id);}
function lessonCount(l){return l.auto?l.count:l.questions.length+(l.pairs?1:0);}

/* ---------------- Daily / streak / hearts ---------------- */
function markActive(){const today=todayKey();
  if(state.lastActive!==today){state.streak=state.lastActive===yesterdayKey()?state.streak+1:1;state.lastActive=today;}
  if(state.dailyDate!==today){state.dailyDate=today;state.dailyCompleted=0;}
  if(!state.activeDays.includes(today)){state.activeDays.push(today);state.activeDays=state.activeDays.slice(-60);}
  saveState();}
function newDayChecks(){const today=todayKey();
  if(state.heartDay!==today){state.hearts=5;state.heartTime=0;state.heartDay=today;}
  if(state.dailyDate!==today){state.dailyDate=today;state.dailyCompleted=0;}
  if(state.wordDate!==today){const d=new Date();const n=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);state.wordIndex=n%WORDS.length;state.wordDate=today;}
  if(state.lastActive&&state.lastActive!==today&&state.lastActive!==yesterdayKey())state.streak=0; // streak broken
}
function regenHearts(){
  if(state.hearts>=5){state.hearts=5;state.heartTime=0;return false;}
  const now=Date.now();
  if(!state.heartTime){state.heartTime=now;return false;}
  const gained=Math.floor((now-state.heartTime)/HEART_MS);
  if(gained>0){state.hearts=Math.min(5,state.hearts+gained);state.heartTime=state.hearts>=5?0:state.heartTime+gained*HEART_MS;return true;}
  return false;}
function loseHeart(){if(state.hearts>=5)state.heartTime=Date.now();state.hearts=Math.max(0,state.hearts-1);}
function nextHeartText(){if(state.hearts>=5)return "";const left=Math.max(0,HEART_MS-(Date.now()-(state.heartTime||Date.now())));return Math.floor(left/60000)+":"+String(Math.floor(left%60000/1000)).padStart(2,"0");}

/* ---------------- Rank & badges ---------------- */
function rankInfo(){let idx=0;RANKS.forEach((r,i)=>{if(state.xp>=r.xp)idx=i;});const cur=RANKS[idx],next=RANKS[idx+1];
  return {idx,cur,next,pct:next?Math.round((state.xp-cur.xp)/(next.xp-cur.xp)*100):100};}
function checkBadges(){const fresh=[];
  BADGES.forEach(b=>{if(!state.badges.includes(b.id)&&b.test(state)){state.badges.push(b.id);fresh.push(b);}});
  if(fresh.length){saveState();sfx("badge");confetti(70);showToast("🏅 Badge unlocked: "+fresh.map(b=>b.name).join(", "));robotTalk(["Wow! You unlocked a new badge!","ବାହ୍! ଆପଣ ନୂଆ ବ୍ୟାଜ୍ ଅନଲକ୍ କଲେ!","वाह! आपने नया बैज अनलॉक किया!"]);}
  return fresh;}

/* ---------------- Sound & voice ---------------- */
let audioCtx=null;
const SFX={correct:[[660,0,.12],[880,.1,.2]],soft:[[740,0,.1]],wrong:[[200,0,.22,"sawtooth"],[150,.12,.26,"sawtooth"]],click:[[520,0,.05,"triangle"]],
  win:[[523,0,.14],[659,.12,.14],[784,.24,.14],[1047,.36,.32]],badge:[[784,0,.12],[988,.1,.12],[1175,.2,.12],[1568,.3,.35]],lose:[[330,0,.2],[262,.18,.2],[196,.36,.35]],
  tick:[[1000,0,.05,"square"]],heart:[[587,0,.1],[784,.09,.1],[988,.18,.22]],flip:[[420,0,.05,"triangle"],[640,.05,.07,"triangle"]],
  rank:[[392,0,.16],[523,.15,.16],[659,.3,.16],[784,.45,.16],[1047,.6,.5]]};
function sfx(name){
  if(!state.settings.sound)return;
  try{audioCtx=AudioKit.ctx();if(!audioCtx)return;if(audioCtx.state==="suspended")audioCtx.resume();
    (SFX[name]||[]).forEach(([f,t,d,type])=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t0=audioCtx.currentTime+t;
      o.type=type||"sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.2*state.settings.sfxVol+.0002,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
      o.connect(g);g.connect(audioCtx.destination);o.start(t0);o.stop(t0+d+.05);});}catch{}}
const canSpeak=()=>"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
function speak(text,rate){
  if(!text)return;if(!canSpeak()){showToast("Voice is not supported on this browser.");return;}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-IN";u.rate=rate||.85;
    u.onstart=()=>AudioKit.duck(true);u.onend=u.onerror=()=>AudioKit.duck(false);
    const vs=speechSynthesis.getVoices();const v=vs.find(x=>x.lang==="en-IN")||vs.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch{}}
let gestured=false;
function applyMusic(){
  if(gestured&&state.settings.music&&!document.hidden){AudioKit.setVolume(state.settings.musicVol);AudioKit.start();}else AudioKit.stop();
  renderTopStats();}
const unlockAudio=()=>{gestured=true;applyMusic();if(robotPending){const t=robotPending;robotPending=null;speakRobot(t.text,t.lang,t.next);}["pointerdown","keydown","touchstart"].forEach(e=>removeEventListener(e,unlockAudio));};
["pointerdown","keydown","touchstart"].forEach(e=>addEventListener(e,unlockAudio,{passive:true}));
function confetti(n){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const c=$("confetti");if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;c.width=innerWidth;c.height=innerHeight;c.classList.remove("hidden");
  const colors=["#6558e8","#ffad4d","#1eaa77","#ef737e","#4cc2ff"];
  const ps=Array.from({length:n||90},()=>({x:innerWidth/2+(Math.random()-.5)*140,y:innerHeight*.38,vx:(Math.random()-.5)*10,vy:-Math.random()*10-3,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:rand(colors)}));
  let f=0;(function tick(){ctx.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{p.vy+=.28;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);ctx.restore();});
    if(++f<110)requestAnimationFrame(tick);else{ctx.clearRect(0,0,c.width,c.height);c.classList.add("hidden");}})();}

function acceptAnswer(item,v){return [item.answer,...(item.accept||[])].some(a=>norm(a)===norm(v));}
/* ---------------- Pronunciation (speech recognition) ---------------- */
const SR_CLASS=window.SpeechRecognition||window.webkitSpeechRecognition||null;
function levenshtein(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[n];}
function similarity(said,target){const x=norm(said),y=norm(target);if(!x&&!y)return 1;return 1-levenshtein(x,y)/Math.max(x.length,y.length,1);}
function listenOnce(){return new Promise((resolve,reject)=>{
  if(!SR_CLASS){reject(new Error("unsupported"));return;}
  const r=new SR_CLASS();r.lang="en-IN";r.interimResults=false;r.maxAlternatives=3;let done=false;
  const timer=setTimeout(()=>{try{r.stop();}catch{}},7000);
  r.onresult=e=>{done=true;clearTimeout(timer);const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);resolve(alts);};
  r.onerror=e=>{if(!done){done=true;clearTimeout(timer);reject(new Error(e.error||"error"));}};
  r.onend=()=>{if(!done){done=true;clearTimeout(timer);reject(new Error("no-speech"));}};
  try{r.start();}catch(err){done=true;reject(err);}});}
/* ---------------- Spaced repetition (Leitner boxes) ---------------- */
const DAY=()=>Math.floor(Date.now()/864e5);
const SRS_GAP={1:1,2:2,3:4,4:7,5:14};          // days until next review per box
function srsKey(it){return it.prompt+"|"+it.answer;}
function srsRecord(item,correct){const k=srsKey(item);const e=state.srs[k]||{box:0,due:0};
  e.box=correct?Math.min(5,Math.max(1,e.box+1)):1; e.due=DAY()+SRS_GAP[e.box]; state.srs[k]=e;}
function dueMistakes(){return state.mistakes.filter(m=>{const e=state.srs[srsKey(m)];return !e||e.due<=DAY();});}
function nextReviewDays(){const dues=state.mistakes.map(m=>(state.srs[srsKey(m)]||{due:DAY()}).due).filter(d=>d>DAY());return dues.length?Math.min(...dues)-DAY():0;}
/* ---------------- Say items ---------------- */
function sayItem(p){return {type:"say",prompt:`Say "${p.en}" aloud`,hint:"Pronunciation practice",answer:p.en,explanation:`${p.en} = ${p.odia}.`,say:p.en};}
function sayLineItem(t){return {type:"say",prompt:`Say "${t.en}" aloud`,hint:"Say the whole sentence clearly",answer:t.en,explanation:`${t.en} = ${t.odia}`,say:t.en,threshold:.72};}
/* ---------------- Talking robot ---------------- */
let robotPending=null,robotSpeaking=false,robotTyping=false,robotGen=0;
const robotEl=()=>document.querySelector(".robot");
function setTalk(){const b=robotEl();if(b)b.classList.toggle("talk",robotSpeaking||robotTyping);}
function typeText(el,text,speed,done){
  if(!el)return;clearInterval(el._t);el.classList.add("typing");el.textContent="";let i=0;
  el._t=setInterval(()=>{el.textContent=text.slice(0,++i);if(i>=text.length){clearInterval(el._t);el.classList.remove("typing");if(done)done();}},speed||26);}
function speakRobot(text,lang,next){
  lang=lang||"en-IN";
  if(!state.settings.robotVoice||!canSpeak()){if(next)next();return;}
  if(!gestured){robotPending={text,lang,next};return;}   // browsers block voice until the first tap
  try{
    const vs=speechSynthesis.getVoices();
    let voice=vs.find(x=>x.lang===lang)||vs.find(x=>x.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    if(!voice&&lang==="or-IN"){if(next)next();return;}   // no Odia voice on this device: text only
    if(!voice)voice=vs.find(x=>/^en/i.test(x.lang));
    const gen=++robotGen;                       // a newer line cancels this chain
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=lang==="or-IN"?.9:1;u.pitch=1.4;if(voice&&typeof SpeechSynthesisVoice!=="undefined"&&voice instanceof SpeechSynthesisVoice)u.voice=voice;
    u.onstart=()=>{robotSpeaking=true;setTalk();AudioKit.duck(true);};
    u.onend=u.onerror=()=>{robotSpeaking=false;setTalk();AudioKit.duck(false);if(next&&gen===robotGen)next();};
    speechSynthesis.speak(u);
  }catch{if(next)next();}}
/* A line is [English, Odia, Hindi]. It types the chosen language and says it in that language. */
function robotLangNow(){return ROBOT_LANGS[state.settings.robotLang]?state.settings.robotLang:"en";}
function robotTalk(line){
  const lang=robotLangNow(),idx={en:0,or:1,hi:2}[lang];
  const text=line[idx]||line[0];
  const bubble=$("robot-message");bubble.innerHTML='<span class="rt-en"></span>';
  robotTyping=true;setTalk();
  typeText(bubble.querySelector(".rt-en"),text,22,()=>{robotTyping=false;setTalk();});
  speakRobot(text,ROBOT_LANGS[lang].tag);}
function robotSay(text,opts){
  robotTyping=true;setTalk();
  typeText($("robot-message"),text,24,()=>{robotTyping=false;setTalk();});
  if(!opts||opts.speak!==false)speakRobot(text);}
const ROBOT_LANGS={en:{label:"English",tag:"en-IN"},or:{label:"ଓଡ଼ିଆ",tag:"or-IN"},hi:{label:"हिंदी",tag:"hi-IN"}};
const ROBOT_IDLE=[
 ["Ready for a new word today?","ଆଜି ଏକ ନୂଆ ଶବ୍ଦ ପାଇଁ ପ୍ରସ୍ତୁତ?","क्या आप आज एक नया शब्द सीखने के लिए तैयार हैं?"],
 ["Tap the mic and say a word. Let's practise speaking!","ମାଇକ୍ ଦବାନ୍ତୁ ଓ ଏକ ଶବ୍ଦ କୁହନ୍ତୁ। ଆସନ୍ତୁ କହିବା ଅଭ୍ୟାସ କରିବା!","माइक दबाइए और एक शब्द बोलिए। चलिए बोलने का अभ्यास करते हैं!"],
 ["Try a Speed Round. Can you beat your score?","ସ୍ପିଡ୍ ରାଉଣ୍ଡ ଚେଷ୍ଟା କରନ୍ତୁ। ନିଜ ସ୍କୋର ହରାଇ ପାରିବେ କି?","स्पीड राउंड आज़माइए। क्या आप अपना स्कोर हरा सकते हैं?"],
 ["Little practice every day goes a long way.","ପ୍ରତିଦିନ ଟିକିଏ ଅଭ୍ୟାସ ବହୁ ଦୂର ନେଇଯାଏ।","हर दिन थोड़ा अभ्यास बहुत काम आता है।"],
 ["Tap the flashcards and learn three new words.","ଫ୍ଲାଶକାର୍ଡ ଦବାନ୍ତୁ ଓ ତିନୋଟି ନୂଆ ଶବ୍ଦ ଶିଖନ୍ତୁ।","फ्लैशकार्ड दबाइए और तीन नए शब्द सीखिए।"],
 ["Your streak is growing. Keep it up!","ଆପଣଙ୍କ ଷ୍ଟ୍ରିକ୍ ବଢ଼ୁଛି। ଏହିପରି ଜାରି ରଖନ୍ତୁ!","आपकी स्ट्रीक बढ़ रही है। ऐसे ही जारी रखिए!"]];
const ROBOT_CELEBRATE=[
 ["Wonderful! You finished the lesson!","ଚମତ୍କାର! ଆପଣ ପାଠ ଶେଷ କରିଲେ!","शानदार! आपने पाठ पूरा कर लिया!"],
 ["Amazing work! Keep going, champion!","ଅଦ୍ଭୁତ କାମ! ଚାଲୁ ରଖନ୍ତୁ, ଚାମ୍ପିଅନ୍!","कमाल का काम! चलते रहिए, चैंपियन!"],
 ["Super job! You are getting better every day!","ବହୁତ ଭଲ! ଆପଣ ପ୍ରତିଦିନ ଉନ୍ନତ ହେଉଛନ୍ତି!","बहुत बढ़िया! आप हर दिन बेहतर हो रहे हैं!"]];
const ROBOT_TRY=[
 ["Good try! Let's practise this one again.","ଭଲ ଚେଷ୍ଟା! ଆସନ୍ତୁ ଏହାକୁ ପୁଣି ଅଭ୍ୟାସ କରିବା।","अच्छी कोशिश! चलिए इसे फिर से अभ्यास करते हैं।"],
 ["Almost there! You will get it next time.","ପ୍ରାୟ ହୋଇଗଲା! ପରବର୍ତ୍ତୀ ଥରେ ଆପଣ ପାରିବେ।","लगभग हो गया! अगली बार आप ज़रूर कर लेंगे।"]];
/* Tips: index i is the same tip in English, Odia and Hindi */
const TIPS_OR=["ନୂଆ ଇଂରାଜୀ ଶବ୍ଦ ପ୍ରତ୍ୟେକ ଥର ଜୋରରେ କୁହନ୍ତୁ। ଅଭ୍ୟାସ ଦ୍ୱାରା ସହଜ ହୁଏ!","ସଠିକ୍ ଉଚ୍ଚାରଣ ଶୁଣିବା ପାଇଁ 🔊 ଦବାନ୍ତୁ, ତା'ପରେ ଦୁଇଥର ପୁନରାବୃତ୍ତି କରନ୍ତୁ।","ଭୁଲ ହେବା ଭଲ! ସେଗୁଡ଼ିକ ଭୁଲ ନୋଟବୁକରେ ରହେ, ଯାହା ଦ୍ୱାରା ଆପଣ ସେଗୁଡ଼ିକ ଠିକ୍ କରିପାରିବେ।","ପ୍ରତିଦିନ ୩ଟି ନୂଆ ଶବ୍ଦ ଶିଖନ୍ତୁ ଏବଂ ପ୍ରତ୍ୟେକକୁ ଏକ ବାକ୍ୟରେ ବ୍ୟବହାର କରନ୍ତୁ।","ଅନ୍ୟ ପ୍ରକାରେ ନିଜକୁ ପରୀକ୍ଷା କରିବା ପାଇଁ ଇଂରାଜୀ → ଓଡ଼ିଆ ମୋଡ୍ ଚେଷ୍ଟା କରନ୍ତୁ।","ପ୍ରତିଦିନ ୫ ମିନିଟ୍ ପାଠ ସପ୍ତାହରେ ଏକ ଲମ୍ବା ପାଠ ଅପେକ୍ଷା ଭଲ।","ଆପଣଙ୍କ ଚାରିପାଖରେ ଥିବା ଇଂରାଜୀ ସାଇନବୋର୍ଡ ଓ ଲେବଲ୍ ପଢ଼ନ୍ତୁ। ସବୁକିଛି ଅଭ୍ୟାସ!","ଆତ୍ମବିଶ୍ୱାସ ଥିଲେ ସ୍ପିଡ୍ ରାଉଣ୍ଡ ଚେଷ୍ଟା କରନ୍ତୁ। ଏହା ଦ୍ରୁତ ଚିନ୍ତା ଶିଖାଏ।"];
const TIPS_HI=["नया अंग्रेज़ी शब्द हर बार ज़ोर से बोलिए। अभ्यास से आसान हो जाता है!","सही उच्चारण सुनने के लिए 🔊 दबाइए, फिर दो बार दोहराइए।","गलतियाँ अच्छी हैं! वे गलती नोटबुक में जाती हैं, ताकि आप उन्हें सुधार सकें।","रोज़ 3 नए शब्द सीखिए और हर एक को एक वाक्य में इस्तेमाल कीजिए।","खुद को दूसरे तरीके से परखने के लिए अंग्रेज़ी → ओड़िया मोड आज़माइए।","हर दिन 5 मिनट का पाठ, हफ़्ते में एक लंबे पाठ से बेहतर है।","आसपास के अंग्रेज़ी साइनबोर्ड और लेबल पढ़िए। सब कुछ अभ्यास है!","आत्मविश्वास हो तो स्पीड राउंड आज़माइए। इससे तेज़ सोच बनती है।"];
setInterval(()=>{
  if(!gestured||document.hidden||robotTyping||robotSpeaking)return;
  if(!$("lesson-modal").classList.contains("hidden")||!$("sheet-modal").classList.contains("hidden"))return;
  robotTalk(rand(ROBOT_IDLE));},90000);
/* ---------------- Question generators ---------------- */
let _pool=null;
function poolList(){if(_pool)return _pool;const m=new Map();
  LEVELS.forEach(l=>l.lessons.forEach(x=>(x.pairs||[]).forEach(([en,odia])=>{if(!m.has(en))m.set(en,odia);})));
  WORDS.forEach(w=>{if(!m.has(w.en))m.set(w.en,w.odia);});
  _pool=[...m].map(([en,odia])=>({en,odia}));return _pool;}
function distract(p,key,local,n){const out=[],seen=new Set([p[key]]);
  for(const list of [shuffle(local.slice()),shuffle(poolList().slice())]){for(const x of list){if(out.length>=n)break;if(!seen.has(x[key])){seen.add(x[key]);out.push(x[key]);}}}
  return out;}
function vocabMcq(p,dir,local){
  if(dir==="odia-en")return {type:"mcq",prompt:`What is the English word for ${p.odia}?`,hint:"Odia → English",answer:p.en,options:[p.en,...distract(p,"en",local,2)],explanation:`${p.en} = ${p.odia}.`,say:p.en};
  return {type:"mcq",prompt:`What is the Odia meaning of '${p.en}'?`,hint:"English → Odia",answer:p.odia,options:[p.odia,...distract(p,"odia",local,2)],explanation:`${p.en} = ${p.odia}.`,say:p.en,preview:true};}
function vocabListen(p,dir,local){
  if(dir==="odia-en")return lis(p.en,p.en,[p.en,...distract(p,"en",local,2)],`You heard: ${p.en} (${p.odia}).`);
  return {type:"listen",prompt:"Listen, then choose the Odia meaning",hint:"Listening practice",say:p.en,answer:p.odia,options:[p.odia,...distract(p,"odia",local,2)],explanation:`${p.en} = ${p.odia}.`};}
function buildAuto(lesson,dir){
  const ps=shuffle(lesson.pairs.map(([en,odia])=>({en,odia})));const at=i=>ps[i%ps.length];
  return [vocabMcq(at(0),dir,ps),vocabMcq(at(1),dir,ps),vocabListen(at(2),dir,ps),dir==="odia-en"?sayItem(at(3)):vocabMcq(at(3),dir,ps),
    dir==="odia-en"?typ(`Type the English word for ${at(4).odia}`,"Odia → English",at(4).en,`${at(4).en} = ${at(4).odia}.`):vocabMcq(at(4),dir,ps),
    mat(pick(lesson.pairs,4))];}
function buildQuestions(lesson){
  if(lesson.pairs&&(lesson.auto||state.mode==="en-odia"))return buildAuto(lesson,state.mode);
  const qs=lesson.questions.map(clone);if(lesson.pairs)qs.push(mat(pick(lesson.pairs,4)));if(lesson.sayLine&&state.mode==="odia-en")qs.push(sayLineItem(lesson.sayLine));return qs;}
function quickQuestions(n,mcqOnly){
  const done=allLessons().filter(l=>state.completed.includes(l.id));const source=done.length?done:allLessons().slice(0,3);const items=[];
  source.forEach(l=>{const orig=lessonById(l.id);
    if(!orig.auto)(orig.questions||[]).forEach(x=>items.push(clone(x)));
    if(orig.pairs){const local=orig.pairs.map(([en,odia])=>({en,odia}));pick(orig.pairs,3).forEach(([en,odia])=>items.push(vocabMcq({en,odia},state.mode,local)));}});
  let list=shuffle(items);if(mcqOnly)list=list.filter(x=>x.type==="mcq");return list.slice(0,n);}
function englishText(item){
  if(item.say)return item.say;const a=String(item.answer||"");
  if(item.type==="match")return null;
  if(/[A-Za-z]/.test(a)){
    if(String(item.prompt).includes("___"))return String(item.prompt).replace(/^[^:_]*:\s*/,"").replace(/_{3,}/,a);
    return a;}
  const m=String(item.prompt).match(/'([^']+)'/);return m?m[1]:null;}
function previewText(item){
  if(item.type==="listen"||item.preview)return item.say||null;
  if(!/[A-Za-z]/.test(String(item.answer||""))&&item.type!=="match"){const m=String(item.prompt).match(/'([^']+)'/);return m?m[1]:null;}
  return null;}

/* ---------------- Mistakes notebook ---------------- */
const mKey=it=>it.type+"|"+it.prompt+"|"+it.answer;
function addMistake(item){const c=clone(item);delete c._retry;if(state.mistakes.some(m=>mKey(m)===mKey(c)))return;state.mistakes.push(c);if(state.mistakes.length>40)state.mistakes.shift();}
function removeMistake(item){const n=state.mistakes.length;state.mistakes=state.mistakes.filter(m=>mKey(m)!==mKey(item));if(state.mistakes.length<n)state.mistakesFixed++;}

/* ---------------- Rendering the home screen ---------------- */
function greetingLine(){
  if(!state.completed.length)return "Namaskar! Ready for a new adventure?";
  if(state.streak>=3)return `🔥 ${state.streak}-day streak! Keep it going!`;
  const h=new Date().getHours();return (h<12?"Good morning":h<17?"Good afternoon":"Good evening")+"! Ready for another quest?";}
function weekDots(){let out="";
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const on=state.activeDays.includes(keyFor(d));
    out+=`<span class="wd${on?" on":""}${i===0?" today":""}"><i>${on?"🔥":""}</i><em>${"SMTWTFS"[d.getDay()]}</em></span>`;}
  return out;}
function renderTopStats(){
  $("top-xp").textContent=state.xp;$("top-hearts").textContent=state.hearts;$("top-streak").textContent=state.streak;
  const t=nextHeartText();$("top-hearts").parentElement.title=t?"Next heart in "+t:"Hearts remaining";
  $("sound-btn").textContent=state.settings.sound?"🔔":"🔕";
  const mb=$("music-btn");mb.classList.toggle("off",!state.settings.music);mb.title=state.settings.music?"Music on":"Music off";}
function render(){
  renderTopStats();
  $("stat-xp").textContent=state.xp;$("stat-streak").textContent=state.streak;$("stat-lessons").textContent=state.completed.length;
  $("stat-accuracy").textContent=state.totalAnswered?Math.round(state.totalCorrect/state.totalAnswered*100)+"%":"—";
  $("completed-count").textContent=state.completed.length+" / "+allLessons().length+" lessons";
  $("week-dots").innerHTML=weekDots();
  // daily quest
  const goal=state.dailyGoal,cnt=Math.min(state.dailyCompleted,goal);
  $("quest-bar").style.width=Math.round(cnt/goal*100)+"%";$("quest-label").textContent=`${cnt} / ${goal} quest${goal>1?"s":""} today`;
  $("goal-chips").innerHTML=[[1,"Easy"],[2,"Normal"],[3,"Serious"]].map(([n,l])=>`<button class="chip${goal===n?" active":""}" data-goal="${n}">${l} · ${n}</button>`).join("");
  $("goal-chips").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.dailyGoal=+b.dataset.goal;saveState();render();}));
  // rank
  const r=rankInfo();$("rank-emoji").textContent=r.cur.emoji;$("rank-name").textContent=r.cur.name;$("rank-bar").style.width=r.pct+"%";
  $("rank-label").textContent=r.next?`${state.xp} / ${r.next.xp} XP to ${r.next.name}`:"Top rank reached! 🎉";
  $("language-toggle").textContent="Mode: "+(state.mode==="odia-en"?"Odia → English":"English → Odia");
  {const di=Math.floor(Date.now()/864e5)%TIPS.length;const tl=[TIPS,TIPS_OR,TIPS_HI][{en:0,or:1,hi:2}[robotLangNow()]];$("daily-tip").textContent=tl[di];}
  // path
  const path=$("learning-path");path.innerHTML="";
  LEVELS.forEach(level=>{
    path.appendChild(el("div","level-heading",`<div class="level-label">${esc(level.level)} · ${esc(level.name.toUpperCase())}</div>`));
    level.lessons.forEach(lesson=>{
      const done=state.completed.includes(lesson.id),unlocked=isUnlocked(lesson);
      const unit=el("div","unit"+(done?" completed":"")+(unlocked?"":" locked"));
      unit.innerHTML=`<div class="unit-node">${done?"✓":level.icon}</div><div><p class="unit-title">${esc(lesson.title)}</p><p class="unit-description">${esc(lesson.desc)}</p><div class="unit-meta">${lessonCount(lesson)} questions · ${lesson.xp} XP</div></div><button class="unit-btn" ${unlocked?"":"disabled"}>${done?"Review":unlocked?"Start →":"🔒 Locked"}</button>`;
      unit.querySelector("button").addEventListener("click",()=>startLesson(level,lesson));path.appendChild(unit);});});
  // practice
  const dueN=dueMistakes().length;$("mistake-count").textContent=!state.mistakes.length?"All clear!":dueN?dueN+" due today":"Nothing due · "+state.mistakes.length+" saved";
  $("mistakes-btn").classList.toggle("disabled",!state.mistakes.length);
  // badges
  $("badge-count").textContent=state.badges.length+" / "+BADGES.length;
  $("badge-grid").innerHTML=BADGES.map(b=>{const on=state.badges.includes(b.id);return `<div class="badge${on?" on":""}" title="${esc(b.desc)}"><span class="badge-icon">${on?b.icon:"🔒"}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`;}).join("");
  // word of the day
  const w=WORDS[state.wordIndex%WORDS.length];$("word-en").textContent=w.en;$("word-odia").textContent=w.odia;$("word-example").textContent="Example: "+w.example;
}


/* ---------------- Upgrade 2: Level test ---------------- */
const TIER_COUNTS=[3,3,2,2];   // questions per level: beginner, elementary, intermediate, advanced
function buildLevelTest(){
  const qs=[];
  LEVELS.slice(0,TIER_COUNTS.length).forEach((level,i)=>{
    const pool=[];
    level.lessons.forEach(l=>{
      if(!l.auto)(l.questions||[]).forEach(q=>{if(q.type==="mcq")pool.push(clone(q));});
      if(l.pairs){const local=l.pairs.map(([en,odia])=>({en,odia}));l.pairs.forEach(([en,odia])=>pool.push(vocabMcq({en,odia},"odia-en",local)));}
    });
    qs.push(...shuffle(pool).slice(0,TIER_COUNTS[i]));
  });
  return qs;}
function startLevelTest(){
  if(state.mode!=="odia-en")state.mode="odia-en";
  startSession({kind:"leveltest",title:"Level Test",icon:"🎯",kicker:"LEVEL TEST",questions:buildLevelTest(),restart:startLevelTest});}
function placeAt(idx){
  LEVELS.slice(0,idx).forEach(l=>l.lessons.forEach(x=>{if(!state.completed.includes(x.id))state.completed.push(x.id);}));
  state.placedLevel=idx;saveState();render();}
function finishLevelTest(){
  const s=session;s.done=true;stopTimer();
  const c=s.correct,total=s.total;
  const placed=c>=9?3:c>=7?2:c>=5?1:0;
  const lv=LEVELS[placed];
  $("lesson-progress-bar").style.width="100%";
  $("lesson-screen").innerHTML=`<div class="lesson-result"><div class="result-emoji">🎯</div><p class="lesson-kicker">LEVEL TEST DONE</p><h2>${c} of ${total} correct</h2>
    <p class="muted">Based on your answers, we suggest starting at <b>${esc(lv.name)}</b> (${esc(lv.level)}). You can change this any time.</p>
    <div class="result-actions"><button class="primary-btn" id="lt-start">Start at ${esc(lv.name)}</button><button class="secondary-btn" id="lt-all">Start from the beginning</button></div></div>`;
  $("lt-start").addEventListener("click",()=>{placeAt(placed);closeLesson(true);showToast(`Your path starts at ${lv.name} 🎉`);});
  $("lt-all").addEventListener("click",()=>closeLesson(true));
  sfx(c>=7?"win":"lose");
  if(c>=7)confetti(90);
}


/* ---------------- Upgrade 2: Grammar and Translation mastery levels ---------------- */
const MASTER_LEVELS=[
 {id:"mastery-grammar",name:"Grammar Mastery",level:"LEVEL 5",icon:"📐",lessons:[
  {id:"tenses-mastery",title:"Tenses Mastery",desc:"Simple, continuous and perfect",xp:35,questions:[
   q("She ___ to school every day.","ପ୍ରତିଦିନ · ସରଳ ବର୍ତ୍ତମାନ","goes",["go","goes","going"],"Simple present with she/he/it adds -s: She goes."),
   q("They ___ football right now.","ଏବେ ହେଉଥିବା କାମ","are playing",["play","are playing","played"],"Right now means an action in progress: are playing."),
   q("I ___ my homework already.","ଏହିମାତ୍ର ସମାପ୍ତ","have finished",["finished","have finished","am finish"],"Already + finished action uses present perfect."),
   q("We ___ here since 2020.","2020 ଠାରୁ · ଚାଲୁଛି","have lived",["live","have lived","lived"],"Since + starting point uses present perfect."),
   q("He ___ a letter when I called.","ଯେତେବେଳେ ମୁଁ ଫୋନ୍ କଲି","was writing",["writes","was writing","has written"],"Action in progress at a past moment: was writing.")]},
  {id:"articles-prepositions",title:"Articles & Prepositions",desc:"a, an, the and in, on, at",xp:35,questions:[
   q("She is ___ engineer.","ସ୍ୱର ଧ୍ୱନିରେ ଶୁରୁ","an",["a","an","the"],"Use 'an' before a vowel sound: an engineer."),
   q("The meeting is ___ Monday.","ଦିନ ପାଇଁ","on",["in","on","at"],"Days of the week take 'on': on Monday."),
   q("We arrived ___ the airport at noon.","ସ୍ଥାନ ଓ ସମୟ","at",["in","on","at"],"'At' is used for a point place and time: at the airport, at noon."),
   q("I live ___ India.","ବଡ଼ ଦେଶ ବା ଅଞ୍ଚଳ","in",["at","on","in"],"Countries and big areas take 'in'."),
   q("This is ___ best day of my life.","ଏକ ହିଁ ବିଶେଷ","the",["a","an","the"],"Use 'the' with superlatives: the best.")]},
  {id:"conditionals-modals",title:"Conditionals & Modals",desc:"If, would, will, must, might",xp:40,questions:[
   q("If I had time, I ___ travel more.","ଯଦି ସମୟ ଥାଏ","would",["will","would","did"],"Second conditional (imaginary now): would + verb."),
   q("If it rains, we ___ stay home.","ଯଦି ବର୍ଷା ହୁଏ","will",["would","will","had"],"First conditional (real future): will + verb."),
   q("You ___ wear a helmet on a bike.","ନିୟମ · ଜରୁରୀ","must",["might","must","could"],"Must shows a strong rule or need."),
   q("I ___ be late. Please start without me.","ସମ୍ଭାବନା","might",["must","might","shall"],"Might shows a possibility, not certainty."),
   q("Could you ___ the door, please?","ଅନୁରୋଧ","close",["closed","close","closing"],"After a modal, use the base verb: close.")]},
  {id:"reported-passive",title:"Reported Speech & Passive",desc:"Professional sentences",xp:40,questions:[
   q("He said, 'I am busy.' → He said that he ___ busy.","ବକ୍ତବ୍ୟ · ଅତୀତ","was",["is","was","were"],"In reported speech, am/is move back to was."),
   q("The letter ___ yesterday.","ଅତୀତ · ପାସିଭ୍","was sent",["sent","was sent","is send"],"Passive past: was/were + past participle."),
   q("She asked, 'Where do you live?' → She asked where I ___.","ପ୍ରଶ୍ନ · ବକ୍ତବ୍ୟ","lived",["live","lived","living"],"Questions in reported speech change to past too."),
   q("English ___ in many countries.","ପାସିଭ୍ · ବର୍ତ୍ତମାନ","is spoken",["speaks","is spoken","spoke"],"Passive present: is + past participle."),
   q("The report ___ by Friday.","ଜରୁରୀ · ପାସିଭ୍","must be finished",["must finish","must be finished","must finished"],"Modal + be + past participle for passive.")]},
  {id:"grammar-boss",title:"Grammar Boss",desc:"Mixed grammar test",xp:60,questions:[
   q("Choose the correct sentence.","ସଠିକ୍ ବାକ୍ୟ","He doesn't like it.",["He don't like it.","He doesn't like it.","He doesn't likes it."],"With he/she/it, use doesn't + base verb."),
   q("Which is correct?","ଅବଧି · for ଓ since","I have been here for two years.",["I am here since two years.","I have been here for two years.","I have been here since two years."],"Use 'for' with a period of time: for two years."),
   arr("ସେ ସବୁବେଳେ ସତ କହେ।","She always tells the truth.",["tell"],"Adverb 'always' goes before the main verb."),
   typ("Type the past tense of 'go'.","ଅତୀତ କାଳ","went","Go → went (irregular)."),
   q("Choose the correct word: The children ___ playing outside.","ବହୁବଚନ","are",["is","are","am"],"Plural subject 'children' takes 'are'."),
   arr("ମୁଁ କାଲି ଏକ ବହି ପଢ଼ିଲି।","I read a book yesterday.",["has"],"Yesterday means simple past: read.")]}
 ]},
 {id:"mastery-translation",name:"Translation Mastery",level:"LEVEL 6",icon:"🌐",lessons:[
  {id:"office-phrases",title:"Office Phrases",desc:"Meetings, emails and deadlines",xp:35,questions:[
   q("Choose the Odia meaning: 'I will send you the report today.'","ଅଫିସ୍ · ଇମେଲ୍","ମୁଁ ଆଜି ଆପଣଙ୍କୁ ରିପୋର୍ଟ ପଠାଇବି।",["ମୁଁ ଆଜି ଆପଣଙ୍କୁ ରିପୋର୍ଟ ପଠାଇବି।","ମୁଁ କାଲି ଏକ ଚିଠି ଲେଖିବି।","ସେ ଆଜି ଘରକୁ ଯିବ।"],"'Send the report' means ରିପୋର୍ଟ ପଠାଇବା."),
   q("Choose the Odia meaning: 'Thank you for your time.'","ଧନ୍ୟବାଦ · ଅଫିସ୍","ଆପଣଙ୍କ ସମୟ ପାଇଁ ଧନ୍ୟବାଦ।",["ଆପଣଙ୍କ ଘର କେଉଁଠି?","ଆପଣଙ୍କ ସମୟ ପାଇଁ ଧନ୍ୟବାଦ।","ମୋ ଗାଡ଼ି ଖରାପ ଅଛି।"],"A polite phrase used after a meeting or call."),
   q("Choose the Odia meaning: 'Please call me back later.'","ଫୋନ୍ · ଅନୁରୋଧ","ଦୟାକରି ପରେ ମୋତେ ଫୋନ୍ କରନ୍ତୁ।",["ମୋ ନାମ ରୀନା।","ଆଜି ବର୍ଷା ହେଉଛି।","ଦୟାକରି ପରେ ମୋତେ ଫୋନ୍ କରନ୍ତୁ।"],"'Call back' means ପରେ ଫୋନ୍ କରିବା."),
   q("Choose the Odia meaning: 'The deadline is next Monday.'","ସମୟସୀମା","ଶେଷ ତାରିଖ ପରବର୍ତ୍ତୀ ସୋମବାର।",["ଆଜି ଛୁଟି ଅଛି।","ଶେଷ ତାରିଖ ପରବର୍ତ୍ତୀ ସୋମବାର।","ସେ ଏକ ଭଲ ଶିକ୍ଷକ।"],"Deadline means the last date to finish something."),
   q("Choose the Odia meaning: 'Let's discuss this in the meeting.'","ବୈଠକ","ଆସନ୍ତୁ ଏହାକୁ ବୈଠକରେ ଆଲୋଚନା କରିବା।",["ଆସନ୍ତୁ ଏହାକୁ ଖାଇବା।","ସେ ଦୌଡ଼ିବ।","ଆସନ୍ତୁ ଏହାକୁ ବୈଠକରେ ଆଲୋଚନା କରିବା।"],"Discuss means ଆଲୋଚନା କରିବା.")]},
  {id:"reverse-odia",title:"Odia to English",desc:"Choose the English meaning",xp:35,questions:[
   q("What is the English for: ମୁଁ ଇଂରାଜୀ ପଢ଼େ।","ଓଡ଼ିଆ → ଇଂରାଜୀ","I study English.",["I eat rice.","I study English.","She reads a book."],"ପଢ଼େ here means study."),
   q("What is the English for: ସେ କାମ କରୁଛି।","ଏବେ ହେଉଥିବା କାମ","She is working.",["She is sleeping.","She is working.","He works here."],"କରୁଛି means is doing, so use is working."),
   q("What is the English for: ଆପଣ କେମିତି ଅଛନ୍ତି?","ଅଭିବାଦନ","How are you?",["Where are you?","How are you?","What is this?"],"A common greeting question."),
   q("What is the English for: ମୋର ଗୋଟିଏ ଭଉଣୀ ଅଛି।","ପରିବାର","I have a sister.",["I want a sister.","My sister is tall.","I have a sister."],"ଅଛି means have."),
   q("What is the English for: ଆମେ କାଲି ସ୍କୁଲ ଗଲୁ।","ଅତୀତ","We went to school yesterday.",["We go to school today.","We will go to school.","We went to school yesterday."],"Yesterday means simple past: went.")]},
  {id:"sentence-translation",title:"Sentence Translation",desc:"Type the English sentence",xp:40,questions:[
   typ("Type the English: ମୁଁ ପ୍ରତିଦିନ ପାଣି ପିଏ।","ଓଡ଼ିଆ → ଇଂରାଜୀ · ଟାଇପ୍ କରନ୍ତୁ","I drink water every day.","Many answers are correct. Example: I drink water every day.",["I drink water daily."]),
   typ("Type the English: ସେ ଭଲ ଗାଏ।","ଓଡ଼ିଆ → ଇଂରାଜୀ","She sings well.","She sings well.",["She sings nicely."]),
   typ("Type the English: ଆମେ ଘରକୁ ଯାଉଛୁ।","ଏବେ ହେଉଥିବା କାମ","We are going home.","We are going home.",["We're going home."]),
   typ("Type the English: ତୁମେ କେଉଁଠି ରୁହ?","ପ୍ରଶ୍ନ","Where do you live?","Where do you live?",["Where are you living?"]),
   typ("Type the English: ମୋ ମା ରାନ୍ଧୁଛନ୍ତି।","ଏବେ ହେଉଥିବା କାମ","My mother is cooking.","My mother is cooking.",["My mom is cooking."])]},
  {id:"hindi-english",title:"Hindi to English",desc:"Hindi sentences into English",xp:40,questions:[
   q("What is the English for: मैं चाय पीता हूँ।","हिंदी → अंग्रेज़ी","I drink tea.",["I eat tea.","I drink tea.","I buy tea."],"पीता हूँ means drink."),
   q("What is the English for: वह स्कूल जाती है।","हिंदी → अंग्रेज़ी","She goes to school.",["She goes to home.","He is at school.","She goes to school."],"जाती है means goes."),
   q("What is the English for: कल बारिश होगी।","भविष्य","It will rain tomorrow.",["It rained yesterday.","It will rain tomorrow.","It is raining now."],"होगी shows future: will rain."),
   q("What is the English for: आपका नाम क्या है?","प्रश्न","What is your name?",["Where is your house?","How old are you?","What is your name?"],"A basic question about a name."),
   q("What is the English for: हम एक अच्छी किताब पढ़ रहे हैं।","चल रहा काम","We are reading a good book.",["We read a good book yesterday.","We are reading a good book.","We are writing a book."],"पढ़ रहे हैं means are reading.")]},
  {id:"translation-boss",title:"Translation Boss",desc:"Mixed translation test",xp:60,questions:[
   typ("Type the English: ସେ ଏକ ନୂଆ ଚାକିରି ପାଇଲା।","ଓଡ଼ିଆ → ଇଂରାଜୀ","She got a new job.","Both 'got' and 'found' work here.",["She found a new job."]),
   q("Which is the best English for 'ଧନ୍ୟବାଦ'?","ଶବ୍ଦ ଅର୍ଥ","Thank you",["Sorry","Thank you","Hello"],"ଧନ୍ୟବାଦ means thank you."),
   arr("ସେ ଏକ ଭଲ ଶିକ୍ଷିକା।","She is a good teacher.",["are"],"Use 'is' with she."),
   q("What is the English for: आप कहाँ रहते हैं?","ପ୍ରଶ୍ନ","Where do you live?",["Where are you going?","Where do you live?","What do you live?"],"कहाँ रहते हैं means where do you live."),
   typ("Type the English: ଆମେ ଶୀଘ୍ର ଦେଖା କରିବା।","ଭବିଷ୍ୟତ","We will meet soon.","We will meet soon.",["We'll meet soon."])]}
]}];
MASTER_LEVELS.forEach(l=>LEVELS.push(l));

/* ---------------- Upgrade 2: Story time ---------------- */
const STORIES=[
 {id:"rina-school",title:"Rina's School Day",emoji:"🏫",
  sentences:[
   {en:"Rina wakes up early in the morning.",or:"ରୀନା ସକାଳୁ ଶୀଘ୍ର ଉଠେ।",hi:"रीना सुबह जल्दी उठती है।"},
   {en:"She brushes her teeth and eats rice.",or:"ସେ ଦାନ୍ତ ବ୍ରଶ୍ କରି ଭାତ ଖାଏ।",hi:"वह दांत साफ़ करती है और चावल खाती है।"},
   {en:"She walks to school with her friend.",or:"ସେ ତା ବନ୍ଧୁ ସହ ସ୍କୁଲକୁ ଯାଏ।",hi:"वह अपनी सहेली के साथ स्कूल पैदल जाती है।"},
   {en:"Her teacher is kind and she loves English class.",or:"ତା ଶିକ୍ଷକ ଦୟାଳୁ ଏବଂ ସେ ଇଂରାଜୀ କ୍ଲାସ୍ ଭଲ ପାଏ।",hi:"उसकी शिक्षिका दयालु हैं और उसे अंग्रेज़ी की कक्षा पसंद है।"}],
  questions:[
   {q:"Who wakes up early?",o:["Rina","Her teacher","Her friend"],a:"Rina",e:"Rina wakes up early in the morning."},
   {q:"What does Rina eat?",o:["Bread","Rice","Fish"],a:"Rice",e:"She brushes her teeth and eats rice."},
   {q:"Where does Rina walk to?",o:["The market","The park","School"],a:"School",e:"She walks to school with her friend."}]},
 {id:"raju-market",title:"Raju at the Market",emoji:"🛒",
  sentences:[
   {en:"Raju goes to the market with his mother.",or:"ରାଜୁ ତା ମା ସହ ବଜାରକୁ ଯାଏ।",hi:"राजू अपनी माँ के साथ बाज़ार जाता है।"},
   {en:"He buys a red apple and a banana.",or:"ସେ ଗୋଟିଏ ଲାଲ ସେଓ ଓ ଗୋଟିଏ କଦଳୀ କିଣେ।",hi:"वह एक लाल सेब और एक केला खरीदता है।"},
   {en:"The fish is fresh and very cheap today.",or:"ଆଜି ମାଛ ତାଜା ଏବଂ ବହୁତ ସସ୍ତା।",hi:"आज मछली ताज़ी और बहुत सस्ती है।"},
   {en:"Raju says thank you to the shopkeeper.",or:"ରାଜୁ ଦୋକାନୀଙ୍କୁ ଧନ୍ୟବାଦ କହେ।",hi:"राजू दुकानदार को धन्यवाद कहता है।"}],
  questions:[
   {q:"What does Raju buy?",o:["A red apple and a banana","Rice and milk","Eggs and tea"],a:"A red apple and a banana",e:"He buys a red apple and a banana."},
   {q:"Who does Raju go with?",o:["His father","His mother","His friend"],a:"His mother",e:"Raju goes to the market with his mother."},
   {q:"What does Raju say to the shopkeeper?",o:["Sorry","Hello","Thank you"],a:"Thank you",e:"Raju says thank you to the shopkeeper."}]},
 {id:"birthday-cake",title:"Mother's Birthday",emoji:"🎂",
  sentences:[
   {en:"Today is my mother's birthday.",or:"ଆଜି ମୋ ମାଙ୍କ ଜନ୍ମଦିନ।",hi:"आज मेरी माँ का जन्मदिन है।"},
   {en:"I make a card and draw a big flower.",or:"ମୁଁ ଏକ କାର୍ଡ ବନାଏ ଓ ଏକ ବଡ଼ ଫୁଲ ଆଙ୍କେ।",hi:"मैं एक कार्ड बनाता हूँ और एक बड़ा फूल बनाता हूँ।"},
   {en:"My sister helps me write Happy Birthday.",or:"ମୋ ଭଉଣୀ ମୋତେ Happy Birthday ଲେଖିବାରେ ସାହାଯ୍ୟ କରେ।",hi:"मेरी बहन मुझे Happy Birthday लिखने में मदद करती है।"},
   {en:"We sing a song and eat a sweet cake.",or:"ଆମେ ଗୀତ ଗାଉ ଓ ମିଠା କେକ୍ ଖାଉ।",hi:"हम गाना गाते हैं और मीठा केक खाते हैं।"}],
  questions:[
   {q:"What is today?",o:["My mother's birthday","A school holiday","My birthday"],a:"My mother's birthday",e:"Today is my mother's birthday."},
   {q:"What does the writer draw?",o:["A big flower","A house","A car"],a:"A big flower",e:"I make a card and draw a big flower."},
   {q:"What do they eat?",o:["Sweet cake","Rice","Fish"],a:"Sweet cake",e:"We sing a song and eat a sweet cake."}]}
];
const STORY_QTR={
 "rina-school":[
  {or:{q:"କିଏ ସକାଳୁ ଶୀଘ୍ର ଉଠେ?",o:{"Rina":"ରୀନା","Her teacher":"ତା ଶିକ୍ଷକ","Her friend":"ତା ବନ୍ଧୁ"}},hi:{q:"सुबह जल्दी कौन उठता है?",o:{"Rina":"रीना","Her teacher":"उसकी शिक्षिका","Her friend":"उसकी सहेली"}}},
  {or:{q:"ରୀନା କ'ଣ ଖାଏ?",o:{"Bread":"ରୁଟି","Rice":"ଭାତ","Fish":"ମାଛ"}},hi:{q:"रीना क्या खाती है?",o:{"Bread":"ब्रेड","Rice":"चावल","Fish":"मछली"}}},
  {or:{q:"ରୀନା କେଉଁଠିକୁ ପାଦରେ ଯାଏ?",o:{"The market":"ବଜାର","The park":"ପାର୍କ","School":"ସ୍କୁଲ୍"}},hi:{q:"रीना पैदल कहाँ जाती है?",o:{"The market":"बाज़ार","The park":"पार्क","School":"स्कूल"}}}],
 "raju-market":[
  {or:{q:"ରାଜୁ କ'ଣ କିଣେ?",o:{"A red apple and a banana":"ଗୋଟିଏ ଲାଲ ସେଓ ଓ କଦଳୀ","Rice and milk":"ଭାତ ଓ ଦୁଧ","Eggs and tea":"ଅଣ୍ଡା ଓ ଚା"}},hi:{q:"राजू क्या खरीदता है?",o:{"A red apple and a banana":"एक लाल सेब और केला","Rice and milk":"चावल और दूध","Eggs and tea":"अंडे और चाय"}}},
  {or:{q:"ରାଜୁ କାହା ସହ ଯାଏ?",o:{"His father":"ତା ବାପା","His mother":"ତା ମା","His friend":"ତା ବନ୍ଧୁ"}},hi:{q:"राजू किसके साथ जाता है?",o:{"His father":"उसके पिता","His mother":"उसकी माँ","His friend":"उसका दोस्त"}}},
  {or:{q:"ରାଜୁ ଦୋକାନୀଙ୍କୁ କ'ଣ କହେ?",o:{"Sorry":"ଦୁଃଖିତ","Hello":"ନମସ୍କାର","Thank you":"ଧନ୍ୟବାଦ"}},hi:{q:"राजू दुकानदार से क्या कहता है?",o:{"Sorry":"माफ़ कीजिए","Hello":"नमस्ते","Thank you":"धन्यवाद"}}}],
 "birthday-cake":[
  {or:{q:"ଆଜି କ'ଣ?",o:{"My mother's birthday":"ମାଙ୍କ ଜନ୍ମଦିନ","A school holiday":"ସ୍କୁଲ୍ ଛୁଟି","My birthday":"ମୋ ଜନ୍ମଦିନ"}},hi:{q:"आज क्या है?",o:{"My mother's birthday":"माँ का जन्मदिन","A school holiday":"स्कूल की छुट्टी","My birthday":"मेरा जन्मदिन"}}},
  {or:{q:"ଲେଖକ କ'ଣ ଆଙ୍କନ୍ତି?",o:{"A big flower":"ଏକ ବଡ଼ ଫୁଲ","A house":"ଏକ ଘର","A car":"ଏକ ଗାଡ଼ି"}},hi:{q:"लेखक क्या बनाता है?",o:{"A big flower":"एक बड़ा फूल","A house":"एक घर","A car":"एक कार"}}},
  {or:{q:"ସେମାନେ କ'ଣ ଖାଆନ୍ତି?",o:{"Sweet cake":"ମିଠା କେକ୍","Rice":"ଭାତ","Fish":"ମାଛ"}},hi:{q:"वे क्या खाते हैं?",o:{"Sweet cake":"मीठा केक","Rice":"चावल","Fish":"मछली"}}}]
};
function startStory(i){
  const st=STORIES[i];
  const reads=st.sentences.map((x,k)=>({type:"read",prompt:x.en,hint:`${st.title} · ${k+1} / ${st.sentences.length}`,answer:x.en,say:x.en,explanation:"",tr:{or:x.or,hi:x.hi}}));
  const qs=st.questions.map((q,j)=>{const t=STORY_QTR[st.id][j];return {type:"mcq",prompt:q.q,hint:`${st.title} · Questions`,answer:q.a,options:shuffle(q.o.slice()),explanation:q.e,tr:{or:t.or.q,hi:t.hi.q},optTr:{or:t.or.o,hi:t.hi.o}};});
  startSession({kind:"story",title:st.title,icon:st.emoji,kicker:"STORY TIME",questions:[...reads,...qs],storyIndex:i,restart:()=>startStory(i)});}
function openStories(){
  openSheet("Story Time 📖",`<p class="muted">Read each sentence, listen to it, then answer 3 questions.</p>`+STORIES.map((st,i)=>`<button class="story-card" data-i="${i}"><span class="story-emoji">${st.emoji}</span><span><b>${esc(st.title)}</b><small>${state.stories.includes(st.id)?"✅ Finished · replay for 5 XP":"4 sentences · 3 questions · +25 XP"}</small></span></button>`).join(""));
  document.querySelectorAll("#sheet-body .story-card").forEach(b=>b.addEventListener("click",()=>{closeSheet();startStory(+b.dataset.i);}));}
BADGES.push({id:"story1",icon:"📖",name:"Storyteller",desc:"Finish a story",test:x=>(x.stories||[]).length>=1},
            {id:"story3",icon:"🎬",name:"Story Master",desc:"Finish all 3 stories",test:x=>(x.stories||[]).length>=3});
$("level-btn").addEventListener("click",startLevelTest);
$("story-btn").addEventListener("click",openStories);

/* ---------------- Sessions ---------------- */
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null;}}
function syncModalLock(){document.body.classList.toggle("modal-open",!$("lesson-modal").classList.contains("hidden")||!$("sheet-modal").classList.contains("hidden")||!$("tour").classList.contains("hidden"));}
function startLesson(level,lesson){
  if(!isUnlocked(lesson)){showToast("Finish the previous lesson to unlock this one.");return;}
  if(state.mode==="en-odia"&&!lesson.pairs)showToast("Grammar lessons stay the same in this mode.");
  startSession({kind:"lesson",title:lesson.title,icon:level.icon,kicker:level.level+" QUEST",questions:buildQuestions(lesson),lesson,level,restart:()=>startLesson(level,lesson)});}
function startQuick(){const qs=quickQuestions(8,false);if(!qs.length){showToast("Not enough questions yet.");return;}
  startSession({kind:"quick",title:"Quick Practice",icon:"⚡",kicker:"PRACTICE",questions:qs,restart:startQuick});}
function startSpeed(){const qs=quickQuestions(8,true);if(qs.length<4){showToast("Complete a lesson first to unlock Speed Round.");return;}
  startSession({kind:"speed",title:"Speed Round",icon:"⏱️",kicker:"SPEED ROUND",questions:qs,timed:true,restart:startSpeed});}
function startMistakes(){if(!state.mistakes.length){showToast("No mistakes to fix. Great job! 🎉");return;}
  const due=shuffle(dueMistakes()).slice(0,8);
  if(!due.length){const d=nextReviewDays();showToast(`Nothing due today. Next review in ${d} day${d===1?"":"s"}. 👍`);return;}
  startSession({kind:"mistakes",title:"Review Due",icon:"🛠️",kicker:"SPACED REVIEW",questions:due.map(clone),restart:startMistakes});}
function startSession(o){
  stopTimer();
  if(o.kind==="lesson"){regenHearts();if(state.hearts<=0){showNoHearts(null,o);return;}}
  session={...o,queue:o.questions.slice(),idx:0,total:o.questions.filter(q=>q.type!=="read").length,correct:0,answered:false,combo:0,bestCombo:0,xpGained:0,done:false,practice:o.kind!=="lesson",selected:null};
  $("lesson-modal").classList.remove("hidden");syncModalLock();renderQuestion();}
function heartsUI(){const v=session&&session.practice?"∞":state.hearts;$("lesson-hearts").textContent=v;$("top-hearts").textContent=state.hearts;}
function coach(kind){return rand(kind==="good"?["Great job!","Super!","Well done!","Excellent!","You're on fire!","Perfect!"]:kind==="bad"?["No worries, we'll fix it!","Mistakes help us learn.","Almost! Try again later.","Keep going, you can do it!"]:["Take your time!","You can do this!","Think, then tap.","Read carefully.","Say it in your head first."]);}
const INSTR={read:"Listen, then tap Next.",mcq:"Choose the best answer.",listen:"Tap 🔊 to listen, then choose.",type:"Type your answer below.",arrange:"Tap the words to build the sentence.",match:"Tap one item on each side to match them.",say:"Tap the mic and say it clearly."};
function renderQuestion(){
  const s=session;stopTimer();const item=s.queue[s.idx];s.item=item;s.answered=false;s.selected=null;s.arranged=[];
  heartsUI();$("lesson-progress-bar").style.width=(s.idx/s.queue.length*100)+"%";
  const retry=item._retry,pre=previewText(item);
  const speakBtn=item.type==="read"?`<div class="listen-row"><button class="speak-btn big" id="speak-q" aria-label="Listen">🔊 Listen</button><button class="speak-btn" id="speak-slow" aria-label="Play slowly">🐢 Slow</button></div>`:item.type==="listen"?`<div class="listen-row"><button class="speak-btn big" id="speak-q" aria-label="Play audio">🔊</button><button class="speak-btn" id="speak-slow" aria-label="Play slowly">🐢</button></div>`:pre?`<div class="listen-row"><button class="speak-btn" id="speak-q" aria-label="Hear it">🔊 Normal</button><button class="speak-btn" id="speak-slow2" aria-label="Play slowly">🐢 Slow</button></div>`:"";
  $("lesson-screen").innerHTML=`<div class="lesson-content"><p class="lesson-kicker">${esc(s.kicker)} · ${retry?"REVIEW":"QUESTION "+(s.idx+1)+"/"+s.queue.length}</p><h2>${esc(s.title)}</h2>
    <p class="coach"><span class="coach-bot">🤖</span><span id="coach-line"></span></p>
    ${s.timed?`<div class="timer"><i id="timer-bar"></i></div>`:""}
    <div class="question-card"><div class="question-emoji">${s.icon}</div><p class="question-prompt">${esc(item.prompt)}</p><p class="question-hint">${esc(item.hint||"")}</p>${item.tr?`<p class="story-tr">${esc(item.tr[robotLangNow()==="hi"?"hi":"or"])}</p>`:""}${speakBtn}</div>
    <p class="lesson-instruction">${INSTR[item.type]||INSTR.mcq}</p><div class="answer-area" id="answer-area"></div><div id="feedback" aria-live="polite"></div>
    <div class="lesson-bottom"><span class="combo" id="combo-pill">${s.combo>=2?"🔥 Combo ×"+s.combo:"Correct answer earns XP ⭐"}</span>${SR_CLASS&&item.type!=="say"?`<button class="voice-chip" id="voice-btn" aria-label="Speak your answer">${item.type==="match"?"🎤 Say a word":"🎤 Speak"}</button>`:""}<button class="primary-btn" id="check-btn" ${item.type==="read"?"":"disabled"}>${item.type==="match"?"Match all pairs":item.type==="read"?"Next →":"Check answer"}</button></div></div>`;
  typeText($("coach-line"),retry?"Let's try this one again!":coach(),22);
  const vb0=$("voice-btn");if(vb0)vb0.addEventListener("click",()=>voiceSolve(item));
  const sq=$("speak-q");if(sq)sq.addEventListener("click",()=>speak(pre||item.say));const ss=$("speak-slow");if(ss)ss.addEventListener("click",()=>speak(item.say,.5));const s2=$("speak-slow2");if(s2)s2.addEventListener("click",()=>speak(pre,.5));
  if(item.type==="listen"&&state.settings.autoRead)setTimeout(()=>{if(session===s&&s.item===item&&!s.answered)speak(item.say);},350);
  $("check-btn").addEventListener("click",onPrimary);
  if(item.type==="mcq"||item.type==="listen")buildChoices(item);
  else if(item.type==="type")buildTyping();
  else if(item.type==="arrange")buildArrange(item);
  else if(item.type==="match")buildMatch(item);
  else if(item.type==="say")buildSay(item);
  if(s.timed)startTimer();}
function buildChoices(item){const list=$("answer-area");list.className="answer-list";
  const otr=item.optTr?item.optTr[robotLangNow()==="hi"?"hi":"or"]:null;
  shuffle(item.options.slice()).forEach((choice,i)=>{const b=el("button","answer-option");b.dataset.value=choice;b.innerHTML=`<span class="key">${i+1}</span><span>${esc(choice)}${otr&&otr[choice]?`<small class="opt-tr">${esc(otr[choice])}</small>`:""}</span>`;
    b.addEventListener("click",()=>selectAnswer(b,choice));list.appendChild(b);});}
function selectAnswer(button,choice){const s=session;if(s.answered)return;sfx("click");
  document.querySelectorAll(".answer-option").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");s.selected=choice;$("check-btn").disabled=false;}
function buildTyping(){const a=$("answer-area");a.innerHTML=`<input id="type-input" class="type-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type in English…" aria-label="Your answer">`;
  const inp=$("type-input");inp.addEventListener("input",()=>{$("check-btn").disabled=!inp.value.trim()&&!session.answered;});
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();onPrimary();}});setTimeout(()=>{try{inp.focus();}catch{}},60);}
function buildArrange(item){const s=session;
  const words=item.answer.split(/\s+/),all=words.concat(item.extra||[]);s.tokens=all;
  const ids=all.map((_,i)=>i);
  for(let k=0;k<20;k++){shuffle(ids);if(!ids.filter(i=>i<words.length).every((v,i)=>v===i))break;} // never show the answer already in order
  s.bank=ids;
  $("answer-area").innerHTML=`<div class="arrange-zone empty" id="arr-zone" aria-label="Your sentence"></div><div class="word-bank" id="arr-bank"></div>`;drawArrange();}
function drawArrange(){const s=session,zone=$("arr-zone"),bank=$("arr-bank");if(!zone)return;zone.innerHTML="";bank.innerHTML="";zone.classList.toggle("empty",!s.arranged.length);
  const tile=id=>{const b=el("button","word-tile");b.textContent=s.tokens[id];return b;};
  s.arranged.forEach(id=>{const b=tile(id);b.addEventListener("click",()=>{if(s.answered)return;s.arranged=s.arranged.filter(x=>x!==id);sfx("click");drawArrange();});zone.appendChild(b);});
  s.bank.forEach(id=>{const b=tile(id);if(s.arranged.includes(id)){b.classList.add("used");b.disabled=true;}else b.addEventListener("click",()=>{if(s.answered)return;s.arranged.push(id);sfx("click");drawArrange();});bank.appendChild(b);});
  if(!s.answered)$("check-btn").disabled=!s.arranged.length;}
/* ---------------- Speak your answer on any question ---------------- */
const NUM_WORDS={one:0,first:0,"1":0,two:1,second:1,"2":1,three:2,third:2,"3":2,four:3,fourth:3,"4":3};
function bestOptionIndex(alts,options){
  let best=-1,bs=0;
  alts.forEach(a=>{const t=norm(a);
    const m=t.match(/\b(?:option\s+)?(one|two|three|four|first|second|third|fourth|1|2|3|4)\b/);
    if(m&&t.split(" ").length<=3&&NUM_WORDS[m[1]]<options.length&&bs<1){bs=1;best=NUM_WORDS[m[1]];}
    options.forEach((o,i)=>{const sc=similarity(a,o);if(sc>bs&&sc>=.7){bs=sc;best=i;}});});
  return best;}
function voiceErrorText(err){
  return ({"not-allowed":"Microphone is blocked. Allow it in browser settings.","service-not-allowed":"Microphone is blocked. Allow it in browser settings.","audio-capture":"No microphone found.","network":"Voice needs internet. Check your connection.","no-speech":"I could not hear you. Try again."})[err.message]||"Could not hear that clearly. Try again.";}
async function voiceSolve(item){
  const s=session;if(!s||s.answered||s.listening||item.type==="say")return;
  s.listening=true;const vb=$("voice-btn");if(vb){vb.disabled=true;vb.textContent="🎙️ Listening…";}
  const status=t=>typeText($("coach-line"),t,18);
  const reset=()=>{s.listening=false;if(vb&&!s.answered){vb.disabled=false;vb.textContent="🎤 Speak";}};
  try{
    const alts=await listenOnce();
    if(session!==s||s.answered){s.listening=false;return;}
    s.listening=false;const heard=alts[0];
    if(item.type==="mcq"||item.type==="listen"){
      const btns=[...document.querySelectorAll(".answer-option")];
      const idx=bestOptionIndex(alts,btns.map(b=>b.dataset.value));
      if(idx<0)status("Didn't catch that. Say the option or tap one.");
      else{btns[idx].click();status(`You said “${heard}”`);setTimeout(()=>{if(session===s&&!s.answered&&s.selected!=null)onPrimary();},450);}
    }else if(item.type==="type"){
      const best=alts.find(a=>similarity(a,item.answer)>=.8)||heard;
      const inp=$("type-input");if(inp){inp.value=best;inp.dispatchEvent(new Event("input"));}
      resolve(similarity(best,item.answer)>=.8,item.answer,best);
    }else if(item.type==="arrange"){
      const score=Math.max(...alts.map(a=>similarity(a,item.answer)));
      resolve(score>=.8,item.answer,heard);
    }else if(item.type==="match"){
      const tiles=[...document.querySelectorAll(".match-tile:not(.matched)")];let best=null,bs=0;
      alts.forEach(a=>tiles.forEach(t=>{const sc=similarity(a,t.textContent);if(sc>bs){bs=sc;best=t;}}));
      if(!best||bs<.75)status("Say a word from the English side, for example Water.");
      else{status(`Matched “${best.textContent}”`);best.click();}
    }
  }catch(err){status(voiceErrorText(err));}
  finally{reset();}
}
function buildSay(item){
  const a=$("answer-area");
  const model=`<div class="listen-row"><button class="speak-btn" id="say-model">🔊 Listen first</button><button class="speak-btn" id="say-model-slow">🐢 Slow</button></div>`;
  if(SR_CLASS){
    a.innerHTML=`${model}<button class="mic-btn" id="mic-btn">🎤 Tap and say</button><p class="say-status" id="say-status">Say it clearly. We will check your pronunciation.</p>`;
    $("mic-btn").addEventListener("click",()=>sayNow(item));
  }else{
    a.innerHTML=`${model}<p class="say-status">Voice is not supported in this browser. Type the word instead.</p><input id="type-input" class="type-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type here…" aria-label="Your answer">`;
    const inp=$("type-input");inp.addEventListener("input",()=>{$("check-btn").disabled=!inp.value.trim();});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();onPrimary();}});setTimeout(()=>{try{inp.focus();}catch{}},60);
  }
  $("say-model").addEventListener("click",()=>speak(item.say));
  $("say-model-slow").addEventListener("click",()=>speak(item.say,.5));
}
async function sayNow(item){
  const s=session;if(!s||s.answered||s.listening)return;s.listening=true;
  const btn=$("mic-btn"),st=$("say-status");btn.disabled=true;btn.textContent="🎙️ Listening…";st.textContent="Speak now…";
  try{
    const alts=await listenOnce();s.listening=false;
    const score=Math.max(...alts.map(x=>similarity(x,item.answer)));
    const thr=item.threshold||.8;
    st.textContent=`You said: “${alts[0]}”`;
    resolve(score>=thr,item.answer,alts[0]);
  }catch(err){
    s.listening=false;btn.disabled=false;btn.textContent="🎤 Try again";
    const msg={"not-allowed":"Microphone is blocked. Allow it in the browser settings, then try again.","service-not-allowed":"Microphone is blocked. Allow it in the browser settings, then try again.","audio-capture":"No microphone found on this device.","network":"Voice recognition needs internet. Check your connection and try again.","no-speech":"I could not hear you. Speak a little louder and try again."}[err.message]||"I could not hear that clearly. Try again.";
    st.textContent=msg;
  }
}
function buildMatch(item){const s=session;s.matched=new Set();s.msel=null;s.mm=0;
  $("answer-area").innerHTML=`<div class="match-grid"><div class="match-col" id="m-left"></div><div class="match-col" id="m-right"></div></div>`;
  const mk=(i,t,side)=>{const b=el("button","match-tile");b.textContent=t;b.dataset.i=i;b.dataset.side=side;b.addEventListener("click",()=>matchClick(b));return b;};
  shuffle(item.pairs.map((p,i)=>[i,p[0]])).forEach(([i,t])=>$("m-left").appendChild(mk(i,t,"L")));
  shuffle(item.pairs.map((p,i)=>[i,p[1]])).forEach(([i,t])=>$("m-right").appendChild(mk(i,t,"R")));}
function matchClick(b){const s=session;if(s.answered||b.classList.contains("matched"))return;
  if(b.dataset.side==="L"&&state.settings.autoRead)speak(b.textContent);
  if(!s.msel){s.msel=b;b.classList.add("sel");sfx("click");return;}
  if(s.msel===b){b.classList.remove("sel");s.msel=null;return;}
  if(s.msel.dataset.side===b.dataset.side){s.msel.classList.remove("sel");s.msel=b;b.classList.add("sel");sfx("click");return;}
  const a=s.msel;s.msel=null;a.classList.remove("sel");
  if(a.dataset.i===b.dataset.i){[a,b].forEach(x=>{x.classList.add("matched");x.disabled=true;});sfx("soft");s.matched.add(a.dataset.i);
    if(s.matched.size===s.item.pairs.length)resolve(s.mm===0,s.item.answer,null,{skipHeart:true});}
  else{s.mm++;sfx("wrong");if(s.kind==="lesson"){loseHeart();saveState();heartsUI();}[a,b].forEach(x=>x.classList.add("wrong"));setTimeout(()=>[a,b].forEach(x=>x.classList.remove("wrong")),450);}}
function startTimer(){const s=session,item=s.item,t0=Date.now(),bar=$("timer-bar");
  let lastSec=-1;
  timerId=setInterval(()=>{const left=SPEED_SECONDS*1000-(Date.now()-t0);const sec=Math.ceil(left/1000);if(left>0&&left<=3000&&sec!==lastSec){lastSec=sec;sfx("tick");}if(bar){bar.style.width=Math.max(0,left/(SPEED_SECONDS*10))+"%";if(left<4000)bar.classList.add("urgent");}
    if(left<=0){stopTimer();if(session===s&&s.item===item&&!s.answered)resolve(false,item.answer,null,{timeUp:true,skipHeart:true});}},100);}
function onPrimary(){const s=session;if(!s||s.done)return;
  if(s.answered){advance();return;}
  const item=s.item;
  if(item.type==="read"){advance();return;}
  if(item.type==="mcq"||item.type==="listen"){if(s.selected==null)return;resolve(s.selected===item.answer,item.answer,s.selected);}
  else if(item.type==="type"){const v=$("type-input").value;if(!v.trim())return;resolve(acceptAnswer(item,v),item.answer,v);}
  else if(item.type==="say"){if(!SR_CLASS){const v=($("type-input")||{}).value||"";if(!v.trim())return;resolve(norm(v)===norm(item.answer),item.answer,v);}}
  else if(item.type==="arrange"){if(!s.arranged.length)return;const user=s.arranged.map(i=>s.tokens[i]).join(" ");resolve(norm(user)===norm(item.answer),item.answer,user);}}
function resolve(correct,correctText,userAnswer,opts){
  opts=opts||{};const s=session;if(!s||s.answered)return;const item=s.item;s.answered=true;stopTimer();
  const retry=!!item._retry;let gain=0;
  if(!retry&&s.kind!=="leveltest")srsRecord(item,correct);
  {const mb=$("mic-btn");if(mb)mb.disabled=true;const vb2=$("voice-btn");if(vb2)vb2.disabled=true;}
  if(!retry)state.totalAnswered++;
  if(correct){sfx("correct");
    if(!retry){s.correct++;state.totalCorrect++;s.combo++;s.bestCombo=Math.max(s.bestCombo,s.combo);state.bestCombo=Math.max(state.bestCombo,s.combo);
      const base=s.kind==="lesson"?5:s.kind==="speed"?3:2,bonus=s.kind==="lesson"&&s.combo>=3?Math.min(s.combo-2,3):0;gain=base+bonus;state.xp+=gain;s.xpGained+=gain;}
    if(s.kind==="mistakes"){const e=state.srs[srsKey(item)];if(e&&e.box>=4)removeMistake(item);}
  }else{sfx("wrong");s.combo=0;
    if(!opts.skipHeart&&s.kind==="lesson")loseHeart();
    if(s.kind!=="mistakes"&&s.kind!=="leveltest"&&!retry)addMistake(item);
    if(!retry&&s.kind!=="speed"&&s.kind!=="leveltest")s.queue.push({...clone(item),_retry:true});}
  // mark UI
  document.querySelectorAll(".answer-option").forEach(b=>{b.disabled=true;if(b.dataset.value===item.answer)b.classList.add("correct");else if(b.dataset.value===s.selected)b.classList.add("wrong");});
  const inp=$("type-input");if(inp){inp.disabled=true;inp.classList.add(correct?"ok":"bad");}
  const zone=$("arr-zone");if(zone){zone.classList.add(correct?"ok":"bad");document.querySelectorAll(".word-tile").forEach(b=>b.disabled=true);}
  const speakText=item.type==="listen"?null:englishText(item);
  const fb=$("feedback");fb.className="feedback "+(correct?"good":"bad");
  const head=correct?(item.type==="match"?"Perfect matching!":coach("good"))+(gain?` +${gain} XP`:""):opts.timeUp?"Time's up!":item.type==="match"?"Some pairs were wrong.":"Not quite.";
  const showAns=!correct&&item.type!=="match";
  const again=!correct&&!retry&&s.kind!=="speed"&&s.kind!=="leveltest"?" We'll ask this again at the end.":"";
  fb.innerHTML=`<b>${esc(head)}</b> ${showAns?"Correct answer: <b>"+esc(correctText)+"</b>. ":""}${esc(item.explanation||"")}${esc(again)} ${speakText?'<button class="speak-btn small" id="speak-fb">🔊 Hear it</button>':""}`;
  const sf=$("speak-fb");if(sf)sf.addEventListener("click",()=>speak(speakText));
  if(speakText&&state.settings.autoRead&&state.settings.sound)setTimeout(()=>speak(speakText),250);
  typeText($("coach-line"),correct?coach("good"):coach("bad"),20);
  $("combo-pill").textContent=s.combo>=2?"🔥 Combo ×"+s.combo:s.kind==="lesson"?"Keep going!":"";
  const last=s.idx>=s.queue.length-1;const cb=$("check-btn");cb.disabled=false;cb.textContent=last?"Finish →":"Continue →";cb.focus();
  heartsUI();saveState();renderTopStats();}
function advance(){const s=session;
  const next=()=>{s.idx++;if(s.idx>=s.queue.length)finishSession();else renderQuestion();};
  if(s.kind==="lesson"&&state.hearts<=0&&s.idx<s.queue.length-1){showNoHearts(next,null);return;}
  next();}
function showNoHearts(resume,startOpts){
  stopTimer();sfx("lose");$("lesson-modal").classList.remove("hidden");syncModalLock();$("lesson-hearts").textContent=0;
  $("lesson-progress-bar").style.width=session&&!startOpts?(session.idx/session.queue.length*100)+"%":"0%";
  $("lesson-screen").innerHTML=`<div class="lesson-result"><div class="result-emoji">💔</div><p class="lesson-kicker">OUT OF HEARTS</p><h2>Take a short break</h2>
    <p class="muted">A new heart arrives every 20 minutes (next one in <b id="heart-timer">${nextHeartText()}</b>). You can also refill a heart with XP, or practise without hearts.</p>
    <div class="result-actions"><button class="primary-btn" id="nh-buy" ${state.xp>=HEART_COST?"":"disabled"}>❤️ Refill 1 heart · ${HEART_COST} XP</button><button class="secondary-btn" id="nh-practice">⚡ Practice instead</button><button class="secondary-btn" id="nh-home">Back to map</button></div></div>`;
  $("nh-buy").addEventListener("click",()=>{if(state.xp<HEART_COST)return;state.xp-=HEART_COST;if(state.hearts>=5)state.heartTime=0;else if(!state.heartTime)state.heartTime=Date.now();state.hearts=Math.min(5,state.hearts+1);saveState();renderTopStats();sfx("heart");
    if(resume){heartsUI();resume();}else if(startOpts)startSession(startOpts);});
  $("nh-practice").addEventListener("click",()=>{closeLesson(true);startQuick();});
  $("nh-home").addEventListener("click",()=>closeLesson(true));}
function finishSession(){
  if(session&&session.kind==="leveltest"){finishLevelTest();return;}
  const s=session;s.done=true;stopTimer();
  const total=s.total,correct=s.correct,acc=total?Math.round(correct/total*100):0;
  const passed=s.kind==="speed"?correct>=1:correct>=Math.ceil(total*.5),perfect=total>0&&correct===total;
  const prevRank=rankInfo().idx;let bonus=0,dailyMsg="";
  if(passed){
    if(s.kind==="lesson"){const first=!state.completed.includes(s.lesson.id);
      if(first){state.completed.push(s.lesson.id);bonus+=s.lesson.xp;state.hearts=Math.min(5,state.hearts+1);if(state.hearts>=5)state.heartTime=0;}else bonus+=Math.round(s.lesson.xp*.25);
      if(perfect){bonus+=10;state.perfectCount++;}}
    else if(s.kind==="story"){const id=STORIES[s.storyIndex].id;if(!state.stories.includes(id)){state.stories.push(id);bonus+=25;}else bonus+=5;}
    else bonus+=s.kind==="speed"?5:3;
    markActive();state.dailyCompleted++;
    if(state.dailyCompleted>=state.dailyGoal&&state.dailyBonusDate!==todayKey()){state.dailyBonusDate=todayKey();bonus+=DAILY_BONUS;dailyMsg=`🎯 Daily goal reached! +${DAILY_BONUS} XP`;}
    state.xp+=bonus;}
  if(s.kind==="speed")state.speedBest=Math.max(state.speedBest,correct);
  if(total>=4)state.bestAccuracy=Math.max(state.bestAccuracy,acc);
  saveState();const fresh=checkBadges();const rank=rankInfo();const ranked=rank.idx>prevRank;
  if(passed){sfx(ranked?"rank":"win");confetti(perfect?150:90);}else sfx("lose");
  render();
  robotTalk(passed?rand(ROBOT_CELEBRATE):rand(ROBOT_TRY));
  const earned=s.xpGained+bonus;
  const next=(()=>{if(s.kind!=="lesson"||!passed)return null;const list=allLessons();const i=list.findIndex(l=>l.id===s.lesson.id);const n=list[i+1];return n&&isUnlocked(n)?n:null;})();
  $("lesson-progress-bar").style.width="100%";heartsUI();
  const title=s.kind==="speed"?(passed?"Speed Round done!":"Time ran out"):passed?(perfect?"Perfect score!":"Amazing work!"):"Keep practising!";
  const sub=passed?(s.kind==="lesson"?"You made progress on your English adventure.":"Great practice session!"):"You need at least half the answers correct to complete this lesson. Try again when you're ready.";
  $("lesson-screen").innerHTML=`<div class="lesson-result"><div class="result-emoji">${passed?(perfect?"🏆":"🎉"):"💪"}</div><p class="lesson-kicker">${passed?(s.kind==="lesson"?"QUEST COMPLETE":"SESSION COMPLETE"):"PRACTICE ROUND"}</p><h2>${esc(title)}</h2><p class="muted">${esc(sub)}</p>
    <div class="result-stats"><div><b>⭐ +${earned}</b><span>XP earned</span></div><div><b>🎯 ${acc}%</b><span>${correct} of ${total} correct</span></div><div><b>⚡ ×${s.bestCombo}</b><span>Best combo</span></div></div>
    ${ranked?`<div class="banner rank">${rank.cur.emoji} Rank up! You are now a <b>${esc(rank.cur.name)}</b></div>`:""}${dailyMsg?`<div class="banner goal">${dailyMsg}</div>`:""}
    ${fresh.map(b=>`<div class="banner badge-up">${b.icon} Badge unlocked: <b>${esc(b.name)}</b></div>`).join("")}
    <div class="result-actions">${next?`<button class="primary-btn" id="result-next">Next lesson →</button>`:""}<button class="${next?"secondary-btn":"primary-btn"}" id="result-home">Back to map</button><button class="secondary-btn" id="result-retry">Try again</button></div></div>`;
  $("result-home").addEventListener("click",()=>closeLesson(true));
  $("result-retry").addEventListener("click",()=>{const r=s.restart;closeLesson(true);if(r)r();});
  const rn=$("result-next");if(rn)rn.addEventListener("click",()=>{const lv=levelById(next.levelId),ls=lessonById(next.id);closeLesson(true);startLesson(lv,ls);});}
function closeLesson(force){
  if(!force&&session&&!session.done&&session.idx>0&&!confirm("Quit this lesson? You will lose your progress in it."))return;
  stopTimer();try{if(canSpeak())speechSynthesis.cancel();}catch{}
  session=null;$("lesson-modal").classList.add("hidden");syncModalLock();render();}

/* ---------------- Sheet modal: flashcards & settings ---------------- */
function openSheet(title,html){$("sheet-title").textContent=title;$("sheet-body").innerHTML=html;$("sheet-modal").classList.remove("hidden");syncModalLock();}
function closeSheet(){$("sheet-modal").classList.add("hidden");syncModalLock();try{if(canSpeak())speechSynthesis.cancel();}catch{}render();}
function openFlashcards(){
  const deck=shuffle(WORDS.slice());let i=0,flipped=false;
  openSheet("Flashcards",`<p class="muted center">Tap the card to flip it. Say the word aloud!</p>
    <button class="flashcard" id="fc-card" aria-live="polite"><span class="fc-front"><small>ENGLISH</small><b id="fc-en"></b></span><span class="fc-back"><small>ODIA</small><b id="fc-odia"></b><em id="fc-ex"></em></span></button>
    <p class="muted center" id="fc-count"></p>
    <div class="result-actions"><button class="secondary-btn" id="fc-prev">‹ Prev</button><button class="secondary-btn" id="fc-say">🔊 Hear it</button><button class="primary-btn" id="fc-next">Next ›</button></div>`);
  const draw=()=>{const w=deck[i];$("fc-en").textContent=w.en;$("fc-odia").textContent=w.odia;$("fc-ex").textContent=w.example;$("fc-card").classList.toggle("flipped",flipped);$("fc-count").textContent=`Card ${i+1} of ${deck.length} · ${state.wordsSeen.length} words studied`;};
  const flip=()=>{flipped=!flipped;if(flipped&&!state.wordsSeen.includes(deck[i].en)){state.wordsSeen.push(deck[i].en);saveState();checkBadges();}sfx("flip");draw();};
  const go=d=>{i=(i+d+deck.length)%deck.length;flipped=false;draw();if(state.settings.autoRead)speak(deck[i].en);};
  $("fc-card").addEventListener("click",flip);$("fc-next").addEventListener("click",()=>go(1));$("fc-prev").addEventListener("click",()=>go(-1));$("fc-say").addEventListener("click",()=>speak(flipped?deck[i].example:deck[i].en));draw();}
const b64e=s=>{let bin="";new TextEncoder().encode(s).forEach(b=>bin+=String.fromCharCode(b));return btoa(bin);};
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)));
function applyTheme(){const t=state.settings.theme;const dark=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme=dark?"dark":"light";const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=dark?"#1b1933":"#6558e8";
  const tb=$("theme-btn");if(tb)tb.textContent=dark?"☀️":"🌙";}
function openSettings(){
  const sw=(id,label,on)=>`<label class="switch-row"><span>${label}</span><input type="checkbox" id="${id}" ${on?"checked":""}><i class="switch"></i></label>`;
  openSheet("Settings",`${sw("set-music","Soft background music",state.settings.music)}
    <label class="slider-row"><span>Music volume</span><input type="range" id="set-mvol" min="0" max="100" value="${Math.round(state.settings.musicVol*100)}"></label>
    ${sw("set-sound","Sound effects",state.settings.sound)}
    <label class="slider-row"><span>Effects volume</span><input type="range" id="set-svol" min="0" max="100" value="${Math.round(state.settings.sfxVol*100)}"></label>
    ${sw("set-read","Read answers aloud",state.settings.autoRead)}
    ${sw("set-robot","Robot talks out loud",state.settings.robotVoice)}
    <p class="eyebrow settings-label">ROBOT LANGUAGE</p><div class="chips" id="robot-lang-chips">${[["en","English"],["or","ଓଡ଼ିଆ"],["hi","हिंदी"]].map(([v,l])=>`<button class="chip${robotLangNow()===v?" active":""}" data-rl="${v}">${l}</button>`).join("")}</div>
    ${isStandalone()?"":'<p class="eyebrow settings-label">APP</p><button class="secondary-btn" id="set-install">📲 Install app</button>'}
    <p class="eyebrow settings-label">THEME</p><div class="chips" id="theme-chips">${[["auto","Auto"],["light","Light"],["dark","Dark"]].map(([v,l])=>`<button class="chip${state.settings.theme===v?" active":""}" data-theme="${v}">${l}</button>`).join("")}</div>
    <p class="eyebrow settings-label">WELCOME TOUR</p><button class="secondary-btn" id="replay-tour">🎓 Replay welcome tour</button>
    <p class="eyebrow settings-label">BACKUP & TRANSFER</p><p class="muted">Copy this code to keep your progress safe or move it to another device. Paste a code and tap Restore to load it.</p>
    <textarea id="backup-code" class="backup" rows="3" spellcheck="false" aria-label="Backup code">${esc(b64e(JSON.stringify(state)))}</textarea>
    <div class="result-actions left"><button class="secondary-btn" id="copy-backup">Copy code</button><button class="secondary-btn" id="restore-backup">Restore from code</button></div>
    <p class="eyebrow settings-label">DANGER ZONE</p><button class="secondary-btn danger" id="reset-progress">Reset all progress</button><p class="muted version">O-E Adventure v2.0</p>`);
  $("set-sound").addEventListener("change",e=>{state.settings.sound=e.target.checked;saveState();renderTopStats();if(e.target.checked)sfx("correct");});
  $("set-read").addEventListener("change",e=>{state.settings.autoRead=e.target.checked;saveState();});
  const si=$("set-install");if(si)si.addEventListener("click",()=>$("install-btn").click());
  $("set-robot").addEventListener("change",e=>{state.settings.robotVoice=e.target.checked;saveState();if(!e.target.checked)speechSynthesis.cancel();});
  document.querySelectorAll("#robot-lang-chips .chip").forEach(c=>c.addEventListener("click",()=>setRobotLang(c.dataset.rl)));
  $("replay-tour").addEventListener("click",replayTour);
  $("set-music").addEventListener("change",e=>{state.settings.music=e.target.checked;gestured=true;saveState();applyMusic();});
  $("set-mvol").addEventListener("input",e=>{state.settings.musicVol=e.target.value/100;gestured=true;if(state.settings.music)applyMusic();});
  $("set-mvol").addEventListener("change",saveState);
  $("set-svol").addEventListener("input",e=>{state.settings.sfxVol=e.target.value/100;});
  $("set-svol").addEventListener("change",()=>{saveState();sfx("correct");});
  document.querySelectorAll("#theme-chips .chip").forEach(b=>b.addEventListener("click",()=>{state.settings.theme=b.dataset.theme;saveState();applyTheme();document.querySelectorAll("#theme-chips .chip").forEach(x=>x.classList.toggle("active",x===b));}));
  $("copy-backup").addEventListener("click",async()=>{const t=$("backup-code");try{await navigator.clipboard.writeText(t.value);showToast("Backup code copied!");}catch{t.select();showToast("Select and copy the code.");}});
  $("restore-backup").addEventListener("click",()=>{try{const obj=JSON.parse(b64d($("backup-code").value.trim()));if(!obj||typeof obj!=="object"||typeof obj.xp!=="number")throw new Error("bad");
    state=sanitize({...freshState(),...obj});saveState();applyTheme();newDayChecks();saveState();closeSheet();showToast("Progress restored! ✅");}catch{showToast("That code is not valid.");}});
  $("reset-progress").addEventListener("click",()=>{if(confirm("Reset ALL progress? This cannot be undone.")){state=freshState();newDayChecks();saveState();applyTheme();closeSheet();showToast("Progress reset.");}});}

/* ---------------- Toast & events ---------------- */
function showToast(message){const t=$("toast");t.textContent=message;t.classList.remove("hidden");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.add("hidden"),2800);}
$("close-lesson").addEventListener("click",()=>closeLesson());
$("lesson-modal").addEventListener("click",e=>{if(e.target.id==="lesson-modal")closeLesson();});
$("close-sheet").addEventListener("click",closeSheet);
$("sheet-modal").addEventListener("click",e=>{if(e.target.id==="sheet-modal")closeSheet();});
$("language-toggle").addEventListener("click",()=>{state.mode=state.mode==="odia-en"?"en-odia":"odia-en";saveState();render();showToast(state.mode==="odia-en"?"Odia → English mode selected":"English → Odia mode selected");});
$("continue-btn").addEventListener("click",()=>{const next=allLessons().find(l=>!state.completed.includes(l.id)&&isUnlocked(l));
  if(!next){showToast("All lessons completed! Enjoy some practice.");startQuick();return;}startLesson(levelById(next.levelId),lessonById(next.id));});
$("new-word").addEventListener("click",()=>{state.wordIndex=(state.wordIndex+1)%WORDS.length;saveState();render();});
$("speak-word").addEventListener("click",()=>{const w=WORDS[state.wordIndex%WORDS.length];speak(w.en+". "+w.example);});
$("quick-btn").addEventListener("click",startQuick);$("speed-btn").addEventListener("click",startSpeed);
$("cards-btn").addEventListener("click",openFlashcards);$("mistakes-btn").addEventListener("click",startMistakes);
$("sound-btn").addEventListener("click",()=>{state.settings.sound=!state.settings.sound;saveState();renderTopStats();if(state.settings.sound)sfx("correct");showToast(state.settings.sound?"Sound on":"Sound off");});
$("theme-btn").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme==="dark";state.settings.theme=dark?"light":"dark";saveState();applyTheme();});
$("music-btn").addEventListener("click",()=>{state.settings.music=!state.settings.music;gestured=true;saveState();applyMusic();showToast(state.settings.music?"Music on 🎵":"Music off");});
$("settings-btn").addEventListener("click",openSettings);

/* ---------------- Welcome tour (C-BOT) ---------------- */
const TOUR_STEPS=[
 {kind:"info",line:["Welcome to O-E Adventure","O-E Adventure କୁ ସ୍ୱାଗତ!","O-E Adventure में आपका स्वागत है!"]},
 {kind:"name",key:"name",line:["What is your name?","ଆପଣଙ୍କ ନାମ କ'ଣ?","आपका नाम क्या है?"]},
 {kind:"age",key:"age",line:["How old are you{n}?","ଆପଣଙ୍କ ବୟସ କେତେ{n}?","आपकी उम्र कितनी है{n}?"]},
 {kind:"chips",key:"source",line:["How did you know about us?","ଆପଣ ଆମ ବିଷୟରେ କେମିତି ଜାଣିଲେ?","आप हमारे बारे में कैसे जाने?"],opts:[["Friend","ବନ୍ଧୁ","दोस्त"],["School","ସ୍କୁଲ୍","स्कूल"],["Social media","ସୋସିଆଲ୍ ମିଡ଼ିଆ","सोशल मीडिया"],["Other","ଅନ୍ୟ","अन्य"]]},
 {kind:"chips",key:"reason",line:["Why do you want to learn English?","ଆପଣ ଇଂରାଜୀ କାହିଁକି ଶିଖିବାକୁ ଚାହୁଁଛନ୍ତି?","आप अंग्रेज़ी क्यों सीखना चाहते हैं?"],opts:[["Work","କାମ","काम"],["Study","ପଢ଼ା","पढ़ाई"],["Travel","ଭ୍ରମଣ","यात्रा"],["Confidence","ଆତ୍ମବିଶ୍ୱାସ","आत्मविश्वास"],["Fun","ମଜା","मज़ा"]]},
 {kind:"chips",key:"level",line:["What is your English level?","ଆପଣଙ୍କ ଇଂରାଜୀ ସ୍ତର କେତେ?","आपकी अंग्रेज़ी का स्तर कैसा है?"],opts:[["Beginner","ଶୁରୁଆତୀ","शुरुआती"],["Intermediate","ମଧ୍ୟମ","मध्यम"],["Advanced","ଉନ୍ନତ","उन्नत"]]},
 {kind:"chips",key:"daily",line:["How much time can you practise every day?","ଆପଣ ପ୍ରତିଦିନ କେତେ ସମୟ ଦେଇପାରିବେ?","आप हर दिन कितना समय दे सकते हैं?"],opts:[["5 min","୫ ମିନିଟ୍","5 मिनट"],["10 min","୧୦ ମିନିଟ୍","10 मिनट"],["15 min","୧୫ ମିନିଟ୍","15 मिनट"],["30+ min","୩୦+ ମିନିଟ୍","30+ मिनट"]]},
 {kind:"info",line:["I am C-BOT, a robot made with technology by Chandan. My real master is Chandan.","ମୁଁ C-BOT, ଚନ୍ଦନଙ୍କ ଦ୍ୱାରା ଟେକ୍ନୋଲୋଜି ସହ ତିଆରି ଏକ ରୋବଟ୍। ମୋର ଅସଲ ମାଲିକ ଚନ୍ଦନ।","मैं C-BOT हूँ, चंदन द्वारा तकनीक से बना एक रोबोट। मेरे असली मालिक चंदन हैं।"]},
 {kind:"info",last:true,line:["Let's start the game!","ଚାଲନ୍ତୁ ଖେଳ ଆରମ୍ଭ କରିବା!","चलिए खेल शुरू करते हैं!"]}
];
let tourIdx=0;
const tourNameTag=()=>state.profile.name?", "+state.profile.name:"";
function tourLine(st,i){return st.line[i].replace("{n}",tourNameTag());}
function openTour(){tourIdx=0;$("tour").classList.remove("hidden");syncModalLock();showTourStep();}
/* Apply the tour choices: level opens the path, daily time sets the daily goal */
function applyTourChoices(){
  const lv={Beginner:0,Intermediate:1,Advanced:2}[state.profile.level];
  if(lv>0)placeAt(lv);
  const mins=parseInt(state.profile.daily,10);
  if(mins)state.dailyGoal=mins<=5?1:mins<=10?2:3;
  saveState();}
function closeTour(done){
  $("tour").classList.add("hidden");syncModalLock();
  try{speechSynthesis.cancel();}catch{}
  if(done){state.profile.tourDone=true;applyTourChoices();saveState();}
  render();
  if(done){robotTalk([`Hi${tourNameTag()}! Let's play and learn together.`,`ନମସ୍କାର${tourNameTag()}! ଆସନ୍ତୁ ଏକାଠି ଶିଖିବା।`,`नमस्ते${tourNameTag()}! चलिए मिलकर सीखते हैं।`]);}
}
function showTourStep(){
  const st=TOUR_STEPS[tourIdx],lang=robotLangNow(),li={en:0,or:1,hi:2}[lang];
  $("tour-progress").textContent=`${tourIdx+1} / ${TOUR_STEPS.length}`;
  $("tour-en").textContent=tourLine(st,0);$("tour-or").textContent=tourLine(st,1);
  const box=$("tour-inputs");box.innerHTML="";
  if(st.kind==="name")box.innerHTML=`<input id="tour-text-in" class="type-input" placeholder="Your name · ଆପଣଙ୍କ ନାମ · आपका नाम" maxlength="30" value="${esc(state.profile.name)}" aria-label="Your name">`;
  if(st.kind==="age")box.innerHTML=`<input id="tour-text-in" class="type-input" type="number" inputmode="numeric" min="3" max="100" placeholder="e.g. 12" value="${esc(state.profile.age)}" aria-label="Your age">`;
  if(st.kind==="chips"){
    box.innerHTML=`<div class="chips tour-chips">${st.opts.map(o=>`<button class="chip${state.profile[st.key]===o[0]?" active":""}" data-v="${esc(o[0])}">${esc(o[0])}<small>${esc(o[1])} · ${esc(o[2])}</small></button>`).join("")}</div>`;
    box.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{state.profile[st.key]=c.dataset.v;box.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===c));sfx("click");}));}
  $("tour-next").textContent=st.last?"Start the game →":"Next →";
  typeText($("tour-bubble"),tourLine(st,li),22);
  const seq=[["en","en-IN"],["or","or-IN"],["hi","hi-IN"]].map(([k,tag],j)=>[tourLine(st,j),tag]);
  (function chain(k){if(k>=seq.length)return;speakRobot(seq[k][0],seq[k][1],()=>chain(k+1));})(0);
  const inp=$("tour-text-in");if(inp&&!inp.value)setTimeout(()=>{try{inp.focus();}catch{}},150);
}
$("tour-next").addEventListener("click",()=>{
  const st=TOUR_STEPS[tourIdx];
  if(st.kind==="name"){state.profile.name=(($("tour-text-in")||{}).value||"").trim().slice(0,30);}
  if(st.kind==="age"){const n=parseInt(($("tour-text-in")||{}).value,10);state.profile.age=n>=3&&n<=100?String(n):"";}
  if(st.kind==="chips"&&!state.profile[st.key]){showToast("Please choose one option.");return;}
  saveState();
  if(st.last){closeTour(true);return;}
  tourIdx++;showTourStep();});
$("tour-skip").addEventListener("click",()=>closeTour(true));
function replayTour(){closeSheet();openTour();}
function updateRobotLangBtn(){const b=$("robot-lang-btn");if(b)b.textContent="🤖 Robot: "+ROBOT_LANGS[robotLangNow()].label;}
function setRobotLang(v){if(!ROBOT_LANGS[v])return;state.settings.robotLang=v;saveState();updateRobotLangBtn();
  document.querySelectorAll("#robot-lang-chips .chip").forEach(c=>c.classList.toggle("active",c.dataset.rl===v));
  if(speechSynthesis)speechSynthesis.cancel();render();robotTalk([greetingLine(),"ନମସ୍କାର! ନୂଆ ଅଭିଯାନ ପାଇଁ ପ୍ରସ୍ତୁତ?","नमस्ते! नई यात्रा के लिए तैयार हैं?"]);}
$("robot-lang-btn").addEventListener("click",()=>{const order=["en","or","hi"];const next=order[(order.indexOf(robotLangNow())+1)%3];setRobotLang(next);showToast("Robot language: "+ROBOT_LANGS[next].label);});
/* ---- PWA: install button (always visible until the app is installed) ---- */
let deferredInstall=null;
const launchedAsApp=/[?&](app=1|source=pwa)/.test(location.search);
const isStandalone=()=>launchedAsApp||matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: minimal-ui)").matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const isAndroid=()=>/android/i.test(navigator.userAgent);
function updateInstallBtn(){const b=$("install-btn");if(b)b.classList.toggle("hidden",isStandalone());}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;updateInstallBtn();});
addEventListener("appinstalled",()=>{deferredInstall=null;updateInstallBtn();showToast("App installed! 🎉");});
function installHelp(){
  let body;
  if(location.protocol==="file:")body=`<p class="muted">You opened the game as a file. Browsers can only install an app from a website (https).</p><ol class="steps"><li><b>Windows:</b> use the <b>English-Adventure-Setup.bat</b> installer. It adds a desktop shortcut.</li><li>Or upload the game to <b>GitHub Pages</b> and open that link on your phone.</li></ol>`;
  else if(isIOS())body=`<ol class="steps"><li>Open this page in <b>Safari</b>.</li><li>Tap the <b>Share</b> button ⬆️.</li><li>Tap <b>Add to Home Screen</b>, then <b>Add</b>.</li></ol>`;
  else if(isAndroid())body=`<ol class="steps"><li>Open this page in <b>Chrome</b>.</li><li>Tap the <b>⋮</b> menu at the top right.</li><li>Tap <b>Install app</b> (or <b>Add to Home screen</b>).</li></ol>`;
  else body=`<ol class="steps"><li><b>Chrome:</b> click the install icon ⊕ at the right end of the address bar, or ⋮ → <b>Cast, save and share → Install page as app</b>.</li><li><b>Edge:</b> ⋯ → <b>Apps → Install this site as an app</b>.</li></ol>`;
  openSheet("Install Odia to English Adventure",body+`<div class="checks" id="pwa-checks"><b>Install check</b><span>Checking…</span></div><p class="muted">Not showing? Reload the page once, wait 5 seconds, and try again. The site must be opened with <b>https://</b>.</p>`);
  if(location.protocol!=="file:")pwaStatus().then(rows=>{const box=$("pwa-checks");if(box)box.innerHTML="<b>Install check</b>"+rows.map(([ok,t])=>`<span class="${ok?"ok":"bad"}">${ok===true?"✅":ok===false?"❌":"⬜"} ${t}</span>`).join("");});}
async function pwaStatus(){
  const rows=[[window.isSecureContext,"Secure connection (https)"]];let man=false,sw=false;
  try{const r=await fetch(document.querySelector('link[rel="manifest"]').href);const j=await r.json();man=!!(j.icons&&j.icons.length&&j.start_url);}catch{}
  rows.push([man,"App manifest and icons"]);
  try{if("serviceWorker" in navigator){const reg=await navigator.serviceWorker.getRegistration();sw=!!(reg&&(reg.active||reg.waiting||reg.installing));}}catch{}
  rows.push([sw,"Offline engine (service worker)"]);
  rows.push([isStandalone()?true:null,"Installed on this device"]);
  return rows;}
/* ---- friendly install banner (shown once, after a few seconds) ---- */
function showInstallBanner(){
  const bn=$("install-banner");if(!bn||isStandalone()||state.settings.bannerDismissed||!(deferredInstall||isIOS()))return;
  $("banner-text").textContent=isIOS()?"Add O-E Adventure to your Home Screen for the full app.":"Install O-E Adventure for a full-screen app that works offline.";
  bn.classList.remove("hidden");}
$("banner-install").addEventListener("click",()=>{$("install-banner").classList.add("hidden");$("install-btn").click();});
$("banner-close").addEventListener("click",()=>{$("install-banner").classList.add("hidden");state.settings.bannerDismissed=true;saveState();});
setTimeout(showInstallBanner,6000);
$("install-btn").addEventListener("click",async()=>{
  if(deferredInstall){const d=deferredInstall;deferredInstall=null;try{d.prompt();await d.userChoice;}catch{}updateInstallBtn();return;}
  installHelp();});
document.querySelector(".robot-area").addEventListener("click",()=>{const r=document.querySelector(".robot");r.classList.remove("jump");void r.offsetWidth;r.classList.add("jump");{const i=Math.floor(Math.random()*TIPS.length);robotTalk([TIPS[i],TIPS_OR[i],TIPS_HI[i]]);}sfx("click");});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){if(!$("sheet-modal").classList.contains("hidden"))closeSheet();else if(!$("lesson-modal").classList.contains("hidden"))closeLesson();return;}
  if($("lesson-modal").classList.contains("hidden")||!session||session.done)return;
  const tag=document.activeElement&&document.activeElement.tagName;
  if(/^[1-9]$/.test(e.key)&&tag!=="INPUT"&&!session.answered&&(session.item.type==="mcq"||session.item.type==="listen")){const b=document.querySelectorAll(".answer-option")[+e.key-1];if(b)b.click();}
  else if(e.key==="Enter"&&tag!=="INPUT"&&tag!=="BUTTON"){e.preventDefault();onPrimary();}});
{const mq=matchMedia("(prefers-color-scheme: dark)");if(mq.addEventListener)mq.addEventListener("change",applyTheme);}
if(canSpeak())try{speechSynthesis.getVoices();}catch{}
setInterval(()=>{if(regenHearts())saveState();renderTopStats();const ht=$("heart-timer");if(ht)ht.textContent=nextHeartText()||"0:00";},1000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden){newDayChecks();if(regenHearts())saveState();render();}});
if("serviceWorker" in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").then(reg=>{
    reg.addEventListener("updatefound",()=>{const nw=reg.installing;if(nw)nw.addEventListener("statechange",()=>{if(nw.state==="installed"&&navigator.serviceWorker.controller)showToast("Update ready ✨ Reopen the app to get it.");});});
  }).catch(()=>{}));}

lessonById("simple-sentences").sayLine={en:"I am a student.",odia:"ମୁଁ ଜଣେ ଛାତ୍ର।"};
lessonById("questions").sayLine={en:"How are you?",odia:"ତୁମେ କେମିତି ଅଛ?"};
lessonById("real-life").sayLine={en:"Nice to meet you.",odia:"ଆପଣଙ୍କୁ ଭେଟି ଆନନ୍ଦିତ।"};
newDayChecks();regenHearts();saveState();applyTheme();render();updateInstallBtn();updateRobotLangBtn();
setTimeout(()=>{const sp=$("splash");if(sp){sp.classList.add("gone");setTimeout(()=>sp.remove(),800);}},1600);
if(state.profile.tourDone)setTimeout(()=>robotTalk([greetingLine(),"ନମସ୍କାର! ନୂଆ ଅଭିଯାନ ପାଇଁ ପ୍ରସ୍ତୁତ?","नमस्ते! नई यात्रा के लिए तैयार हैं?"]),800);
else setTimeout(openTour,500);
// app shortcuts from the home-screen icon (long-press) e.g. ?action=quick
{const a=new URLSearchParams(location.search).get("action");
 if(a){setTimeout(()=>{if(a==="continue")$("continue-btn").click();else if(a==="quick")startQuick();else if(a==="cards")openFlashcards();history.replaceState(null,"",location.pathname);},400);}}
