/* Madiland: Mr. Madi's library. Calling Madi ("Ask Madi", the figure, its bubble) pours a window out of him, like a genie
   out of a lamp; Mr. Madi asks a few questions with ready-made answers, fetches three books and stands them on the counter.
   Films are loaded only when he is called. Closing (X, Esc, click outside) pours the window back into Madi. */
(function(){
const BOOKS={"B0H9M64T9D":["Driving Instructor Planner 2027",0.667,"planner"],"B0HJP13P4L":["Tattoo Appointment Book 2027",0.667,"planner"],"B0H9XLFLDG":["Doctor Planner 2027",0.667,"planner"],"B0HCDY6VGQ":["Ultimate Daily Planner 2027",0.667,"planner"],"B0H9MGVZLB":["Dentist Planner 2027",0.667,"planner"],"B0HJ9S2D9S":["Massage Therapist Planner 2027",0.667,"planner"],"B0H9MFN7C4":["Electrician Planner 2027",0.667,"planner"],"B0H9PBZHHC":["Esthetician Planner 2027",0.667,"planner"],"B0H9P6PBZG":["Insurance Agent Planner 2027",0.667,"planner"],"B0HC3613SM":["Interior Designer Planner 2027",0.667,"planner"],"B0H9P4DCHJ":["Lawyer Planner 2027",0.667,"planner"],"B0H9P161PJ":["Makeup Artist Planner 2027",0.667,"planner"],"B0H8S2TZMB":["Real Estate Agent Planner 2027",0.667,"planner"],"B0H8QXHGX8":["Accountant Planner 2027",0.667,"planner"],"B0H8ZM1VL6":["Hairstylist Planner 2027",0.667,"planner"],"B0H956VKJK":["Personal Trainer Planner 2027",0.667,"planner"],"B0H95J7V6J":["Nurse Planner 2027",0.667,"planner"],"B0H8Q8SYRJ":["Graphic Designer Planner 2027",0.667,"planner"],"B0H95J3SJZ":["Architect Planner 2027",0.667,"planner"],"B0H95MSND6":["Baker Planner 2027",0.667,"planner"],"B0HJDXPB4V":["Nutritionist Planner 2027",0.667,"planner"],"B0HJFCDHHW":["Photographer Planner 2027",0.667,"planner"],"B0HJLV85FD":["Physical Therapist Planner 2027",0.667,"planner"],"B0HJF32NWH":["Plumber Planner 2027",0.667,"planner"],"B0HJF81WLN":["Project Manager Planner 2027",0.667,"planner"],"B0HJFJGLZF":["Therapist Planner 2027",0.667,"planner"],"B0HJFJ9VH4":["Recruiter & HR Planner 2027",0.667,"planner"],"B0HJFWY5HZ":["Sales Rep Planner 2027",0.667,"planner"],"B0HJF975L5":["Content Creator Planner 2027",0.667,"planner"],"B0H9H4N71N":["Barber Appointment Book 2027",0.667,"planner"],"B0HJP63ZC7":["Teacher Planner 2027",0.667,"planner"],"B0HJNY7YTR":["Veterinarian Planner 2027",0.667,"planner"],"B0H92L5NGJ":["Nail Tech Planner 2027",0.667,"planner"],"B0HJPBMV4D":["Yoga Teacher Planner 2027",0.667,"planner"],"B0HJWG6ZTZ":["Wedding Planner 2027",0.667,"planner"],"B0HKL9F8Y1":["Barber Appointment Book",0.773,"planner"],"B0HKL2JF6F":["Nail Tech Appointment Book",0.773,"planner"],"B0HKLJHT7M":["Tattoo Appointment Book",0.773,"planner"],"B0HKMYMT97":["Accounting Planner & Client Record Book",0.773,"planner"],"B0HKLR7WJP":["Small Business Income & Expense Log Book",0.773,"planner"],"B0HKLJ816H":["Insurance Agent Planner & Sales Tracker",0.773,"planner"],"B0HLBNQ54F":["Forex Trading Journal",0.773,"trading"],"B0HLBM4DQX":["Options Trading Journal",0.773,"trading"],"B0HJP23HK1":["The Thistlewick Green Affair",0.667,"puzzle"],"B0HJNRRRJX":["The Thistlewick Hall Affair",0.667,"puzzle"],"B0HJNSN62S":["Write Back, Dad",0.7,"journal"],"B0HJP14LPZ":["Write Back, Mom",0.7,"journal"],"B0HJNY3BCS":["The Me I'm Making",0.667,"journal"],"B0GLMT3528":["Easter Colouring Book for Girls",1.0,"coloring"],"B0GLMGFHDZ":["Easter Colouring Book for Boys",1.0,"coloring"],"B0HLXW4ZT4":["Season to Kill",0.647,"novel"],"B0HQQ37ZDW":["Bodie and the Dinosaurs (Bodie & Jodie Book 5)",1.0,"coloring"],"B0HPC1M7PP":["Bodie & Jodie's Easter Egg Hunt (Book 4)",1.0,"coloring"],"B0HQPZ448V":["Day Trading Journal",0.772,"trading"],"B0HPBTQT7K":["Trading Journal: Stocks, Options, Futures, Forex and Crypto",0.772,"trading"],"B0HNH6SC6M":["Futures Trading Journal",0.772,"trading"],"B0HMP7CCSG":["Bodie Meets Jodie (Bodie & Jodie Book 1)",1.0,"coloring"],"B0HMP9QVXR":["Bodie & Jodie's Merry Christmas (Book 2)",1.0,"coloring"],"B0HNGXNSGZ":["Bodie & Jodie's Not-So-Spooky Halloween (Book 3)",1.0,"coloring"],"B0HLXQXD8T":["Hairdresser Appointment Book & Color Formula Log",0.772,"planner"],"B0HSLQN7NZ":["Dog Walker Diary 2027",0.662,"planner"],"B0HSLKRQ11":["Dog Groomer Diary 2027",0.767,"planner"],"B0HQXM5XR9":["Stock Trading Journal",0.773,"trading"],"B0HRS939PK":["Crypto Trading Journal",0.773,"trading"],"B0HR21HFBL":["Goodnight, Bodie & Jodie (Book 6)",1.0,"coloring"],"B0HRSBNZM5":["Jodie and the Mermaids (Book 7)",1.0,"coloring"]};
const PAGE={"B0HMP9QVXR":"book-bodie-jodie-merry-christmas.html","B0HMP7CCSG":"book-bodie-meets-jodie.html","B0HNGXNSGZ":"book-bodie-jodie-not-so-spooky-halloween.html","B0HPC1M7PP":"book-bodie-jodie-easter-egg-hunt.html","B0HQQ37ZDW":"book-bodie-and-the-dinosaurs.html","B0H9M64T9D":"book-driving-instructor-planner-2027.html","B0HJNY3BCS":"book-the-me-im-making.html","B0HPBTQT7K":"book-trading-journal.html","B0HJP23HK1":"book-thistlewick-green-affair.html","B0HLXW4ZT4":"book-season-to-kill.html","B0H9MFN7C4":"book-electrician-planner-2027.html","B0HJF32NWH":"book-plumber-planner-2027.html","B0H95MSND6":"book-baker-planner-2027.html","B0H9H4N71N":"book-barber-appointment-book-2027.html","B0H8ZM1VL6":"book-hairstylist-planner-2027.html","B0H92L5NGJ":"book-nail-tech-planner-2027.html","B0H9PBZHHC":"book-esthetician-planner-2027.html","B0H9P161PJ":"book-makeup-artist-planner-2027.html","B0HJ9S2D9S":"book-massage-therapist-planner-2027.html","B0HJP13P4L":"book-tattoo-appointment-book-2027.html","B0H95J7V6J":"book-nurse-planner-2027.html","B0H9XLFLDG":"book-doctor-planner-2027.html","B0H9MGVZLB":"book-dentist-planner-2027.html","B0HJNY7YTR":"book-veterinarian-planner-2027.html","B0HJLV85FD":"book-physical-therapist-planner-2027.html","B0HJDXPB4V":"book-nutritionist-planner-2027.html","B0H956VKJK":"book-personal-trainer-planner-2027.html","B0HJPBMV4D":"book-yoga-teacher-planner-2027.html","B0HJFJGLZF":"book-therapist-planner-2027.html","B0HJP63ZC7":"book-teacher-planner-2027.html","B0H8QXHGX8":"book-accountant-planner-2027.html","B0H9P4DCHJ":"book-lawyer-planner-2027.html","B0H95J3SJZ":"book-architect-planner-2027.html","B0HC3613SM":"book-interior-designer-planner-2027.html","B0H8Q8SYRJ":"book-graphic-designer-planner-2027.html","B0HJFCDHHW":"book-photographer-planner-2027.html","B0HJF975L5":"book-content-creator-planner-2027.html","B0H8S2TZMB":"book-real-estate-agent-planner-2027.html","B0H9P6PBZG":"book-insurance-agent-planner-2027.html","B0HJFWY5HZ":"book-sales-rep-planner-2027.html","B0HJFJ9VH4":"book-recruiter-and-hr-planner-2027.html","B0HJF81WLN":"book-project-manager-planner-2027.html","B0HJWG6ZTZ":"book-wedding-planner-2027.html","B0HCDY6VGQ":"book-ultimate-daily-planner-2027.html","B0HKL9F8Y1":"book-barber-appointment-book.html","B0HLXQXD8T":"book-hairdresser-appointment-book-and-color-formula-log.html","B0HKL2JF6F":"book-nail-tech-appointment-book.html","B0HKLJHT7M":"book-tattoo-appointment-book.html","B0HKLJ816H":"book-insurance-agent-planner-and-sales-tracker.html","B0HKMYMT97":"book-accounting-planner-and-client-record-book.html","B0HKLR7WJP":"book-small-business-income-and-expense-log-book.html","B0HLBNQ54F":"book-forex-trading-journal.html","B0HLBM4DQX":"book-options-trading-journal.html","B0HNH6SC6M":"book-futures-trading-journal.html","B0HQPZ448V":"book-day-trading-journal.html","B0HQXM5XR9":"book-stock-trading-journal.html","B0HRS939PK":"book-crypto-trading-journal.html","B0HJNSN62S":"book-write-back-dad.html","B0HJP14LPZ":"book-write-back-mom.html","B0HJNRRRJX":"book-thistlewick-hall-affair.html","B0GLMT3528":"book-easter-colouring-book-girls.html","B0GLMGFHDZ":"book-easter-colouring-book-boys.html","B0HSLKRQ11":"book-dog-groomer-diary-2027.html","B0HSLQN7NZ":"book-dog-walker-diary-2027.html"}, NOTE={'B0HJNY3BCS':'For a teen'}, AZ=a=>PAGE[a]||'https://www.amazon.com/dp/'+a;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const small=innerWidth<=700||Math.min(screen.width,screen.height,innerWidth)<=500||(innerHeight<=500&&matchMedia('(pointer:coarse)').matches)||(navigator.connection&&navigator.connection.saveData);
/* a slow line gets the light films (a third of the size): when the browser says so, or when the first film came slowly */
let thin=small||/2g|3g/.test((navigator.connection||{}).effectiveType||'');
const SRC=n=>'biblio/'+n+(thin?'_m':'')+'.mp4', PIC=n=>'biblio/'+n+(small?'_m':'')+'.webp';

/* ---------- the catalogue, as Mr. Madi knows it ---------- */
const JOBS={ /* field: [ [answer, dated 2027, undated] ] */
 'Beauty and hair':[['Barber','B0H9H4N71N','B0HKL9F8Y1'],['Hairstylist','B0H8ZM1VL6','B0HLXQXD8T'],['Nail tech','B0H92L5NGJ','B0HKL2JF6F'],['Esthetician','B0H9PBZHHC'],['Makeup artist','B0H9P161PJ'],['Tattoo artist','B0HJP13P4L','B0HKLJHT7M']],
 'Health and care':[['Nurse','B0H95J7V6J'],['Doctor','B0H9XLFLDG'],['Dentist','B0H9MGVZLB'],['Therapist','B0HJFJGLZF'],['Physical therapist','B0HJLV85FD'],['Massage therapist','B0HJ9S2D9S'],['Nutritionist','B0HJDXPB4V'],['Veterinarian','B0HJNY7YTR'],['Personal trainer','B0H956VKJK'],['Yoga teacher','B0HJPBMV4D']],
 'Office and money':[['Accountant','B0H8QXHGX8','B0HKMYMT97'],['Small business',null,'B0HKLR7WJP'],['Insurance agent','B0H9P6PBZG','B0HKLJ816H'],['Real estate agent','B0H8S2TZMB'],['Lawyer','B0H9P4DCHJ'],['Sales rep','B0HJFWY5HZ'],['Project manager','B0HJF81WLN'],['Recruiter or HR','B0HJFJ9VH4']],
 'Trades and teaching':[['Electrician','B0H9MFN7C4'],['Plumber','B0HJF32NWH'],['Driving instructor','B0H9M64T9D'],['Teacher','B0HJP63ZC7'],['Dog walker','B0HSLQN7NZ',null,['B0HSLQN7NZ','B0HSLKRQ11','B0HJNY7YTR']],['Dog groomer','B0HSLKRQ11',null,['B0HSLKRQ11','B0HSLQN7NZ','B0HJNY7YTR']]],   /* 27 nov: j[3] = the three books, when the neighbours on the list are not the right company */
 'Creative and homes':[['Photographer','B0HJFCDHHW'],['Graphic designer','B0H8Q8SYRJ'],['Interior designer','B0HC3613SM'],['Architect','B0H95J3SJZ'],['Content creator','B0HJF975L5'],['Baker','B0H95MSND6'],['Wedding planner','B0HJWG6ZTZ']]
};
const ANY='B0HCDY6VGQ';
const uniq=a=>[...new Set(a.filter(Boolean))];
function jobBooks(field,j,kind){ const first=kind==='un'?[j[2],j[1]]:[j[1],j[2]]; const mates=JOBS[field].filter(x=>x!==j&&!x[3]).map(x=>kind==='un'?(x[2]||x[1]):(x[1]||x[2])); return uniq([...first,...mates,ANY]); }

/* a step: say = the question; a = answers [label, mr Madi's reply, reaction clip, next step or {books}] */
const START=()=>({ say:'Who is the book for?', a:[
 ['For me','Splendid. A book chosen for oneself is never wasted.','r3',()=>want('you')],
 ['A child','Ah! The best readers of all.','r1',child],
 ['My mom or dad','Now you have touched an old heart.','r4',parent],
 ['A friend or colleague','A thoughtful gift. I like you already.','r3',()=>want('them')]] });
const want=w=>({ say:w==='you'?'What would make you smile?':'What would make them smile?', a:[
 ['Getting work organized','Order! The quiet kind of happiness.','r3',field],
 ['A puzzle or a story','Oh, now we are whispering. I know just the corner.','r2',tale],
 ['Coloring with a little one','Marvellous. Small hands, big crayons.','r1',child],
 ['Writing things down','Words that wait for somebody. Lovely.','r4',()=>write(w)],
 ['Trading the markets','My goodness! You will want a clear head.','r2',trade]] });
const field=()=>({ say:'What sort of work is it?', a:[...Object.keys(JOBS).map((f,i)=>[f,['Wonderful hands at work, then.','The people who look after people. Thank you.','Numbers, names and deadlines. I understand.','Where would we be without them?','Ah, the ones who make things beautiful.'][i],['r1','r4','r3','r3','r2'][i],()=>job(f)]),
 ['Any job at all','One book for everything. Very sensible.','r3',{books:[ANY,'B0HKLR7WJP','B0HJF81WLN']}]] });
const job=f=>({ say:'And which one, exactly?', a:JOBS[f].map((j,i)=>[j[0],['I have the very thing.','Oh, that one is a favourite of mine.','Say no more.'][i%3],['r2','r1','r3'][i%3],j[3]?{books:j[3]}:j[1]&&j[2]?()=>dated(f,j):{books:jobBooks(f,j)}]) });
const dated=(f,j)=>({ say:'Should it know the date, or wait for you?', a:[
 ['Dated, for 2027','A fresh year, every day in its place.','r1',{books:jobBooks(f,j)}],
 ['Undated, start any day','Begin whenever you like. Books are patient.','r3',{books:jobBooks(f,j,'un')}]] });
const tale=()=>({ say:'Would you rather solve it, or simply read it?', a:[
 ['Solve it','A detective! I suspected as much.','r2',{books:['B0HJP23HK1','B0HJNRRRJX','B0HLXW4ZT4']}],
 ['Read it','Ten suspects, ten sauces. Do not read it hungry.','r1',{books:['B0HLXW4ZT4','B0HJNRRRJX','B0HJP23HK1']}]] });
const write=w=>({ say:w==='you'?'Who should the words be about?':'Who will be writing in it?', a:[
 [w==='you'?'About me':'Just them','The most interesting chapter is always the next one.','r3',{books:['B0HJP14LPZ','B0HJNSN62S','B0HJNY3BCS']}],
 [w==='you'?'Me and my mom':'A mother and her child','She will keep it forever, you know.','r4',{books:['B0HJP14LPZ','B0HJNSN62S','B0HJNY3BCS']}],
 [w==='you'?'Me and my dad':'A father and his child','He will pretend he has something in his eye.','r4',{books:['B0HJNSN62S','B0HJP14LPZ','B0HJNY3BCS']}]] });
const parent=()=>({ say:'For mom, or for dad?', a:[
 ['For mom','Mothers keep every page.','r4',{books:['B0HJP14LPZ','B0HJNSN62S','B0HJNY3BCS']}],
 ['For dad','He will read it twice and tell no one.','r4',{books:['B0HJNSN62S','B0HJP14LPZ','B0HJNY3BCS']}]] });
const trade=()=>({ say:'Which market keeps you awake?', a:[
 ['Day trading','Quick eyes, calm hands.','r2',{books:['B0HQPZ448V','B0HPBTQT7K','B0HNH6SC6M']}],
 ['A bit of everything','Then you need one book that holds it all.','r3',{books:['B0HPBTQT7K','B0HQPZ448V','B0HLBM4DQX']}],
 ['Forex','The market that never sleeps. Nor do you, I see.','r2',{books:['B0HLBNQ54F','B0HPBTQT7K','B0HQPZ448V']}],
 ['Options','Ah, a planner of possibilities.','r3',{books:['B0HLBM4DQX','B0HPBTQT7K','B0HQPZ448V']}],
 ['Futures','Looking ahead. Very wise.','r3',{books:['B0HNH6SC6M','B0HPBTQT7K','B0HQPZ448V']}],
 ['Stocks','A good company and a little patience. Quite right.','r3',{books:['B0HQXM5XR9','B0HPBTQT7K','B0HQPZ448V']}],
 ['Crypto','A market that never closes. I shall leave the lamp on.','r2',{books:['B0HRS939PK','B0HPBTQT7K','B0HQPZ448V']}]] });
const child=()=>({ say:'What kind of adventure shall it be?', a:[
 ['Meeting new friends','Bodie and Jodie will be delighted.','r1',{books:['B0HMP7CCSG','B0HQQ37ZDW','B0HMP9QVXR']}],
 ['Dinosaurs','Dinosaurs! Mind the shelves.','r2',{books:['B0HQQ37ZDW','B0HMP7CCSG','B0HNGXNSGZ']}],
 ['Christmas','Snow, bells and crayons.','r1',{books:['B0HMP9QVXR','B0HMP7CCSG','B0HQQ37ZDW']}],
 ['Halloween','Not so very spooky, I promise.','r2',{books:['B0HNGXNSGZ','B0HMP7CCSG','B0HQQ37ZDW']}],
 ['Easter','Somebody has hidden the eggs again.','r1',easter]] });
const easter=()=>({ say:'Which basket shall we fill?', a:[
 ['An egg hunt story','Off they go, over the garden wall.','r1',{books:['B0HPC1M7PP','B0GLMT3528','B0GLMGFHDZ']}],
 ['Bunnies for a girl','Soft ears and bright eggs.','r4',{books:['B0GLMT3528','B0HPC1M7PP','B0HMP7CCSG']}],
 ['Bunnies for a boy','These bunnies are rather cool.','r3',{books:['B0GLMGFHDZ','B0HPC1M7PP','B0HMP7CCSG']}]] });

/* ---------- look ---------- */
const css=`
.lib{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;background:none;overflow:hidden;color:#F3E7D3;font-family:'Familjen Grotesk',system-ui,sans-serif}
.lib::backdrop{background:none}
.lib:not([open]){display:none}
.lib-dim{position:fixed;inset:0;z-index:90;background:radial-gradient(90% 90% at 50% 45%,rgba(12,9,6,.62),rgba(8,10,11,.86));opacity:0;transition:opacity .55s;pointer-events:none}
.lib-dim.on{opacity:1}
.lib-cv{position:fixed;inset:0;width:100vw;height:100vh;z-index:91;pointer-events:none}
.lib .win{position:absolute;display:flex;flex-direction:column;overflow:hidden;border-radius:14px;background:#1B0F07;box-shadow:0 40px 110px rgba(0,0,0,.6),0 0 0 1px rgba(255,206,140,.16)}
.lib .film{position:relative;flex:none;overflow:hidden;background:#140C06 center/cover no-repeat}
.lib .film video,.lib .film .pic{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .26s linear}
.lib .film .on{opacity:1}
.lib .film canvas{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .26s linear;z-index:3;pointer-events:none}
.lib .film canvas.dust{z-index:5;opacity:1;transition:none}
.lib .film .vs{opacity:0!important;z-index:0}
.lib .stage1{position:absolute;left:0;top:0;width:1280px;height:720px;transform-origin:0 0;pointer-events:none;z-index:4}
.lib .bk3{position:absolute;left:0;top:0;width:400px;height:600px;transform-origin:0 0;overflow:hidden;opacity:0;transition:opacity .9s,filter .3s;background:#555 center/cover;pointer-events:none;border:0;padding:0;display:block}
.lib .bk3 b{position:absolute;inset:-20px;background:inherit;filter:blur(16px) brightness(.8)}
.lib .bk3 img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.lib .bk3.fill img{object-fit:fill}
.lib .bk3::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.34),rgba(255,255,255,.10) 4%,rgba(0,0,0,.12) 8%,rgba(0,0,0,0) 22%),linear-gradient(180deg,rgba(255,225,170,.10),rgba(30,14,4,.26))}
.lib .bk3.on{opacity:1;pointer-events:auto;cursor:pointer}
.lib .bk3:nth-child(1){filter:brightness(.8) saturate(.92)}.lib .bk3:nth-child(2),.lib .bk3:nth-child(3){filter:brightness(.9) saturate(.95)}
.lib .bk3.gl{background:none!important;filter:none!important}.lib .bk3.gl b,.lib .bk3.gl img,.lib .bk3.gl::after{display:none}
.lib .bk3.on:hover,.lib .bk3.on.hl{filter:brightness(1.1)}
.lib .desk{container-type:inline-size;position:relative;flex:1;min-height:0;padding:20px 30px 24px;display:flex;flex-direction:column;gap:15px;
  background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,0) 26px),radial-gradient(70% 120% at 18% 0%,rgba(255,186,96,.13),transparent 70%),linear-gradient(180deg,#341D0D,#25140A)}
.lib .say{margin:0;font:italic 400 clamp(21px,2.1vw,28px)/1.22 'Newsreader',Georgia,serif;color:#FFF3DD;min-height:1.22em;text-wrap:balance}
.lib .say span{opacity:0;animation:libW .34s ease-out forwards}
@keyframes libW{from{opacity:0;filter:blur(3px)}to{opacity:1;filter:none}}
.lib .say small{font:500 15px/1 'Familjen Grotesk',system-ui,sans-serif;color:#E9B871;margin-right:12px;vertical-align:.16em}
.lib .ans{display:flex;flex-wrap:wrap;gap:10px 11px;overflow:auto;padding:6px 4px 8px;margin:-6px -4px;scrollbar-width:thin;scrollbar-color:#8a5d2f transparent}
.lib .sl{position:relative;flex:none;appearance:none;border:0;margin:0;cursor:pointer;text-align:left;font:500 16px/1.2 'Familjen Grotesk',system-ui,sans-serif;color:#2A1B0D;min-height:46px;padding:11px 18px 11px 30px;border-radius:3px;text-decoration:none;display:inline-flex;align-items:center;
  background:radial-gradient(circle at 14px 50%,#2a170b 0 4px,transparent 4.6px),linear-gradient(180deg,#F8EFDD,#E9DABD);box-shadow:0 5px 10px rgba(0,0,0,.42),inset 0 0 0 1px rgba(120,82,40,.16);
  transform:rotate(var(--r,0deg));transition:transform .22s cubic-bezier(.16,1,.3,1),background-color .2s,box-shadow .22s,opacity .3s;animation:libS .5s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes libS{from{opacity:0;transform:translateY(16px) rotate(calc(var(--r,0deg)*4))}}
.lib .sl:hover,.lib .sl:focus-visible{transform:translateY(-4px) rotate(0deg);box-shadow:0 11px 18px rgba(0,0,0,.5),inset 0 0 0 2px #C98633;outline:none}
.lib .sl.quiet{background:none;color:#F3DDB8;padding-left:16px;box-shadow:inset 0 0 0 1px rgba(243,221,184,.42);border-radius:22px}
.lib .sl.quiet:hover,.lib .sl.quiet:focus-visible{box-shadow:inset 0 0 0 2px #F2A33A;color:#fff}
.lib .ans.gone .sl{opacity:0;pointer-events:none;transform:translateY(8px)}
.lib .ans.gone .sl.picked{opacity:1;transform:translateY(-4px);box-shadow:0 11px 18px rgba(0,0,0,.5),inset 0 0 0 2px #C98633}
.lib .three{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;width:100%}
.lib .three .sl{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;padding:11px 16px 11px 30px;text-wrap:balance}
.lib .three .sl span{display:block;margin-top:4px;font-size:14px;color:#8A4B0C}
.lib .three .sl img{display:none}
.lib .row{display:flex;flex-wrap:wrap;gap:10px;width:100%}
@container (min-width:960px){.lib .row{position:absolute;width:auto;right:30px;top:13px;z-index:2}}
.lib .x{position:absolute;z-index:5;right:14px;top:14px;width:52px;height:52px;border:0;border-radius:50%;cursor:pointer;display:grid;place-items:center;background:#F8EFDD;color:#2A1B0D;box-shadow:0 6px 18px rgba(0,0,0,.55),0 0 0 2px rgba(42,23,11,.55);transition:transform .25s cubic-bezier(.16,1,.3,1),background .2s}
.lib .x:hover{background:#F2A33A;transform:rotate(90deg)}
.lib .x svg{width:22px;height:22px;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;fill:none}
.lib :focus-visible{outline:3px solid #F2A33A;outline-offset:3px}
.lib .back{position:absolute;z-index:5;left:14px;top:14px;border:0;cursor:pointer;min-height:44px;padding:0 17px;border-radius:22px;font:500 15px/1 'Familjen Grotesk',system-ui,sans-serif;background:rgba(27,15,7,.78);color:#F8EFDD;box-shadow:inset 0 0 0 1px rgba(248,239,221,.35)}
.lib .made{position:absolute;z-index:4;right:16px;bottom:8px;font:400 12px/1 'Familjen Grotesk',system-ui,sans-serif;color:rgba(243,221,184,.72);pointer-events:none}
.lib .back:hover{background:#2f1a0c}.lib .back[hidden]{display:none}
@media (max-width:700px){.lib .desk{padding:16px 16px calc(18px + env(safe-area-inset-bottom));gap:13px}.lib .win{border-radius:0}.lib .sl{font-size:16px}.lib .x{width:48px;height:48px;right:10px;top:10px}.lib .back{left:10px;top:10px}
 .lib .three{grid-template-columns:1fr}.lib .say{font-size:22px}.lib .ans{flex:1;align-content:flex-start}
 .lib .ans:not(:has(.three)){flex-direction:column;flex-wrap:nowrap;align-items:stretch;gap:10px;padding-bottom:14px}.lib .ans>.sl{flex:1 0 46px;max-height:124px;font-size:18px;padding-left:40px;background:radial-gradient(circle at 20px 50%,#2a170b 0 4.5px,transparent 5.1px),linear-gradient(180deg,#F8EFDD,#E9DABD)}.lib .ans>.sl.quiet{background:none;padding-left:18px;flex:0 0 46px}
 .lib .three .sl{flex-direction:row;align-items:center;justify-content:flex-start;gap:15px;padding:9px 16px 9px 30px}.lib .row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.lib .row .sl{justify-content:center;text-align:center;padding:8px;font-size:15px}.lib .row .sl:nth-child(2){grid-column:1/-1;order:3}.lib .three .sl img{display:block;flex:none;height:min(62px,8vh);width:auto;border-radius:2px;box-shadow:0 2px 7px rgba(42,23,11,.45)}}
@media (max-width:700px) and (max-height:700px){.lib .desk{gap:9px;padding-top:12px;padding-bottom:calc(24px + env(safe-area-inset-bottom))}.lib .say{font-size:20px}.lib .ans:not(:has(.three)){gap:6px;padding-bottom:4px}.lib .ans>.sl{flex-basis:44px;min-height:44px;padding-top:6px;padding-bottom:6px}.lib .ans>.sl.quiet{flex-basis:44px}.lib .three{gap:7px}.lib .three .sl{padding-top:5px;padding-bottom:5px}.lib .three .sl img{height:44px}.lib .row{gap:7px}.lib .row .sl{min-height:44px;padding:5px}}
@media (max-height:760px) and (min-width:701px){.lib .desk{padding:14px 26px 14px;gap:10px}}
@media (max-height:560px) and (min-width:701px){.lib .win{flex-direction:row}.lib .desk{padding:16px 16px 28px;gap:9px}.lib .say{font-size:20px;padding-right:56px}.lib .ans{flex:1;align-content:flex-start}.lib .sl{min-height:44px;padding-top:7px;padding-bottom:7px}
 .lib .three{grid-template-columns:1fr;gap:8px}.lib .three .sl{flex-direction:row;align-items:center;justify-content:flex-start;gap:12px;padding:6px 12px 6px 28px;font-size:15px}.lib .three .sl img{display:block;flex:none;height:58px;width:auto;border-radius:2px;box-shadow:0 2px 6px rgba(42,23,11,.45)}}
html.lib-on,html.lib-on body{overflow:hidden}
@media (prefers-reduced-motion:reduce){.lib *,.lib-dim{animation:none!important;transition:none!important}.lib .say span{opacity:1}}`;

/* ---------- window ---------- */
let dlg,win,film,desk,say,ans,x,back,stage,bks,dim,vs,cvs,vids=[],cur=0,open=false,busy=false,run=0,hist=[],shown=[],from=null,imgRest;
function build(){
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  dim=document.createElement('div'); dim.className='lib-dim'; document.body.appendChild(dim);
  dlg=document.createElement('dialog'); dlg.className='lib'; dlg.setAttribute('aria-label',"Mr. Madi's library");
  dlg.innerHTML=`<div class="win"><div class="film" role="img" aria-label="Mr. Madi, an old librarian with round glasses, at his counter in a lamp-lit library, a ginger cat beside him"><video muted playsinline preload="auto" tabindex="-1" aria-hidden="true"></video><video muted playsinline preload="auto" tabindex="-1" aria-hidden="true"></video><video class="vs" muted playsinline preload="auto" tabindex="-1" aria-hidden="true"></video><canvas class="gl" aria-hidden="true"></canvas><div class="stage1"></div></div>
  <div class="desk"><p class="say" aria-live="polite"></p><div class="ans"></div></div><small class="made">Mr. Madi is an AI-made character.</small><button class="back" type="button" hidden>Back</button><button class="x" type="button" aria-label="Close Mr. Madi's library"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`;
  document.body.appendChild(dlg);
  const q=s=>dlg.querySelector(s); win=q('.win'); film=q('.film'); desk=q('.desk'); say=q('.say'); ans=q('.ans'); x=q('.x'); back=q('.back'); stage=q('.stage1'); vids=[...dlg.querySelectorAll('video:not(.vs)')]; vs=q('.vs'); cvs=q('canvas.gl');
  bks=QUADS.map(qd=>{ const b=document.createElement('button'); b.type='button'; b.className='bk3'; b.tabIndex=-1; b.setAttribute('aria-hidden','true'); b.style.transform=homography(qd); b.innerHTML='<b></b><img alt="">'; stage.appendChild(b); return b; });
  x.onclick=close; back.onclick=goBack;
  dlg.addEventListener('cancel',e=>{ e.preventDefault(); close(); });
  dlg.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.preventDefault(); close(); } });
  dlg.addEventListener('click',e=>{ if(e.target===dlg) close(); });
  addEventListener('resize',()=>open&&place());
  [...vids,vs].forEach(v=>v.addEventListener('contextmenu',e=>e.preventDefault()));
}
function rect(){ const W=innerWidth,H=innerHeight; 
  if(W<=700){ return {l:0,t:0,w:W,h:H,f:Math.round(H<740?Math.min(W*.84,H*.4):Math.min(W*1.1,H*.46))}; }
  if(H<=560){ const h=H-16,w=W-16; return {l:8,t:8,w,h,f:h,fw:Math.round(Math.min(h*16/9,w*.58))}; }
  let dk=H<760?232:W<1040?256:196, w=Math.round(Math.min(1280,W*.92,(H*.95-dk)*16/9)); if(dk===196&&w<1030){ dk=250; w=Math.round(Math.min(1280,W*.92,(H*.95-dk)*16/9)); } const f=Math.round(w*9/16), h=f+dk; return {l:Math.round((W-w)/2),t:Math.round((H-h)/2),w,h,f}; }
