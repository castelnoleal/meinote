/* =====================================================================
   MeiNote · V.6 FEATURES
   1. Live output    – the Generated Output box rebuilds while you type
   2. Note history   – round button at the bottom right; every note is kept,
                       even after Clear, and can be restored or copied
   3. Callback alarms – bell button in the header; rings, notifies, snoozes
   4. Small helpers   – recent templates, restore after reload, shortcuts
   Everything is saved in this browser only (localStorage). Nothing is sent anywhere.
   ===================================================================== */
(function(){
"use strict";

/* ---------- Settings you may want to change ---------- */
var HISTORY_DAYS_DEFAULT = 30;        // how long notes stay in history
var DELETED_DAYS = 7;                 // how long deleted notes can be brought back
var HISTORY_MAX = 1500;               // safety limit on stored notes
var ALARM_VOLUME = 0.7;               // 0 to 1
var SENSITIVE = /account\s*(number|#|no)|routing|acnt\s*#|card\s*number/i;  // fields saved as last 4 digits only

/* ---------- Helpers ---------- */
var SHIFT = MEINOTE.shift;
var K = {hist:"meinote.history.v1", alarms:"meinote.alarms.v1", recent:"meinote.recent.v1", set:"meinote.settings.v1"};
var store = {
  get:function(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } },
  set:function(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
var settings = Object.assign({retention:HISTORY_DAYS_DEFAULT, sound:"chime"}, store.get(K.set,{}));
function saveSettings(){ store.set(K.set,settings); }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function pad(n){ return String(n).padStart(2,"0"); }
function fmtClock(ts,tz){ return new Date(ts).toLocaleTimeString([], {hour:"numeric",minute:"2-digit",timeZone:tz||undefined}); }
function toast(m,t){ if(typeof window.showToast==="function") window.showToast(m,t||"success"); }
function curTpl(){ try{ return currentTemplate; }catch(e){ return ""; } }
function tplOnly(){ try{ return templateOnly; }catch(e){ return false; } }
function copyText(t){
  if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(t).then(function(){ toast("✅ Copied to Clipboard"); }); return; }
  var ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); toast("✅ Copied to Clipboard"); }catch(e){} ta.remove();
}
/* Modal shell in the same style as the CSAT panel: blue bar, white body */
function modalShell(id, title, widthClass){
  var m=document.createElement("div");
  m.id=id; m.className="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
  m.innerHTML='<div class="bg-white dark:bg-slate-800 '+widthClass+' max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">'+
    '<div class="bg-blue-900 text-white px-4 py-3 flex justify-between items-center"><h2 class="font-semibold">'+title+'</h2>'+
    '<button type="button" data-close class="text-red-300 hover:text-white text-lg" aria-label="Close">✕</button></div>'+
    '<div class="mei-modal-body overflow-y-auto"></div></div>';
  document.body.appendChild(m);
  m.addEventListener("click",function(e){ if(e.target===m || e.target.closest("[data-close]")) m.classList.add("hidden"); });
  return m;
}

var out = $("outputArea");
var origGenerate = window.generateNote;
var origCopy = window.copyToClipboard;
var origClear = window.clearOutput;
var origSwitch = window.switchTemplate;
var origToggleTpl = window.toggleTemplateOnly;

/* ---------- Field snapshots (for history / restore) ---------- */
function snapFields(){
  var f={};
  document.querySelectorAll("#fields input, #fields select, #fields textarea").forEach(function(el){
    if(!el.id) return;
    f[el.id] = (el.type==="checkbox"||el.type==="radio") ? (el.checked?"__on":"__off") : el.value;
  });
  return f;
}
function last4(v){ v=String(v||""); var d=v.replace(/\s/g,""); return d.length<=4 ? v : "••••"+d.slice(-4); }
function labelFor(el){
  var l=el.previousElementSibling;
  while(l && !(l.classList && l.classList.contains("lbl"))) l=l.previousElementSibling;
  if(!l && el.parentNode) l=el.parentNode.querySelector(".lbl");
  return l ? l.textContent : "";
}
function safeFields(){
  var f=snapFields();
  document.querySelectorAll("#fields input").forEach(function(el){ if(el.id && f[el.id] && SENSITIVE.test(labelFor(el))) f[el.id]=last4(f[el.id]); });
  return f;
}
function safeText(t){
  return String(t||"").split("\n").map(function(l){
    var m=l.match(/^([^:]{0,40}):\s*(.+)$/);
    return (m && SENSITIVE.test(m[1]) && /\d{5,}/.test(m[2].replace(/\s/g,""))) ? m[1]+": "+last4(m[2].trim()) : l;
  }).join("\n");
}
function applyFields(f){
  Object.keys(f||{}).forEach(function(id){
    var el=$(id); if(!el) return;
    if(el.type==="checkbox"||el.type==="radio") el.checked = f[id]==="__on"; else el.value=f[id];
  });
}
function hasUserInput(){
  var any=false;
  document.querySelectorAll("#fields input:not([type=checkbox]):not([type=radio]), #fields textarea").forEach(function(el){ if(el.value.trim()) any=true; });
  return any;
}

/* =====================================================================
   1. LIVE OUTPUT
   ===================================================================== */
var outLabel = out.previousElementSibling;           // "Generated Output"
var liveInfo = document.createElement("span");
liveInfo.id="meiLiveInfo"; liveInfo.className="mei-live-info";
outLabel.appendChild(liveInfo);
var view = document.createElement("div");
view.id="meiOutputView"; view.className="inp h-96 font-mono mei-output"; view.setAttribute("aria-live","polite");
out.parentNode.insertBefore(view,out);
out.classList.add("mei-hidden-output");

var prevLines=[];
var HEADER_LINES={"Discussed w. C:":1};
function renderLive(flash){
  var text=out.value||"";
  if(!text){
    view.innerHTML='<span class="mei-placeholder">'+(curTpl() ? "Output cleared. Type in the form to rebuild the note." : "Choose a template. The note builds here as you type.")+'</span>';
    liveInfo.textContent=""; prevLines=[]; return;
  }
  var lines=text.split("\n"), empty=0, html="";
  lines.forEach(function(l,i){
    var t=l.trim(), next=(lines[i+1]||"").trim();
    var isEmpty = /^[^:]{1,70}:\s*$/.test(t) && !HEADER_LINES[t] && !/^[-•*]/.test(next);
    if(isEmpty) empty++;
    var cls = (isEmpty?" mei-empty":"") + (flash && prevLines[i]!==l ? " mei-changed":"");
    html+='<div class="mei-line'+cls+'">'+(esc(l)||"&nbsp;")+'</div>';
  });
  view.innerHTML=html; prevLines=lines;
  liveInfo.textContent = "Live · " + (empty ? empty+" empty "+(empty===1?"field":"fields") : "all fields filled");
  liveInfo.classList.toggle("has-empty", empty>0);
}
var holdEmpty=false;    // after Clear, keep the box empty until the next edit
function liveGenerate(flash){
  if(!curTpl()){ out.value=""; renderLive(false); return; }
  if(holdEmpty){ renderLive(false); return; }
  try{ origGenerate(); }catch(e){ console.warn("MeiNote live output:",e); }
  renderLive(flash!==false);
  queueDraft();
}
var fieldsEl=$("fields"), liveTimer=null;
function onFieldEdit(){ holdEmpty=false; clearTimeout(liveTimer); liveTimer=setTimeout(function(){ liveGenerate(true); },60); }
fieldsEl.addEventListener("input",onFieldEdit);
fieldsEl.addEventListener("change",onFieldEdit);
new MutationObserver(function(){ clearTimeout(liveTimer); liveTimer=setTimeout(function(){ liveGenerate(false); },80); }).observe(fieldsEl,{childList:true,subtree:true});

/* =====================================================================
   2. NOTE HISTORY
   One entry per note: it is updated while you type and gets a new
   version each time you Generate, Copy or Clear.
   ===================================================================== */
var hist = store.get(K.hist,[]);
var session = null;
var bubble, panel;
function purge(){
  var now=Date.now(), keep=settings.retention*864e5;
  hist = hist.filter(function(h){ return now-h.updated < keep && !(h.deletedAt && now-h.deletedAt > DELETED_DAYS*864e5); }).slice(0,HISTORY_MAX);
}
function saveHist(){ store.set(K.hist,hist); if(bubble) updateBubble(); }
purge(); saveHist();
function findSession(){ return session ? hist.find(function(h){ return h.id===session; }) : null; }
function upsert(action){
  if(!curTpl()) return null;
  var text=safeText(out.value||""), h=findSession();
  if(!h){
    if(!hasUserInput() && action!=="generated" && action!=="copied") return null;
    h={id:uid(), shift:SHIFT, template:curTpl(), tplOnly:tplOnly(), created:Date.now(), updated:Date.now(), tags:[], text:text, fields:{}, versions:[]};
    hist.unshift(h); session=h.id;
  }
  h.updated=Date.now(); h.text=text; h.fields=safeFields(); h.template=curTpl(); h.tplOnly=tplOnly();
  if(action!=="draft"){
    if(h.tags.indexOf(action)<0) h.tags.push(action);
    var last=h.versions[h.versions.length-1];
    if(text && (!last || last.text!==text)) h.versions.push({at:Date.now(), action:action, text:text, fields:h.fields});
    if(h.versions.length>12) h.versions.splice(0,h.versions.length-12);
  }
  delete h.deletedAt;
  saveHist(); if(panel && !panel.classList.contains("hidden")) renderHist();
  return h;
}
var draftTimer=null;
function queueDraft(){ clearTimeout(draftTimer); draftTimer=setTimeout(function(){ if(hasUserInput()) upsert("draft"); },900); }
function flushDraft(){ clearTimeout(draftTimer); clearTimeout(liveTimer); if(curTpl() && hasUserInput()){ try{ origGenerate(); }catch(e){} upsert("draft"); } }
window.addEventListener("beforeunload",flushDraft);

/* Hook into the app's buttons */
window.generateNote = function(){
  if(!curTpl()){ toast("Select a template first","danger"); return; }
  holdEmpty=false; origGenerate(); renderLive(true); upsert("generated");
};
window.copyToClipboard = function(){ origCopy(); if(out.value) upsert("copied"); };
window.clearOutput = function(){
  if(out.value && hasUserInput()) upsert("cleared");
  origClear(); session=null; holdEmpty=true; renderLive(false);
};
window.switchTemplate = function(){
  flushDraft(); session=null; holdEmpty=false;
  origSwitch();
  var t=$("template").value; if(t && curTpl()===t) pushRecent(t);
  setTimeout(function(){ liveGenerate(false); },90);
};
window.toggleTemplateOnly = function(btn){ origToggleTpl(btn); liveGenerate(true); };

function restoreEntry(id,verIdx){
  var h=hist.find(function(x){ return x.id===id; }); if(!h) return;
  var v=(verIdx!=null && h.versions[verIdx]) ? h.versions[verIdx] : h;
  var sel=$("template"); sel.value=h.template;
  if(sel.value!==h.template){ toast("That template isn't in this version","danger"); return; }
  window.switchTemplate();
  setTimeout(function(){
    applyFields(v.fields||h.fields);
    if(!!h.tplOnly !== !!tplOnly()) window.toggleTemplateOnly($("meiTplMode"));
    session=h.id; liveGenerate(true);
    toast("Restored "+h.template+" note");
  },160);
}

/* History button (bottom right) and panel */
bubble=document.createElement("button");
bubble.id="meiHistoryBtn"; bubble.type="button"; bubble.title="Note History (Alt+H)";
bubble.innerHTML='<i class="fas fa-clock-rotate-left"></i><b hidden></b>';
document.body.appendChild(bubble);
panel=document.createElement("div");
panel.id="meiHistory"; panel.className="hidden";
panel.innerHTML=
  '<div class="bg-blue-900 text-white px-4 py-3 flex justify-between items-center"><h2 class="font-semibold">Note History</h2>'+
  '<button type="button" data-close class="text-red-300 hover:text-white text-lg" aria-label="Close">✕</button></div>'+
  '<div class="p-3 border-b border-slate-200 dark:border-slate-700">'+
  '<input id="meiHistSearch" class="inp" style="margin-bottom:8px" placeholder="Search notes, templates, DS numbers...">'+
  '<div class="mei-tabs"><button type="button" data-tab="today" class="on">Today</button><button type="button" data-tab="all">All</button><button type="button" data-tab="deleted">Deleted</button></div></div>'+
  '<div id="meiHistList" class="flex-1 overflow-y-auto p-3 space-y-2"></div>'+
  '<div class="px-3 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">Keep for '+
  '<select id="meiHistDays" class="border rounded px-1 dark:bg-slate-700 dark:border-slate-600"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option><option value="90">90 days</option></select>'+
  '<button type="button" id="meiHistExport" class="ml-auto border rounded px-2 py-1 dark:border-slate-600">Export</button></div>';
document.body.appendChild(panel);

var tab="today", openId=null, openVer={};
var listEl=$("meiHistList"), searchEl=$("meiHistSearch"), daysEl=$("meiHistDays");
daysEl.value=String(settings.retention);
daysEl.onchange=function(){ settings.retention=+daysEl.value; saveSettings(); purge(); saveHist(); renderHist(); };
function isToday(ts){ return new Date(ts).toDateString()===new Date().toDateString(); }
function updateBubble(){
  var n=hist.filter(function(h){ return !h.deletedAt && isToday(h.updated); }).length;
  var b=bubble.querySelector("b"); b.hidden=!n; b.textContent=n>99?"99+":n;
}
function visible(){
  var q=searchEl.value.trim().toLowerCase();
  return hist.filter(function(h){
    if(tab==="deleted" ? !h.deletedAt : !!h.deletedAt) return false;
    if(tab==="today" && !isToday(h.updated)) return false;
    return !q || (h.template+" "+h.text).toLowerCase().indexOf(q)>=0;
  });
}
var TAG={generated:"Generated",copied:"Copied",cleared:"Cleared"};
function renderHist(){
  var items=visible(), html="", lastDay="";
  if(!items.length){
    listEl.innerHTML='<p class="text-sm text-slate-500 text-center py-8">'+(tab==="deleted" ? "No deleted notes. Deleted notes stay here for "+DELETED_DAYS+" days." : searchEl.value ? "No notes match that search." : "Notes you build are saved here, even after you clear them.")+'</p>';
    return;
  }
  items.forEach(function(h){
    var day=new Date(h.updated).toLocaleDateString([], {weekday:"long",month:"short",day:"numeric"});
    if(tab!=="today" && day!==lastDay){ html+='<div class="text-xs font-semibold text-slate-500 pt-2">'+day+'</div>'; lastDay=day; }
    var vi=openVer[h.id]!=null ? openVer[h.id] : null;
    var shown=(vi!=null && h.versions[vi]) ? h.versions[vi].text : h.text;
    var tags=h.tags.length ? h.tags.map(function(t){ return '<span class="mei-tag mei-tag-'+t+'">'+(TAG[t]||t)+'</span>'; }).join("") : '<span class="mei-tag">Draft</span>';
    if(h.shift!==SHIFT) tags+='<span class="mei-tag">'+esc(h.shift)+'</span>';
    var open=openId===h.id;
    var vers=(open && h.versions.length>1) ? '<div class="mei-vers">Versions: '+h.versions.map(function(v,i){ return '<button type="button" data-ver="'+i+'" class="'+(vi===i?"on":"")+'">'+fmtClock(v.at)+'</button>'; }).join("")+'<button type="button" data-ver="" class="'+(vi==null?"on":"")+'">Latest</button></div>' : "";
    var acts=!open ? "" : h.deletedAt
      ? '<div class="mei-acts"><button type="button" data-act="undelete" class="p">Restore to history</button><button type="button" data-act="purge" class="d">Delete forever</button></div>'
      : '<div class="mei-acts"><button type="button" data-act="restore" class="p" title="Load this note back into the form">Restore</button><button type="button" data-act="copy">Copy</button><button type="button" data-act="alarm">Set callback</button><button type="button" data-act="delete" class="d">Delete</button></div>';
    html+='<div class="articleBtn mei-hitem'+(open?" open":"")+'" data-id="'+h.id+'">'+
      '<div class="flex justify-between gap-2"><b class="truncate">'+esc(h.template)+'</b><span class="text-xs text-slate-500 font-mono">'+fmtClock(h.updated)+'</span></div>'+
      '<div class="mei-tags">'+tags+'</div><pre class="mei-hprev">'+esc(shown||"(empty)")+'</pre>'+vers+acts+'</div>';
  });
  listEl.innerHTML=html;
}
listEl.addEventListener("click",function(e){
  var item=e.target.closest(".mei-hitem"); if(!item) return;
  var id=item.dataset.id, h=hist.find(function(x){ return x.id===id; });
  var vb=e.target.closest("[data-ver]");
  if(vb){ openVer[id]=vb.dataset.ver==="" ? null : +vb.dataset.ver; renderHist(); return; }
  var ab=e.target.closest("[data-act]");
  if(!ab){ openId = openId===id ? null : id; renderHist(); return; }
  var vi=openVer[id], text=(vi!=null && h.versions[vi]) ? h.versions[vi].text : h.text;
  switch(ab.dataset.act){
    case "restore": restoreEntry(id,vi); panel.classList.add("hidden"); break;
    case "copy": copyText(text); break;
    case "alarm": openAlarms({label:h.template, note:text}); break;
    case "delete": h.deletedAt=Date.now(); if(session===id) session=null; saveHist(); renderHist(); toast("Moved to Deleted","danger"); break;
    case "undelete": delete h.deletedAt; saveHist(); renderHist(); toast("Back in history"); break;
    case "purge": hist=hist.filter(function(x){ return x.id!==id; }); saveHist(); renderHist(); break;
  }
});
panel.querySelector(".mei-tabs").addEventListener("click",function(e){
  var b=e.target.closest("[data-tab]"); if(!b) return; tab=b.dataset.tab;
  panel.querySelectorAll(".mei-tabs button").forEach(function(x){ x.classList.toggle("on",x===b); }); renderHist();
});
searchEl.addEventListener("input",renderHist);
panel.querySelector("[data-close]").onclick=function(){ panel.classList.add("hidden"); };
bubble.onclick=function(){ panel.classList.toggle("hidden"); if(!panel.classList.contains("hidden")){ renderHist(); searchEl.focus(); } };
$("meiHistExport").onclick=function(){
  var items=visible(); if(!items.length){ toast("Nothing to export","danger"); return; }
  var txt=items.map(function(h){ return "=== "+h.template+" | "+new Date(h.updated).toLocaleString()+" | "+h.shift+" ===\n"+h.text; }).join("\n\n");
  var a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"}));
  a.download="MeiNote-history-"+new Date().toISOString().slice(0,10)+".txt"; a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); },2000);
};
updateBubble();

