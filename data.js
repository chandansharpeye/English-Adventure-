const LEVELS = [
  {id:"starter",name:"First Steps",subtitle:"Start with everyday English",level:"BEGINNER",icon:"🌱",color:"green",lessons:[
    {id:"greetings",title:"Hello & Greetings",desc:"Say hello and introduce yourself",xp:20,questions:[
      q("How do you say ନମସ୍କାର in English?","ନମସ୍କାର","Hello",["Goodbye","Sorry","Hello"],"Hello means ନମସ୍କାର."),
      q("What does ଧନ୍ୟବାଦ mean?","Odia → English","Thank you",["Please","Thank you","Good night"],"Thank you means ଧନ୍ୟବାଦ."),
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

/* ============================================================
   O-E Adventure — data additions
   Question helpers, vocabulary pairs, new lessons, words, badges
   ============================================================ */
function q(prompt,hint,answer,options,explanation,extra){return Object.assign({type:"mcq",prompt,hint,answer,options,explanation},extra||{});}
// Arrange the words into a sentence. `answer` is the correct sentence, `extra` = distractor words.
function arr(hint,answer,extra,explanation){return {type:"arrange",prompt:"Put the words in the correct order",hint,answer,extra:extra||[],explanation:explanation||("Correct sentence: "+answer)};}
// Listen and choose
function lis(say,answer,options,explanation){return {type:"listen",prompt:"Tap 🔊 and choose what you hear",hint:"Listening practice",say,answer,options,explanation:explanation||("You heard: "+say)};}
// Type the answer
function typ(prompt,hint,answer,explanation,accept){return {type:"type",prompt,hint,answer,explanation,accept:accept||[]};}
// Match pairs: pairs = [[english, odia], ...]
function mat(pairs){return {type:"match",prompt:"Match the pairs",hint:"English ↔ Odia",pairs,answer:pairs.map(p=>p[0]+" = "+p[1]).join(", "),explanation:pairs.map(p=>p[0]+" = "+p[1]).join(" · ")};}

/* ---------- Vocabulary pairs [English, Odia] ---------- */
const PAIRS={
  greetings:[["Hello","ନମସ୍କାର"],["Thank you","ଧନ୍ୟବାଦ"],["Goodbye","ବିଦାୟ"],["Sorry","ଦୁଃଖିତ"],["Please","ଦୟାକରି"],["Good night","ଶୁଭରାତ୍ରି"],["Good morning","ସୁପ୍ରଭାତ"]],
  daily:[["Water","ଜଳ"],["Book","ବହି"],["Friend","ବନ୍ଧୁ"],["House","ଘର"],["Door","ଦ୍ୱାର"],["Road","ରାସ୍ତା"],["School","ସ୍କୁଲ୍"],["Teacher","ଶିକ୍ଷକ"],["Student","ଛାତ୍ର"]],
  numcol:[["One","ଏକ"],["Two","ଦୁଇ"],["Three","ତିନି"],["Four","ଚାରି"],["Five","ପାଞ୍ଚ"],["Ten","ଦଶ"],["Red","ଲାଲ"],["Blue","ନୀଳ"],["Green","ସବୁଜ"],["Black","କଳା"],["White","ଧଳା"]],
  family:[["Mother","ମା"],["Father","ବାପା"],["Brother","ଭାଇ"],["Sister","ଭଉଣୀ"],["Grandfather","ଅଜା"],["Grandmother","ଆଈ"]],
  food:[["Rice","ଭାତ"],["Milk","ଦୁଧ"],["Fish","ମାଛ"],["Egg","ଅଣ୍ଡା"],["Tea","ଚା"],["Mango","ଆମ୍ବ"],["Banana","କଦଳୀ"],["Apple","ସେଓ"]],
  bodyAnimals:[["Hand","ହାତ"],["Eye","ଆଖି"],["Nose","ନାକ"],["Ear","କାନ"],["Head","ମୁଣ୍ଡ"],["Foot","ପାଦ"],["Cow","ଗାଈ"],["Dog","କୁକୁର"],["Cat","ବିଲେଇ"],["Elephant","ହାତୀ"],["Tiger","ବାଘ"],["Bird","ପକ୍ଷୀ"]],
  opposites:[["Big","ବଡ଼"],["Small","ଛୋଟ"],["Hot","ଗରମ"],["Cold","ଥଣ୍ଡା"],["Good","ଭଲ"],["Bad","ଖରାପ"],["New","ନୂଆ"],["Old","ପୁରୁଣା"]],
  days:[["Monday","ସୋମବାର"],["Tuesday","ମଙ୍ଗଳବାର"],["Wednesday","ବୁଧବାର"],["Thursday","ଗୁରୁବାର"],["Friday","ଶୁକ୍ରବାର"],["Saturday","ଶନିବାର"],["Sunday","ରବିବାର"]],
  power:[["Improve","ଉନ୍ନତ କରିବା"],["Helpful","ସାହାଯ୍ୟକାରୀ"],["Essential","ଅତ୍ୟାବଶ୍ୟକ"],["Start","ଆରମ୍ଭ କରିବା"],["Brave","ସାହସୀ"],["Kind","ଦୟାଳୁ"],["Courage","ସାହସ"],["Curious","ଜିଜ୍ଞାସୁ"]]
};

/* ---------- helpers to edit the original LEVELS ---------- */
function levelById(id){return LEVELS.find(l=>l.id===id);}
function lessonById(id){for(const lv of LEVELS){const l=lv.lessons.find(x=>x.id===id);if(l)return l;}return null;}
function insertAfter(levelId,afterLessonId,newLessons){const lv=levelById(levelId);const i=lv.lessons.findIndex(l=>l.id===afterLessonId);lv.lessons.splice(i+1,0,...newLessons);}
function autoLesson(id,title,desc,xp,pairs){return {id,title,desc,xp,pairs,auto:true,count:6,questions:[]};}

// Attach pairs to the original vocabulary lessons (they get a match round + English → Odia mode)
lessonById("greetings").pairs=PAIRS.greetings;
lessonById("daily-words").pairs=PAIRS.daily;
lessonById("numbers-colors").pairs=PAIRS.numcol;
lessonById("vocabulary").pairs=PAIRS.power;

/* ---------- New lessons ---------- */
// Beginner
insertAfter("starter","numbers-colors",[
  autoLesson("family","My Family","Mother, father, brother and more",20,PAIRS.family),
  autoLesson("food","Food & Fruits","Talk about what you eat and drink",20,PAIRS.food),
  autoLesson("body-animals","Body & Animals","Parts of the body and common animals",20,PAIRS.bodyAnimals)
]);

// Elementary
insertAfter("builder","simple-sentences",[
  {id:"build-it",title:"Build It!",desc:"Tap the words to build sentences",xp:25,questions:[
    arr("ମୋ ନାମ ରୀନା।","My name is Rina.",["are"],"Use 'is' with a name: My name is Rina."),
    arr("ସେ ଭାତ ଖାଏ।","She eats rice.",["eat"],"With she/he, add -s to the verb: eats."),
    arr("ମୁଁ ପ୍ରତିଦିନ ସ୍କୁଲକୁ ଯାଏ।","I go to school every day.",["goes"],"I go to school every day."),
    arr("ତୁମେ କେଉଁଠି ରୁହ?","Where do you live?",["does"],"Where do you live? asks about a place."),
    arr("ଆମେ ଗୋଟିଏ ବହି ପଢ଼ୁଛୁ।","We are reading a book.",["is"],"Are + verb-ing shows an action happening now.")
  ]}
]);
levelById("builder").lessons.push(
  autoLesson("days","Days of the Week","Monday to Sunday",25,PAIRS.days),
  autoLesson("opposites","Opposites","Big and small, hot and cold",25,PAIRS.opposites)
);

// Intermediate
levelById("explorer").lessons.push(
  {id:"plurals",title:"Plurals & Have/Has",desc:"One book, two books",xp:30,questions:[
    q("One book, two ___.","ଗୋଟିଏ ବହି, ଦୁଇଟି ବହି","books",["book","bookes","books"],"Most nouns just add -s: books."),
    q("One child, two ___.","ଗୋଟିଏ ପିଲା, ଦୁଇଟି ପିଲା","children",["childs","children","childes"],"Child → children is an irregular plural."),
    q("She ___ a red bag.","ତାଙ୍କ ପାଖରେ ଗୋଟିଏ ଲାଲ ବ୍ୟାଗ ଅଛି।","has",["have","has","having"],"Use 'has' with he/she/it."),
    q("I ___ two brothers.","ମୋର ଦୁଇ ଭାଇ ଅଛନ୍ତି।","have",["have","has","having"],"Use 'have' with I, you, we, they."),
    q("___ you like tea?","ତୁମେ ଚା ପସନ୍ଦ କର?","Do",["Do","Does","Is"],"Use 'Do' to ask a question with you.")
  ]},
  {id:"modals",title:"Can, Should & Must",desc:"Ability, advice and rules",xp:30,questions:[
    q("I ___ swim.","ମୁଁ ପହଁରି ପାରେ।","can",["can","cans","am can"],"Use 'can' for ability."),
    q("You ___ drink water every day.","ତୁମେ ପ୍ରତିଦିନ ପାଣି ପିଇବା ଉଚିତ୍।","should",["should","shoulds","shoulding"],"Use 'should' to give advice."),
    q("She can ___ English well.","ସେ ଭଲ ଇଂରାଜୀ କହିପାରେ।","speak",["speaks","speak","speaking"],"After 'can', use the base verb: speak."),
    q("We ___ stop at a red light.","ରାସ୍ତାର ଲାଲ ବତୀରେ ଆମକୁ ଅଟକିବାକୁ ହେବ।","must",["must","are","did"],"Use 'must' for a strong rule."),
    q("Which sentence is correct?","'can' ପରେ verb ର ମୂଳ ରୂପ ବ୍ୟବହାର କରନ୍ତୁ।","She can sing.",["She can sings.","She can sing.","She cans sing."],"After 'can', never add -s: She can sing.")
  ]}
);

// Advanced
levelById("champion").lessons.push(
  {id:"real-life",title:"Real-Life Talk",desc:"Polite phrases for everyday life",xp:35,questions:[
    q("You meet someone new. What do you say?","ନୂଆ ଲୋକଙ୍କୁ ଭେଟିଲେ କ'ଣ କହିବେ?","Nice to meet you.",["Nice to meet you.","See you later.","Good night."],"Nice to meet you is used when you meet someone for the first time."),
    q("You want to know the price. Ask:","ମୂଲ୍ୟ ପଚାରିବାକୁ","How much is this?",["How old is this?","How much is this?","How far is this?"],"How much is this? asks about the price."),
    q("You did not hear clearly. Say:","ଭଲ ଭାବେ ଶୁଣି ନାହାଁନ୍ତି।","Could you repeat that, please?",["Could you repeat that, please?","Where is the station?","I am fine, thanks."],"Could you repeat that, please? is a polite way to ask again."),
    q("You are lost. Ask for the bus stop:","ବସ୍ ଷ୍ଟପ୍ କେଉଁଠି?","Excuse me, where is the bus stop?",["Excuse me, what is your name?","Excuse me, where is the bus stop?","Excuse me, how old are you?"],"Excuse me, where is…? is a polite way to ask for a place."),
    q("Someone says 'Thank you!' What do you reply?","ଧନ୍ୟବାଦର ଉତ୍ତରରେ","You're welcome.",["You're welcome.","Good morning.","I'm sorry."],"You're welcome is the reply to thank you."),
    arr("ଦୟାକରି ମୋତେ ସାହାଯ୍ୟ କରିବେ?","Could you help me, please?",["he"],"Could you help me, please? is a polite request.")
  ]},
  {id:"fix-it",title:"Fix the Mistake",desc:"Spot and correct common errors",xp:35,questions:[
    q("Choose the correct sentence.","ସଠିକ୍ ବାକ୍ୟ ବାଛନ୍ତୁ","He goes to school every day.",["He go to school every day.","He goes to school every day.","He going to school every day."],"With he/she/it, add -s: He goes."),
    q("Choose the correct sentence.","ସଠିକ୍ ବାକ୍ୟ ବାଛନ୍ତୁ","She doesn't like apples.",["She don't like apples.","She doesn't likes apples.","She doesn't like apples."],"Use doesn't + base verb: She doesn't like."),
    q("Choose the correct sentence.","'yesterday' ଥିଲେ ଅତୀତ କାଳ ବ୍ୟବହାର କରନ୍ତୁ।","I saw him yesterday.",["I have seen him yesterday.","I saw him yesterday.","I see him yesterday."],"Use simple past with 'yesterday': I saw him."),
    q("Choose the correct sentence.","Information ଗଣନୀୟ ନୁହେଁ।","There is a lot of information.",["There are many informations.","There is a lot of information.","There is many information."],"'Information' is uncountable: no -s."),
    q("Choose the correct sentence.","'taller' ସହିତ 'more' ଦରକାର ନାହିଁ।","He is taller than me.",["He is more taller than me.","He is taller than me.","He is most taller than me."],"Don't use 'more' with -er words: taller.")
  ]}
);

/* ---------- Words for flashcards & Word of the Day ---------- */
const WORDS=[
 {en:"Brave",odia:"ସାହସୀ",example:"The brave student tried again."},
 {en:"Curious",odia:"ଜିଜ୍ଞାସୁ",example:"A curious learner asks questions."},
 {en:"Kind",odia:"ଦୟାଳୁ",example:"Be kind to others."},
 {en:"Improve",odia:"ଉନ୍ନତ କରିବା",example:"I practise daily to improve my English."},
 {en:"Dream",odia:"ସ୍ୱପ୍ନ",example:"Work towards your dream."},
 {en:"Friend",odia:"ବନ୍ଧୁ",example:"My friend helps me learn."},
 {en:"Learn",odia:"ଶିଖିବା",example:"We learn something new every day."},
 {en:"Courage",odia:"ସାହସ",example:"Courage helps us try again."},
 {en:"Happy",odia:"ଖୁସି",example:"I am happy today."},
 {en:"Teacher",odia:"ଶିକ୍ଷକ",example:"My teacher is kind."},
 {en:"Family",odia:"ପରିବାର",example:"I love my family."},
 {en:"Morning",odia:"ସକାଳ",example:"I study in the morning."},
 {en:"Night",odia:"ରାତି",example:"The night is quiet."},
 {en:"Market",odia:"ବଜାର",example:"We go to the market."},
 {en:"Village",odia:"ଗାଁ",example:"My grandmother lives in a village."},
 {en:"River",odia:"ନଦୀ",example:"The river is wide."},
 {en:"Mountain",odia:"ପାହାଡ଼",example:"The mountain is tall."},
 {en:"Flower",odia:"ଫୁଲ",example:"The flower smells sweet."},
 {en:"Sun",odia:"ସୂର୍ଯ୍ୟ",example:"The sun is bright."},
 {en:"Moon",odia:"ଚନ୍ଦ୍ର",example:"The moon is beautiful."},
 {en:"Rain",odia:"ବର୍ଷା",example:"I like the rain."},
 {en:"Help",odia:"ସାହାଯ୍ୟ",example:"Can you help me?"},
 {en:"Strong",odia:"ଶକ୍ତିଶାଳୀ",example:"Exercise makes you strong."},
 {en:"Beautiful",odia:"ସୁନ୍ଦର",example:"The garden is beautiful."},
 {en:"Smile",odia:"ହସ",example:"Her smile is warm."},
 {en:"Think",odia:"ଚିନ୍ତା କରିବା",example:"Think before you speak."},
 {en:"Listen",odia:"ଶୁଣିବା",example:"Listen carefully."},
 {en:"Speak",odia:"କହିବା",example:"Speak slowly and clearly."},
 {en:"Write",odia:"ଲେଖିବା",example:"Write your name here."},
 {en:"Practice",odia:"ଅଭ୍ୟାସ",example:"Daily practice helps."},
 {en:"Success",odia:"ସଫଳତା",example:"Hard work brings success."},
 {en:"Water",odia:"ଜଳ",example:"Please drink water."}
];

const TIPS=[
 "Say each new English word aloud. Practice makes it easier!",
 "Tap 🔊 to hear the right pronunciation, then repeat it twice.",
 "Mistakes are good! They go to your Mistakes Notebook so you can fix them.",
 "Learn 3 new words a day and use each one in a sentence.",
 "Try switching to English → Odia mode to test yourself the other way.",
 "A 5-minute lesson every day beats one long lesson once a week.",
 "Read English signboards and labels around you. Everything is practice!",
 "Try a Speed Round when you feel confident. It builds quick thinking."
];

const RANKS=[
 {xp:0,name:"Rookie",emoji:"🌱"},{xp:100,name:"Learner",emoji:"📘"},{xp:300,name:"Explorer",emoji:"🧭"},
 {xp:600,name:"Speaker",emoji:"🗣️"},{xp:1000,name:"Storyteller",emoji:"📖"},{xp:1600,name:"Champion",emoji:"🏆"},{xp:2500,name:"Legend",emoji:"👑"}
];

const BADGES=[
 {id:"first",icon:"👣",name:"First Step",desc:"Complete your first lesson",test:s=>s.completed.length>=1},
 {id:"five",icon:"🖐️",name:"High Five",desc:"Complete 5 lessons",test:s=>s.completed.length>=5},
 {id:"perfect",icon:"💯",name:"Perfectionist",desc:"Finish a lesson with no mistakes",test:s=>s.perfectCount>=1},
 {id:"combo",icon:"⚡",name:"Combo Master",desc:"Get 6 correct answers in a row",test:s=>s.bestCombo>=6},
 {id:"streak3",icon:"🔥",name:"On Fire",desc:"Reach a 3-day streak",test:s=>s.streak>=3},
 {id:"streak7",icon:"🌟",name:"Week Warrior",desc:"Reach a 7-day streak",test:s=>s.streak>=7},
 {id:"xp500",icon:"💎",name:"XP Hunter",desc:"Earn 500 XP",test:s=>s.xp>=500},
 {id:"words",icon:"🔤",name:"Word Wizard",desc:"Study 15 flashcards",test:s=>s.wordsSeen.length>=15},
 {id:"speed",icon:"⏱️",name:"Speed Star",desc:"Get 7+ correct in a Speed Round",test:s=>s.speedBest>=7},
 {id:"fixer",icon:"🛠️",name:"Mistake Fixer",desc:"Fix 10 mistakes from your notebook",test:s=>s.mistakesFixed>=10},
 {id:"champ",icon:"🏆",name:"English Champion",desc:"Complete every lesson",test:s=>s.completed.length>=allLessons().length}
];