function place(){ const r=rect(); Object.assign(win.style,{left:r.l+'px',top:r.t+'px',width:r.w+'px',height:r.h+'px'}); const fw=r.fw||r.w; film.style.height=r.f+'px'; film.style.width=r.fw?fw+'px':'';
  const s=Math.max(fw/1280,r.f/720); stage.style.transform=`translate(${(fw-1280*s)/2}px,${(r.f-720*s)/2}px) scale(${s})`; if(G){ const k=Math.min(devicePixelRatio||1,2), w=Math.round(fw*k), h=Math.round(r.f*k); if(cvs.width!==w||cvs.height!==h){ cvs.width=w; cvs.height=h; } draw(); } return r; }

/* covers stand on the three blank books of the last frame */
const QUADS=[[[445.4,413.8],[566.2,417.7],[566.2,635.4],[445.4,623.1]],[[620.5,416.2],[752.7,413.1],[752.7,623.8],[620.5,633.8]],[[784.6,416.2],[911.5,411.9],[911.5,619.6],[784.6,630.8]]];
function homography(q){ const [a,b,c,d]=q,W=400,H=600; const dx1=b[0]-c[0],dx2=d[0]-c[0],dx3=a[0]-b[0]+c[0]-d[0],dy1=b[1]-c[1],dy2=d[1]-c[1],dy3=a[1]-b[1]+c[1]-d[1];
  const D=dx1*dy2-dx2*dy1,g=(dx3*dy2-dx2*dy3)/D,h=(dx1*dy3-dx3*dy1)/D;
  return `matrix3d(${(b[0]-a[0]+g*b[0])/W},${(b[1]-a[1]+g*b[1])/W},0,${g/W},${(d[0]-a[0]+h*d[0])/H},${(d[1]-a[1]+h*d[1])/H},0,${h/H},0,0,1,0,${a[0]},${a[1]},0,1)`; }

