const LEVELS = [
  {id:"starter",name:"First Steps",subtitle:"Start with everyday English",level:"BEGINNER",icon:"🌱",color:"green",lessons:[
    {id:"greetings",title:"Hello & Greetings",desc:"Say hello and introduce yourself",xp:20,questions:[
      q("How do you say ନମସ୍କାର in English?","ନମସ୍କାର","Hello",["Goodbye","Sorry","Hello"],"Hello means ନମସ୍କାର."),
      q("Choose the correct meaning of 'Thank you'.","ଧନ୍ୟବାଦ","Thank you",["Please","Thank you","Good night"],"Thank you means ଧନ୍ୟବାଦ."),
      q("Complete: My name ___ Rina.","ମୋ ନାମ ରୀନା।","is",["am","is","are"],"Use 'is' with a person's name: My name is Rina."),
      q("What do you say when you meet someone in the morning?","ସକାଳେ ଭେଟିଲେ କ'ଣ କହିବେ?","Good morning",["Good night","Good morning","See you"],"Good morning is a greeting used in the morning.")
    ]},
    {id:"daily-words",title:"Everyday Words",desc:"Learn useful words around you",xp:20,questions:[
      q("ଜଳ means…","Choose the English word","Water",["Water","Fire","Air"],"Water = ଜଳ."),
      q("ବହି means…","Choose the English word","Book",["Bag","Book","Door"],"Book = ବହି."),
      q("What is the Odia meaning of 'Friend'?","Choose the correct meaning","ବନ୍ଧୁ",["ଶିକ୍ଷକ","ବନ୍ଧୁ","ଘର"],"Friend = ବନ୍ଧୁ."),
      q("What is the English word for ଘର?","Choose the English word","House",["School","House","Road"],"House = ଘର.")
    ]},
    {id:"numbers-colors",title:"Numbers & Colours",desc:"Count and describe the world",xp:20,questions:[
      q("What number is ତିନି?","Odia → English","Three",["Two","Three","Four"],"Three = ତିନି."),
      q("What is the Odia meaning of 'Red'?","English → Odia","ଲାଲ",["ନୀଳ","ସବୁଜ","ଲାଲ"],"Red = ଲାଲ."),
      q("Which word means ଦଶ?","Choose the English word","Ten",["Eight","Ten","Twelve"],"Ten = ଦଶ."),
      q("The sky is often…","ଆକାଶ ସାଧାରଣତଃ କେଉଁ ରଙ୍ଗର?","Blue",["Blue","Pink","Brown"],"Blue = ନୀଳ.")
    ]}
  ]},
  {id:"builder",name:"Sentence Builder",subtitle:"Turn words into sentences",level:"ELEMENTARY",icon:"🧩",color:"blue",lessons:[
    {id:"simple-sentences",title:"Simple Sentences",desc:"Build clear, useful sentences",xp:25,questions:[
      q("Choose the correct sentence.","ମୁଁ ଜଣେ ଛାତ୍ର।","I am a student.",["I is a student.","I am a student.","I are a student."],"Use 'am' with 'I'."),
      q("Translate: ସେ ଖୁସି ଅଛି।","Odia → English","He is happy.",["He happy.","He is happy.","He are happy."],"He is happy = ସେ ଖୁସି ଅଛି।"),
      q("Fill in: They ___ my friends.","ସେମାନେ ମୋ ବନ୍ଧୁ।","are",["is","am","are"],"Use 'are' with they."),
      q("Translate: ମୁଁ ପାଣି ପିଏ।","Odia → English","I drink water.",["I drink water.","I eats water.","I drinking water."],"I drink water = ମୁଁ ପାଣି ପିଏ।")
    ]},
    {id:"questions",title:"Ask a Question",desc:"Learn how to ask politely",xp:25,questions:[
      q("Which sentence asks someone's name?","କାହାର ନାମ ପଚାରିବାକୁ…","What is your name?",["Where are you?","What is your name?","How old is your book?"],"What is your name? = ତୁମ ନାମ କ'ଣ?"),
      q("Translate: ତୁମେ କେମିତି ଅଛ?","Odia → English","How are you?",["Who are you?","How are you?","Where are you?"],"How are you? = ତୁମେ କେମିତି ଅଛ?"),
      q("Choose the polite word for ଦୟାକରି.","English → Odia","Please",["Please","Never","Yesterday"],"Please = ଦୟାକରି."),
      q("Complete: ___ is my school?","ମୋ ସ୍କୁଲ୍ କେଉଁଠି?","Where",["Who","Where","When"],"Where asks about a place.")
    ]},
    {id:"verbs",title:"Action Words",desc:"Use common verbs correctly",xp:25,questions:[
      q("What is the past tense of GO?","ଗତକାଲି ମୁଁ ସ୍କୁଲକୁ…","Went",["Goed","Going","Went"],"Go → went."),
      q("Choose the meaning of 'Read'.","English → Odia","ପଢ଼ିବା",["ଲେଖିବା","ପଢ଼ିବା","ଖେଳିବା"],"Read = ପଢ଼ିବା."),
      q("She ___ a book every day.","ସେ ପ୍ରତିଦିନ ବହି ପଢ଼େ।","reads",["read","reads","reading"],"With he/she/it in the simple present, often add -s."),
      q("What is the past tense of EAT?","Choose the correct form","Ate",["Eated","Ate","Eating"],"Eat → ate.")
    ]}
  ]},
  {id:"explorer",name:"Grammar Explorer",subtitle:"Make your English stronger",level:"INTERMEDIATE",icon:"🧭",color:"orange",lessons:[
    {id:"tenses",title:"Present, Past & Future",desc:"Choose the right tense",xp:30,questions:[
      q("Every day, I ___ to school.","Simple present","go",["go","went","will went"],"Use 'go' for a regular habit with I."),
      q("Yesterday, she ___ a letter.","Simple past","wrote",["writes","will write","wrote"],"Yesterday signals the past: write → wrote."),
      q("Tomorrow, we ___ our grandmother.","Future tense","will visit",["visited","will visit","visits"],"Use will + base verb for the future."),
      q("They are ___ football now.","Present continuous","playing",["play","played","playing"],"Are + verb-ing describes an action happening now.")
    ]},
    {id:"articles",title:"A, An & The",desc:"Use articles with confidence",xp:30,questions:[
      q("I ate ___ apple.","Use the correct article","an",["a","an","the"],"Use 'an' before a vowel sound, as in apple."),
      q("She has ___ book.","Use the correct article","a",["a","an","the"],"Use 'a' before a consonant sound, as in book."),
      q("The sun rises in ___ east.","Complete the sentence","the",["a","an","the"],"We say 'the east' in this expression."),
      q("He is ___ honest person.","Choose by sound","an",["a","an","the"],"Honest begins with a vowel sound because the h is silent.")
    ]},
    {id:"prepositions",title:"Place & Time Words",desc:"In, on, at and more",xp:30,questions:[
      q("The book is ___ the table.","ବହିଟି ଟେବୁଲ୍ ଉପରେ ଅଛି।","on",["in","on","at"],"Use 'on' for something resting on a surface."),
      q("I wake up ___ 6 o'clock.","Choose the preposition","at",["in","on","at"],"Use 'at' with a specific clock time."),
      q("My birthday is ___ August.","Choose the preposition","in",["in","on","at"],"Use 'in' with months."),
      q("We have class ___ Monday.","Choose the preposition","on",["in","on","at"],"Use 'on' with days.")
    ]}
  ]},
  {id:"champion",name:"English Champion",subtitle:"Use English in real life",level:"ADVANCED",icon:"🏆",color:"pink",lessons:[
    {id:"connectors",title:"Connect Your Ideas",desc:"Because, but, although and so",xp:35,questions:[
      q("I was tired, ___ I finished my homework.","Choose a connector","but",["because","but","unless"],"'But' shows contrast between two ideas."),
      q("I stayed home ___ it was raining.","Choose a connector","because",["because","although","or"],"'Because' gives a reason."),
      q("Study well ___ you can improve.","Choose a connector","so that",["so that","but","unless"],"'So that' introduces a purpose."),
      q("___ it was late, they continued working.","Choose a connector","Although",["Because","Although","So"],"'Although' introduces a contrast.")
    ]},
    {id:"vocabulary",title:"Power Vocabulary",desc:"Choose precise words",xp:35,questions:[
      q("A person who is willing to help is…","Choose the best word","Helpful",["Careless","Helpful","Sleepy"],"Helpful means ready to help others."),
      q("What does 'improve' mean?","English → Odia","ଉନ୍ନତ କରିବା",["ଭୁଲିଯିବା","ଉନ୍ନତ କରିବା","ବନ୍ଦ କରିବା"],"Improve = ଉନ୍ନତ କରିବା."),
      q("Choose a synonym for 'begin'.","A synonym has a similar meaning","Start",["Finish","Start","Forget"],"Begin and start have similar meanings."),
      q("Which word means 'very important'?","Choose the best word","Essential",["Ordinary","Essential","Tiny"],"Essential means very important or necessary.")
    ]},
    {id:"reading",title:"Reading Detective",desc:"Understand meaning from context",xp:35,questions:[
      q("Rita carried an umbrella because dark clouds filled the sky. Why?","Read the sentence carefully","She expected rain.",["She wanted to swim.","She expected rain.","She was going to sleep."],"Dark clouds and an umbrella suggest she expected rain."),
      q("The road was slippery after the storm. What does slippery mean?","Choose the closest meaning","Hard to walk on safely",["Very colourful","Hard to walk on safely","Very quiet"],"A slippery surface can make you lose your footing."),
      q("Mina saved a little money each week. Eventually, she bought a bicycle. What helped her?","Find the main idea","Saving money",["Spending everything","Saving money","Losing her books"],"Saving a little regularly helped her reach her goal."),
      q("Choose the best title: A passage about daily practice helping a learner speak better.","Find the main idea","Practice Makes Progress",["A Rainy Afternoon","Practice Makes Progress","My New Shoes"],"The title should match the central idea.")
    ]}
  ]}
];
function q(prompt,hint,answer,options,explanation){return {prompt,hint,answer,options,explanation};}
const WORDS=[
 {en:"Brave",odia:"ସାହସୀ",example:"The brave student tried again."},
 {en:"Curious",odia:"ଜିଜ୍ଞାସୁ",example:"A curious learner asks questions."},
 {en:"Kind",odia:"ଦୟାଳୁ",example:"Be kind to others."},
 {en:"Improve",odia:"ଉନ୍ନତ କରିବା",example:"I practise daily to improve my English."},
 {en:"Dream",odia:"ସ୍ୱପ୍ନ",example:"Work towards your dream."},
 {en:"Friend",odia:"ବନ୍ଧୁ",example:"My friend helps me learn."},
 {en:"Learn",odia:"ଶିଖିବା",example:"We learn something new every day."},
 {en:"Courage",odia:"ସାହସ",example:"Courage helps us try again."}
];
const REVERSE_BANK = [
 {prompt:"What is the Odia meaning of ‘Hello’?",hint:"English → Odia",answer:"ନମସ୍କାର",options:["ବିଦାୟ","ନମସ୍କାର","ଧନ୍ୟବାଦ"],explanation:"Hello = ନମସ୍କାର."},
 {prompt:"What is the Odia meaning of ‘Thank you’?",hint:"English → Odia",answer:"ଧନ୍ୟବାଦ",options:["ଦୟାକରି","ଧନ୍ୟବାଦ","ଶୁଭରାତ୍ରି"],explanation:"Thank you = ଧନ୍ୟବାଦ."},
 {prompt:"What is the Odia meaning of ‘Water’?",hint:"English → Odia",answer:"ଜଳ",options:["ଜଳ","ଅଗ୍ନି","ବାୟୁ"],explanation:"Water = ଜଳ."},
 {prompt:"What is the Odia meaning of ‘Book’?",hint:"English → Odia",answer:"ବହି",options:["ବ୍ୟାଗ","ବହି","ଦ୍ୱାର"],explanation:"Book = ବହି."},
 {prompt:"What is the Odia meaning of ‘House’?",hint:"English → Odia",answer:"ଘର",options:["ସ୍କୁଲ୍","ଘର","ରାସ୍ତା"],explanation:"House = ଘର."},
 {prompt:"What is the Odia meaning of ‘Friend’?",hint:"English → Odia",answer:"ବନ୍ଧୁ",options:["ଶିକ୍ଷକ","ବନ୍ଧୁ","ଛାତ୍ର"],explanation:"Friend = ବନ୍ଧୁ."},
 {prompt:"What is the Odia meaning of ‘Red’?",hint:"English → Odia",answer:"ଲାଲ",options:["ନୀଳ","ସବୁଜ","ଲାଲ"],explanation:"Red = ଲାଲ."},
 {prompt:"What is the Odia meaning of ‘Three’?",hint:"English → Odia",answer:"ତିନି",options:["ଦୁଇ","ତିନି","ଚାରି"],explanation:"Three = ତିନି."},
 {prompt:"Translate: ‘I am a student.’",hint:"English → Odia",answer:"ମୁଁ ଜଣେ ଛାତ୍ର।",options:["ମୁଁ ଜଣେ ଛାତ୍ର।","ସେ ଖୁସି ଅଛି।","ମୁଁ ପାଣି ପିଏ।"],explanation:"I am a student = ମୁଁ ଜଣେ ଛାତ୍ର।"},
 {prompt:"Translate: ‘How are you?’",hint:"English → Odia",answer:"ତୁମେ କେମିତି ଅଛ?",options:["ତୁମ ନାମ କ'ଣ?","ତୁମେ କେମିତି ଅଛ?","ତୁମେ କେଉଁଠି ଅଛ?"],explanation:"How are you? = ତୁମେ କେମିତି ଅଛ?"},
 {prompt:"What is the Odia meaning of ‘Please’?",hint:"English → Odia",answer:"ଦୟାକରି",options:["ଦୟାକରି","ଗତକାଲି","କେବେ"],explanation:"Please = ଦୟାକରି."},
 {prompt:"What is the Odia meaning of ‘Read’?",hint:"English → Odia",answer:"ପଢ଼ିବା",options:["ଲେଖିବା","ପଢ଼ିବା","ଖେଳିବା"],explanation:"Read = ପଢ଼ିବା."},
 {prompt:"What is the Odia meaning of ‘Improve’?",hint:"English → Odia",answer:"ଉନ୍ନତ କରିବା",options:["ଭୁଲିଯିବା","ଉନ୍ନତ କରିବା","ବନ୍ଦ କରିବା"],explanation:"Improve = ଉନ୍ନତ କରିବା."},
 {prompt:"What is the Odia meaning of ‘Kind’?",hint:"English → Odia",answer:"ଦୟାଳୁ",options:["ଦୟାଳୁ","ରାଗୀ","କ୍ଲାନ୍ତ"],explanation:"Kind = ଦୟାଳୁ."},
 {prompt:"What is the Odia meaning of ‘Brave’?",hint:"English → Odia",answer:"ସାହସୀ",options:["ଭୀରୁ","ସାହସୀ","ଧୀର"],explanation:"Brave = ସାହସୀ."},
 {prompt:"What is the Odia meaning of ‘Learn’?",hint:"English → Odia",answer:"ଶିଖିବା",options:["ଶିଖିବା","ଶୋଇବା","ଦୌଡ଼ିବା"],explanation:"Learn = ଶିଖିବା."},
 {prompt:"What is the Odia meaning of ‘Courage’?",hint:"English → Odia",answer:"ସାହସ",options:["ସାହସ","ଭୟ","ନିଦ"],explanation:"Courage = ସାହସ."},
 {prompt:"What is the Odia meaning of ‘Start’?",hint:"English → Odia",answer:"ଆରମ୍ଭ କରିବା",options:["ଶେଷ କରିବା","ଆରମ୍ଭ କରିବା","ଭୁଲିବା"],explanation:"Start = ଆରମ୍ଭ କରିବା."},
 {prompt:"What is the Odia meaning of ‘Helpful’?",hint:"English → Odia",answer:"ସାହାଯ୍ୟକାରୀ",options:["ଅଳସୁଆ","ସାହାଯ୍ୟକାରୀ","ଦୁଃଖୀ"],explanation:"Helpful = ସାହାଯ୍ୟକାରୀ."},
 {prompt:"What is the Odia meaning of ‘Essential’?",hint:"English → Odia",answer:"ଅତ୍ୟାବଶ୍ୟକ",options:["ସାଧାରଣ","ଅତ୍ୟାବଶ୍ୟକ","ଛୋଟ"],explanation:"Essential = ଅତ୍ୟାବଶ୍ୟକ."}
];
const STORAGE_KEY="english-adventure-progress-v1";
const todayKey=()=>new Date().toLocaleDateString("en-CA");
const yesterdayKey=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toLocaleDateString("en-CA");};
const freshState=()=>({xp:0,hearts:5,streak:0,lastActive:null,completed:[],dailyCompleted:0,dailyDate:null,bestAccuracy:0,totalAnswered:0,totalCorrect:0,mode:"odia-en",wordIndex:0});
let state=loadState(), currentLesson=null, questionIndex=0, sessionCorrect=0, sessionAnswered=0, sessionHearts=5, selectedAnswer=null, lessonDone=false;
if(state.lastActive!==todayKey()) state.hearts=5;
function loadState(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY));return s&&typeof s==="object"?{...freshState(),...s}:freshState();}catch{return freshState();}}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{showToast("Progress could not be saved on this browser.");}}
function allLessons(){return LEVELS.flatMap(level=>level.lessons.map(lesson=>({...lesson,levelId:level.id,levelName:level.name,levelIcon:level.icon})));}
function isUnlocked(lesson){const list=allLessons();const i=list.findIndex(x=>x.id===lesson.id);return i===0||state.completed.includes(list[i-1].id)||state.completed.includes(lesson.id);}
function markActive(){const today=todayKey();if(state.lastActive!==today){state.streak=state.lastActive===yesterdayKey()?state.streak+1:1;state.lastActive=today;}if(state.dailyDate!==today){state.dailyDate=today;state.dailyCompleted=0;}saveState();}
function render(){
 document.getElementById("top-xp").textContent=state.xp;
 document.getElementById("top-hearts").textContent=state.hearts;
 document.getElementById("top-streak").textContent=state.streak;
 document.getElementById("stat-xp").textContent=state.xp;
 document.getElementById("stat-streak").textContent=state.streak;
 document.getElementById("stat-lessons").textContent=state.completed.length;
 document.getElementById("stat-accuracy").textContent=state.totalAnswered?Math.round(state.totalCorrect/state.totalAnswered*100)+"%":"—";
 document.getElementById("completed-count").textContent=state.completed.length+" lessons completed";
 document.getElementById("quest-bar").style.width=(state.dailyCompleted?100:0)+"%";
 document.getElementById("quest-label").textContent=(state.dailyCompleted?1:0)+" / 1 lesson today";
 document.getElementById("language-toggle").textContent="Mode: "+(state.mode==="odia-en"?"Odia → English":"English → Odia");
 const path=document.getElementById("learning-path");path.innerHTML="";
 LEVELS.forEach(level=>{
   const header=document.createElement("div");header.className="level-heading";header.innerHTML=`<div style="margin:16px 0 5px 5px;color:#77758d;font-size:10px;font-weight:900;letter-spacing:1.2px">${level.level} · ${escapeHtml(level.name.toUpperCase())}</div>`;path.appendChild(header);
   level.lessons.forEach(lesson=>{
     const done=state.completed.includes(lesson.id),unlocked=isUnlocked(lesson);
     const unit=document.createElement("div");unit.className="unit"+(done?" completed":"")+(unlocked?"":" locked");
     unit.innerHTML=`<div class="unit-node">${done?"✓":level.icon}</div><div><p class="unit-title">${escapeHtml(lesson.title)}</p><p class="unit-description">${escapeHtml(lesson.desc)}</p><div class="unit-meta">${lesson.questions.length} questions · ${lesson.xp} XP</div></div><button class="unit-btn" ${unlocked?"":"disabled"}>${done?"Review":unlocked?"Start →":"🔒 Locked"}</button>`;
     unit.querySelector("button").addEventListener("click",()=>startLesson(level,lesson));path.appendChild(unit);
   });
 });
 document.getElementById("word-en").textContent=WORDS[state.wordIndex%WORDS.length].en;
 document.getElementById("word-odia").textContent=WORDS[state.wordIndex%WORDS.length].odia;
 document.getElementById("word-example").textContent="Example: "+WORDS[state.wordIndex%WORDS.length].example;
 document.getElementById("robot-message").textContent=state.completed.length?"You're doing great! Ready for another quest?":"Namaskar! Ready for a new adventure?";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function startLesson(level,lesson){
 if(!isUnlocked(lesson)){showToast("Finish the previous lesson to unlock this one.");return;}
 if(state.hearts<=0){showToast("You need more hearts. Hearts refill to 5 when you return tomorrow.");return;}
 currentLesson={...lesson,level};
 if(state.mode==="en-odia") currentLesson.questions=REVERSE_BANK.slice((LEVELS.flatMap(l=>l.lessons).findIndex(x=>x.id===lesson.id)*2)%REVERSE_BANK.length).concat(REVERSE_BANK).slice(0,lesson.questions.length);
 questionIndex=0;sessionCorrect=0;sessionAnswered=0;sessionHearts=state.hearts;selectedAnswer=null;lessonDone=false;
 document.getElementById("lesson-modal").classList.remove("hidden");renderQuestion();
}
function renderQuestion(){
 const screen=document.getElementById("lesson-screen");
 document.getElementById("lesson-hearts").textContent=sessionHearts;
 document.getElementById("lesson-progress-bar").style.width=(questionIndex/currentLesson.questions.length*100)+"%";
 const item=currentLesson.questions[questionIndex];selectedAnswer=null;
 const prompt=item.prompt;
 const hint=item.hint;
 const choices=item.options;
 screen.innerHTML=`<div class="lesson-content"><p class="lesson-kicker">${escapeHtml(currentLesson.level.level)} QUEST · QUESTION ${questionIndex+1}/${currentLesson.questions.length}</p><h2>${escapeHtml(currentLesson.title)}</h2><p class="lesson-instruction">Choose the best answer. Take your time!</p><div class="question-card"><div class="question-emoji">${currentLesson.level.icon}</div><p class="question-prompt">${escapeHtml(prompt)}</p><p class="question-hint">${escapeHtml(hint)}</p></div><div class="answer-list" id="answer-list"></div><div id="feedback"></div><div class="lesson-bottom"><span class="muted">Correct answer earns XP ⭐</span><button class="primary-btn" id="check-btn" disabled>Check answer</button></div></div>`;
 const list=document.getElementById("answer-list");
 choices.forEach((choice,i)=>{const b=document.createElement("button");b.className="answer-option";b.textContent=choice;b.addEventListener("click",()=>selectAnswer(b,choice));list.appendChild(b);});
 document.getElementById("check-btn").addEventListener("click",checkAnswer);
}
function makeReversePrompt(item){const m=item.prompt.match(/(?:for|of) '([^']+)'/i);if(m)return `What is the Odia meaning of “${m[1]}”?`;const match=item.prompt.match(/(?:means|meaning of) '([^']+)'/i);if(match)return `What is the Odia meaning of “${match[1]}”?`;return "Choose the best answer for this English practice question.";}
function reverseOptions(item){if(item.prompt.includes("ଜଳ"))return ["ଜଳ","ଅଗ୍ନି","ବାୟୁ"];if(item.prompt.includes("ବହି"))return ["ବ୍ୟାଗ","ବହି","ଦ୍ୱାର"];if(item.answer==="Hello")return ["ନମସ୍କାର","ବିଦାୟ","ଧନ୍ୟବାଦ"];if(item.answer==="Thank you")return ["ଦୟାକରି","ଧନ୍ୟବାଦ","ଶୁଭରାତ୍ରି"];return item.options;}
function selectAnswer(button,choice){if(lessonDone)return;document.querySelectorAll(".answer-option").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");selectedAnswer=choice;document.getElementById("check-btn").disabled=false;}
function checkAnswer(){
 if(selectedAnswer===null||lessonDone)return;
 const item=currentLesson.questions[questionIndex],buttons=[...document.querySelectorAll(".answer-option")],feedback=document.getElementById("feedback");
 sessionAnswered++;state.totalAnswered++;
 const correct=selectedAnswer===item.answer;
 if(correct){sessionCorrect++;state.totalCorrect++;state.xp+=5;buttons.forEach(b=>{if(b.textContent===item.answer)b.classList.add("correct");});feedback.className="feedback good";feedback.textContent="Correct! +5 XP. "+item.explanation;}
 else{sessionHearts=Math.max(0,sessionHearts-1);state.hearts=Math.max(0,state.hearts-1);buttons.forEach(b=>{if(b.textContent===selectedAnswer)b.classList.add("wrong");if(b.textContent===item.answer)b.classList.add("correct");});feedback.className="feedback bad";feedback.textContent="Not quite. Correct answer: "+item.answer+". "+item.explanation;}
 buttons.forEach(b=>b.disabled=true);document.getElementById("lesson-hearts").textContent=sessionHearts;document.getElementById("top-hearts").textContent=state.hearts;
 const check=document.getElementById("check-btn");check.disabled=false;check.textContent=questionIndex===currentLesson.questions.length-1?"Finish lesson →":"Continue →";check.onclick=advanceQuestion;
 state.bestAccuracy=Math.max(state.bestAccuracy,Math.round(sessionCorrect/sessionAnswered*100));saveState();renderStatsOnly();
}
function advanceQuestion(){if(questionIndex<currentLesson.questions.length-1){questionIndex++;renderQuestion();}else finishLesson();}
function renderStatsOnly(){document.getElementById("top-xp").textContent=state.xp;document.getElementById("stat-xp").textContent=state.xp;document.getElementById("stat-accuracy").textContent=state.totalAnswered?Math.round(state.totalCorrect/state.totalAnswered*100)+"%":"—";}
function finishLesson(){
 const perfect=sessionCorrect===currentLesson.questions.length,passed=sessionCorrect>=Math.ceil(currentLesson.questions.length*.5);
 if(passed&&!state.completed.includes(currentLesson.id)){state.completed.push(currentLesson.id);state.xp+=currentLesson.xp;markActive();state.dailyCompleted=1;state.hearts=Math.max(0,Math.min(5,state.hearts+1));}
 else if(passed){state.xp+=Math.round(currentLesson.xp*.25);markActive();state.dailyCompleted=1;}
 saveState();render();
 const screen=document.getElementById("lesson-screen");document.getElementById("lesson-progress-bar").style.width="100%";
 screen.innerHTML=`<div class="lesson-result"><div class="result-emoji">${passed?(perfect?"🏆":"🎉"):"💪"}</div><p class="lesson-kicker">QUEST ${passed?"COMPLETE":"PRACTICE ROUND"}</p><h2>${passed?"Amazing work!":"Keep practising!"}</h2><p class="muted">${passed?"You made progress on your English adventure.":"You need at least half the answers correct to complete this lesson. Try again when you're ready."}</p><div class="result-score">⭐ +${passed?(state.completed.includes(currentLesson.id)?currentLesson.xp:Math.round(currentLesson.xp*.25)):0} bonus XP</div><p class="muted">${sessionCorrect} of ${currentLesson.questions.length} correct · "+Math.round(sessionCorrect/currentLesson.questions.length*100)+"% accuracy</p><div class="result-actions"><button class="primary-btn" id="result-home">Back to map</button><button class="secondary-btn" id="result-retry">Try again</button></div></div>`;
 // Fix percentage display safely without building dynamic HTML from user input.
 screen.querySelector(".lesson-result .muted:nth-of-type(2)").textContent=`${sessionCorrect} of ${currentLesson.questions.length} correct · ${Math.round(sessionCorrect/currentLesson.questions.length*100)}% accuracy`;
 document.getElementById("result-home").addEventListener("click",closeLesson);
 document.getElementById("result-retry").addEventListener("click",()=>startLesson(currentLesson.level,currentLesson));
 lessonDone=true;
}
function closeLesson(){document.getElementById("lesson-modal").classList.add("hidden");currentLesson=null;render();}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.remove("hidden");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.add("hidden"),2600);}
document.getElementById("close-lesson").addEventListener("click",closeLesson);
document.getElementById("lesson-modal").addEventListener("click",e=>{if(e.target.id==="lesson-modal")closeLesson();});
document.getElementById("language-toggle").addEventListener("click",()=>{state.mode=state.mode==="odia-en"?"en-odia":"odia-en";saveState();render();showToast(state.mode==="odia-en"?"Odia → English mode selected":"English → Odia mode selected");});
document.getElementById("continue-btn").addEventListener("click",()=>{const list=allLessons();const next=list.find(l=>!state.completed.includes(l.id)&&isUnlocked(l));if(!next){showToast("All lessons completed! Review any lesson to keep practising.");return;}const level=LEVELS.find(x=>x.id===next.levelId);startLesson(level,level.lessons.find(x=>x.id===next.id));});
document.getElementById("new-word").addEventListener("click",()=>{state.wordIndex=(state.wordIndex+1)%WORDS.length;saveState();render();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLesson();});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
render();
