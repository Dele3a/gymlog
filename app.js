/* GYMLOG V4 — training insights and body check-ins. Local-first PWA. */
(function(){
'use strict';
const $=id=>document.getElementById(id), KEY='gymlog_pwa_v1', ROUTINE='gymlog_routine_v3', LIB='gymlog_library_v3';
const defaults=[
{name:'PUSH + TRICEPS',items:[['Flat Bench Press',3,6,10,[[22.5,10],[25,10],[25,10]],'Chest','Barbell'],['Incline Bench Press',3,8,12,[[15,10],[15,10],[17.5,10]],'Chest','Dumbbell'],['Seated Chest Press Machine',3,10,12,[[20,12],[25,10],[30,10]],'Chest','Machine'],['Cable Lateral Raise',3,12,15,[[9,10],[9,10],[9,10]],'Shoulders','Cable'],['Straight-Bar Triceps Pushdown',3,10,12,[[39,10],[41,10],[41,8]],'Triceps','Cable'],['Overhead Cable Triceps Extension',3,10,15,[[23,10],[23,9],[23,8]],'Triceps','Cable']]},
{name:'PULL + BICEPS',items:[['Lat Pulldown',3,8,12,[[59,10],[59,10],[61.3,10]],'Back','Machine'],['Diverging Seated Row',3,8,12,[[32,10],[32,10],[32,10]],'Back','Machine'],['Seated Low Row',2,10,12,[[39,10],[39,12]],'Back','Cable'],['Reverse Butterfly',2,12,15,[[32,10],[32,10]],'Shoulders','Machine'],['Seated Back Dumbbell Raise',3,10,10,[[14,10],[14,10],[16,10]],'Shoulders','Dumbbell'],['Incline Dumbbell Biceps Curl',3,8,12,[[10,10],[10,10],[10,10]],'Biceps','Dumbbell'],['Straight-Bar Cable Curl',2,10,12,[[27,10],[27,10]],'Biceps','Cable'],['Hammer Curl',2,10,12,[[27,10],[27,10]],'Biceps','Dumbbell']]},
{name:'LOWER BODY A',items:[['Barbell Squat',3,6,10,[],'Quadriceps','Barbell'],['Leg Press',3,10,12,[],'Quadriceps','Machine'],['Leg Extension',3,12,15,[],'Quadriceps','Machine'],['Seated Leg Curl',2,10,15,[],'Hamstrings','Machine'],['Standing Calf Raise',3,12,15,[],'Calves','Machine'],['Cable Crunch',3,12,15,[],'Core','Cable']]},
{name:'REST',rest:true,items:[]},
{name:'CHEST + BACK',items:[['Incline Chest Press Machine',3,8,12,[[15,10],[20,10],[20,10]],'Chest','Machine'],['Butterfly Chest / Pec Deck',3,12,15,[[45,10],[52,10],[54.3,10]],'Chest','Machine'],['Neutral-Grip Lat Pulldown',3,10,12,[[52,10],[59,10],[59,10]],'Back','Machine'],['Divergent Seated Row',3,8,12,[[32,10],[32,10],[32,10]],'Back','Machine'],['Straight-Arm Cable Pulldown',2,12,15,[[18,12],[18,12]],'Back','Cable'],['Cable Chest Fly',2,12,15,[],'Chest','Cable']]},
{name:'ARMS + SHOULDERS',items:[['Seated Shoulder Press',3,8,12,[[18,10],[18,10],[18,10]],'Shoulders','Machine'],['Cable Lateral Raise',3,12,15,[[9,10],[9,10],[9,10]],'Shoulders','Cable'],['Reverse Butterfly',3,12,15,[[25,10],[32,10],[32,10]],'Shoulders','Machine'],['Incline Dumbbell Biceps Curl',3,10,12,[[10,12],[12,10],[12,10]],'Biceps','Dumbbell'],['Straight Bar Biceps Curl',3,10,12,[[23,10],[25.3,10],[25.3,10]],'Biceps','Barbell'],['Rope Hammer Curl',3,10,12,[[25.3,10],[25.3,10],[25.3,10]],'Biceps','Cable'],['Overhead Cable Triceps Extension',3,10,15,[[20.3,10],[20.3,10],[]],'Triceps','Cable'],['Straight-Bar Triceps Pushdown',3,10,12,[[36,12],[41,10],[41,10]],'Triceps','Cable'],['Reverse Wrist Curl',3,12,15,[[18,12],[18,12],[18,8]],'Forearms','Dumbbell'],['Wrist Curl',3,12,15,[[14,12],[14,12],[16.3,10]],'Forearms','Dumbbell']]},
{name:'LOWER BODY B',items:[['Romanian Deadlift',3,8,12,[],'Hamstrings','Barbell'],['Hip Thrust',3,8,12,[],'Glutes','Barbell'],['Bulgarian Split Squat',2,10,12,[],'Quadriceps','Dumbbell'],['Seated Leg Curl',3,10,15,[],'Hamstrings','Machine'],['Seated Calf Raise',3,12,15,[],'Calves','Machine'],['Hanging Leg Raise',3,10,15,[],'Core','Bodyweight'],['Side Plank',2,30,45,[],'Core','Bodyweight','sec']]},
{name:'REST',rest:true,items:[]}
];
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}state.entries=state.entries||{};state.history=state.history||[];state.settings=state.settings||{};
const uid=()=>Math.random().toString(36).slice(2,10);
function normalizeDays(input){
 return input.map((d,di)=>({id:d.id||('day'+di+'_'+uid()),name:d.name||'WORKOUT',rest:!!d.rest,items:(d.items||[]).map((x,ei)=>{
  if(Array.isArray(x))return {id:'ex'+di+'_'+ei+'_'+uid(),name:x[0],sets:+x[1]||3,min:+x[2]||8,max:+x[3]||12,initial:x[4]||[],muscle:x[5]||'Other',equipment:x[6]||'Other',unit:x[7]==='sec'?'sec':'reps',superset:'',rest:90};
  return {id:x.id||uid(),name:x.name||'Exercise',sets:+x.sets||3,min:+x.min||8,max:+x.max||12,initial:x.initial||[],muscle:x.muscle||'Other',equipment:x.equipment||'Other',unit:x.unit||'reps',superset:x.superset||'',rest:+x.rest||90};
 })}));
}
let days;try{const raw=JSON.parse(localStorage.getItem(ROUTINE)||'null');days=raw&&raw.length?normalizeDays(raw):null}catch(e){days=null}
if(!days){days=normalizeDays(defaults);if(Array.isArray(state.routine)&&state.routine.length){try{days=normalizeDays(state.routine)}catch(e){}}}
let day=Math.max(0,Math.min(Number(state.day)||0,days.length-1)),tab='home',filter='All',search='',timer=null,remaining=0,sessionStart=null,sessionSeconds=0,sessionTicker=null;
const SET_TYPES=[['working','Working'],['warmup','Warm-up'],['backoff','Back-off'],['drop','Drop'],['failure','Failure'],['rest-pause','Rest-pause'],['custom','Custom']];
let activeSession=state.activeSession||null;
// V6 exercise reference data: illustrations are loaded from the licensed RepDB public dataset.
let exerciseVisualData=null,exerciseVisualStatus='loading';
const REPDB_JSON='https://exercise-dataset.com/exercises.json';
function normalizeExerciseName(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function repdbMatch(x){
 if(!exerciseVisualData||!Array.isArray(exerciseVisualData.exercises))return null;
 const q=normalizeExerciseName(x.name);
 if(!q)return null;
 // Exact names only: fuzzy matches can show the wrong technique or equipment variation.
 return exerciseVisualData.exercises.find(z=>normalizeExerciseName(z.name_en||z.name)===q)||null;
}
function repdbImage(asset,pose){
 if(!asset||!asset.images||!asset.images.flat)return '';
 const f=asset.images.flat,path=f[pose]||f.main||f.peak||f.start;
 if(!path)return '';
 if(/^https:\/\//i.test(path))return path;
 const clean=String(path).replace(/^\.\//,'').replace(/^\//,'');
 return 'https://exercise-dataset.com/'+clean;
}
function muscleDisplay(s){return String(s||'').replace(/[_-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function exerciseEvidence(x){
 const asset=repdbMatch(x),primaryCount=asset?.primary_muscles?.length||x.primary?.length||0;
 const equipment=String(x.equipment||'').toLowerCase(),tags=(asset?.tags||[]).map(t=>String(t).toLowerCase());
 const target=primaryCount===1?30:primaryCount===2?25:primaryCount>2?18:10;
 const loading=/barbell|dumbbell|cable|machine|smith|plate/.test(equipment)?25:/bodyweight/.test(equipment)?18:10;
 const stability=/machine|cable/.test(equipment)?15:/bench|supported/.test(equipment)?13:10;
 const range=tags.some(t=>/long.length|lengthened|full.rom|large.rom/.test(t))?15:8;
 const coaching=asset?.instructions_en?.length?(asset?.tips_en?.length?15:11):(x.instructions?.length?8:3);
 const fit=Math.max(0,Math.min(100,target+loading+stability+range+coaching));
 return {fit,label:fit>=85?'High selection fit':fit>=72?'Good selection fit':'Context-dependent option',confidence:'Strong evidence for resistance training overall · limited for this exact variation',explanation:'This evidence-informed heuristic considers target-muscle specificity, progressive-loading practicality, setup stability, available range-of-motion tags and coaching detail. It is a decision aid, not a measured hypertrophy effect or proof that one exercise is universally superior.'};
}
function communitySummary(name){const ratings=state.exerciseRatings||{},v=ratings[name];return v?{count:1,average:Number(v)}:{count:0,average:0}}
async function loadExerciseVisualData(){
 try{
  const response=await fetch(REPDB_JSON,{mode:'cors',credentials:'omit'});
  if(!response.ok)throw Error('Dataset request failed: '+response.status);
  const payload=await response.json();
  const records=Array.isArray(payload)?payload:Array.isArray(payload.exercises)?payload.exercises:null;
  if(!records||!records.length||!records.every(x=>x&&typeof (x.name_en||x.name)==='string'))throw Error('Unexpected RepDB dataset schema');
  exerciseVisualData={exercises:records};
  exerciseVisualStatus='ready';
 }catch(e){exerciseVisualData=null;exerciseVisualStatus='unavailable';}
 renderLibrary();
}

if(activeSession&&activeSession.dayId){const found=days.findIndex(d=>d.id===activeSession.dayId);if(found>=0)day=found;else activeSession=null;}
if(activeSession&&activeSession.status==='running')sessionStart=Number(activeSession.startedAt)||Date.now();
const unit=()=>state.settings.unit||'kg';
function save(){state.day=day;localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(ROUTINE,JSON.stringify(days))}
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function allExercises(){return days.flatMap(d=>d.items||[])}
function totalSets(){return allExercises().reduce((n,x)=>n+x.sets,0)}
function doneSets(){return Object.values(state.entries).filter(x=>x&&x.done).length}
function key(d,e,s){return days[d].id+'_'+days[d].items[e].id+'_'+s}
function getSet(d,e,s){const k=key(d,e,s);if(!state.entries[k]){const x=days[d].items[e],seed=x.initial[s]||[];state.entries[k]={w:seed[0]??'',r:seed[1]??'',done:false}}const v=state.entries[k];if(v.rir===undefined)v.rir='';if(v.rpe===undefined)v.rpe='';if(!v.type)v.type='working';return v}
function updateSet(d,e,s,p){state.entries[key(d,e,s)]=Object.assign({},getSet(d,e,s),p);save()}
function latestFor(name){const out=[];state.history.slice().reverse().forEach(h=>(h.details||[]).filter(x=>x.exercise===name).forEach(x=>out.push(x)));return out}
function progressionAdvice(x){
 const sessions=state.history.filter(h=>(h.details||[]).some(z=>z.exercise===x.name&&(z.setType||'working')==='working'));
 if(!sessions.length)return {status:'new',title:'Baseline needed',message:'Log completed working sets to build an exercise-specific progression target.'};
 const sets=(sessions[0].details||[]).filter(z=>z.exercise===x.name&&(z.setType||'working')==='working'&&z.done&&Number(z.reps)>0);
 if(!sets.length)return {status:'incomplete',title:'More data needed',message:'Complete and record your working sets before changing the load.'};
 if(x.unit==='sec')return {status:'time',title:'Time-based progression',message:'Build controlled hold time within your target range. Increase duration only when every set meets the top of the range with stable form.'};
 const weighted=sets.filter(z=>Number(z.weight)>0&&x.equipment!=='Bodyweight'),low=sets.filter(z=>Number(z.reps)<x.min),top=sets.filter(z=>Number(z.reps)>=x.max);
 const effortKnown=sets.every(z=>(z.rir!==null&&z.rir!==undefined&&z.rir!=='')||(z.rpe!==null&&z.rpe!==undefined&&z.rpe!==''));
 const effortEasy=sets.every(z=>(z.rir!==null&&z.rir!==undefined&&z.rir!==''?Number(z.rir)>=2:Number(z.rpe)<=8));
 const effortHard=sets.filter(z=>(z.rir!==null&&z.rir!==undefined&&z.rir!==''?Number(z.rir)<=0:z.rpe!==null&&z.rpe!==undefined&&z.rpe!==''?Number(z.rpe)>=9:false)).length>=Math.max(1,Math.ceil(sets.length/2));
 const recent=sessions.slice(0,3).map(h=>(h.details||[]).filter(z=>z.exercise===x.name&&(z.setType||'working')==='working'&&z.done&&Number(z.reps)>0));
 const avg=g=>g.reduce((n,z)=>n+Number(z.reps),0)/g.length;
 const comparable=recent.length===3&&recent.every(g=>g.length>0)&&recent.every(g=>g.every(z=>Number(z.weight)===Number(recent[0][0].weight)));
 if(comparable&&Math.max(avg(recent[0]),avg(recent[1]),avg(recent[2]))-Math.min(avg(recent[0]),avg(recent[1]),avg(recent[2]))<0.6)return {status:'plateau',title:'Progress has levelled off',message:'Your last three logged sessions show little rep change at a similar load. Keep the load steady, review recovery and technique, and reassess after another session.'};
 if(low.length>=Math.max(1,Math.ceil(sets.length/2))&&effortHard){const maxLoad=weighted.length?Math.max(...weighted.map(z=>Number(z.weight))):0;const target=maxLoad?roundLoad(maxLoad*0.95):null;return {status:'reduce',title:'Consider a small load reduction',message:'Several sets fell below your rep range with high effort. Prioritise clean reps; consider reducing the load slightly next time.'+(target?' Suggested starting load: '+target+' '+unit()+'.':'')};}
 if(top.length===sets.length&&effortKnown&&effortEasy){const maxLoad=weighted.length?Math.max(...weighted.map(z=>Number(z.weight))):0;const target=maxLoad?roundLoad(maxLoad*1.025):null;return {status:'increase',title:'Ready to progress',message:'Every completed working set reached the top of your rep range with at least 2 RIR or RPE 8 or lower. Increase by a small step next time while staying in range.'+(target?' Suggested load: '+target+' '+unit()+'.':x.equipment==='Bodyweight'?' Add a rep or choose a slightly harder variation.':'')};}
 if(top.length===sets.length&&!effortKnown)return {status:'verify',title:'Confirm effort before increasing',message:'You reached the top of the rep range. Record RIR or RPE next time; keep the same load until effort confirms the sets were controlled.'};
 if(effortHard)return {status:'hold',title:'Hold the current load',message:'Your effort was high. Keep the load steady and aim for consistent reps with good technique before progressing.'};
 return {status:'reps',title:'Build reps first',message:'Keep the current load and add one rep to a set where possible, staying inside your target range and maintaining technique.'};
}
function roundLoad(value){const step=unit()==='kg'?0.5:1;return Math.round(value/step)*step}
function estimateSuggestion(x){const a=progressionAdvice(x);return a.title+': '+a.message}
function stats(){const workouts=state.history.length,vol=validWorkingSets().reduce((n,x)=>n+x.volume,0),prs={};validWorkingSets().forEach(x=>{prs[x.exercise]=Math.max(prs[x.exercise]||0,x.weight)});return {workouts,vol,prs,prCount:Object.keys(prs).length}}
function weekCount(){const now=new Date(),start=new Date(now);start.setDate(now.getDate()-6);return state.history.filter(h=>{const d=new Date(h.timestamp||h.date);return !isNaN(d)&&d>=start}).length}
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.remove('show'),2300)}
function setTab(t){tab=t;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));['home','workout','library','progress','history','settings'].forEach(k=>$(k+'Page').classList.toggle('hidden',k!==t));render()}
function render(){
 const s=stats();$('topDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});$('helloStats').textContent=s.workouts+' sessions logged · '+weekCount()+' this week';
 $('homeWorkouts').textContent=s.workouts;$('homeVolume').textContent=Math.round(s.vol).toLocaleString();$('homeExercises').textContent=countDistinct();$('homeWeek').textContent=weekCount();
 renderToday();renderWorkout();renderLibrary();renderProgress();renderHistory();renderSettings();
}
function countDistinct(){return new Set(allExercises().map(x=>x.name)).size}
function renderToday(){
 const week=$('weekBars'),now=new Date(),weekData=[];for(let i=6;i>=0;i--){const dt=new Date(now);dt.setDate(now.getDate()-i);const keyDate=dt.toDateString();const n=state.history.filter(h=>new Date(h.timestamp||h.date).toDateString()===keyDate).length;weekData.push({label:dt.toLocaleDateString(undefined,{weekday:'short'}).slice(0,2),n})}const maxWeek=Math.max(1,...weekData.map(x=>x.n));week.innerHTML=weekData.map(x=>'<div class="week-col"><div class="week-bar '+(x.n?'active':'')+'" style="height:'+Math.max(4,x.n/maxWeek*90)+'px"></div><span class="week-day">'+x.label+'</span></div>').join('');
 const d=days[day],items=d.items||[],completed=items.reduce((a,x,e)=>a+Array.from({length:x.sets},(_,i)=>getSet(day,e,i).done?1:0).reduce((p,v)=>p+v,0),0),total=items.reduce((a,x)=>a+x.sets,0);
 $('todayTitle').textContent=d.rest?'Recovery day':d.name;$('todaySub').textContent=d.rest?'Take the time to recover.':items.length+' exercises · '+total+' working sets';$('todayPercent').textContent=(total?Math.round(completed/total*100):0)+'%';$('todayBar').style.width=(total?completed/total*100:0)+'%';
 $('todayExercises').innerHTML=d.rest?'<div class="empty-inline">Rest day. Light movement, hydration and recovery.</div>':items.slice(0,4).map(x=>'<div class="mini-ex"><span>'+escapeHtml(x.name)+'</span><span>'+x.sets+' sets</span></div>').join('')+(items.length>4?'<div class="tiny muted">+'+(items.length-4)+' more exercises</div>':'');
 $('todayStart').textContent=d.rest?'View recovery day':'Start workout';
}
function renderWorkout(){
 const d=days[day],items=d.items||[];$('dayTabs').innerHTML=days.map((x,i)=>'<button class="day-pill '+(i===day?'selected':'')+'" data-day="'+i+'"><span>DAY '+(i+1)+'</span><b>'+escapeHtml(x.name.split(' ')[0])+'</b></button>').join('');
 $('dayTabs').querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=+b.dataset.day;save();render()});
 $('workoutTitle').textContent=d.name;$('workoutMeta').textContent=d.rest?'Recovery session':items.length+' exercises · '+items.reduce((a,x)=>a+x.sets,0)+' sets';
 $('workoutContent').innerHTML=d.rest?'<div class="recovery-card"><div class="recovery-icon">✦</div><h2>Recovery is part of progress.</h2><p>Use today for light movement, mobility and rest. Your next session will be better for it.</p><label class="checkline"><input id="recoveryDone" type="checkbox"> Recovery walk / cardio completed</label><textarea id="recoveryNote" placeholder="Recovery notes..." rows="3">'+escapeHtml(state.entries['recovery_'+d.id]||'')+'</textarea></div>':items.map((x,e)=>exerciseCard(x,e)).join('');
 if(d.rest){$('recoveryDone').checked=!!state.entries['recoveryDone_'+d.id];$('recoveryDone').onchange=()=>{state.entries['recoveryDone_'+d.id]=$('recoveryDone').checked;save()};$('recoveryNote').onchange=()=>{state.entries['recovery_'+d.id]=$('recoveryNote').value;save()}}
 $('workoutContent').querySelectorAll('[data-set]').forEach(el=>el.onchange=()=>{const e=+el.dataset.exercise,si=+el.dataset.set,prop=el.dataset.prop;let value=prop==='done'?el.checked:el.value;if((prop==='rir'&&value!==''&&(Number(value)<0||Number(value)>10))||(prop==='rpe'&&value!==''&&(Number(value)<1||Number(value)>10))){showToast('RIR and RPE must be between 0 and 10.');el.value='';value=''}if(prop==='type'&&value==='custom'){const custom=prompt('Name this custom set type','Cluster');if(custom===null){el.value='working';value='working'}else updateSet(day,e,si,{customType:custom.trim()||'Custom',type:'custom'})}updateSet(day,e,si,{[prop]:value});renderToday();renderWorkoutProgress()});
 $('workoutContent').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editExercise(+b.dataset.edit));$('workoutContent').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeExercise(+b.dataset.remove));$('workoutContent').querySelectorAll('[data-timer]').forEach(b=>b.onclick=()=>startTimer(+b.dataset.timer));$('workoutContent').querySelectorAll('[data-next-superset]').forEach(b=>b.onclick=()=>{const i=+b.dataset.nextSuperset,group=days[day].items[i].superset,partner=days[day].items.findIndex((x,j)=>j!==i&&x.superset===group);if(partner<0)return showToast('Add another exercise to this superset group.');const card=$('exercise-'+partner);card.scrollIntoView({behavior:'smooth',block:'center'});card.style.borderColor='var(--accent)';setTimeout(()=>card.style.borderColor='',1200)});
 $('dayDone').textContent=(items.reduce((a,x,e)=>a+Array.from({length:x.sets},(_,i)=>getSet(day,e,i).done?1:0).reduce((p,v)=>p+v,0),0))+'/'+items.reduce((a,x)=>a+x.sets,0)+' sets done';
}
function exerciseCard(x,e){
 const advice=progressionAdvice(x),hint=advice.title+': '+advice.message,prior=latestFor(x.name).slice(-x.sets),previous=prior.length?'Last time: '+prior.map(z=>(z.weight||'—')+' '+unit()+' × '+(z.reps||'—')).join(' · '):'No previous performance logged yet',group=x.superset?'<div class="superset-strip"><span>⇄ SUPERSET '+escapeHtml(x.superset)+' · alternate with linked exercise</span><button class="text-btn" data-next-superset="'+e+'">Next partner →</button></div>':'';
 const rows=Array.from({length:x.sets},(_,si)=>{const v=getSet(day,e,si),type=v.type||'working';return '<div class="set-row '+(v.done?'is-complete':'')+'"><b>'+(si+1)+'</b><input aria-label="Load" type="number" min="0" step=".5" inputmode="decimal" placeholder="—" value="'+escapeHtml(v.w)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="w"><input aria-label="Reps" type="number" min="0" step="1" inputmode="numeric" placeholder="—" value="'+escapeHtml(v.r)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="r"><input aria-label="RIR" type="number" min="0" max="10" step=".5" placeholder="—" value="'+escapeHtml(v.rir)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="rir"><input aria-label="RPE" type="number" min="1" max="10" step=".5" placeholder="—" value="'+escapeHtml(v.rpe)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="rpe"><select aria-label="Set type" data-set="'+si+'" data-exercise="'+e+'" data-prop="type">'+SET_TYPES.map(t=>'<option value="'+t[0]+'" '+(type===t[0]?'selected':'')+'>'+(t[0]==='custom'&&v.customType?escapeHtml(v.customType):t[1])+'</option>').join('')+'</select><label class="done-toggle"><input type="checkbox" '+(v.done?'checked':'')+' data-set="'+si+'" data-exercise="'+e+'" data-prop="done"><span></span></label></div>'}).join('');
 return '<article class="lift-card" id="exercise-'+e+'"><div class="lift-head"><div><div class="muscle-tag">'+escapeHtml(x.muscle)+' · '+escapeHtml(x.equipment)+(x.superset?' · SUPERSET '+escapeHtml(x.superset):'')+'</div><h3>'+escapeHtml(x.name)+'</h3><div class="lift-sub">'+x.sets+' sets · '+x.min+'–'+x.max+' '+escapeHtml(x.unit)+'</div></div><button class="icon-btn" data-edit="'+e+'" aria-label="Edit exercise">•••</button></div>'+group+'<div class="set-head"><span>SET</span><span>LOAD</span><span>'+escapeHtml(x.unit.toUpperCase())+'</span><span>RIR</span><span>RPE</span><span>TYPE</span><span>✓</span></div>'+rows+'<div class="coach-note progression-note progression-'+advice.status+'"><span>PREVIOUS PERFORMANCE</span><p>'+escapeHtml(previous)+'</p><span>↗ PROGRESSION INSIGHT</span><b>'+escapeHtml(advice.title)+'</b><p>'+escapeHtml(advice.message)+'</p></div><div class="lift-actions"><button class="text-btn" data-timer="'+x.rest+'">◷ '+x.rest+'s rest</button><button class="text-btn" data-remove="'+e+'">Remove</button></div></article>';
}
function renderWorkoutProgress(){const d=days[day],n=d.items.reduce((a,x)=>a+x.sets,0),done=d.items.reduce((a,x,e)=>a+Array.from({length:x.sets},(_,i)=>getSet(day,e,i).done?1:0).reduce((p,v)=>p+v,0),0);$('dayDone').textContent=done+'/'+n+' sets done';}
function addExercise(){
 const name=prompt('Exercise name');if(!name||!name.trim())return;
 const muscle=prompt('Muscle group (Chest, Back, Shoulders, Biceps, Triceps, Quadriceps, Hamstrings, Glutes, Calves, Core, Forearms)','Chest')||'Other';
 const equipment=prompt('Equipment (Barbell, Dumbbell, Cable, Machine, Bodyweight)','Dumbbell')||'Other';
 const sets=+prompt('Number of sets','3'),min=+prompt('Minimum reps','8'),max=+prompt('Maximum reps','12');
 if(!Number.isInteger(sets)||sets<1||sets>20||min<1||max<min)return showToast('Check the set and rep values.');
 const unitType=prompt('Unit: reps or sec','reps')||'reps';
 days[day].items.push({id:uid(),name:name.trim(),muscle,equipment,sets,min,max,unit:unitType==='sec'?'sec':'reps',initial:[],rest:90,superset:''});save();render();showToast('Exercise added to your session.');
}
function editExercise(i){const x=days[day].items[i],name=prompt('Exercise name',x.name);if(name===null)return;const sets=+prompt('Sets',x.sets),min=+prompt('Minimum reps',x.min),max=+prompt('Maximum reps',x.max);if(!name.trim()||!Number.isInteger(sets)||sets<1||sets>20||min<1||max<min)return showToast('Invalid exercise settings.');x.name=name.trim();x.sets=sets;x.min=min;x.max=max;x.muscle=prompt('Muscle group',x.muscle)||x.muscle;x.equipment=prompt('Equipment',x.equipment)||x.equipment;x.superset=prompt('Superset label (optional)',x.superset)||'';x.rest=+prompt('Rest seconds',x.rest)||90;save();render()}
function removeExercise(i){if(!confirm('Remove '+days[day].items[i].name+' from this routine?'))return;days[day].items.splice(i,1);save();render()}
function addDay(){const name=prompt('New training day name','NEW WORKOUT');if(!name||!name.trim())return;days.splice(day+1,0,{id:uid(),name:name.trim(),rest:false,items:[]});day++;save();render()}
function editDay(){const name=prompt('Rename training day',days[day].name);if(name===null)return;days[day].name=name.trim()||days[day].name;save();render()}
function deleteDay(){if(days.length<=1)return showToast('Keep at least one training day.');if(!confirm('Delete this day from your cycle?'))return;days.splice(day,1);day=Math.min(day,days.length-1);save();render()}
function formatTime(n){n=Math.max(0,Math.floor(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function elapsedSession(){if(!activeSession)return 0;return Math.max(0,Number(activeSession.elapsedMs)||0)+(activeSession.status==='running'&&activeSession.startedAt?Date.now()-Number(activeSession.startedAt):0)}
function updateSessionUI(){const status=$('sessionStatus'),clock=$('sessionClock');if(!status||!clock)return;const active=!!activeSession;clock.textContent=formatTime(elapsedSession()/1000);status.textContent=!active?'No active session':activeSession.status==='paused'?'Paused':'In progress';status.className='session-state '+(active?activeSession.status:'');$('pauseWorkout').classList.toggle('hidden',!active||activeSession.status!=='running');$('resumeWorkout').classList.toggle('hidden',!active||activeSession.status!=='paused');$('discardWorkout').classList.toggle('hidden',!active)}
function persistSession(){state.activeSession=activeSession;save();updateSessionUI()}
function startClock(){clearInterval(sessionTicker);sessionTicker=setInterval(updateSessionUI,1000);updateSessionUI()}
function startWorkout(){if(activeSession&&activeSession.dayId!==days[day].id){if(!confirm('A session is already active on another training day. Discard it and start this one?'))return;activeSession=null}if(!activeSession)activeSession={dayId:days[day].id,dayIndex:day,startedAt:Date.now(),elapsedMs:0,status:'running',createdAt:Date.now()};else if(activeSession.status==='paused'){activeSession.status='running';activeSession.startedAt=Date.now()}sessionStart=activeSession.startedAt;persistSession();startClock();setTab('workout')}
function pauseWorkout(){if(!activeSession||activeSession.status!=='running')return;activeSession.elapsedMs=elapsedSession();activeSession.status='paused';delete activeSession.startedAt;clearInterval(sessionTicker);sessionStart=null;persistSession();showToast('Session paused. Your work is saved.')}
function resumeWorkout(){if(!activeSession||activeSession.status!=='paused')return;activeSession.status='running';activeSession.startedAt=Date.now();sessionStart=activeSession.startedAt;persistSession();startClock();showToast('Session resumed.')}
function discardWorkout(){if(!activeSession)return;if(!confirm('Discard this session? Your set entries remain saved, but no workout is added to history.'))return;activeSession=null;sessionStart=null;sessionSeconds=0;clearInterval(sessionTicker);persistSession();showToast('Session discarded. Logged sets were kept.')}
function restoreSessionClock(){if(activeSession){if(activeSession.status==='running'){if(!activeSession.startedAt)activeSession.startedAt=Date.now();startClock()}else updateSessionUI()}else updateSessionUI()}
function finishWorkout(){
 const d=days[day],details=[];d.items.forEach((x,e)=>{for(let si=0;si<x.sets;si++){const v=getSet(day,e,si);if(v.w!==''||v.r!==''||v.done)details.push({exercise:x.name,set:si+1,weight:v.w,reps:v.r,done:!!v.done,muscle:x.muscle,rir:v.rir===''?null:Number(v.rir),rpe:v.rpe===''?null:Number(v.rpe),setType:v.type||'working',customType:v.customType||'',superset:x.superset||''})}});
 if(!d.rest&&!details.length)return showToast('Log at least one set before finishing.');
 if(!confirm('Finish and save this session to workout history?'))return;
 const timestamp=Date.now(),duration=Math.floor(elapsedSession()/1000);state.history.unshift({id:uid(),timestamp,date:new Date(timestamp).toLocaleString(),day:day+1,name:d.name,details,duration});
 activeSession=null;sessionStart=null;sessionSeconds=0;clearInterval(sessionTicker);state.activeSession=null;save();render();showToast('Workout saved. Strong work.');
}
function startTimer(n){clearInterval(timer);remaining=n;$('timerOverlay').classList.remove('hidden');tick();timer=setInterval(()=>{remaining--;tick();if(remaining<=0){clearInterval(timer);$('timerValue').textContent='DONE';if(navigator.vibrate)navigator.vibrate([180,100,180])}},1000)}
function tick(){ $('timerValue').textContent=formatTime(Math.max(0,remaining)) }
function libraryItems(){
 const map=new Map();
 (window.GYMLOG_EXERCISES||[]).forEach(x=>{const k=x.name.toLowerCase();if(!map.has(k))map.set(k,Object.assign({},x,{source:'catalog'}))});
 allExercises().forEach(x=>{const k=x.name.toLowerCase();map.set(k,Object.assign({},map.get(k)||{},x,{source:'routine'}))});
 (state.customExercises||[]).forEach(x=>{const k=x.name.toLowerCase();map.set(k,Object.assign({sets:3,min:8,max:12,unit:'reps',rest:90},map.get(k)||{},x,{source:'custom'}))});
 return Array.from(map.values()).map(x=>Object.assign(x,exerciseMeta(x)));
}
function exerciseMeta(x){
 const n=x.name.toLowerCase(),m=x.muscle,meta={primary:[m],secondary:[],difficulty:'Intermediate',instructions:['Set up the equipment and adopt a stable starting position.','Move through a controlled range of motion without bouncing.','Keep the target muscles engaged and avoid using momentum.','Return to the start position under control.'],mistakes:['Using momentum to move the load.','Cutting the range of motion short.','Losing a stable torso or joint position.'],alternatives:[],pattern:'general'};
 if(/bench press|chest press|push.?up/.test(n)){meta.pattern='press';meta.secondary=['Triceps','Shoulders'];meta.instructions=['Set your shoulder blades in a stable position and keep your feet planted.','Lower the load under control toward the mid-chest.','Press smoothly until your elbows extend without forcefully locking them.'];meta.mistakes=['Allowing the shoulders to roll forward.','Bouncing the weight off the chest.','Excessive elbow flare.'];meta.alternatives=['Dumbbell Bench Press','Push-Up','Machine Chest Press']}
 else if(/fly|pec deck|butterfly/.test(n)){meta.pattern='fly';meta.secondary=['Shoulders'];meta.instructions=['Set the handles so the upper arms are roughly level with the chest.','Keep a soft bend in the elbows and open until a comfortable chest stretch.','Bring the arms together by squeezing the chest, without shrugging.'];meta.mistakes=['Turning the movement into a press.','Using excessive stretch or momentum.','Shrugging the shoulders.'];meta.alternatives=['Cable Chest Fly','Dumbbell Fly','Machine Chest Fly']}
 else if(/pulldown|pull.?up|chin.?up/.test(n)){meta.pattern='pull';meta.secondary=['Biceps','Forearms'];meta.instructions=['Brace your torso and set the shoulders down away from the ears.','Pull the handle or body toward the upper chest with elbows driving down.','Return slowly until the arms are extended while maintaining control.'];meta.mistakes=['Swinging the torso to move the load.','Pulling behind the neck.','Shrugging at the top.'];meta.alternatives=['Assisted Pull-Up','Straight-Arm Pulldown','Dumbbell Pullover']}
 else if(/row/.test(n)){meta.pattern='row';meta.secondary=['Biceps','Rear Deltoids','Forearms'];meta.instructions=['Brace the torso and keep the spine neutral.','Drive the elbows back and draw the shoulder blades together.','Lower the handle slowly without rounding the back.'];meta.mistakes=['Jerking the torso.','Rounding the lower back.','Shrugging instead of driving the elbows.'];meta.alternatives=['Chest-Supported Row','Seated Cable Row','One-Arm Dumbbell Row']}
 else if(/squat|leg press|split squat/.test(n)){meta.pattern='squat';meta.primary=['Quadriceps','Glutes'];meta.secondary=['Hamstrings','Core'];meta.instructions=['Set feet in a stable stance and brace your trunk.','Bend at the hips and knees, tracking knees in line with the toes.','Descend only as far as you can maintain control and a stable spine.','Drive through the feet to stand without letting the knees collapse inward.'];meta.mistakes=['Knees collapsing inward.','Heels lifting unintentionally.','Losing trunk position or depth control.'];meta.alternatives=['Goblet Squat','Hack Squat','Step-Up']}
 else if(/deadlift|romanian/.test(n)){meta.pattern='hinge';meta.primary=['Hamstrings','Glutes'];meta.secondary=['Back','Core','Forearms'];meta.instructions=['Stand tall with the load close to the body.','Push the hips back with a slight knee bend while keeping the spine neutral.','Lower until you feel a hamstring stretch, then drive the hips forward to stand.'];meta.mistakes=['Rounding the lower back.','Letting the load drift away.','Turning the hinge into a squat.'];meta.alternatives=['Dumbbell Romanian Deadlift','Cable Pull-Through','Hip Hinge']}
 else if(/curl/.test(n)){meta.pattern='curl';meta.primary=[/wrist/.test(n)?'Forearms':'Biceps'];meta.secondary=['Forearms'];meta.instructions=['Keep the upper arm or forearm supported and wrists neutral unless the exercise targets the wrist.','Curl through a comfortable range without swinging.','Lower slowly to the starting position.'];meta.mistakes=['Swinging the torso.','Moving the elbows excessively.','Dropping the weight quickly.'];meta.alternatives=['Dumbbell Curl','Hammer Curl','Cable Curl']}
 else if(/triceps|pushdown|extension/.test(n)){meta.pattern='extension';meta.primary=['Triceps'];meta.secondary=['Shoulders'];meta.instructions=['Keep the upper arms steady and brace the torso.','Extend the elbows to move the handle while avoiding shoulder swing.','Return slowly until the triceps are stretched comfortably.'];meta.mistakes=['Flaring the elbows.','Leaning bodyweight into the movement.','Using momentum.'];meta.alternatives=['Overhead Dumbbell Extension','Close-Grip Push-Up','Cable Pushdown']}
 else if(/lateral raise|shoulder press|reverse butterfly|back dumbbell raise/.test(n)){meta.pattern='shoulder';meta.primary=['Shoulders'];meta.secondary=['Triceps','Upper Back'];meta.instructions=['Keep the ribcage stacked over the pelvis and shoulders relaxed.','Move the arms in the intended plane with a slight elbow bend.','Use a controlled tempo and avoid swinging.'];meta.mistakes=['Shrugging toward the ears.','Swinging the weights.','Using a load that shortens the range.'];meta.alternatives=['Dumbbell Lateral Raise','Machine Shoulder Press','Cable Rear-Delt Fly']}
 else if(/calf/.test(n)){meta.pattern='calf';meta.primary=['Calves'];meta.instructions=['Use a stable foot position and hold the stretch briefly at the bottom.','Rise onto the balls of the feet as high as comfortable.','Lower slowly without bouncing.'];meta.mistakes=['Bouncing through repetitions.','Using a partial range.','Letting the ankles roll outward.'];meta.alternatives=['Standing Calf Raise','Seated Calf Raise']}
 else if(/crunch|hanging leg|plank/.test(n)){meta.pattern='core';meta.primary=['Core'];meta.secondary=['Hip Flexors'];meta.instructions=['Brace the abdominal wall and keep the pelvis controlled.','Move slowly without swinging or arching the lower back.','Breathe steadily throughout the repetition or hold.'];meta.mistakes=['Using momentum.','Overarching the lower back.','Holding the breath unnecessarily.'];meta.alternatives=['Dead Bug','Reverse Crunch','Side Plank']}
 return meta;
}
function muscleMapSvg(muscles){
 const primaryLabels=(muscles?.primary||muscles||[]).map(m=>String(m).toLowerCase().replace(/[_-]/g,' '));
 const secondaryLabels=(muscles?.secondary||[]).map(m=>String(m).toLowerCase().replace(/[_-]/g,' '));
 const groups={
  chest:['chest','pectoralis','pectorals','pecs'],frontDelts:['front deltoid','anterior deltoid','deltoid anterior','shoulders'],sideDelts:['lateral deltoid','side deltoid','shoulders'],biceps:['biceps','brachialis','arms'],forearms:['forearm','wrist flexor','wrist extensor'],abs:['abs','rectus abdominis','abdominals','core'],obliques:['oblique','core'],quads:['quadriceps','rectus femoris','vastus'],calves:['calves','gastrocnemius','soleus'],
  traps:['trapezius','traps','back'],rearDelts:['rear deltoid','posterior deltoid','shoulders'],lats:['latissimus','lats','back'],triceps:['triceps','arms'],glutes:['glute','gluteus'],hamstrings:['hamstring','biceps femoris'],erectors:['erector spinae','spinal erector']
 };
 const match=(labels,k)=>labels.some(l=>groups[k].some(g=>l.includes(g)));
 const p=(k,d)=>{const cls=match(primaryLabels,k)?'primary-target':match(secondaryLabels,k)?'secondary-target':'';return '<path class="v6-muscle '+cls+'" d="'+d+'"/>'};
 return '<div class="v6-anatomy"><svg viewBox="0 0 300 230" role="img" aria-label="Front and back muscle silhouettes"><g transform="translate(8 5)">'+
 '<text x="70" y="12" class="v6-anatomy-label">FRONT</text><circle class="v6-body" cx="70" cy="31" r="12"/><path class="v6-body" d="M49 47 Q70 39 91 47 L101 87 91 120 86 151 82 214 58 214 54 151 49 120 39 87Z"/>'+
 p('frontDelts','M48 54 Q35 54 35 71 L48 79 55 57Z')+p('frontDelts','M92 54 Q105 54 105 71 L92 79 85 57Z')+p('chest','M51 58 Q70 49 89 58 L86 82 Q70 92 54 82Z')+p('biceps','M38 77 L29 112 39 118 50 82Z')+p('biceps','M102 77 L111 112 101 118 90 82Z')+p('forearms','M29 119 L24 154 34 157 40 121Z')+p('forearms','M111 119 L116 154 106 157 100 121Z')+p('abs','M55 87 L85 87 82 127 58 127Z')+p('obliques','M49 88 L56 91 54 123 47 119Z')+p('obliques','M91 88 L84 91 86 123 93 119Z')+p('quads','M55 130 L68 130 65 177 54 177Z')+p('quads','M72 130 L85 130 86 177 75 177Z')+p('calves','M56 181 L66 181 65 211 57 211Z')+p('calves','M75 181 L85 181 83 211 75 211Z')+'</g><g transform="translate(153 5)"><text x="70" y="12" class="v6-anatomy-label">BACK</text><circle class="v6-body" cx="70" cy="31" r="12"/><path class="v6-body" d="M49 47 Q70 39 91 47 L101 87 91 120 86 151 82 214 58 214 54 151 49 120 39 87Z"/>'+
 p('traps','M54 52 L70 47 86 52 83 75 70 82 57 75Z')+p('rearDelts','M48 55 Q35 55 35 72 L49 80 56 59Z')+p('rearDelts','M92 55 Q105 55 105 72 L91 80 84 59Z')+p('lats','M55 78 L85 78 91 111 70 130 49 111Z')+p('triceps','M38 79 L29 112 39 118 50 83Z')+p('triceps','M102 79 L111 112 101 118 90 83Z')+p('forearms','M29 119 L24 154 34 157 40 121Z')+p('forearms','M111 119 L116 154 106 157 100 121Z')+p('erectors','M66 82 L74 82 76 126 70 135 64 126Z')+p('glutes','M51 128 Q70 120 89 128 L86 151 70 157 54 151Z')+p('hamstrings','M54 155 L68 155 65 180 54 180Z')+p('hamstrings','M72 155 L86 155 86 180 75 180Z')+p('calves','M56 182 L66 182 65 211 57 211Z')+p('calves','M75 182 L85 182 83 211 75 211Z')+'</g></svg><div class="v6-anatomy-legend"><span><i class="primary"></i>Primary target</span><span><i class="secondary"></i>Secondary target</span></div></div>';
}
function exerciseIllustrationSvg(pattern){
 const extras={press:'<path d="M34 48 H154 M42 39 V57 M146 39 V57 M64 78 L64 48 M124 76 L124 48" stroke="#9aa8b5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M75 38 V18 M68 25 L75 18 82 25" stroke="#c8ff55" stroke-width="3" fill="none"/>',fly:'<path d="M35 52 L65 78 M153 52 L124 76 M28 45 L40 59 M160 45 L148 59" stroke="#9aa8b5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M65 78 Q94 28 124 76" stroke="#c8ff55" stroke-width="3" fill="none" stroke-dasharray="5 5"/>',pull:'<path d="M35 18 H153 M45 18 V30 M143 18 V30 M94 18 V46" stroke="#9aa8b5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 42 L94 55 108 42" stroke="#c8ff55" stroke-width="3" fill="none"/>',row:'<path d="M35 150 H153 M52 150 L66 110 M66 110 L112 92 M112 92 L133 116 M112 92 L129 62" stroke="#9aa8b5" stroke-width="5" fill="none" stroke-linecap="round"/>',squat:'<path d="M55 155 H133 M70 155 L77 119 M77 119 L112 119 M112 119 L128 155" stroke="#9aa8b5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M94 42 L94 90 M94 58 L70 77 M94 58 L118 77 M94 90 L78 116 M94 90 L112 116" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',hinge:'<path d="M42 152 H145 M94 50 L70 90 112 108 130 146 M70 90 L53 132 M70 90 L110 70" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',curl:'<path d="M94 42 L94 96 M94 57 L65 78 58 53 M94 57 L124 76 M94 96 L72 140 M94 96 L116 140 M47 46 H68" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',extension:'<path d="M94 42 L94 96 M94 57 L65 78 M94 57 L124 76 135 48 M94 96 L72 140 M94 96 L116 140" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',shoulder:'<path d="M94 42 L94 96 M94 57 L65 28 M94 57 L124 28 M94 96 L72 140 M94 96 L116 140" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',calf:'<path d="M94 42 L94 96 M94 57 L65 78 M94 57 L124 76 M94 96 L80 143 80 154 M94 96 L108 143 108 154 M69 157 H91 M97 157 H119" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>',core:'<path d="M94 42 L94 96 M94 57 L65 78 M94 57 L124 76 M94 96 L72 140 M94 96 L116 140 M72 84 Q94 68 116 84" stroke="#c8ff55" stroke-width="5" fill="none" stroke-linecap="round"/>'};
 const figure='<circle cx="94" cy="28" r="12" fill="none" stroke="#c8ff55" stroke-width="4"/><path d="M94 42 L94 96 M94 57 L65 78 M94 57 L124 76 M94 96 L72 140 M94 96 L116 140" fill="none" stroke="#c8ff55" stroke-width="5" stroke-linecap="round"/>';
 return '<svg viewBox="0 0 190 180" role="img" aria-label="Original exercise movement illustration"><path d="M12 160 H178" stroke="#64717b" stroke-width="2" stroke-dasharray="4 5"/>'+figure+(extras[pattern]||extras.press)+'</svg>';
}
function openExerciseDetails(name){
 const x=libraryItems().find(z=>z.name===name);if(!x)return;
 const asset=repdbMatch(x),ev=exerciseEvidence(x),primary=asset?asset.primary_muscles.map(muscleDisplay):x.primary,secondary=asset?asset.secondary_muscles.map(muscleDisplay):x.secondary;
 $('exerciseModalTitle').textContent=x.name;$('exerciseModalSubtitle').textContent=x.muscle+' · '+x.equipment;
 const poseStart=asset?repdbImage(asset,'start'):'',posePeak=asset?repdbImage(asset,'peak'):'';
 const visuals=asset&&(poseStart||posePeak)?'<div class="v6-poses">'+(poseStart?'<figure><img src="'+poseStart+'" alt="'+escapeHtml(x.name)+' start position" loading="lazy" onerror="this.closest(\'figure\').classList.add(\'image-failed\')"><figcaption>START POSITION</figcaption></figure>':'')+(posePeak?'<figure><img src="'+posePeak+'" alt="'+escapeHtml(x.name)+' peak position" loading="lazy" onerror="this.closest(\'figure\').classList.add(\'image-failed\')"><figcaption>PEAK POSITION</figcaption></figure>':'')+'</div>':'<div class="v6-no-image"><div class="v6-image-placeholder">REFERENCE IMAGE NOT AVAILABLE</div><p>No verified demonstration image is available for this exact variation. GYMLOG will not substitute a different exercise image.</p></div>';
 const instructions=asset&&asset.instructions_en&&asset.instructions_en.length?asset.instructions_en:x.instructions;
 const tips=asset&&asset.tips_en&&asset.tips_en.length?asset.tips_en:x.mistakes;
 const muscles={primary,secondary};
 const community=communitySummary(x.name);
 $('exerciseModalBody').innerHTML='<div class="v6-detail-layout"><div class="v6-detail-main"><section class="v6-visual-panel"><div class="v6-section-kicker">MOVEMENT REFERENCE</div>'+visuals+'<div class="v6-muscle-panel"><div><b>Target muscle map</b><small>'+(asset?'Based on RepDB primary and secondary muscle metadata.':'Estimated from GYMLOG movement classification; verify against your technique.')+'</small></div>'+muscleMapSvg(muscles)+'</div></section><section class="v6-info-panel"><div class="v6-section-kicker">MOVEMENT COACHING</div><h3>How to perform</h3><ol>'+instructions.map(t=>'<li>'+escapeHtml(t)+'</li>').join('')+'</ol><h3>Coaching cues</h3><ul>'+tips.map(t=>'<li>'+escapeHtml(t)+'</li>').join('')+'</ul></section></div><aside class="v6-detail-side"><section class="v6-score-card"><div class="v6-section-kicker">GYMLOG SELECTION GUIDE</div><div class="v6-score">'+ev.fit+'<small>/100</small></div><b>'+ev.label+'</b><p>'+ev.explanation+'</p><div class="v6-evidence-line"><span>Research confidence</span><b>'+ev.confidence+'</b></div><small class="v6-disclaimer">This is a transparent practical-fit heuristic, not a clinical ranking or a measured hypertrophy effect.</small></section><section class="v6-info-panel"><h3>Muscles involved</h3><div class="v6-muscle-tags">'+primary.map(m=>'<span class="primary">'+escapeHtml(m)+' · primary</span>').join('')+secondary.map(m=>'<span>'+escapeHtml(m)+' · secondary</span>').join('')+'</div><div class="v6-fact-grid"><div><small>EQUIPMENT</small><b>'+escapeHtml(x.equipment)+'</b></div><div><small>LEVEL</small><b>'+escapeHtml(x.difficulty)+'</b></div><div><small>DEFAULT PLAN</small><b>'+x.sets+' × '+x.min+'–'+x.max+'</b></div><div><small>MECHANIC</small><b>'+escapeHtml(asset?.mechanic||x.pattern)+'</b></div></div></section><section class="v6-info-panel"><h3>What research supports</h3><p>Progressive resistance training reliably improves strength and muscle size. Research supports choosing movements you can perform consistently and progressively overload; it does not establish a universal winner for every muscle or person.</p><p>Exercise variation and range of motion can influence regional adaptations, but findings differ by muscle and movement.</p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/" target="_blank" rel="noopener">ACSM evidence overview ↗</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/35438660/" target="_blank" rel="noopener">Exercise variation review ↗</a></section><section class="v6-info-panel"><h3>Community feedback</h3><div class="v6-community-score">'+(community.count?community.average.toFixed(1)+' / 5':'Not rated yet')+'</div><p>'+community.count+' ratings saved on this device. Ratings are private and are not represented as internet-wide feedback.</p><div class="v6-community-note"><b>What lifters discuss online</b><p>Community threads show mixed preferences: many lifters combine machines and free weights, choosing based on comfort, stability, available equipment and progression. These are anecdotes, not effectiveness trials.</p><a href="https://www.reddit.com/r/workout/comments/1mly4qk/is_there_a_difference_between_machines_and_free/" target="_blank" rel="noopener">Read discussion ↗</a> · <a href="https://www.reddit.com/r/naturalbodybuilding/comments/1oix50a/how_much_does_exercise_selection_actually_matter/" target="_blank" rel="noopener">Exercise selection discussion ↗</a></div><div class="v6-rate-row"><label for="exerciseRating">Your rating</label><select id="exerciseRating"><option value="">Rate this movement</option><option value="5">5 · Excellent</option><option value="4">4 · Very good</option><option value="3">3 · Good</option><option value="2">2 · Fair</option><option value="1">1 · Poor</option></select></div><button class="btn" id="saveExerciseRating">Save rating</button></section><section class="v6-info-panel"><h3>Alternatives</h3><ul>'+x.alternatives.map(t=>'<li>'+escapeHtml(t)+'</li>').join('')+'</ul></section><div class="exercise-dialog-actions"><button class="btn primary" data-modal-add="'+escapeHtml(x.name)+'">＋ Add to current day</button><button class="btn" data-modal-fav="'+escapeHtml(x.name)+'">'+((state.libraryFavorites||[]).includes(x.name)?'★ Saved':'☆ Favorite')+'</button></div></aside></div><p class="v6-attribution">Exercise illustrations and anatomy metadata by <a href="https://repdb.co/" target="_blank" rel="noopener">RepDB</a> · <a href="https://github.com/RepDB/exercise-dataset" target="_blank" rel="noopener">dataset and license</a>.</p>';
 $('exerciseModalBody').querySelector('[data-modal-add]').onclick=()=>addLibraryExercise(x.name);
 $('exerciseModalBody').querySelector('[data-modal-fav]').onclick=()=>{toggleLibraryFavorite(x.name);openExerciseDetails(x.name)};
 $('saveExerciseRating').onclick=()=>{const v=Number($('exerciseRating').value);if(!v)return showToast('Choose a rating first.');state.exerciseRatings=state.exerciseRatings||{};state.exerciseRatings[x.name]=v;save();openExerciseDetails(x.name);showToast('Your private rating was saved.')};
 $('exerciseModal').classList.remove('hidden');
}

function toggleLibraryFavorite(name){state.libraryFavorites=state.libraryFavorites||[];const i=state.libraryFavorites.indexOf(name);if(i>=0)state.libraryFavorites.splice(i,1);else state.libraryFavorites.push(name);save();renderLibrary()}
function addLibraryExercise(name){
 const x=libraryItems().find(z=>z.name===name);if(!x)return;
 if(days[day].rest){showToast('Choose a training day before adding an exercise.');return}
 const ex={id:uid(),name:x.name,sets:x.sets||3,min:x.min||8,max:x.max||12,initial:[],muscle:x.muscle,equipment:x.equipment,unit:x.unit||'reps',rest:x.rest||90,superset:''};
 days[day].items.push(ex);save();render();showToast(x.name+' added to '+days[day].name+'.');
 $('exerciseModal').classList.add('hidden');setTab('workout');
}
function createCustomExercise(){
 const name=prompt('Custom exercise name');if(!name||!name.trim())return;
 if(libraryItems().some(x=>x.name.toLowerCase()===name.trim().toLowerCase()))return showToast('That exercise is already in your library.');
 const muscle=prompt('Primary muscle group','Chest')||'Other',equipment=prompt('Equipment','Dumbbell')||'Other';
 const sets=Number(prompt('Default sets','3')),min=Number(prompt('Minimum reps','8')),max=Number(prompt('Maximum reps','12'));
 if(!Number.isInteger(sets)||sets<1||sets>20||!Number.isInteger(min)||min<1||!Number.isInteger(max)||max<min)return showToast('Check your set and rep values.');
 state.customExercises=state.customExercises||[];state.customExercises.push({id:uid(),name:name.trim(),muscle,equipment,sets,min,max,unit:'reps',rest:90,initial:[]});save();renderLibrary();showToast('Custom exercise saved to your library.');
}
function renderLibrary(){
 const all=libraryItems(),muscles=['All',...new Set(all.map(x=>x.muscle))],equipment=['All',...new Set(all.map(x=>x.equipment))];
 $('muscleFilters').innerHTML=muscles.map(m=>'<button class="filter-chip '+(filter===m?'active':'')+'" data-filter="'+escapeHtml(m)+'">'+escapeHtml(m)+'</button>').join('');
 $('muscleFilters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;renderLibrary()});
 const ef=$('equipmentFilter'),current=ef.value;ef.innerHTML=equipment.map(x=>'<option value="'+escapeHtml(x)+'">'+escapeHtml(x==='All'?'All equipment':x)+'</option>').join('');ef.value=equipment.includes(current)?current:'All';
 const q=$('librarySearch').value.toLowerCase(),favoritesOnly=$('favoritesOnly').classList.contains('active'),favorites=state.libraryFavorites||[],sort=$('librarySort')?.value||'recommended';
 let matches=all.filter(x=>(filter==='All'||x.muscle===filter)&&(ef.value==='All'||x.equipment===ef.value)&&($('difficultyFilter').value==='All'||x.difficulty===$('difficultyFilter').value)&&(!favoritesOnly||favorites.includes(x.name))&&(x.name.toLowerCase().includes(q)||x.muscle.toLowerCase().includes(q)||x.equipment.toLowerCase().includes(q)));
 if(sort==='alpha')matches.sort((a,b)=>a.name.localeCompare(b.name));
 else if(sort==='evidence')matches.sort((a,b)=>exerciseEvidence(b).fit-exerciseEvidence(a).fit||a.name.localeCompare(b.name));
 else matches.sort((a,b)=>exerciseEvidence(b).fit-exerciseEvidence(a).fit||a.name.localeCompare(b.name));
 const matched=matches.filter(x=>!!repdbMatch(x)).length;
 $('libraryCount').textContent=matches.length+' exercises · '+matched+' exact visual matches'+(exerciseVisualStatus==='loading'?' · loading data':exerciseVisualStatus==='unavailable'?' · reference data offline':'');
 $('libraryList').innerHTML=matches.map(x=>{const ev=exerciseEvidence(x),asset=repdbMatch(x),img=asset?repdbImage(asset,'peak'):'',thumb=img?'<img class="lib-thumb" src="'+img+'" alt="'+escapeHtml(x.name)+' exercise illustration" loading="lazy" onerror="this.style.display=\'none\'">':'<div class="lib-icon">'+escapeHtml(x.muscle.slice(0,2).toUpperCase())+'</div>';return '<article class="library-item v6-library-item">'+thumb+'<div class="lib-info"><b>'+escapeHtml(x.name)+'</b><span>'+escapeHtml(x.muscle)+' · '+escapeHtml(x.equipment)+' · '+escapeHtml(x.difficulty)+'</span><span>'+x.sets+' × '+x.min+'–'+x.max+' · '+escapeHtml(x.primary.join(', '))+'</span></div><div class="lib-rating"><b>'+ev.fit+'/100</b><small>'+ev.label+'</small></div><div class="lib-actions"><button data-detail="'+escapeHtml(x.name)+'">Explore</button><button class="fav" data-fav="'+escapeHtml(x.name)+'">'+(favorites.includes(x.name)?'★':'☆')+'</button><button data-add="'+escapeHtml(x.name)+'">＋</button></div></article>'}).join('')||'<div class="empty-state">No exercises match those filters.</div>';
 $('libraryList').querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>openExerciseDetails(b.dataset.detail));
 $('libraryList').querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>toggleLibraryFavorite(b.dataset.fav));
 $('libraryList').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addLibraryExercise(b.dataset.add));
}

function completedWorkingSets(since=0){
 const out=[];
 state.history.forEach(h=>{
  const stamp=Number(h.timestamp)||new Date(h.date).getTime();
  if(!Number.isFinite(stamp)||stamp<since)return;
  (h.details||[]).forEach(x=>{
   const routine=allExercises().find(e=>e.name===x.exercise),reps=Number(x.reps),weight=Number(x.weight);
   if(!x.done||(x.setType||'working')!=='working'||!Number.isFinite(reps)||reps<1||routine&&routine.unit==='sec')return;
   const loaded=Number.isFinite(weight)&&weight>0&&!(routine&&routine.equipment==='Bodyweight');
   out.push({exercise:x.exercise,muscle:x.muscle||(routine&&routine.muscle)||'Other',weight:loaded?weight:0,reps,loaded,volume:loaded?weight*reps:0,timestamp:stamp,date:new Date(stamp),e1rm:loaded&&reps<=10?weight*(1+reps/30):null});
  });
 });
 return out;
}
function validWorkingSets(since=0){return completedWorkingSets(since).filter(x=>x.loaded)}
function renderOverallProgress(completed,loaded){
 const now=Date.now(),dayMs=86400000,from30=now-30*dayMs,from60=now-60*dayMs;
 const sessions=state.history.map(h=>({h,t:Number(h.timestamp)||new Date(h.date).getTime()})).filter(x=>Number.isFinite(x.t)).sort((a,b)=>a.t-b.t);
 const recent=sessions.filter(x=>x.t>=from30),prior=sessions.filter(x=>x.t>=from60&&x.t<from30),recentSets=completed.filter(x=>x.timestamp>=from30),recentLoaded=loaded.filter(x=>x.timestamp>=from30);
 const recentVolume=recentLoaded.reduce((n,x)=>n+x.volume,0),priorVolume=loaded.filter(x=>x.timestamp>=from60&&x.timestamp<from30).reduce((n,x)=>n+x.volume,0);
 const days=new Set(recent.map(x=>new Date(x.t).toDateString())).size,delta=(a,b)=>b?Math.round((a-b)/b*100):null;
 $('overallSessions').textContent=recent.length;$('overallSets').textContent=recentSets.length;$('overallVolume').textContent=Math.round(recentVolume).toLocaleString()+' '+unit();$('overallDays').textContent=days+' / 30';
 const sd=delta(recent.length,prior.length),vd=delta(recentVolume,priorVolume);
 $('overallSessionsNote').textContent=sd===null?'No previous 30-day baseline':(sd>=0?'+':'')+sd+'% vs previous 30 days';
 $('overallVolumeNote').textContent=vd===null?'No previous 30-day baseline':(vd>=0?'+':'')+vd+'% vs previous 30 days';
 const active=new Set(sessions.map(x=>new Date(x.t).toDateString()));let streak=0,cursor=new Date();cursor.setHours(0,0,0,0);if(!active.has(cursor.toDateString()))cursor.setDate(cursor.getDate()-1);while(active.has(cursor.toDateString())&&streak<365){streak++;cursor.setDate(cursor.getDate()-1)}$('overallStreak').textContent=streak+' day'+(streak===1?'':'s');
 const weeks=[];for(let i=7;i>=0;i--){const start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-start.getDay()-i*7);const end=start.getTime()+7*dayMs;const sets=completed.filter(x=>x.timestamp>=start.getTime()&&x.timestamp<end),vol=loaded.filter(x=>x.timestamp>=start.getTime()&&x.timestamp<end).reduce((n,x)=>n+x.volume,0),count=sessions.filter(x=>x.t>=start.getTime()&&x.t<end).length;weeks.push({label:start.toLocaleDateString(undefined,{month:'short',day:'numeric'}),sets:sets.length,volume:vol,sessions:count})}
 const peak=Math.max(1,...weeks.map(x=>x.volume));
 $('overallTrend').innerHTML='<div class="overall-bars">'+weeks.map(x=>'<div class="overall-week"><div class="overall-bar-value">'+(x.volume?Math.round(x.volume/100)/10+'k':'—')+'</div><div class="overall-bar-track"><span style="height:'+Math.max(x.volume?4:0,x.volume/peak*100)+'%"></span></div><b>'+x.label+'</b><small>'+x.sessions+' sess.</small></div>').join('')+'</div><div class="chart-legend"><span><i></i> Weekly loaded volume ('+unit()+')</span><span>Session count shown below each week</span></div>';
 const balance={};recentSets.forEach(x=>balance[x.muscle]=(balance[x.muscle]||0)+1);const maxBalance=Math.max(1,...Object.values(balance));
 $('overallBalance').innerHTML=Object.keys(balance).length?Object.entries(balance).sort((a,b)=>b[1]-a[1]).map(([m,n])=>'<div class="balance-row"><span>'+escapeHtml(m)+'</span><div><i style="width:'+(n/maxBalance*100)+'%"></i></div><b>'+n+'</b></div>').join(''):'<div class="chart-empty">Log completed working sets to build your muscle-group overview.</div>';
 const totalVol=loaded.reduce((n,x)=>n+x.volume,0),totalSets=completed.length,avg=recent.length?Math.round(recent.reduce((n,x)=>n+(Number(x.h.duration)||0),0)/recent.length/60):0;
 $('overallSummary').textContent=state.history.length?state.history.length+' total sessions · '+totalSets.toLocaleString()+' completed working sets · '+Math.round(totalVol).toLocaleString()+' '+unit()+' total loaded volume · '+avg+' min average session over the last 30 days.':'Your overall training summary will appear after your first completed workout.';
}
function renderProgress(){
 const previous=$('progressSelect').value,names=[...new Set(allExercises().map(x=>x.name))];
 $('progressSelect').innerHTML=names.map(n=>'<option>'+escapeHtml(n)+'</option>').join('');
 if(names.includes(previous))$('progressSelect').value=previous;
 const name=$('progressSelect').value,all=validWorkingSets(),completed=completedWorkingSets(),logs=all.filter(x=>x.exercise===name),exerciseSets=completed.filter(x=>x.exercise===name);
 renderOverallProgress(completed,all);
 const bestLoad=logs.reduce((m,x)=>Math.max(m,x.weight),0),bestReps=exerciseSets.reduce((m,x)=>Math.max(m,x.reps),0);
 const estimates=logs.filter(x=>x.e1rm!==null),bestE1rm=estimates.reduce((m,x)=>Math.max(m,x.e1rm),0);
 $('prValue').textContent=bestLoad?bestLoad+' '+unit():'—';$('prName').textContent=name||'Select an exercise';
 $('progressSets').textContent=all.length;$('progressSessions').textContent=state.history.length;
 $('estimatedOneRm').textContent=bestE1rm?bestE1rm.toFixed(1)+' '+unit():'—';
 $('bestReps').textContent=bestReps||'—';
 const cutoff7=Date.now()-7*86400000,cutoff30=Date.now()-30*86400000;
 const week=all.filter(x=>x.timestamp>=cutoff7),month=all.filter(x=>x.timestamp>=cutoff30),weekSets=completed.filter(x=>x.timestamp>=cutoff7);
 $('weeklyVolume').textContent=Math.round(week.reduce((n,x)=>n+x.volume,0)).toLocaleString()+' '+unit();
 $('monthlyVolume').textContent=Math.round(month.reduce((n,x)=>n+x.volume,0)).toLocaleString()+' '+unit();
 $('weeklyWorkingSets').textContent=weekSets.length;
 const useEstimates=estimates.length>=2,points=(useEstimates?logs.filter(x=>x.e1rm!==null):logs).slice(-12),width=320,height=132,pad=14,values=points.map(x=>useEstimates?x.e1rm:x.weight),maxVal=Math.max(1,...values),minVal=Math.min(0,...values),range=Math.max(1,maxVal-minVal);
 const coords=values.map((v,i)=>((pad+i*(width-2*pad)/Math.max(1,values.length-1))+','+(height-pad-(v-minVal)/range*(height-2*pad))));
 $('chart').innerHTML=points.length>1?'<svg viewBox="0 0 320 132" role="img" aria-label="Estimated one rep max trend"><polyline points="'+coords.join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+coords.map(p=>{const a=p.split(',');return '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="3.5" fill="var(--accent)"/>'}).join('')+'</svg><div class="chart-axis-note">'+(useEstimates?'Estimated 1RM (Epley) · last 12 working sets':'Logged load · last 12 working sets')+'</div>':'<div class="chart-empty">Log at least two completed working sets to see your trend.</div>';
 const selectedHistory=completed.filter(x=>x.exercise===name).slice().sort((a,b)=>b.timestamp-a.timestamp).slice(0,12);
 $('exerciseHistory').innerHTML=selectedHistory.length?selectedHistory.map(x=>'<div class="exercise-history-row"><span><b>'+escapeHtml(x.date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}))+'</b><small>'+escapeHtml(x.muscle)+' · '+(x.loaded?escapeHtml(x.weight)+' '+unit():'Bodyweight')+'</small></span><strong>'+x.reps+' reps</strong><em>'+(x.e1rm?('e1RM '+x.e1rm.toFixed(1)+' '+unit()):'Working set')+'</em></div>').join(''):'<div class="empty-inline">No saved working-set history for this exercise yet.</div>';
 const records={};all.forEach(x=>{const r=records[x.exercise]||(records[x.exercise]={load:0,reps:0,e1rm:0,muscle:x.muscle});r.load=Math.max(r.load,x.weight);r.reps=Math.max(r.reps,x.reps);if(x.e1rm)r.e1rm=Math.max(r.e1rm,x.e1rm)});
 $('prList').innerHTML=Object.keys(records).sort((a,b)=>records[b].load-records[a].load).slice(0,10).map(n=>'<div class="pr-row"><span>'+escapeHtml(n)+'<small class="record-sub">Best reps: '+records[n].reps+' · Est. 1RM: '+(records[n].e1rm?records[n].e1rm.toFixed(1)+' '+unit():'—')+'</small></span><b>'+records[n].load+' '+unit()+'</b></div>').join('')||'<div class="empty-inline">Your records will appear here after you complete working sets with a load and reps.</div>';
 const volume={};weekSets.forEach(x=>{volume[x.muscle]=(volume[x.muscle]||0)+1});const vmax=Math.max(1,...Object.values(volume));
 $('muscleVolume').innerHTML=Object.keys(volume).length?Object.entries(volume).sort((a,b)=>b[1]-a[1]).map(([m,n])=>'<div class="muscle-row"><b>'+escapeHtml(m)+'</b><div class="muscle-track"><span style="width:'+(n/vmax*100)+'%"></span></div><strong>'+n+'</strong></div>').join(''):'<div class="chart-empty">Complete working sets to see your weekly muscle-group volume.</div>';
 const measurements=(state.measurements||[]).slice().sort((a,b)=>b.timestamp-a.timestamp);
 $('measurementList').innerHTML=measurements.length?measurements.slice(0,8).map(x=>'<div class="measurement-row"><b>'+escapeHtml(x.date)+'</b><span>'+['bodyWeight','waist','chest','arm'].filter(k=>x[k]).map(k=>({bodyWeight:'Weight',waist:'Waist',chest:'Chest',arm:'Arm'}[k])+': '+escapeHtml(x[k])+' '+(k==='bodyWeight'?'kg':'cm')).join(' · ')+'</span></div>').join(''):'<div class="empty-inline">No body check-ins yet. Add one whenever you want to track a measurement.</div>';
}
function renderHistory(){$('historyList').innerHTML=state.history.length?state.history.map(h=>'<details class="history-card"><summary><span><b>'+escapeHtml(h.name)+'</b><small>'+escapeHtml(h.date)+' · '+formatTime(h.duration||0)+'</small></span><strong>'+((h.details||[]).length)+' sets</strong></summary><div class="history-detail">'+(h.details||[]).map(x=>'<div>'+escapeHtml(x.exercise)+' <b>'+escapeHtml(x.weight||'—')+' '+unit()+' × '+escapeHtml(x.reps||'—')+'</b><span> '+(x.setType||'working')+(x.rir!=null?' · RIR '+x.rir:'')+(x.rpe!=null?' · RPE '+x.rpe:'')+'</span></div>').join('')+'</div></details>').join(''):'<div class="empty-state">No workouts logged yet. Your completed sessions will show here.</div>'}
function renderSettings(){$('unitSetting').textContent=unit().toUpperCase();$('themeSetting').textContent=state.settings.theme==='light'?'Light':'Dark';}
function switchUnit(){const old=unit(),next=old==='kg'?'lb':'kg',factor=old==='kg'?2.20462262:1/2.20462262;if(!confirm('Convert all saved weights from '+old+' to '+next+'?'))return;Object.values(state.entries).forEach(v=>{if(v&&v.w!==''&&v.w!=null)v.w=Math.round(Number(v.w)*factor*10)/10});state.history.forEach(h=>(h.details||[]).forEach(x=>{if(x.weight!==''&&x.weight!=null)x.weight=Math.round(Number(x.weight)*factor*10)/10}));days.forEach(d=>d.items.forEach(x=>x.initial.forEach(v=>{if(v[0]!=null&&v[0]!=='')v[0]=Math.round(Number(v[0])*factor*10)/10})));state.settings.unit=next;save();render();showToast('Converted to '+next.toUpperCase())}
function switchTheme(){state.settings.theme=state.settings.theme==='light'?'dark':'light';save();applyTheme();renderSettings()}
function applyTheme(){document.body.classList.toggle('light-theme',state.settings.theme==='light')}
function exportBackup(){const data={version:4,state,days};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gymlog-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url)}
function importBackup(file){const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!data.state||!Array.isArray(data.days))throw Error();if(!confirm('Restore this backup? Current data will be replaced.'))return;state=data.state;state.entries=state.entries||{};state.history=state.history||[];days=normalizeDays(data.days);save();render();showToast('Backup restored')}catch(e){showToast('This file is not a valid GYMLOG backup')}};reader.readAsText(file)}
function bind(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 $('todayStart').onclick=startWorkout;$('startWorkout').onclick=startWorkout;$('finishWorkout').onclick=finishWorkout;$('pauseWorkout').onclick=pauseWorkout;$('resumeWorkout').onclick=resumeWorkout;$('discardWorkout').onclick=discardWorkout;$('addExercise').onclick=addExercise;$('addDay').onclick=addDay;$('renameDay').onclick=editDay;$('deleteDay').onclick=deleteDay;
 $('librarySearch').oninput=renderLibrary;$('equipmentFilter').onchange=renderLibrary;$('librarySort').onchange=renderLibrary;$('difficultyFilter').onchange=renderLibrary;$('favoritesOnly').onclick=()=>{$('favoritesOnly').classList.toggle('active');renderLibrary()};$('createCustomExercise').onclick=createCustomExercise;$('closeExerciseModal').onclick=()=>$('exerciseModal').classList.add('hidden');$('exerciseModal').onclick=e=>{if(e.target===$('exerciseModal'))$('exerciseModal').classList.add('hidden')};$('progressSelect').onchange=renderProgress;$('addMeasurement').onclick=addMeasurement;$('monthlyReport').onclick=exportMonthlyReport;$('exportBtn').onclick=exportBackup;$('exportBtn2').onclick=exportBackup;$('importInput').onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value=''};$('unitBtn').onclick=switchUnit;$('themeBtn').onclick=switchTheme;$('clearHistory').onclick=()=>{if(confirm('Permanently clear workout history?')){state.history=[];save();render();showToast('History cleared')}};
 $('timerClose').onclick=()=>{$('timerOverlay').classList.add('hidden');clearInterval(timer)};$('timerPlus').onclick=()=>{remaining+=15;tick()};$('timerMinus').onclick=()=>{remaining=Math.max(0,remaining-15);tick()};
}
function migrate(){
 // Preserve V1 numeric set keys by translating them to stable V3 exercise IDs.
 let changed=false;days.forEach((d,di)=>d.items.forEach((x,ei)=>{for(let si=0;si<x.sets;si++){const old=state.entries[di+'_'+ei+'_'+si];const fresh=d.id+'_'+x.id+'_'+si;if(old&&!state.entries[fresh]){state.entries[fresh]=old;changed=true}}}));
 if(changed)save();
}
migrate();save();bind();applyTheme();render();restoreSessionClock();loadExerciseVisualData();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();