/* ---------- films: two players, one dissolving over the other ---------- */
const blobs={}, ready={}; let queue=[], pumping=0;
function grab(n){ const t0=performance.now(); return blobs[n]||(blobs[n]=fetch(SRC(n)).then(r=>{ if(!r.ok) throw 0; return r.blob(); }).then(b=>{ ready[n]=1; if(n==='s1'&&b.size*8/(performance.now()-t0)<9000) thin=true; return URL.createObjectURL(b); }).catch(e=>{ delete blobs[n]; throw e; })); }
/* is the film here within ms? nobody is kept waiting for a download */
const soon=(n,ms)=>Promise.race([grab(n).then(()=>true,()=>false),new Promise(r=>setTimeout(()=>r(false),ms))]);
/* one after another; `first` = ahead of everything else that waits */
function later(list,first){ const l=list.filter((n,i)=>!blobs[n]&&list.indexOf(n)===i); queue=first?l.concat(queue.filter(n=>!l.includes(n))):queue.filter(n=>!l.includes(n)).concat(l); if(pumping) return; pumping=1; (async()=>{ while(queue.length&&open){ const n=queue.shift(); try{ await grab(n); }catch(e){} } pumping=0; })(); }
let token=0, watch=0, now='', after=null;
/* every film starts and ends in the same seated pose. n = film, end = what follows, o: rate, at (start second), cut (no dissolve), hold (let the last frame stay) */
async function play(n,end,o){ o=o||{}; const t=++token; cancelAnimationFrame(watch);
  if(reduce){ return; }
  const v=vids[1-cur]; let url; try{ url=await grab(n); }catch(e){ if(t===token&&end) setTimeout(()=>t===token&&end(),1500); return; }
  if(t!==token) return; v.pause(); v.src=url; v.playbackRate=o.rate||1;
  try{ if(o.at){ await new Promise((ok,no)=>{ v.onloadedmetadata=()=>{ v.currentTime=o.at; }; v.onseeked=ok; v.onerror=no; setTimeout(ok,700); }); v.onseeked=v.onloadedmetadata=v.onerror=null; if(t!==token) return; }
    await v.play(); }catch(e){ if(t!==token) return; if(end) setTimeout(()=>t===token&&end(),1500); return; }
  if(t!==token){ return; }
  v.playbackRate=o.rate||1; now=n; after=end; const t9=performance.now();
  const old=vids[cur]; cur=1-cur; v.style.transitionDuration=o.cut?'0s':''; v.style.zIndex=2; old.style.zIndex=1; v.classList.add('on'); if(!o.keep) glOff();
  setTimeout(()=>{ if(vids[cur]===v){ old.classList.remove('on'); old.pause(); } },o.cut?60:300);
  const w=()=>{ if(t!==token) return; if(o.home&&v.currentTime>o.home&&v.duration){ const l=v.duration-(o.rest||0)-v.currentTime; v.playbackRate=Math.max(1,Math.min(1+(o.rest?1.45:1.1)*Math.min(1,(v.currentTime-o.home)/(o.rest?.6:.8)),(o.rest?1.2:1)+l*1.2)); } if(o.rest?v.duration&&v.currentTime>=v.duration-o.rest||v.ended:v.duration&&v.duration-v.currentTime<(o.tail||.27)*Math.max(1,v.playbackRate)||v.ended){ end&&end(); return; } watch=requestAnimationFrame(w); }; w();
}
/* every state has several films; they come in a shuffled order and the same one never plays twice running */
const VAR={n:['n1','n2','n3','n4'],r1:['r1','r1b','r1c'],r2:['r2','r2b','r2d'],r3:['r3','r3b','r3c','r3d'],r4:['r4','r4b','r4c','r4d']};
/* what was shown and when is remembered while the tab is open, across pages: the one not seen for the longest time comes next, and never the one just shown */
let turn=0, memo={}; const KEY='madiShown', recall=()=>{ try{ const o=JSON.parse(sessionStorage.getItem(KEY))||{}; if((o._||0)>=turn){ turn=o._||0; memo=o; } }catch(e){} };
const fresh_=(a,b)=>(memo[a]||0)-(memo[b]||0)||Math.random()-.5;
const KIN={r4:['r3','r1'],r3:['r1','r4'],r2:['r1','r3'],r1:['r3','r2']};
function line(k){ recall(); const c=VAR[k].filter(x=>x!==memo['='+k[0]]&&(VAR[k].length<2||x!==memo['='+k])); return (c.length?c:KIN[k].map(q=>line(q)[0])).sort(fresh_); }
function peek(k){ return line(k)[0]; }
/* the film to play now; if the one whose turn it is has not arrived yet, another that is already here; the one after it starts to download */
function take(k){ const l=line(k), n=l.find(x=>ready[x])||l[0]; memo[n]=memo._=++turn; memo['='+k[0]]=memo['='+k]=n; try{ sessionStorage.setItem(KEY,JSON.stringify(memo)); }catch(e){} later([peek(k)],true); return n; }
/* from here on he is on his way back to the seated pose (seconds); when the books are next, that part goes a little quicker */
const HOME={r2b:5.8,r2c:4.2,r2d:5.9,r3c:4.7,r3d:4,r4b:5.7,r4c:4.3,r4d:5.2};
/* seconds before its end at which a reaction is already back in the seated pose (measured on the frames): the walk to the shelf starts from there, not from the end of the film */
const REST={r4b:.27}, REST0=.37;
function idle(){ play(take('n'),idle,{at:.2}); }
/* back to the seated pose without a cut: he finishes what he is doing (or undoes what he has only just begun), a little quicker, and only then reacts */
const QUIET=.33, PEAK=2.3;
function settle(then){ const v=vids[cur];
  if(reduce||!now||!v.classList.contains('on')||!v.duration||v.ended) return then();
  const d=v.duration, p=v.currentTime; if(p<QUIET||p>d-QUIET*1.7) return then();
  const run2=(end)=>{ const t=++token; cancelAnimationFrame(watch); const el=vids[cur]; let t0=performance.now();
    const w=ts=>{ if(t!==token) return; const left=el.duration-el.currentTime; if(left<QUIET*1.15||el.ended){ el.playbackRate=1; end(); return; }
      /* gentle start, gentle landing */
      el.playbackRate=Math.max(1,Math.min(1+(PEAK-1)*Math.min(1,(ts-t0)/350),1+left*1.6)); watch=requestAnimationFrame(w); }; watch=requestAnimationFrame(w); };
  if(p<2.75&&now[0]==='n'&&blobs[now+'r']&&ready[now+'r']){ const n=now+'r'; rev(n,run2,then); } else run2(then); }