/* =====================================================================
   3. CALLBACK ALARMS
   ===================================================================== */
/* Sound (also used by the 2-minute hold timer) */
var ac=null;
function audio(){ try{ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==="suspended") ac.resume(); }catch(e){} return ac; }
document.addEventListener("pointerdown",audio,{passive:true});
document.addEventListener("keydown",audio);
function tone(c,f,t0,dur,type,g){
  var o=c.createOscillator(), v=c.createGain(); o.type=type||"sine"; o.frequency.value=f;
  v.gain.setValueAtTime(0.0001,t0); v.gain.exponentialRampToValueAtTime(Math.max(.001,g*ALARM_VOLUME),t0+.02); v.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(v); v.connect(c.destination); o.start(t0); o.stop(t0+dur+.05);
}
var SOUNDS={
  chime:function(c,t){ [880,1108.7,1318.5,1760].forEach(function(f,i){ tone(c,f,t+i*.16,.9,"sine",.35); }); },
  bell:function(c,t){ tone(c,659,t,1.6,"sine",.4); tone(c,1318,t,1.1,"sine",.15); tone(c,659,t+.8,1.6,"sine",.35); },
  pulse:function(c,t){ for(var i=0;i<3;i++) tone(c,988,t+i*.28,.18,"square",.12); },
  urgent:function(c,t){ for(var i=0;i<6;i++) tone(c,i%2?740:988,t+i*.15,.13,"sawtooth",.1); }
};
window.MeiSound={ play:function(name){ var c=audio(); if(c) (SOUNDS[name]||SOUNDS.chime)(c,c.currentTime+.05); } };

