const days=[
{name:"PUSH + TRICEPS",items:[
["Flat Bench Press",3,6,10,[[22.5,10],[25,10],[25,10]]],["Incline Bench Press",3,8,12,[[15,10],[15,10],[17.5,10]]],["Seated Chest Press Machine",3,10,12,[[20,12],[25,10],[30,10]]],["Cable Lateral Raise",3,12,15,[[9,10],[9,10],[9,10]]],["Straight-Bar Triceps Pushdown",3,10,12,[[39,10],[41,10],[41,8]]],["Overhead Cable Triceps Extension",3,10,15,[[23,10],[23,9],[23,8]]]]},
{name:"PULL + BICEPS",items:[
["Lat Pulldown",3,8,12,[[59,10],[59,10],[61.3,10]]],["Diverging Seated Row",3,8,12,[[32,10],[32,10],[32,10]]],["Seated Low Row",2,10,12,[[39,10],[39,12]]],["Reverse Butterfly",2,12,15,[[32,10],[32,10]]],["Seated Back Dumbbell Raise",3,10,10,[[14,10],[14,10],[16,10]]],["Incline Dumbbell Biceps Curl",3,8,12,[[10,10],[10,10],[10,10]]],["Straight-Bar Cable Curl",2,10,12,[[27,10],[27,10]]],["Hammer Curl",2,10,12,[[27,10],[27,10]]]]},
{name:"LOWER BODY A",items:[
["Barbell Squat",3,6,10,[]],["Leg Press",3,10,12,[]],["Leg Extension",3,12,15,[]],["Seated Leg Curl",2,10,15,[]],["Standing Calf Raise",3,12,15,[]],["Cable Crunch",3,12,15,[]]]},
{name:"REST",rest:true},
{name:"CHEST + BACK",items:[
["Incline Chest Press Machine",3,8,12,[[15,10],[20,10],[20,10]]],["Butterfly Chest / Pec Deck",3,12,15,[[45,10],[52,10],[54.3,10]]],["Neutral-Grip Lat Pulldown",3,10,12,[[52,10],[59,10],[59,10]]],["Divergent Seated Row",3,8,12,[[32,10],[32,10],[32,10]]],["Straight-Arm Cable Pulldown",2,12,15,[[18,12],[18,12]]],["Cable Chest Fly",2,12,15,[]]]},
{name:"ARMS + SHOULDERS",items:[
["Seated Shoulder Press",3,8,12,[[18,10],[18,10],[18,10]]],["Cable Lateral Raise",3,12,15,[[9,10],[9,10],[9,10]]],["Reverse Butterfly",3,12,15,[[25,10],[32,10],[32,10]]],["Incline Dumbbell Biceps Curl",3,10,12,[[10,12],[12,10],[12,10]]],["Straight Bar Biceps Curl",3,10,12,[[23,10],[25.3,10],[25.3,10]]],["Rope Hammer Curl",3,10,12,[[25.3,10],[25.3,10],[25.3,10]]],["Overhead Cable Triceps Extension",3,10,15,[[20.3,10],[20.3,10],[]]],["Straight-Bar Triceps Pushdown",3,10,12,[[36,12],[41,10],[41,10]]],["Reverse Wrist Curl",3,12,15,[[18,12],[18,12],[18,8]]],["Wrist Curl",3,12,15,[[14,12],[14,12],[16.3,10]]]]},
{name:"LOWER BODY B",items:[
["Romanian Deadlift",3,8,12,[]],["Hip Thrust",3,8,12,[]],["Bulgarian Split Squat",2,10,12,[]],["Seated Leg Curl",3,10,15,[]],["Seated Calf Raise",3,12,15,[]],["Hanging Leg Raise",3,10,15,[]],["Side Plank",2,30,45,[],"sec"]]},
{name:"REST",rest:true}];
const $=id=>document.getElementById(id),KEY="gymlog_pwa_v1";
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}state.entries||={};state.history||=[];let day=Number.isInteger(state.day)?state.day:0;
const save=()=>{state.day=day;localStorage.setItem(KEY,JSON.stringify(state))};
const sk=(d,e,s)=>`${d}_${e}_${s}`;
const val=(d,e,s)=>state.entries[sk(d,e,s)]||{w:days[d].items[e][4][s]?.[0]??"",r:days[d].items[e][4][s]?.[1]??"",done:false};
function patch(d,e,s,p){state.entries[sk(d,e,s)]={...val(d,e,s),...p};save()}
const exerciseCount=days.reduce((n,d)=>n+(d.items||[]).length,0);
const setCount=()=>Object.values(state.entries).filter(x=>x.done).length;
function draw(){
 $("cycle").textContent=`DAY ${day+1} / 8`;
 $("days").innerHTML=days.map((d,i)=>`<button class="day ${day===i?"active":""}" data-day="${i}">DAY ${i+1}<small>${d.rest?"REST":d.name.split(" ")[0]}</small></button>`).join("");
 $("days").querySelectorAll("button").forEach(b=>b.onclick=()=>{day=+b.dataset.day;save();draw()});
 const d=days[day],rest=!!d.rest;$("dayname").textContent=rest?"REST DAY":d.name;$("daymeta").textContent=rest?"Recovery and light cardio":`${d.items.length} exercises · ${d.items.reduce((a,x)=>a+x[1],0)} sets`;
 $("restPanel").classList.toggle("hidden",!rest);$("exerciseList").classList.toggle("hidden",rest);
 if(rest){$("cardio").checked=!!state.entries["cardio_"+day];$("restnote").value=state.entries["restnote_"+day]||""}
 let total=rest?1:d.items.reduce((a,x)=>a+x[1],0),done=rest?(state.entries["cardio_"+day]?1:0):d.items.reduce((a,x,e)=>a+Array.from({length:x[1]},(_,s)=>val(day,e,s).done?1:0).reduce((p,v)=>p+v,0),0);
 let pct=Math.round(done/total*100);$("percent").textContent=pct+"%";$("progressbar").style.width=pct+"%";
 $("exerciseList").innerHTML=rest?"":d.items.map((x,e)=>`<article class="exercise"><div class="exercise-title"><span>${x[0]}</span><span class="range">${x[1]} × ${x[2]}–${x[3]} ${x[5]||"reps"}</span></div>${Array.from({length:x[1]},(_,s)=>{let v=val(day,e,s);return `<div class="set"><div class="setnum">${s+1}</div><label><span class="fieldlabel">WEIGHT (KG)</span><input class="field weight" type="number" step=".1" min="0" inputmode="decimal" placeholder="kg" value="${v.w}" data-e="${e}" data-s="${s}"></label><label><span class="fieldlabel">${x[5]||"REPS"}</span><input class="field reps" type="number" min="0" inputmode="numeric" placeholder="${x[5]||"reps"}" value="${v.r}" data-e="${e}" data-s="${s}"></label><label class="check"><input type="checkbox" class="done" data-e="${e}" data-s="${s}" ${v.done?"checked":""}>Done</label></div>`}).join("")}</article>`).join("");
 $("exerciseList").querySelectorAll(".weight,.reps").forEach(el=>el.onchange=()=>{patch(day,+el.dataset.e,+el.dataset.s,{[el.classList.contains("weight")?"w":"r"]:el.value});drawStatsOnly()});
 $("exerciseList").querySelectorAll(".done").forEach(el=>el.onchange=()=>{patch(day,+el.dataset.e,+el.dataset.s,{done:el.checked});draw()});
 $("total").textContent=state.history.length;$("setsdone").textContent=setCount();$("excount").textContent=exerciseCount;
}
function drawStatsOnly(){let d=days[day],n=d.items.reduce((a,x)=>a+x[1],0),v=d.items.reduce((a,x,e)=>a+Array.from({length:x[1]},(_,s)=>val(day,e,s).done?1:0).reduce((p,z)=>p+z,0),0);$("percent").textContent=Math.round(v/n*100)+"%";$("progressbar").style.width=(v/n*100)+"%";$("setsdone").textContent=setCount()}
function finish(){
 const d=days[day];if(d.rest&&!state.entries["cardio_"+day]&&!confirm("Cardio isn't checked. Finish this rest day anyway?"))return;
 const details=[];if(!d.rest)d.items.forEach((x,e)=>{for(let s=0;s<x[1];s++){let v=val(day,e,s);if(v.w!==""||v.r!==""||v.done)details.push({exercise:x[0],set:s+1,weight:v.w,reps:v.r,done:v.done})}});
 state.history.unshift({date:new Date().toLocaleString(),day:day+1,name:d.name,details,cardio:!!state.entries["cardio_"+day],notes:state.entries["restnote_"+day]||""});save();draw();drawHistory();alert("Workout saved to your history! 💪")
}
function drawHistory(){$("historyList").innerHTML=state.history.length?state.history.map((h,i)=>`<details class="panel historyitem"><summary>${h.name} · Day ${h.day}<span class="muted" style="float:right;font-size:11px">${h.date}</span></summary><p>${h.details.map(x=>`${x.exercise} · Set ${x.set}: ${x.weight||"—"} kg × ${x.reps||"—"} ${x.done?"✓":""}`).join("<br>")||"No sets recorded."}${h.cardio?"<br>Cardio completed":""}${h.notes?"<br>"+h.notes:""}</p></details>`).join(""):'<div class="panel muted">No completed workouts yet. Finish a workout to see it here.</div>'}
function drawProgress(){
 let names=[...new Set(days.flatMap(d=>(d.items||[]).map(x=>x[0])))],sel=$("exerciseSelect"),old=sel.value;sel.innerHTML=names.map(n=>`<option>${n}</option>`).join("");if(names.includes(old))sel.value=old;
 let n=sel.value,records=[];state.history.slice().reverse().forEach(h=>h.details.filter(x=>x.exercise===n).forEach(x=>records.push({...x,date:h.date})));
 let last=records.at(-1),prev=records.at(-2);
 $("progressDetails").innerHTML=last?`<div class="muted tiny">Latest logged set</div><div style="font-size:25px;font-weight:850;margin-top:4px">${last.weight||"—"} kg × ${last.reps||"—"}</div><div class="tiny muted">${last.date}</div><p class="tiny">${prev?`Previous: <b>${prev.weight||"—"} kg × ${prev.reps||"—"}</b>`:"Log another session to compare."}</p><div class="tiny muted">Recorded sets: ${records.length}</div>${records.slice().reverse().slice(0,12).map(x=>`<div class="tiny" style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:8px 0"><span>${x.date}</span><b>${x.weight||"—"} kg × ${x.reps||"—"}</b></div>`).join("")}`:'<p class="muted tiny">No history for this exercise yet.</p>';
 $("stats").innerHTML=`Total workouts: <b>${state.history.length}</b><br><br>Sets marked complete: <b>${setCount()}</b><br><br>Exercises in routine: <b>${exerciseCount}</b>`
}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));["workout","progress","history"].forEach(t=>$(`${t}View`).classList.toggle("hidden",t!==b.dataset.tab));if(b.dataset.tab==="progress")drawProgress();if(b.dataset.tab==="history")drawHistory()});
$("prev").onclick=()=>{day=(day+7)%8;save();draw()};$("next").onclick=()=>{day=(day+1)%8;save();draw()};
$("reset").onclick=()=>{if(confirm("Clear today's completed checks? Weights and reps will stay.")){(days[day].items||[]).forEach((x,e)=>{for(let s=0;s<x[1];s++)patch(day,e,s,{done:false})});draw()}};
$("finish").onclick=finish;$("cardio").onchange=()=>{state.entries["cardio_"+day]=$("cardio").checked;save();draw()};$("restnote").onchange=()=>{state.entries["restnote_"+day]=$("restnote").value;save()};
$("exerciseSelect").onchange=drawProgress;
$("export").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="gymlog-backup.json";a.click();URL.revokeObjectURL(u)};
$("clearHistory").onclick=()=>{if(confirm("Delete all workout history? This cannot be undone.")){state.history=[];save();drawHistory();draw()}};
draw();drawHistory();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));