async function rev(n,run2,then){ const t=++token; cancelAnimationFrame(watch); const v=vids[1-cur], old=vids[cur], url=await blobs[n]; if(t!==token) return;
  v.pause(); v.src=url; try{ await new Promise(ok=>{ v.onloadedmetadata=()=>{ v.currentTime=Math.max(0,v.duration-old.currentTime-.15); }; v.onseeked=ok; setTimeout(ok,600); }); v.onseeked=v.onloadedmetadata=null; if(t!==token) return;
    old.pause(); v.currentTime=Math.max(0,v.duration-old.currentTime); await new Promise(ok=>{ v.onseeked=ok; setTimeout(ok,400); }); v.onseeked=null; if(t!==token) return; await v.play(); }catch(e){ if(t===token){ old.play().catch(()=>{}); run2(then); } return; }
  if(t!==token) return; cur=1-cur; now=n; v.style.transitionDuration='.12s'; v.style.zIndex=2; old.style.zIndex=1; v.classList.add('on'); setTimeout(()=>{ if(vids[cur]===v) old.classList.remove('on'); },160); run2(then); }
function freeze(){ token++; cancelAnimationFrame(watch); if(vs) vs.pause(); }

/* ---------- the films with books: the real covers are laid on the blank books, frame by frame.
   The film carries, under the picture, a matte for each book (so his fingers stay in front) and the frame number as ten black/white boxes. */