/* Time zones */
var ZONES=[["","My time"],["America/New_York","Eastern (ET)"],["America/Chicago","Central (CT)"],["America/Denver","Mountain (MT)"],["America/Phoenix","Arizona (MST)"],["America/Los_Angeles","Pacific (PT)"],["America/Anchorage","Alaska (AKT)"],["Pacific/Honolulu","Hawaii (HT)"]];
function zoneShort(tz){ var z=ZONES.find(function(x){ return x[0]===tz; }); return !tz ? "your time" : z ? z[1].replace(/.*\((.*)\)/,"$1") : tz; }
function tzOffset(tz,ts){
  var o={}; new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(new Date(ts)).forEach(function(x){ o[x.type]=x.value; });
  return Date.UTC(+o.year,+o.month-1,+o.day,+o.hour%24,+o.minute,+o.second)-ts;
}
function wallToTs(dateStr,timeStr,tz){
  var d=dateStr.split("-").map(Number), t=timeStr.split(":").map(Number);
  if(!tz) return new Date(d[0],d[1]-1,d[2],t[0],t[1]).getTime();
  var guess=Date.UTC(d[0],d[1]-1,d[2],t[0],t[1]);
  return guess-tzOffset(tz,guess-tzOffset(tz,guess));
}
function partsIn(ts,tz){ var o={}; new Intl.DateTimeFormat("en-CA",{timeZone:tz||undefined,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).formatToParts(new Date(ts)).forEach(function(x){ o[x.type]=x.value; }); return o; }
function dateIn(ts,tz){ var o=partsIn(ts,tz); return o.year+"-"+o.month+"-"+o.day; }
function timeIn(ts,tz){ var o=partsIn(ts,tz); return pad(+o.hour%24)+":"+o.minute; }
function until(ts){ var s=Math.max(0,Math.round((ts-Date.now())/1000)), h=Math.floor(s/3600), m=Math.floor(s%3600/60); return h ? h+"h "+pad(m)+"m" : m ? m+"m "+pad(s%60)+"s" : s+"s"; }

var alarms=store.get(K.alarms,[]);
function saveAlarms(){ store.set(K.alarms,alarms); renderAlarmBadge(); }
var alarmBtn=$("meiAlarmBtn");
var nextLine=document.createElement("div");
nextLine.id="meiNextAlarm"; nextLine.hidden=true; nextLine.title="Open Callback Alarms";
var ld=$("liveDate"); (ld.closest("center")||ld).insertAdjacentElement("afterend",nextLine);
nextLine.onclick=function(){ openAlarms(); };

var modal=modalShell("meiAlarms","Callback Alarms","w-[720px] max-w-full");
modal.querySelector(".mei-modal-body").innerHTML=
 '<div class="grid md:grid-cols-2">'+
 '<form id="maForm" class="p-5" novalidate>'+
  '<label class="lbl" for="maLabel">Client name or reason</label><input id="maLabel" class="inp" placeholder="e.g. J. Smith - NSF follow-up">'+
  '<label class="lbl" for="maRef">DS / reference number (optional)</label><input id="maRef" class="inp">'+
  '<div class="flex flex-wrap gap-1 mb-2" id="maQuick"><button type="button" data-min="5">5 min</button><button type="button" data-min="15">15 min</button><button type="button" data-min="30">30 min</button><button type="button" data-min="60">1 hour</button><button type="button" data-min="120">2 hours</button></div>'+
  '<div class="grid grid-cols-2 gap-x-3"><div><label class="lbl" for="maDate">Date</label><input id="maDate" type="date" class="inp"></div><div><label class="lbl" for="maTime">Time</label><input id="maTime" type="time" class="inp"></div></div>'+
  '<label class="lbl" for="maTz">Time zone</label><select id="maTz" class="inp">'+ZONES.map(function(z){ return '<option value="'+z[0]+'">'+z[1]+'</option>'; }).join("")+'</select>'+
  '<p id="maWhen" class="text-sm text-blue-700 dark:text-blue-300 mb-2"></p>'+
  '<div class="grid grid-cols-2 gap-x-3"><div><label class="lbl" for="maSound">Sound</label><select id="maSound" class="inp"><option value="chime">Chime</option><option value="bell">Bell</option><option value="pulse">Pulse</option><option value="urgent">Urgent</option></select></div>'+
  '<div><label class="lbl" for="maEarly">Remind me</label><select id="maEarly" class="inp"><option value="0">At the time</option><option value="2">2 min early</option><option value="5">5 min early</option><option value="10">10 min early</option></select></div></div>'+
  '<label class="lbl" for="maNote">Note</label><textarea id="maNote" class="inp" placeholder="What to do on the callback"></textarea>'+
  '<label class="flex items-center gap-2 text-sm mb-3"><input type="checkbox" id="maAttach"> Attach the current note</label>'+
  '<div class="flex gap-2"><button type="button" id="maTest" class="articleBtn" style="width:auto">Test sound</button><button type="submit" id="maSave" class="flex-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-2">Set Alarm</button></div>'+
  '<p id="maPerm" class="text-xs text-slate-500 mt-3" hidden></p>'+
 '</form>'+
 '<div class="p-5 bg-slate-50 dark:bg-slate-900"><h3 class="font-semibold mb-2">Upcoming callbacks</h3><div id="maList" class="space-y-2"></div></div>'+
 '</div>';
var editing=null;
function setIn(min){ var tz=$("maTz").value, ts=Math.ceil((Date.now()+min*60000)/60000)*60000; $("maDate").value=dateIn(ts,tz); $("maTime").value=timeIn(ts,tz); describeWhen(); }
function formTs(){ var d=$("maDate").value, t=$("maTime").value; return (d&&t) ? wallToTs(d,t,$("maTz").value) : NaN; }
function describeWhen(){
  var ts=formTs(), tz=$("maTz").value, early=+$("maEarly").value, el=$("maWhen");
  if(isNaN(ts)){ el.textContent="Pick a date and time."; return; }
  el.textContent = ts<=Date.now() ? "That time has already passed." :
    "Rings "+(early?early+" min before ":"at ")+fmtClock(ts,tz||undefined)+" "+zoneShort(tz)+(tz?" ("+fmtClock(ts)+" your time)":"")+", in "+until(ts-early*60000)+".";
}
["maDate","maTime","maTz","maEarly"].forEach(function(id){ $(id).addEventListener("input",describeWhen); $(id).addEventListener("change",describeWhen); });
$("maQuick").addEventListener("click",function(e){ var b=e.target.closest("[data-min]"); if(b) setIn(+b.dataset.min); });
$("maTest").onclick=function(){ MeiSound.play($("maSound").value); };
$("maForm").addEventListener("submit",function(e){
  e.preventDefault();
  var label=$("maLabel").value.trim(), ts=formTs();
  if(!label){ $("maWhen").textContent="Add a client name or reason so you know what the alarm is for."; $("maLabel").focus(); return; }
  if(isNaN(ts) || ts<=Date.now()){ $("maWhen").textContent="Choose a time in the future."; return; }
  var note=$("maNote").value.trim();
  if($("maAttach").checked && out.value) note=(note?note+"\n\n":"")+safeText(out.value);
  var a={id:editing||uid(), label:label, ref:$("maRef").value.trim(), at:ts, early:+$("maEarly").value, tz:$("maTz").value, sound:$("maSound").value, note:note, status:"pending"};
  alarms=alarms.filter(function(x){ return x.id!==a.id; }); alarms.push(a); alarms.sort(function(x,y){ return x.at-y.at; });
  settings.sound=a.sound; saveSettings(); saveAlarms();
  toast("⏰ Callback set for "+fmtClock(a.at,a.tz||undefined)+" "+zoneShort(a.tz));
  editing=null; $("maSave").textContent="Set Alarm"; resetForm(); renderAlarmList(); askPermission();
});
function resetForm(){ ["maLabel","maRef","maNote"].forEach(function(id){ $(id).value=""; }); $("maAttach").checked=false; $("maEarly").value="0"; $("maSound").value=settings.sound; setIn(30); }
function openAlarms(pre){
  pre=pre||{}; modal.classList.remove("hidden"); audio();
  if(!editing) resetForm();
  if(pre.tz!=null){ $("maTz").value=pre.tz; setIn(30); }
  if(pre.label) $("maLabel").value=pre.label;
  if(pre.note) $("maNote").value=pre.note;
  renderAlarmList(); permHint(); setTimeout(function(){ $("maLabel").focus(); },30);
}
window.openCallbackAlarms=openAlarms;
function renderAlarmList(){
  var up=alarms.filter(function(a){ return a.status!=="done"; }), done=alarms.filter(function(a){ return a.status==="done"; }).slice(-3).reverse();
  if(!up.length && !done.length){ $("maList").innerHTML='<p class="text-sm text-slate-500">No callbacks set yet.</p>'; return; }
  $("maList").innerHTML=up.map(function(a){
    return '<div class="articleBtn" data-id="'+a.id+'"><div class="flex justify-between gap-2"><b>'+esc(a.label)+'</b><span class="font-mono text-sm text-blue-700 dark:text-blue-300" data-cd="'+a.id+'">'+until(a.at-a.early*60000)+'</span></div>'+
      '<div class="text-xs text-slate-500">'+fmtClock(a.at,a.tz||undefined)+' '+zoneShort(a.tz)+(a.tz?' · '+fmtClock(a.at)+' your time':'')+(a.ref?' · '+esc(a.ref):'')+'</div>'+
      '<div class="mei-acts"><button type="button" data-a="edit">Edit</button><button type="button" data-a="del" class="d">Delete</button></div></div>';
  }).join("")+(done.length ? '<h4 class="text-sm font-semibold text-slate-500 pt-2">Done</h4>'+done.map(function(a){
    return '<div class="articleBtn opacity-60" data-id="'+a.id+'"><div class="flex justify-between"><b>'+esc(a.label)+'</b><span class="text-xs">'+fmtClock(a.at)+'</span></div><div class="mei-acts"><button type="button" data-a="del" class="d">Remove</button></div></div>';
  }).join("") : "");
}
$("maList").addEventListener("click",function(e){
  var b=e.target.closest("[data-a]"); if(!b) return;
  var id=b.closest("[data-id]").dataset.id, a=alarms.find(function(x){ return x.id===id; });
  if(b.dataset.a==="del"){ alarms=alarms.filter(function(x){ return x.id!==id; }); saveAlarms(); renderAlarmList(); }
  if(b.dataset.a==="edit" && a){
    editing=id; $("maLabel").value=a.label; $("maRef").value=a.ref||""; $("maTz").value=a.tz; $("maDate").value=dateIn(a.at,a.tz); $("maTime").value=timeIn(a.at,a.tz);
    $("maSound").value=a.sound; $("maEarly").value=String(a.early||0); $("maNote").value=a.note||""; $("maSave").textContent="Save Changes"; describeWhen();
  }
});
function permHint(){
  var p=$("maPerm");
  if(!("Notification" in window)){ p.hidden=false; p.textContent="This browser can't show desktop notifications. Alarms still ring and show on this page."; return; }
  if(Notification.permission==="granted"){ p.hidden=true; return; }
  p.hidden=false;
  p.innerHTML = Notification.permission==="denied"
    ? "Desktop notifications are blocked for this site, so alarms ring and show on this page only. Allow them from the lock icon in the address bar."
    : 'Want a desktop notification when MeiNote is behind other windows? <button type="button" id="maAllow" class="underline text-blue-700">Allow notifications</button>';
  var al=$("maAllow"); if(al) al.onclick=askPermission;
}
function askPermission(){ try{ if("Notification" in window && Notification.permission==="default") Notification.requestPermission().then(permHint); }catch(e){} }

/* Ringing */
var ringHost=document.createElement("div"); ringHost.id="meiRinging"; ringHost.setAttribute("role","alert"); document.body.appendChild(ringHost);
var ringing={}, ringLoop=null, titleLoop=null, baseTitle=document.title;
function ring(a){
  if(ringing[a.id]) return;
  a.status="ringing"; saveAlarms();
  var missed=Date.now()-a.at > 2*60000;
  var el=document.createElement("div");
  el.className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden";
  el.innerHTML='<div class="bg-blue-900 text-white px-4 py-2 flex items-center gap-2"><i class="fas fa-bell mei-bell text-yellow-300"></i><b>'+(missed?"Missed callback":"Callback")+'</b><span class="ml-auto text-blue-200 text-sm">'+fmtClock(a.at,a.tz||undefined)+' '+zoneShort(a.tz)+'</span></div>'+
    '<div class="p-4"><div class="font-semibold">'+esc(a.label)+(a.ref?' <span class="text-slate-500 font-normal">· '+esc(a.ref)+'</span>':'')+'</div>'+
    (a.note?'<pre class="mei-hprev mt-2" style="max-height:120px;overflow:auto">'+esc(a.note)+'</pre>':'')+
    '<div class="mei-acts mt-3"><button type="button" data-s="5">Snooze 5 min</button><button type="button" data-s="10">10 min</button>'+(a.note?'<button type="button" data-c="1">Copy note</button>':'')+'<button type="button" data-d="1" class="p ml-auto">Dismiss</button></div></div>';
  ringHost.appendChild(el); ringing[a.id]=el;
  el.addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b) return;
    if(b.dataset.c){ copyText(a.note); return; }
    if(b.dataset.s){ a.at=Date.now()+(+b.dataset.s)*60000; a.early=0; a.status="pending"; toast("Snoozed "+b.dataset.s+" min"); }
    else a.status="done";
    saveAlarms(); stopRing(a.id); renderAlarmList();
  });
  MeiSound.play(a.sound);
  if(!ringLoop) ringLoop=setInterval(function(){ var id=Object.keys(ringing)[0], x=alarms.find(function(y){ return y.id===id; }); if(id) MeiSound.play(x?x.sound:"chime"); },3200);
  if(!titleLoop){ var on=false; titleLoop=setInterval(function(){ on=!on; document.title=on ? "⏰ CALLBACK: "+a.label : baseTitle; },900); }
  try{
    if("Notification" in window && Notification.permission==="granted"){
      var n=new Notification("Callback: "+a.label,{body:(a.ref?a.ref+" · ":"")+fmtClock(a.at,a.tz||undefined)+" "+zoneShort(a.tz)+(a.note?"\n"+a.note.slice(0,120):""),tag:"meinote-"+a.id,requireInteraction:true});
      n.onclick=function(){ window.focus(); n.close(); };
    }
  }catch(e){}
}
function stopRing(id){
  if(ringing[id]) ringing[id].remove(); delete ringing[id];
  if(!Object.keys(ringing).length){ clearInterval(ringLoop); ringLoop=null; clearInterval(titleLoop); titleLoop=null; document.title=baseTitle; }
}
function renderAlarmBadge(){
  var up=alarms.filter(function(a){ return a.status==="pending"; });
  var b=alarmBtn.querySelector("b"); b.hidden=!up.length; b.textContent=up.length;
  if(!up.length){ nextLine.hidden=true; return; }
  var n=up[0]; nextLine.hidden=false;
  nextLine.textContent="Next callback "+fmtClock(n.at)+" · "+n.label;
}
setInterval(function(){
  var now=Date.now();
  alarms.forEach(function(a){ if((a.status==="pending" && now>=a.at-a.early*60000) || (a.status==="ringing" && !ringing[a.id])) ring(a); });
  renderAlarmBadge();
  if(!modal.classList.contains("hidden")) document.querySelectorAll("[data-cd]").forEach(function(s){ var a=alarms.find(function(x){ return x.id===s.dataset.cd; }); if(a) s.textContent=until(a.at-a.early*60000); });
  if(!Object.keys(ringing).length) baseTitle=document.title;
},1000);
alarmBtn.onclick=function(){ openAlarms(); };
renderAlarmBadge();