// ---- GYMLOG V2 customization layer ----
(function(){
 const originalDraw=draw;
 let restInterval=null,restRemaining=0;
 function persistRoutine(){state.routine=days;save()}
 function remapDeletedExercise(d,removed){
   const old={};Object.keys(state.entries).forEach(k=>{const m=k.match(/^(\d+)_(\d+)_(\d+)$/);if(m&&+m[1]===d)old[k]=state.entries[k]});
   Object.keys(old).forEach(k=>delete state.entries[k]);
   Object.keys(old).forEach(k=>{const m=k.match(/^(\d+)_(\d+)_(\d+)$/),idx=+m[2],s=m[3];if(idx<removed)state.entries[k]=old[k];else if(idx>removed)state.entries[d+"_"+(idx-1)+"_"+s]=old[k]});
 }
 function toolbar(){
   if(document.getElementById("v2tools"))return;
   const h=document.querySelector("header"),bar=document.createElement("div");bar.id="v2tools";bar.className="actions";bar.style.flexWrap="wrap";bar.innerHTML='<button class="btn" id="v2add">＋ Add exercise</button><button class="btn" id="v2editday">Edit day</button><button class="btn" id="v2addday">＋ Add day</button><button class="btn" id="v2delday">Delete day</button><button class="btn" id="v2unit">kg / lb</button><button class="btn" id="v2theme">Light / dark</button><button class="btn" id="v2backup">Backup</button><label class="btn" for="v2restore">Restore</label><input id="v2restore" type="file" accept="application/json" hidden>';
   h.insertAdjacentElement("afterend",bar);
   const timer=document.createElement("div");timer.id="v2timer";timer.className="panel hidden";timer.style.margin="10px 0";timer.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><div class="tiny muted">REST TIMER</div><strong id="v2time" style="font-size:28px">01:30</strong></div><div><button class="btn" id="v2minus">-15s</button> <button class="btn" id="v2plus">+15s</button> <button class="btn" id="v2stop">Stop</button></div></div>';
   document.getElementById("workoutView").insertBefore(timer,document.getElementById("exerciseList"));
   document.getElementById("v2add").onclick=addExercise;
   document.getElementById("v2editday").onclick=editDay;
   document.getElementById("v2addday").onclick=addDay;
   document.getElementById("v2delday").onclick=deleteDay;
   document.getElementById("v2unit").onclick=toggleUnit;
   document.getElementById("v2theme").onclick=toggleTheme;
   document.getElementById("v2backup").onclick=backup;
   document.getElementById("v2restore").onchange=restore;
   document.getElementById("v2stop").onclick=stopTimer;
   document.getElementById("v2plus").onclick=()=>changeTimer(15);
   document.getElementById("v2minus").onclick=()=>changeTimer(-15);
 }
 function decorate(){
   const cards=document.querySelectorAll("#exerciseList .exercise");
   cards.forEach((card,i)=>{
     if(card.querySelector(".v2edit"))return;
     const head=card.querySelector(".exercise-title");if(!head)return;
     const actions=document.createElement("div");actions.className="actions";actions.style.margin="5px 0 0";actions.innerHTML='<button class="btn v2edit" style="padding:5px 9px;font-size:11px">Edit exercise</button><button class="btn v2delete" style="padding:5px 9px;font-size:11px">Delete</button><button class="btn v2rest" style="padding:5px 9px;font-size:11px">Rest timer</button>';
     head.insertAdjacentElement("afterend",actions);
     actions.querySelector(".v2edit").onclick=()=>editExercise(i);
     actions.querySelector(".v2delete").onclick=()=>deleteExercise(i);
     actions.querySelector(".v2rest").onclick=()=>startTimer(90);
   });
 }
 function addExercise(){
   const name=prompt("Exercise name:");if(!name||!name.trim())return;
   const sets=Number(prompt("Number of sets:","3")),min=Number(prompt("Minimum reps:","8")),max=Number(prompt("Maximum reps:","12"));
   if(!Number.isInteger(sets)||sets<1||sets>20||min<1||max<min)return alert("Please enter valid sets and rep ranges.");
   const unit=prompt("Unit: reps or sec","reps")||"reps",superset=prompt("Superset group (optional):","")||"";
   days[day].items.push([name.trim(),sets,min,max,[],unit,superset]);
   persistRoutine();draw();
 }
 function editExercise(i){
   const x=days[day].items[i],name=prompt("Exercise name:",x[0]);if(name===null)return;
   const sets=Number(prompt("Sets:",String(x[1]))),min=Number(prompt("Minimum reps / seconds:",String(x[2]))),max=Number(prompt("Maximum reps / seconds:",String(x[3])));
   if(!name.trim()||!Number.isInteger(sets)||sets<1||sets>20||min<1||max<min)return alert("Invalid exercise details.");
   x[0]=name.trim();x[1]=sets;x[2]=min;x[3]=max;
   x[5]=prompt("Unit: reps or sec:",x[5]||"reps")||"reps";x[6]=prompt("Superset group (optional):",x[6]||"")||"";
   while(x[4].length<sets)x[4].push([]);x[4].length=sets;
   persistRoutine();draw();
 }
 function deleteExercise(i){
   const x=days[day].items[i];if(!confirm("Delete "+x[0]+" from this workout?"))return;
   remapDeletedExercise(day,i);days[day].items.splice(i,1);persistRoutine();draw();
 }
 function editDay(){const n=prompt("Workout day name:",days[day].name);if(n===null)return;days[day].name=n.trim()||days[day].name;persistRoutine();draw()}
 function addDay(){const n=prompt("New workout day name:","NEW WORKOUT");if(!n||!n.trim())return;days.splice(day+1,0,{name:n.trim(),items:[]});day++;persistRoutine();draw()}
 function deleteDay(){if(days.length<2)return alert("You need at least one workout day.");if(!confirm("Delete this day from your cycle?"))return;days.splice(day,1);day=Math.min(day,days.length-1);persistRoutine();draw()}
 function toggleUnit(){state.settings=state.settings||{};const toLb=state.settings.unit!=="lb",factor=toLb?2.20462262:1/2.20462262;Object.values(state.entries).forEach(v=>{if(v&&v.w!==undefined&&v.w!=="")v.w=String(Math.round(Number(v.w)*factor*10)/10)});state.history.forEach(h=>(h.details||[]).forEach(v=>{if(v.weight!==undefined&&v.weight!=="")v.weight=String(Math.round(Number(v.weight)*factor*10)/10)}));days.forEach(d=>(d.items||[]).forEach(x=>{if(Array.isArray(x)&&Array.isArray(x[4]))x[4].forEach(s=>{if(s&&s[0]!==undefined&&s[0]!=="")s[0]=Math.round(Number(s[0])*factor*10)/10})}));state.settings.unit=toLb?"lb":"kg";persistRoutine();draw();alert("Weights converted to "+state.settings.unit.toUpperCase()+".")}
 function toggleTheme(){state.settings=state.settings||{};state.settings.light=!state.settings.light;save();document.body.classList.toggle("light-mode",!!state.settings.light)}
 function backup(){const data={state:state,days:days},blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="gymlog-backup.json";a.click();URL.revokeObjectURL(url)}
 function restore(e){const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!data.state||!Array.isArray(data.days))throw Error();if(!confirm("Restore backup? Current data will be replaced."))return;state=data.state;days=data.days;save();draw();alert("Backup restored.")}catch(err){alert("Invalid GYMLOG backup file.")}};reader.readAsText(f);e.target.value=""}
 function startTimer(seconds){stopTimer();restRemaining=seconds;document.getElementById("v2timer").classList.remove("hidden");tick();restInterval=setInterval(()=>{restRemaining--;tick();if(restRemaining<=0){stopTimer(false);document.getElementById("v2time").textContent="REST COMPLETE";if(navigator.vibrate)navigator.vibrate([180,100,180])}},1000)}
 function tick(){document.getElementById("v2time").textContent=Math.floor(restRemaining/60)+":"+String(restRemaining%60).padStart(2,"0")}
 function changeTimer(n){restRemaining=Math.max(0,restRemaining+n);tick()}
 function stopTimer(hide=true){clearInterval(restInterval);restInterval=null;if(hide)document.getElementById("v2timer").classList.add("hidden")}
 // Load previously customized routine while retaining the original logged set values.
 if(Array.isArray(state.routine)&&state.routine.length){days.splice(0,days.length,...state.routine)}
 const priorDraw=draw;
 draw=function(){priorDraw();toolbar();decorate();document.body.classList.toggle("light-mode",!!state.settings?.light);document.getElementById("cycle").textContent="DAY "+(day+1)+" / "+days.length;document.getElementById("excount").textContent=days.reduce((n,d)=>n+(d.items||[]).length,0);document.querySelectorAll("#exerciseList .fieldlabel").forEach(el=>{if(el.textContent.includes("WEIGHT"))el.textContent="WEIGHT ("+(state.settings?.unit||"kg").toUpperCase()+")"})};
 draw();
})();