let G=null, covers=[null,null,null], hot=[0,0,0], mixv=1, lit=0;
const VS=`#version 300 es
precision highp float; uniform sampler2D V; uniform highp sampler2D Q; uniform vec2 S; out vec2 p; flat out mat3 H0; flat out mat3 H1; flat out mat3 H2; flat out vec3 has;
mat3 inv(vec2 a,vec2 b,vec2 c,vec2 d){ vec2 d1=b-c,d2=d-c,d3=a-b+c-d; float D=d1.x*d2.y-d2.x*d1.y; float g=(d3.x*d2.y-d2.x*d3.y)/D,h=(d1.x*d3.y-d3.x*d1.y)/D; mat3 m=mat3(b-a+g*b,g,d-a+h*d,h,a,1.); return inverse(m); }
void main(){ vec2 q=vec2((gl_VertexID<<1)&2,gl_VertexID&2); gl_Position=vec4(q*2.-1.,0,1); float s=max(S.x/1280.,S.y/720.); p=(vec2(q.x,1.-q.y)-.5)*S/s+vec2(640.,360.);
 int f=0; for(int k=0;k<10;k++) if(texture(V,vec2((float(k)*64.+32.)/1280.,1120./1128.)).r>.5) f+=1<<k;
 has=vec3(0); mat3 H[3]; for(int b=0;b<3;b++){ vec4 u=texelFetch(Q,ivec2(b*2,f),0),w=texelFetch(Q,ivec2(b*2+1,f),0); if(u.z>0.){ has[b]=1.; H[b]=inv(u.xy,u.zw,w.xy,w.zw); vec2 c=(u.xy+u.zw+w.xy+w.zw)/4.; if((H[b]*vec3(c,1)).z<0.) H[b]=-H[b]; } else H[b]=mat3(1.); } H0=H[0];H1=H[1];H2=H[2]; }`;
const FS=`#version 300 es
precision highp float; in vec2 p; flat in mat3 H0; flat in mat3 H1; flat in mat3 H2; flat in vec3 has; uniform sampler2D V,A0,A1,A2,B0,B1,B2; uniform vec3 hot; uniform float mx; out vec4 o;
vec3 pic(vec2 x){ return texture(V,vec2(clamp(x.x,.5,1279.5)/1280.,clamp(x.y,.5,719.)/1128.)).rgb; }
void one(inout vec3 c,vec3 sh,float m,mat3 H,sampler2D A,sampler2D B,float h){ vec3 q=H*vec3(p,1); vec2 u=q.xy/q.z; float e=smoothstep(.0,.012,u.x); u=clamp(u,.004,.996); vec2 gx=dFdx(u),gy=dFdy(u); vec3 t=mix(textureGrad(A,u,gx,gy).rgb,textureGrad(B,u,gx,gy).rgb,mx); float g=1.-.2*exp(-pow((u.x-.05)/.02,2.))*e; c=mix(c,min(t*min(sh,vec3(1.12))*g*(1.+.22*h),1.),m); }
float mt(int k){ vec2 x=(p-vec2(400.,180.))/vec2(540.,500.); if(x.x<0.||x.x>1.||x.y<0.||x.y>1.) return 0.; return smoothstep(.06,.92,texture(V,vec2((float(k)*424.+clamp(x.x*424.,1.,423.))/1280.,(720.+clamp(x.y*392.,1.5,391.))/1128.)).r); }
void main(){ vec3 c=pic(p); vec3 s=(c*2.+pic(p+vec2(1.6,0))+pic(p-vec2(1.6,0))+pic(p+vec2(0,1.6))+pic(p-vec2(0,1.6)))/6./.745; s*=pow(clamp(dot(s,vec3(.3333)),.05,2.),-.4)*.95;
 if(has.x>0.) one(c,s,mt(0),H0,A0,B0,hot.x); if(has.y>0.) one(c,s,mt(1),H1,A1,B1,hot.y); if(has.z>0.) one(c,s,mt(2),H2,A2,B2,hot.z); o=vec4(c,1); }`;
function glInit(){ if(G!==null||reduce) return G; G=false; try{
  const g=cvs.getContext('webgl2',{alpha:false,antialias:false,preserveDrawingBuffer:true}); if(!g) return G;
  const sh=(t,x)=>{ const o=g.createShader(t); g.shaderSource(o,x); g.compileShader(o); if(!g.getShaderParameter(o,g.COMPILE_STATUS)) throw g.getShaderInfoLog(o); return o; };
  const pr=g.createProgram(); g.attachShader(pr,sh(g.VERTEX_SHADER,VS)); g.attachShader(pr,sh(g.FRAGMENT_SHADER,FS)); g.linkProgram(pr); if(!g.getProgramParameter(pr,g.LINK_STATUS)) throw g.getProgramInfoLog(pr); g.useProgram(pr);
  const U=n=>g.getUniformLocation(pr,n), tex=(i,mip)=>{ const t=g.createTexture(); g.activeTexture(g.TEXTURE0+i); g.bindTexture(g.TEXTURE_2D,t); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,mip||g.LINEAR); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,mip===g.NEAREST?g.NEAREST:g.LINEAR); return t; };
  g.bindVertexArray(g.createVertexArray()); tex(0); tex(1,g.NEAREST); const an=g.getExtension('EXT_texture_filter_anisotropic');
  for(let i=2;i<8;i++){ tex(i,g.LINEAR_MIPMAP_LINEAR); if(an) g.texParameterf(g.TEXTURE_2D,an.TEXTURE_MAX_ANISOTROPY_EXT,8); g.texImage2D(g.TEXTURE_2D,0,g.RGBA,1,1,0,g.RGBA,g.UNSIGNED_BYTE,new Uint8Array([120,118,112,255])); g.generateMipmap(g.TEXTURE_2D); }
  ['V','Q','A0','A1','A2','B0','B1','B2'].forEach((n,i)=>g.uniform1i(U(n),i));
  G={g,S:U('S'),hot:U('hot'),mx:U('mx'),q:false,v:false,pend:null};
  G.pend=fetch('biblio/quads.bin').then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }).then(b=>{ const s=new Int16Array(b), f=new Float32Array(s.length); for(let i=0;i<s.length;i++) f[i]=s[i]/8; g.activeTexture(g.TEXTURE1); g.texImage2D(g.TEXTURE_2D,0,g.RGBA32F,6,s.length/24,0,g.RGBA,g.FLOAT,f); G.q=true; }).catch(()=>{ G=false; });
  cvs.addEventListener('webglcontextlost',e=>{ e.preventDefault(); G=false; cvs.style.opacity=0; });
 }catch(e){ G=false; } if(G) place(); return G; }
/* a cover as a 2:3 sheet: filled, or whole on a blurred echo of itself */
async function sheet(a){ const im=await load('img/c/'+a+'.webp'), c=document.createElement('canvas'); c.width=512; c.height=768; const x=c.getContext('2d'); x.fillStyle='#777'; x.fillRect(0,0,512,768); if(!im) return c; const w=im.naturalWidth,h=im.naturalHeight;
  if(BOOKS[a][1]<.86){ x.drawImage(im,0,0,512,768); return c; }
  /* a square cover: plain cloth above and below, in the cover's own colours */
  const av=(sy)=>{ const q=document.createElement('canvas'); q.width=q.height=8; const z=q.getContext('2d'); z.drawImage(im,0,sy,w,h*.06,0,0,8,8); const d=z.getImageData(0,0,8,8).data; let r=[0,0,0]; for(let i=0;i<256;i+=4) for(let j=0;j<3;j++) r[j]+=d[i+j]/64; return 'rgb('+r.map(Math.round)+')'; };
  x.fillStyle=av(0); x.fillRect(0,0,512,384); x.fillStyle=av(h*.94); x.fillRect(0,384,512,384); const H=Math.min(768,512/w*h*1.22); x.drawImage(im,0,(768-H)/2,512,H); return c; }