/* The US time map (opened inside MeiNote) can ask for an alarm in a state's zone */
window.addEventListener("message",function(e){
  var d=e.data; if(!d || d.type!=="meinote:alarm") return;
  if(!$("htmlViewerPanel").classList.contains("hidden")) window.toggleHtmlViewer();
  openAlarms({tz:d.tz||"", label:d.label||""});
});

/* =====================================================================
   4. SMALL HELPERS
   ===================================================================== */
/* Recent templates under the dropdown */
var recent=store.get(K.recent,[]);
var recentEl=document.createElement("div"); recentEl.id="meiRecent";
$("template").insertAdjacentElement("afterend",recentEl);
function pushRecent(t){ recent=[t].concat(recent.filter(function(x){ return x!==t; })).slice(0,6); store.set(K.recent,recent); renderRecent(); }
function renderRecent(){ recentEl.innerHTML=recent.map(function(t){ return '<button type="button" data-t="'+esc(t)+'"'+(t===curTpl()?' class="on"':'')+'>'+esc(t)+'</button>'; }).join(""); }
recentEl.addEventListener("click",function(e){ var b=e.target.closest("[data-t]"); if(!b) return; $("template").value=b.dataset.t; window.switchTemplate(); });
renderRecent();

/* Offer to restore an unfinished note after the page was closed or reloaded */
(function(){
  var last=hist.find(function(h){ return !h.deletedAt && h.shift===SHIFT; });
  if(!last || last.tags.indexOf("cleared")>=0 || last.tags.indexOf("copied")>=0 || Date.now()-last.updated>12*36e5) return;
  var bar=document.createElement("div"); bar.id="meiRestoreBar";
  bar.innerHTML='<span>Unfinished <b>'+esc(last.template)+'</b> note from '+fmtClock(last.updated)+'.</span><button type="button" class="p">Restore</button><button type="button">Dismiss</button>';
  $("meiLeft").insertAdjacentElement("afterbegin",bar);
  bar.children[1].onclick=function(){ restoreEntry(last.id); bar.remove(); };
  bar.children[2].onclick=function(){ bar.remove(); };
})();

/* Keyboard shortcuts */
document.addEventListener("keydown",function(e){
  var calc=$("calculatorPanel"); if(calc && !calc.classList.contains("hidden")) return;   // calculator uses the keyboard
  var typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||"");
  if((e.ctrlKey||e.metaKey) && e.key==="Enter"){ e.preventDefault(); window.generateNote(); return; }
  if(e.altKey && !e.ctrlKey){
    var k=e.key.toLowerCase();
    if(k==="c"){ e.preventDefault(); window.copyToClipboard(); }
    else if(k==="x"){ e.preventDefault(); window.clearOutput(); }
    else if(k==="h"){ e.preventDefault(); bubble.click(); }
    else if(k==="a"){ e.preventDefault(); openAlarms(); }
    return;
  }
  if(e.key==="Escape"){ modal.classList.add("hidden"); panel.classList.add("hidden"); }
  if(e.key==="/" && !typing){ e.preventDefault(); $("kbSearch").focus(); }
});

renderLive(false);
})();
