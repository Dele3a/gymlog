/* GYMLOG V3 — premium training tracker. Local-first, installable PWA. */
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
const unit=()=>state.settings.unit||'kg';
function save(){state.day=day;localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(ROUTINE,JSON.stringify(days))}
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function allExercises(){return days.flatMap(d=>d.items||[])}
function totalSets(){return allExercises().reduce((n,x)=>n+x.sets,0)}
function doneSets(){return Object.values(state.entries).filter(x=>x&&x.done).length}
function key(d,e,s){return days[d].id+'_'+days[d].items[e].id+'_'+s}
function getSet(d,e,s){const k=key(d,e,s);if(!state.entries[k]){const x=days[d].items[e],seed=x.initial[s]||[];state.entries[k]={w:seed[0]??'',r:seed[1]??'',done:false}}return state.entries[k]}
function updateSet(d,e,s,p){state.entries[key(d,e,s)]=Object.assign({},getSet(d,e,s),p);save()}
function latestFor(name){const out=[];state.history.slice().reverse().forEach(h=>(h.details||[]).filter(x=>x.exercise===name).forEach(x=>out.push(x)));return out}
function estimateSuggestion(x){const logs=latestFor(x.name);if(!logs.length)return 'Log your first session to unlock progression tips.';const last=logs.slice(-x.sets),valid=last.filter(z=>Number(z.reps)>0);if(!valid.length)return 'Complete your sets to receive a recommendation.';if(valid.length>=x.sets&&valid.every(z=>Number(z.reps)>=x.max)){const w=Math.max.apply(null,valid.map(z=>Number(z.weight)||0));return 'Target: increase by '+(unit()==='kg'?'2–2.5 kg':'5 lb')+' next session, keeping reps in range.'}return 'Target: add 1 rep to one or more sets while maintaining good technique.'}
function stats(){const workouts=state.history.length,vol=state.history.reduce((a,h)=>a+(h.details||[]).reduce((b,x)=>b+(Number(x.weight)||0)*(Number(x.reps)||0),0),0),prs={};state.history.forEach(h=>(h.details||[]).forEach(x=>{prs[x.exercise]=Math.max(prs[x.exercise]||0,Number(x.weight)||0)}));return {workouts,vol,prs,prCount:Object.keys(prs).length}}
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
 $('workoutContent').querySelectorAll('[data-set]').forEach(el=>el.onchange=()=>{const e=+el.dataset.exercise,si=+el.dataset.set,prop=el.dataset.prop;updateSet(day,e,si,{[prop]:prop==='done'?el.checked:el.value});renderToday();renderWorkoutProgress()});
 $('workoutContent').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editExercise(+b.dataset.edit));$('workoutContent').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeExercise(+b.dataset.remove));$('workoutContent').querySelectorAll('[data-timer]').forEach(b=>b.onclick=()=>startTimer(+b.dataset.timer));
 $('dayDone').textContent=(items.reduce((a,x,e)=>a+Array.from({length:x.sets},(_,i)=>getSet(day,e,i).done?1:0).reduce((p,v)=>p+v,0),0))+'/'+items.reduce((a,x)=>a+x.sets,0)+' sets done';
}
function exerciseCard(x,e){
 const logs=latestFor(x.name),last=logs[logs.length-1],hint=estimateSuggestion(x);
 return '<article class="lift-card"><div class="lift-head"><div><div class="muscle-tag">'+escapeHtml(x.muscle)+' · '+escapeHtml(x.equipment)+(x.superset?' · SUPERSET '+escapeHtml(x.superset):'')+'</div><h3>'+escapeHtml(x.name)+'</h3><div class="lift-sub">'+x.sets+' sets · '+x.min+'–'+x.max+' '+escapeHtml(x.unit)+'</div></div><button class="icon-btn" data-edit="'+e+'" aria-label="Edit exercise">•••</button></div><div class="set-head"><span>SET</span><span>LOAD ('+unit().toUpperCase()+')</span><span>'+escapeHtml(x.unit.toUpperCase())+'</span><span>DONE</span></div>'+Array.from({length:x.sets},(_,si)=>{const v=getSet(day,e,si);return '<div class="set-row"><b>'+(si+1)+'</b><input type="number" min="0" step=".5" inputmode="decimal" placeholder="—" value="'+escapeHtml(v.w)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="w"><input type="number" min="0" step="1" inputmode="numeric" placeholder="—" value="'+escapeHtml(v.r)+'" data-set="'+si+'" data-exercise="'+e+'" data-prop="r"><label class="done-toggle"><input type="checkbox" '+(v.done?'checked':'')+' data-set="'+si+'" data-exercise="'+e+'" data-prop="done"><span></span></label></div>'}).join('')+'<div class="coach-note"><span>↗ COACH TIP</span><p>'+escapeHtml(hint)+'</p></div><div class="lift-actions"><button class="text-btn" data-timer="'+x.rest+'">◷ '+x.rest+'s rest</button><button class="text-btn" data-remove="'+e+'">Remove</button></div></article>';
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
function startWorkout(){sessionStart=Date.now();sessionSeconds=0;clearInterval(sessionTicker);sessionTicker=setInterval(()=>{sessionSeconds=Math.floor((Date.now()-sessionStart)/1000);$('sessionClock').textContent=formatTime(sessionSeconds)},1000);setTab('workout')}
function formatTime(n){return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function finishWorkout(){
 const d=days[day],details=[];d.items.forEach((x,e)=>{for(let si=0;si<x.sets;si++){const v=getSet(day,e,si);if(v.w!==''||v.r!==''||v.done)details.push({exercise:x.name,set:si+1,weight:v.w,reps:v.r,done:v.done,muscle:x.muscle})}});
 if(!d.rest&&!details.length)return showToast('Log at least one set before finishing.');
 const timestamp=Date.now();state.history.unshift({id:uid(),timestamp,date:new Date(timestamp).toLocaleString(),day:day+1,name:d.name,details,duration:sessionStart?Math.floor((timestamp-sessionStart)/1000):sessionSeconds});clearInterval(sessionTicker);sessionStart=null;save();render();showToast('Workout saved. Strong work.');
}
function startTimer(n){clearInterval(timer);remaining=n;$('timerOverlay').classList.remove('hidden');tick();timer=setInterval(()=>{remaining--;tick();if(remaining<=0){clearInterval(timer);$('timerValue').textContent='DONE';if(navigator.vibrate)navigator.vibrate([180,100,180])}},1000)}
function tick(){ $('timerValue').textContent=formatTime(Math.max(0,remaining)) }
function renderLibrary(){
 const all=allExercises(),muscles=['All',...new Set(all.map(x=>x.muscle))],tools=['All',...new Set(all.map(x=>x.equipment))];$('muscleFilters').innerHTML=muscles.map(m=>'<button class="filter-chip '+(filter===m?'active':'')+'" data-filter="'+escapeHtml(m)+'">'+escapeHtml(m)+'</button>').join('');$('muscleFilters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;renderLibrary()});
 const q=$('librarySearch').value.toLowerCase(),matches=all.filter(x=>(filter==='All'||x.muscle===filter)&&(x.name.toLowerCase().includes(q)||x.muscle.toLowerCase().includes(q)||x.equipment.toLowerCase().includes(q)));$('libraryCount').textContent=matches.length+' exercises';$('libraryList').innerHTML=matches.map(x=>'<div class="library-item"><div class="lib-icon">'+escapeHtml(x.muscle.slice(0,2).toUpperCase())+'</div><div class="lib-info"><b>'+escapeHtml(x.name)+'</b><span>'+escapeHtml(x.muscle)+' · '+escapeHtml(x.equipment)+'</span></div><span class="lib-range">'+x.sets+' × '+x.min+'–'+x.max+'</span></div>').join('')||'<div class="empty-state">No exercises match that search.</div>';
}
function renderProgress(){
 const s=stats(),names=[...new Set(allExercises().map(x=>x.name))];$('progressSelect').innerHTML=names.map(n=>'<option>'+escapeHtml(n)+'</option>').join('');const name=$('progressSelect').value,logs=latestFor(name),max=logs.reduce((m,x)=>Math.max(m,Number(x.weight)||0),0);$('prValue').textContent=max?max+' '+unit():'—';$('prName').textContent=name||'Personal record';$('progressSets').textContent=logs.length;$('progressSessions').textContent=s.workouts;
 const points=logs.slice(-12).map(x=>Number(x.weight)||0),width=320,height=116,pad=12,maxVal=Math.max(1,...points),minVal=Math.min(0,...points),range=Math.max(1,maxVal-minVal),coords=points.map((v,i)=>((pad+i*(width-2*pad)/Math.max(1,points.length-1))+','+(height-pad-(v-minVal)/range*(height-2*pad))));$('chart').innerHTML=points.length>1?'<svg viewBox="0 0 320 116" role="img" aria-label="Recent working weights"><polyline points="'+coords.join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+coords.map(p=>{const a=p.split(',');return '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="3.5" fill="var(--accent)"/>'}).join('')+'</svg>':'<div class="chart-empty">Log at least two sessions to see your trend.</div>';
 $('prList').innerHTML=Object.keys(s.prs).sort((a,b)=>s.prs[b]-s.prs[a]).slice(0,8).map(n=>'<div class="pr-row"><span>'+escapeHtml(n)+'</span><b>'+s.prs[n]+' '+unit()+'</b></div>').join('')||'<div class="empty-inline">Your records will appear here as you train.</div>';
}
function renderHistory(){$('historyList').innerHTML=state.history.length?state.history.map(h=>'<details class="history-card"><summary><span><b>'+escapeHtml(h.name)+'</b><small>'+escapeHtml(h.date)+'</small></span><strong>'+((h.details||[]).length)+' sets</strong></summary><div class="history-detail">'+(h.details||[]).map(x=>'<div>'+escapeHtml(x.exercise)+' <b>'+escapeHtml(x.weight||'—')+' '+unit()+' × '+escapeHtml(x.reps||'—')+'</b></div>').join('')+'</div></details>').join(''):'<div class="empty-state">No workouts logged yet. Your completed sessions will show here.</div>'}
function renderSettings(){$('unitSetting').textContent=unit().toUpperCase();$('themeSetting').textContent=state.settings.theme==='light'?'Light':'Dark';}
function switchUnit(){const old=unit(),next=old==='kg'?'lb':'kg',factor=old==='kg'?2.20462262:1/2.20462262;if(!confirm('Convert all saved weights from '+old+' to '+next+'?'))return;Object.values(state.entries).forEach(v=>{if(v&&v.w!==''&&v.w!=null)v.w=Math.round(Number(v.w)*factor*10)/10});state.history.forEach(h=>(h.details||[]).forEach(x=>{if(x.weight!==''&&x.weight!=null)x.weight=Math.round(Number(x.weight)*factor*10)/10}));days.forEach(d=>d.items.forEach(x=>x.initial.forEach(v=>{if(v[0]!=null&&v[0]!=='')v[0]=Math.round(Number(v[0])*factor*10)/10})));state.settings.unit=next;save();render();showToast('Converted to '+next.toUpperCase())}
function switchTheme(){state.settings.theme=state.settings.theme==='light'?'dark':'light';save();applyTheme();renderSettings()}
function applyTheme(){document.body.classList.toggle('light-theme',state.settings.theme==='light')}
function exportBackup(){const data={version:3,state,days};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gymlog-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url)}
function importBackup(file){const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!data.state||!Array.isArray(data.days))throw Error();if(!confirm('Restore this backup? Current data will be replaced.'))return;state=data.state;state.entries=state.entries||{};state.history=state.history||[];days=normalizeDays(data.days);save();render();showToast('Backup restored')}catch(e){showToast('This file is not a valid GYMLOG backup')}};reader.readAsText(file)}
function bind(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 $('todayStart').onclick=startWorkout;$('startWorkout').onclick=startWorkout;$('finishWorkout').onclick=finishWorkout;$('addExercise').onclick=addExercise;$('addDay').onclick=addDay;$('renameDay').onclick=editDay;$('deleteDay').onclick=deleteDay;
 $('librarySearch').oninput=renderLibrary;$('progressSelect').onchange=renderProgress;$('exportBtn').onclick=exportBackup;$('exportBtn2').onclick=exportBackup;$('importInput').onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value=''};$('unitBtn').onclick=switchUnit;$('themeBtn').onclick=switchTheme;$('clearHistory').onclick=()=>{if(confirm('Permanently clear workout history?')){state.history=[];save();render();showToast('History cleared')}};
 $('timerClose').onclick=()=>{$('timerOverlay').classList.add('hidden');clearInterval(timer)};$('timerPlus').onclick=()=>{remaining+=15;tick()};$('timerMinus').onclick=()=>{remaining=Math.max(0,remaining-15);tick()};
}
function migrate(){
 // Preserve V1 numeric set keys by translating them to stable V3 exercise IDs.
 let changed=false;days.forEach((d,di)=>d.items.forEach((x,ei)=>{for(let si=0;si<x.sets;si++){const old=state.entries[di+'_'+ei+'_'+si];const fresh=d.id+'_'+x.id+'_'+si;if(old&&!state.entries[fresh]){state.entries[fresh]=old;changed=true}}}));
 if(changed)save();
}
migrate();save();bind();applyTheme();render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();