async function dress(list,unit){ const c=await Promise.all(list.map(sheet)); if(!G) return; const g=G.g; c.forEach((x,i)=>{ g.activeTexture(g.TEXTURE0+unit+i); g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,x); g.generateMipmap(g.TEXTURE_2D); }); }
let face=0; /* which set of covers he shows: 0 or 1 */
async function cover3(list){ face=1-face; await dress(list,face?5:2); }
function draw(fresh){ if(!G||!G.q||!(fresh||G.v)) return; const g=G.g; if(fresh){ g.activeTexture(g.TEXTURE0); try{ g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,vs); }catch(e){ return; } G.v=true; }
  g.viewport(0,0,cvs.width,cvs.height); g.uniform2f(G.S,cvs.width,cvs.height); g.uniform3f(G.hot,hot[0],hot[1],hot[2]); g.uniform1f(G.mx,mixv); g.drawArrays(g.TRIANGLES,0,3); }
function glOn(fast){ cvs.style.transitionDuration=fast?'0s':''; cvs.style.opacity=1; lit=1; }
function glOff(){ if(!lit) return; lit=0; cvs.style.transitionDuration=''; cvs.style.opacity=0; }
/* the walk to the shelf is made ready while he still reacts: its first frame (the seated pose) is drawn on the hidden canvas */
const UP=.17; /* he sits quite still for the first frames of that film: it is taken up from here */
function prime(){ if(!G||reduce) return; Promise.all([G.pend,grab('f1s')]).then(q=>{ const url=q[1]; if(!G||lit||!vs.paused||(vs.src===url&&Math.abs(vs.currentTime-UP)<.03&&vs.readyState>1)) return; vs.src=url; vs.onloadeddata=()=>{ vs.onloadeddata=null; vs.onseeked=()=>{ vs.onseeked=null; if(!lit&&vs.paused) draw(true); }; vs.currentTime=UP; }; }).catch(()=>{}); }
/* plays a film with books on the canvas; end() on its last frame */
async function playG(n,end,o){ o=o||{}; const t=++token; cancelAnimationFrame(watch); let url; const bad=()=>{ if(t===token){ still(); end(); } };
  try{ await G.pend; url=await grab(n); }catch(e){ return bad(); } if(t!==token||!G) return bad();
  /* join: the film is already waiting on its first frame, which is the pose the reaction has just come back to */
  const join=o.join&&!lit&&vs.src===url&&vs.readyState>1&&vs.paused&&Math.abs(vs.currentTime-UP)<.03; let first=true;
  if(join){ draw(true); cvs.style.transitionDuration='.1s'; cvs.style.opacity=1; lit=1; first=false; setTimeout(()=>{ if(lit) vids.forEach(v=>v.pause()); },130); } else { vs.onloadeddata=vs.onseeked=null; vs.pause(); vs.src=url; }
  vs.playbackRate=o.rate||1; try{ await vs.play(); }catch(e){ return bad(); } if(t!==token) return; vs.playbackRate=o.rate||1; now='';
  let last=-1; const w=()=>{ if(t!==token) return; if(vs.currentTime!==last&&vs.readyState>1){ last=vs.currentTime; draw(true); if(first&&last>0){ first=false; glOn(lit); setTimeout(()=>{ if(lit) vids.forEach(v=>v.pause()); },300); } }
    if(vs.ended||(vs.duration&&vs.duration-vs.currentTime<.03)){ vs.pause(); draw(true); end&&end(); return; } watch=requestAnimationFrame(w); }; w(); }
/* straight to the last frame */
async function stillG(){ const t=++token; cancelAnimationFrame(watch); try{ await G.pend; const url=await grab('f1s'); if(t!==token||!G) return; vs.pause(); vs.onloadeddata=vs.onseeked=null; if(vs.src!==url) vs.src=url; await new Promise((ok,no)=>{ const go=()=>{ vs.currentTime=Math.max(0,vs.duration-.05); }; vs.onseeked=ok; vs.onerror=no; vs.readyState>0?go():vs.onloadedmetadata=go; setTimeout(no,4000); }); vs.onseeked=vs.onloadedmetadata=vs.onerror=null; if(t!==token) return; await new Promise(r=>setTimeout(r,60)); draw(true); glOn(); return true; }catch(e){ return false; } }
/* lamp dust: a breath of gold over the books while something changes under it */
function dust(ms,mid){ const c=document.createElement('canvas'), r=film.getBoundingClientRect(), k=Math.min(devicePixelRatio||1,1.5); c.className='dust'; c.width=r.width*k; c.height=r.height*k; film.appendChild(c); const g=c.getContext('2d'); g.scale(k,k); const s=Math.max(r.width/1280,r.height/720), X=x=>(x-640)*s+r.width/2, Y=y=>(y-360)*s+r.height/2;
  const P=Array.from({length:150},()=>({x:500+Math.random()*250,y:380+Math.random()*250,a:Math.random()*6.3,v:20+Math.random()*70,r:.7+Math.random()*1.9,d:Math.random()*.35,t:Math.random()<.22})), t0=performance.now(); let done=false;
  const f=now=>{ const t=Math.max(0,(now-t0)/ms); g.clearRect(0,0,r.width,r.height); if(t>.42&&!done){ done=true; mid(); } if(t>=1||!open){ c.remove(); if(!done){ done=true; mid(); } return; } const e=Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(1,t))),1.3); g.globalCompositeOperation='lighter';
    const R=250*s, gx=g.createRadialGradient(X(622),Y(505),0,X(622),Y(505),R); gx.addColorStop(0,`rgba(255,214,140,${.62*e})`); gx.addColorStop(.55,`rgba(255,190,100,${.28*e})`); gx.addColorStop(1,'rgba(255,190,100,0)'); g.fillStyle=gx; g.fillRect(X(622)-R,Y(505)-R,2*R,2*R);
    for(const q of P){ const u=(t-q.d)/(1-q.d); if(u<0||u>1) continue; g.globalAlpha=Math.sin(Math.PI*u)*.95; g.fillStyle=q.t?'#BFF6EF':'#FFE2A8'; g.beginPath(); g.arc(X(q.x+Math.cos(q.a+u*3)*q.v*u),Y(q.y+Math.sin(q.a)*q.v*.5*u-95*u*u),q.r*s*1.3,0,7); g.fill(); } g.globalAlpha=1; g.globalCompositeOperation='source-over'; requestAnimationFrame(f); }; requestAnimationFrame(f); }

/* ---------- talk ---------- */
function speak(t,who){ say.textContent=''; if(who){ const s=document.createElement('small'); s.textContent=who; say.appendChild(s); }
  t.split(' ').forEach((w,i)=>{ const s=document.createElement('span'); s.textContent=w+' '; s.style.animationDelay=(i*.055)+'s'; say.appendChild(s); }); }
const slip=(t,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='sl'; b.textContent=t; b.style.setProperty('--r',[-.7,.5,-.3,.8,-.5,.35][i%6]+'deg'); b.style.setProperty('--d',(.12+i*.045)+'s'); return b; };
function ask(step,push){ const r=++run; busy=false; if(push!==false) hist.push(step); back.hidden=hist.length<2; hideBooks(); film.style.backgroundImage=`url(${PIC('rest')})`;
  if(!reduce&&step.a.some(a=>a[3].books)){ glInit(); grab(G?'f1s':'f1').catch(()=>{}); }
  speak(step.say); ans.className='ans'; ans.textContent='';
  step.a.forEach((a,i)=>{ const b=slip(a[0],i); b.onclick=()=>pick(a,b,r); ans.appendChild(b); }); ans.scrollTop=0; focusFirst(); }
function focusFirst(){ const b=ans.querySelector('.sl'); if(b&&kb) b.focus({preventScroll:true}); }
let kb=false; addEventListener('keydown',()=>kb=true,true); addEventListener('pointerdown',()=>kb=false,true);
function pick(a,b,r){ if(busy||r!==run) return; busy=true; b.classList.add('picked'); ans.classList.add('gone'); if(kb) x.focus({preventScroll:true});
  const next=typeof a[3]==='function'?a[3]():a[3], go=++run; speak(a[1]);
  if(next.books&&!reduce){ glInit(); grab(G?'f1s':'f1').catch(()=>{}); prime(); }
  const cont=()=>{ if(go!==run||!open) return; next.books?fetchBooks(next.books):ask(next); };
  if(reduce){ setTimeout(cont,1400); return; }
  if(next.books){ dressFor(next.books); setTimeout(()=>{ if(go===run&&open) skipSlip(()=>{ if(go===run) fetchBooks(next.books,true); }); },1200); }
  /* the next question arrives while he is still reacting; he goes back to waiting when the film ends */
  const T=performance.now(), react=async()=>{ if(go!==run||!open) return; if(!next.books) setTimeout(cont,2900); const tk=token;
    const film1=take(a[2]); if(!await soon(film1,600)){ if(go!==run||!open) return; if(next.books) setTimeout(cont,900); else if(tk===token) idle(); return; }
    if(go!==run||!open||tk!==token) return; play(film1,next.books?cont:idle,next.books?{at:.25,rest:REST[film1]||REST0,home:HOME[film1]||3.1}:{at:.25,tail:.27}); };
  settle(react); }
function goBack(){ if(!busy&&hist.length<2) return; run++; if(!busy) hist.pop(); const s=hist.pop(); ask(s); if(reduce) return; const v=vids[cur];
  if(!now||v.paused||v.ended||!v.classList.contains('on')) idle(); else if(now[0]!=='n') settle(idle); }

