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