/* ---------- the three books ---------- */
let odd=0,list=[],at=0,covered=null,dr=0,trips=0,swaps=0;
function dressFor(books){ if(list.src===books&&dr) return; list=books.slice(0); list.src=books; at=0; odd=0; covered=null; glInit(); const L=list; dr=G?cover3(three()).then(()=>{ mixv=face; covered=L; }):0; }
function skipSlip(f){ let sk=ans.querySelector('.skip'); if(!sk){ ans.className='ans'; ans.textContent=''; sk=slip('Show me now',0); sk.classList.add('quiet','skip'); sk.style.setProperty('--r','0deg'); sk.style.setProperty('--d','0s'); ans.appendChild(sk); } sk.onclick=f; return sk; }
function fetchBooks(books,now_){ if(list.src!==books||at) dr=0; dressFor(books); list.src=null; const d0=dr; dr=0; const r=++run; back.hidden=true; if(!now_) speak('One moment. I know exactly where they are.');
  const done=()=>{ if(r!==run||!open) return; showBooks(); };
  const go=async()=>{ if(r!==run) return; sk.disabled=true; if(G&&ready.f1s&&covered===list){ mixv=face; if(!await stillG()) still(); } else still(); if(r===run) done(); };
  const sk=skipSlip(go); if(now_){ freeze(); go(); return; }
  if(reduce){ setTimeout(()=>{ still(); done(); },900); return; }
  const rt=trips++?1.6:1.25;
  settle(async()=>{ if(r!==run) return; if(!G){ if(!await soon('f1',2500)){ if(r===run){ still(); done(); } return; } if(r!==run) return; play('f1',()=>{ hold(); done(); }); return; }
    Promise.all([d0,G.pend,soon('f1s',2500)]).then(q=>{ if(r!==run) return; if(!G){ play('f1',()=>{ hold(); done(); }); return; } if(!q[2]){ still(); done(); return; } playG('f1s',done,{rate:rt,join:true}); }); }); }
/* stop on the last frame, over the matching picture */
function hold(){ film.style.backgroundImage=`url(${PIC('books')})`; }
function still(){ freeze(); hold(); glOff(); vids.forEach(v=>{ v.classList.remove('on'); v.pause(); }); }
function three(){ const o=[]; for(let i=0;i<3&&i<list.length;i++) o.push(list[(at+i)%list.length]); return o; }
function more(){ /* other ideas: the rest of this answer first, then neighbours from the same kind of shelf */
  const kind=BOOKS[list[0]][2]; Object.keys(BOOKS).filter(a=>BOOKS[a][2]===kind&&!list.includes(a)).forEach(a=>list.push(a));
  if(list.length<4) odd=list.length, ['B0HLXW4ZT4','B0HJP23HK1',"B0HJNY3BCS",'B0HMP7CCSG','B0HCDY6VGQ','B0HPBTQT7K'].forEach(a=>list.length<6&&!list.includes(a)&&list.push(a)); }
function showBooks(){ const r=++run; busy=false; const t=three(); back.hidden=false; back.onclick=backToLast;
  t.forEach((a,i)=>{ const b=bks[i], src='img/c/'+a+'.webp', asp=BOOKS[a][1]; b.style.backgroundImage=`url(${src})`; b.classList.toggle('fill',asp<.72); b.querySelector('img').src=src; b.classList.toggle('gl',!!(G&&lit)); b.classList.add('on'); b.onmouseenter=()=>heat(i,1); b.onmouseleave=()=>heat(i,0); b.onclick=()=>PAGE[a]?g.children[i].click():window.open(AZ(a),'_blank','noopener'); b.style.transitionDelay=(i*.22)+'s'; });
  speak(odd&&at>=odd?'I have no more of that kind. Perhaps something quite different?':at?'Perhaps one of these, then?':'Here we are. I think one of these is yours.'); ans.className='ans'; ans.textContent='';
  const g=document.createElement('div'); g.className='three';
  t.forEach((a,i)=>{ const l=document.createElement('a'); l.className='sl'; l.href=AZ(a); if(!PAGE[a]){ l.target='_blank'; l.rel='noopener'; } l.style.setProperty('--d',(.2+i*.12)+'s'); l.style.setProperty('--r',[-.5,.3,-.2][i]+'deg'); const im=document.createElement('img'); im.src='img/c/'+a+'.webp'; im.alt=''; im.width=60; im.height=90; const tx=document.createElement('div'); tx.append(BOOKS[a][0]); const s=document.createElement('span'); s.textContent=(NOTE[a]?NOTE[a]+'. ':'')+(PAGE[a]?'Look inside':'See it on Amazon'); tx.appendChild(s); l.append(im,tx);
    l.addEventListener('click',()=>{ if(PAGE[a]) leaveMark(); });
    l.onmouseenter=l.onfocus=()=>{ bks[i].classList.add('hl'); heat(i,1); }; l.onmouseleave=l.onblur=()=>{ bks[i].classList.remove('hl'); heat(i,0); }; g.appendChild(l); });
  const row=document.createElement('div'); row.className='row';
  const mk=(t,f)=>{ const b=slip(t,0); b.classList.add('quiet'); b.style.setProperty('--r','0deg'); b.style.setProperty('--d','.7s'); b.onclick=()=>r===run&&f(); row.appendChild(b); };
  mk('Show me three others',others); mk('Not quite right, start again',again); const nf=document.querySelector('form.news'); if(nf) mk('Write to me when there is a new book',()=>{ close(); setTimeout(()=>{ nf.scrollIntoView({block:'center'}); nf.querySelector('[type=email]').focus({preventScroll:true}); },700); }); mk('Thank you, Mr. Madi',bye); later(['bye']);
  ans.append(g,row); ans.scrollTop=0; focusFirst(); }
function heat(i,v){ if(!G||!lit) return; hot[i]=v; if(heat.f) return; const c=heat.c||(heat.c=[0,0,0]), T=hot; const st=()=>{ let go=false; T.forEach((x,j)=>{ c[j]+=(x-c[j])*.2; if(Math.abs(x-c[j])>.01) go=true; else c[j]=x; }); const k=hot; hot=c; draw(); hot=k; heat.f=go?requestAnimationFrame(st):0; }; heat.f=requestAnimationFrame(st); }
function hideBooks(){ hot[0]=hot[1]=hot[2]=0; if(heat.c) heat.c.fill(0); bks.forEach(b=>{ b.style.transitionDelay='0s'; b.classList.remove('on','hl'); }); back.onclick=goBack; }
function others(){ const r=++run, quick=swaps++>0; if(list.length<=at+3) more(); at+=3; if(at>=list.length) at=0; hideBooks(); back.hidden=true; speak('No? Let me look again.'); ans.classList.add('gone');
  const put=()=>{ if(r!==run) return; showBooks(); };
  if(reduce){ setTimeout(put,700); return; }
  /* he gathers the books to his chest, then stands three others in their place */
  const puff=()=>{ if(r===run) dust(1100,put); };
  if(G&&lit){ const nx=cover3(three()); setTimeout(async()=>{ const ok=(await Promise.all([soon('f4s',600),soon('f5s',600)])).every(Boolean); if(r!==run) return; if(!ok){ dust(1100,()=>{ if(r===run){ still(); put(); } }); return; } playG('f4s',async()=>{ await nx; if(r!==run) return; const to=face, fr=mixv;
      dust(1100,()=>{ const t0=performance.now(); const m=n=>{ if(r!==run) return; const u=Math.min(1,(n-t0)/260); mixv=fr+(to-fr)*u; draw(); if(u<1) requestAnimationFrame(m); else playG('f5s',put,{rate:quick?2:1.35}); }; requestAnimationFrame(m); }); },{rate:quick?2.3:1.55}); },quick?60:300); return; }
  if(G){ puff(); return; }
  Promise.all([soon('f4',600),soon('f5',600)]).then(q=>{ if(r!==run) return; if(!q.every(Boolean)){ puff(); return; } play('f4',()=>{ if(r!==run) return; playPart(put); },{rate:1.7}); }); }
function playPart(done){ const v=vids[cur]; play('f5',()=>{ hold(); done(); },{rate:1.5}); }
function again(){ hist=[]; toQuestion(START(),'Of course. Let us begin again.'); }
/* he waves and bows before the window closes; the X and Escape close at once, and so does a film that is not here yet */
function bye(){ if(reduce||!ready.bye){ close(); return; } const r=++run; hideBooks(); back.hidden=true; ans.classList.add('gone'); speak('A pleasure, as always. Happy reading.');
  dust(900,()=>{ if(r!==run) return; film.style.backgroundImage=`url(${PIC('rest')})`; glOff(); const end=()=>{ if(r===run) close(); }; play('bye',end,{at:.7,rate:1.15,tail:2.6}); setTimeout(end,6500); }); }
function backToLast(){ const s=hist.pop(); s?toQuestion(s,'Of course. Let us look at that again.'):again(); }
function toQuestion(step,line){ const r=++run; hideBooks(); back.hidden=true; speak(line); ans.classList.add('gone');
  const go=()=>{ if(r!==run||!open) return; ask(step); };
  if(reduce){ setTimeout(go,700); return; }
  if(G&&lit){ soon('f4s',600).then(ok=>{ if(r!==run) return; if(!ok) throw 0; playG('f4s',()=>{ if(r!==run) return; dust(1300,()=>{ if(r!==run) return; idle(); setTimeout(go,700); }); },{rate:1.7}); }).catch(()=>{ if(r!==run) return; dust(1100,()=>{ if(r!==run) return; glOff(); film.style.backgroundImage=`url(${PIC('rest')})`; idle(); setTimeout(go,500); }); }); return; }
  soon('f4',600).then(ok=>{ if(r!==run) return; if(!ok||G){ dust(1100,()=>{ if(r!==run) return; film.style.backgroundImage=`url(${PIC('rest')})`; idle(); setTimeout(go,500); }); return; } play('f4',idle,{rate:1.6}); setTimeout(go,3600); }); }

/* ---------- the genie: the window is poured out of Madi, strip by strip ---------- */
function lamp(){ const m=document.querySelector('.madi .m3')||document.querySelector('div.madi,a.madi'); let r=m&&m.getBoundingClientRect(); const vis=r&&r.width&&r.bottom>20&&r.top<innerHeight-10;
  if(!vis&&from&&from.isConnected) r=from.getBoundingClientRect(); if(!r||!r.width) r={left:innerWidth-90,top:innerHeight-120,width:60,height:80};
  return {x:r.left+r.width/2,y:Math.max(6,Math.min(innerHeight-6,r.top+r.height*.45))}; }
function snapshot(r){ const k=Math.min(devicePixelRatio||1,1.5), c=document.createElement('canvas'); c.width=r.w*k; c.height=r.h*k; const g=c.getContext('2d'); g.scale(k,k);
  if(r.w<innerWidth){ g.beginPath(); g.roundRect(0,0,r.w,r.h,14); g.clip(); }
  g.fillStyle='#1B0F07'; g.fillRect(0,0,r.w,r.h);
  const fw=r.fw||r.w, cover=(im,w,h)=>{ const s=Math.max(fw/w,r.f/h); g.save(); g.beginPath(); g.rect(0,0,fw,r.f); g.clip(); g.drawImage(im,(fw-w*s)/2,(r.f-h*s)/2,w*s,h*s); g.restore(); };
  try{ if(imgRest&&imgRest.naturalWidth) cover(imgRest,imgRest.naturalWidth,imgRest.naturalHeight); }catch(e){}
  if(open&&lit){ try{ g.drawImage(cvs,0,0,fw,r.f); }catch(e){} } else if(open&&!reduce){ const v=vids[cur]; try{ if(v.classList.contains('on')&&v.readyState>1) cover(v,v.videoWidth,v.videoHeight); }catch(e){} }
  const l=g.createLinearGradient(0,r.f,0,r.h); l.addColorStop(0,'#180C05'); l.addColorStop(.15,'#341D0D'); l.addColorStop(1,'#25140A'); if(r.fw){ g.fillStyle='#2b180c'; g.fillRect(fw,0,r.w-fw,r.h); } else { g.fillStyle=l; g.fillRect(0,r.f,r.w,r.h-r.f); } return c; }
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2, cl=t=>Math.max(0,Math.min(1,t));
function genie(out){ return new Promise(res=>{ const r=place(), m=lamp(), img=snapshot(r), cv=document.createElement('canvas'), k=Math.min(devicePixelRatio||1,1.5); cv.className='lib-cv'; cv.width=innerWidth*k; cv.height=innerHeight*k; document.body.appendChild(cv); const g=cv.getContext('2d'); g.scale(k,k);
  const up=m.y<r.t+r.h*.5, N=Math.ceil(r.h/3), D=out?1050:780, t0=performance.now(), sh=img.height/N;
  const sparks=Array.from({length:46},()=>({a:Math.random(),s:Math.random()*6.28,r:.8+Math.random()*1.8,o:(Math.random()-.5)*2}));
  if(!out) requestAnimationFrame(()=>{ dlg.close(); });
  const f=now=>{ const t=cl((now-t0)/D), p=out?1-t:t; /* p=1: all inside the lamp */
    g.clearRect(0,0,innerWidth,innerHeight); let mid=[];
    const row=v=>{ const u=up?v:1-v; /* the edge nearest to Madi goes first */
      const qx=ease(cl(p*1.75-u*.35-0)), qy=ease(cl(p*1.95-u*.95));
      const sway=Math.sin(u*5+p*7)*18*Math.sin(Math.PI*p)*qx; const l=r.l+(m.x-3-r.l)*qx, rr=r.l+r.w+(m.x+3-r.l-r.w)*qx; return {y:r.t+v*r.h+(m.y-r.t-v*r.h)*qy,l:l+sway*(1-qy),r:rr+sway*(1-qy),q:qy}; };
    let a=row(0); for(let i=0;i<N;i++){ const b=row((i+1)/N); const w=Math.max(1,(a.r-a.l)), h=b.y-a.y; if(Math.abs(h)>.02&&a.q<.999){ g.globalAlpha=1-Math.pow(a.q,6); g.drawImage(img,0,i*sh,img.width,sh,a.l,Math.min(a.y,b.y)-.4,w,Math.abs(h)+1); } if(i%12===0) mid.push(a); a=b; }
    g.globalCompositeOperation='lighter'; const gl=Math.sin(Math.PI*cl(p*1.02));
    if(gl>.01){ const R=46+50*gl, rg=g.createRadialGradient(m.x,m.y,0,m.x,m.y,R); rg.addColorStop(0,`rgba(255,214,140,${.6*gl})`); rg.addColorStop(.5,`rgba(127,227,218,${.22*gl})`); rg.addColorStop(1,'rgba(127,227,218,0)'); g.globalAlpha=1; g.fillStyle=rg; g.fillRect(m.x-R,m.y-R,2*R,2*R);
      for(const s of sparks){ const e=mid[Math.floor(s.a*mid.length)]; if(!e) continue; const x=(s.o<0?e.l:e.r)+Math.sin(s.s+t*9)*14, y=e.y+Math.cos(s.s+t*7)*10; g.globalAlpha=gl*(.35+.65*Math.abs(Math.sin(s.s+t*8))); g.fillStyle=s.o<0?'#FFE2A8':'#BFF6EF'; g.beginPath(); g.arc(x,y,s.r,0,7); g.fill(); } }
    g.globalCompositeOperation='source-over'; g.globalAlpha=1;
    if(t<1) requestAnimationFrame(f); else res(()=>cv.remove()); };
  requestAnimationFrame(f); }); }
const load=u=>new Promise(r=>{ const i=new Image(); i.onload=()=>i.decode?i.decode().then(()=>r(i),()=>r(i)):r(i); i.onerror=()=>r(null); i.src=u; });

let anim=false, quit=false;
addEventListener('keydown',e=>{ if(e.key==='Escape'&&anim&&!open) quit=true; },true);
/* after “Look inside” and Back, the three books are still on the counter */
const BACK=(()=>{ try{ if(top!==self||(performance.getEntriesByType('navigation')[0]||{}).type!=='back_forward') return null; const s=history.state; if(!s||!s.lib) return null; const l=s.lib; const c={...s}; delete c.lib; history.replaceState(c,''); return l; }catch(e){ return null; } })();
addEventListener('pageshow',e=>{ if(e.persisted) try{ const s=history.state; if(s&&s.lib){ const c={...s}; delete c.lib; history.replaceState(c,''); } }catch(_){ } });
function leaveMark(){ try{ const h=top.history; h.replaceState({...(h.state||{}),lib:{b:list.slice(0),at,odd}},''); }catch(e){} }
async function call(el,kept){ if(open||anim) return; anim=true; quit=false; from=el||null; if(!dlg) build(); document.documentElement.classList.add('lib-on'); dim.classList.add('on');
  hist=[]; run++; ans.textContent=''; say.textContent=''; back.hidden=true; hideBooks(); now=''; lit=0; cvs.style.transitionDuration='0s'; cvs.style.opacity=0; vids.forEach(v=>{ v.classList.remove('on'); v.pause(); }); film.style.backgroundImage=`url(${PIC('rest')})`;
  /* how fast did the pictures of this page come? */
  if(!thin) try{ const v=performance.getEntriesByType('resource').filter(e=>e.transferSize>60000&&e.responseEnd>e.responseStart).map(e=>e.transferSize*8/(e.responseEnd-e.responseStart)); if(v.length&&Math.max(...v)<3000) thin=true; }catch(e){}
  if(!reduce){ grab('s1').catch(()=>{}); }
  imgRest=await Promise.race([load(PIC('rest')),new Promise(r=>setTimeout(()=>r(null),2500))]);
  if(!reduce){ const done=await genie(true); open=true; place(); dlg.showModal(); requestAnimationFrame(()=>requestAnimationFrame(done)); } else { open=true; place(); dlg.showModal(); }
  x.focus({preventScroll:true}); if(!kb) x.blur(); anim=false; if(quit){ close(); return; }
  if(kept){ const r=++run; list=kept.b; list.src=null; at=kept.at; odd=kept.odd||0; covered=null; trips++; glInit(); if(!reduce&&G){ await cover3(three()); mixv=face; } if(r!==run||!open) return; if(!reduce&&G){ grab('f1s').catch(()=>{}); if(!await soon('f1s',4000)||!await stillG()) still(); } else still(); if(r===run&&open) showBooks(); if(!reduce) later([peek('n'),'n1','f4s','f5s']); return; }
  const r=run; speak('Come in, come in. I am Mr. Madi.');
  if(!reduce){ play('s1',idle); glInit(); const q=k=>peek(k); later(G?[q('n'),q('r3'),q('r1'),q('r4'),q('r2'),'n1','n2','n1r','n3','n2r','n3r','n4','n4r','f1s','f4s','f5s']:[q('n'),q('r3'),q('r1'),q('r4'),q('r2'),'n1','n2','n3','f1','f4','f5']); }
  setTimeout(()=>{ if(r===run&&open) ask(START()); },reduce?900:2600); }
async function close(){ if(!open||anim) return; anim=true; run++; freeze();
  if(!reduce){ const g=genie(false); dim.classList.remove('on'); (await g)(); } else { dlg.close(); dim.classList.remove('on'); }
  vs.pause(); vids.forEach(v=>{ v.pause(); v.classList.remove('on'); }); open=false; anim=false; document.documentElement.classList.remove('lib-on'); if(from&&from.focus&&kb) from.focus({preventScroll:true}); }

/* ---------- who calls him ---------- */
addEventListener('click',e=>{ if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return; const t=e.target.closest&&e.target.closest('div.madi,a.madi,.rb.saffron,a[href$="#finder"]'); if(!t||t.closest('.lib')) return; e.preventDefault(); e.stopImmediatePropagation(); call(t); },true);
const md=()=>{ const m=document.querySelector('div.madi'); if(m&&!m.hasAttribute('tabindex')){ m.tabIndex=0; m.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); call(m); } }); } };
md(); if(BACK&&Array.isArray(BACK.b)&&BACK.b.length&&BACK.b.every(a=>BOOKS[a])) addEventListener('load',()=>setTimeout(()=>call(null,BACK),500)); else if(location.hash==='#finder') addEventListener('load',()=>setTimeout(()=>call(null),700));
addEventListener('pagehide',e=>{ if(e.persisted) return; Object.values(blobs).forEach(p=>p.then(URL.revokeObjectURL,()=>{})); [...vids,vs].forEach(v=>v&&v.removeAttribute('src')); });
window.LIB={call,close};
})();
