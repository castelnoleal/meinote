/* =====================================================================
   MeiNote · CORE APP
   Timers, calendar, calculator, payment schedule analyzer, KB search,
   copy/clear, screenshots and the tool viewer. Template forms live in templates.js,
   note text in notes.js, articles in articles.js, V.6 features in features.js.
   ===================================================================== */


/* ---------- Payment schedule analyzer: summary placement ---------- */
document.addEventListener("DOMContentLoaded",function(){

const table=document.getElementById("scheduleTable");
const summary=document.getElementById("scheduleSummary");
const panel=document.getElementById("creditorSummaryPanel");
let wrapper=document.getElementById("summaryTop");

if(table && summary){

 if(!wrapper){
   wrapper=document.createElement("div");
   wrapper.id="summaryTop";
   table.parentNode.insertBefore(wrapper,table);
 }

 if(panel && panel.parentNode!==wrapper){
   wrapper.appendChild(panel);
 }

 if(summary.parentNode!==wrapper){
   wrapper.appendChild(summary);
 }

}

});

/* ===============================
MEI BALANCE SHEET ANALYZER
=============================== */

let scheduleData=[]

function toggleSchedulePanel(){

const panel=document.getElementById("schedulePanel")

panel.classList.toggle("hidden")

}

function parseSchedule(){

const text=document.getElementById("scheduleInput").value

const lines=text.split("\n")

scheduleData=[]

lines.forEach((line,i)=>{

// repair messy spacing
const clean=line.replace(/\s{2,}/g," ").trim()

// detect date
const dateMatch=clean.match(/\d{2}[-\/]\d{2}[-\/]\d{4}/)

// detect all money values
const moneyMatches=(clean.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g)||[])

// detect status
const statusMatch=clean.match(/Cleared|Pending|Failed/i)

if(moneyMatches){

moneyMatches.forEach((val,idx)=>{

const amount=parseFloat(val.replace(/[$,]/g,""))

if(!isNaN(amount) && amount>0){

let desc = clean;

// second $ in the row = bank fee
if(idx===1){
desc = clean + " bank fee";
}

scheduleData.push({

id:scheduleData.length,
date:dateMatch?dateMatch[0]:"",
amount:amount,
description:desc,
status:statusMatch?statusMatch[0]:"",
enabled:true

})

}

})

}

})

renderSchedule()

}


/* detectDate() is defined once, further down with the analyzer table code. */


function renderSchedule(){

const table=document.getElementById("scheduleTable")

table.innerHTML=""

scheduleData.forEach(row=>{

const tr=document.createElement("tr")

tr.innerHTML=`
<td>
<input type="checkbox" ${row.enabled?"checked":""}
onchange="toggleScheduleRow(${row.id})">
</td>

<td>${row.date || detectDate(row.description)}</td>

<td style="text-align:right">$${row.amount.toFixed(2)}</td>

<td>${row.description}</td>

<td>${row.status}</td>
`

table.appendChild(tr)

})

updateScheduleTotals()

}


function toggleScheduleRow(id){
let row=scheduleData.find(r=>r.id===id)
if(!row) return
row.enabled=!row.enabled
updateScheduleTotals()
}

function updateScheduleTotals(){

let total=0
let categories={}

let queuedTotal = 0
let clearedTotal = 0
let creditors = {}
let creditorCleared={}
let creditorQueued={}
let feeQueued={pb:0,bank:0,legal:0}


scheduleData.forEach(r=>{

if(!r.enabled) return

total+=r.amount

let label="Other"

const line=r.description.toLowerCase()

if(line.includes("pb fee")) label="PB Fees"
else if(line.includes("bank fee")) label="Bank Fees"
else if(line.includes("legal")) label="Legal Fees"
else if(line.includes("creditor")) label="Creditor Payments"
else if(line.includes("deposit")) label="Deposits"

if(!categories[label]) categories[label]=0

categories[label]+=r.amount

// queued / cleared totals
let statusText=(r.status||"").toLowerCase()
if(statusText.includes("cleared")){
    clearedTotal+=r.amount
}else{
    queuedTotal+=r.amount
}
if(line.includes("pb fee")) feeQueued.pb+=r.amount

if(line.includes("bank fee")){
    feeQueued.bank+=r.amount
}

if(line.includes("legal")) feeQueued.legal+=r.amount
// removed duplicate cleared accumulation

// creditor detection
let credMatch = r.description ? r.description.match(/[A-Z\/\-]+\([^\)]+\)/) : null
if(credMatch){
let bankFeeLine = line.includes("bank fee");

let name = credMatch[0]
if(!creditors[name]) creditors[name]=0
creditors[name]+=r.amount
if((r.status||"").toLowerCase().includes("queued")||(r.description||"").toLowerCase().includes("queued")){
if(!creditorQueued[name]) creditorQueued[name]=0
creditorQueued[name]+=r.amount
}else{
if(!creditorCleared[name]) creditorCleared[name]=0
creditorCleared[name]+=r.amount
}

let bankClearedPerCreditor={}
let bankQueuedPerCreditor={}

scheduleData.forEach(r=>{
 if(!r.enabled) return
 const line=(r.description||"").toLowerCase()
 if(!line.includes("bank fee")) return
 let credMatch = r.description ? r.description.match(/[A-Z\/\- ]+\(\d+\)/) : null
 if(!credMatch) return
 let c=credMatch[0]
 if(!bankClearedPerCreditor[c]) bankClearedPerCreditor[c]=0
 if(!bankQueuedPerCreditor[c]) bankQueuedPerCreditor[c]=0
 if((r.status||"").toLowerCase().includes("queued") || line.includes("queued")){
     bankQueuedPerCreditor[c]+=r.amount
 }else{
     bankClearedPerCreditor[c]+=r.amount
 }
})

let creditorPanel="CREDITOR SUMMARY\n\n"
Object.keys(creditorCleared).sort().forEach(c=>{
let cleared=(creditorCleared[c]||0)
let queued=(creditorQueued[c]||0)

creditorPanel+=c+"\n"
creditorPanel+="Cleared: $"+cleared.toFixed(2)+"\n"
creditorPanel+="Queued: $"+queued.toFixed(2)+"\n"
creditorPanel+="Total bank fees cleared: $"+(bankClearedPerCreditor[c]||0).toFixed(2)+"\n"
creditorPanel+="Total bank fees queued: $"+(bankQueuedPerCreditor[c]||0).toFixed(2)+"\n\n"
})

creditorPanel+="QUEUED\n"
creditorPanel+="Creditor Fees: $"+feeQueued.pb.toFixed(2)+"\n"
creditorPanel+="Creditor Payments: $"+queuedTotal.toFixed(2)+"\n"
creditorPanel+="Legal Fees: $"+feeQueued.legal.toFixed(2)+"\n"

let panel=document.getElementById("creditorSummaryPanel")
if(panel) panel.innerText=creditorPanel

}


})

document.getElementById("scheduleTotal").innerText=
"Total Selected: $" + total.toFixed(2)

let summary=""

Object.keys(categories).forEach(c=>{
summary+=c+": $"+categories[c].toFixed(2)+"\n"
})


let fullSummary="OVERALL TOTALS\n"
Object.keys(categories).forEach(c=>{
fullSummary+=c+": $"+categories[c].toFixed(2)+"\n"
})

fullSummary+="\nCLEARED TOTAL\n$"+clearedTotal.toFixed(2)+"\n"
fullSummary+="\nQUEUED TOTAL\n$"+queuedTotal.toFixed(2)+"\n"

fullSummary+="\nPER-CREDITOR TOTALS\n"
Object.keys(creditors).sort().forEach(c=>{
fullSummary+=c+": $"+creditors[c].toFixed(2)+"\n"
})

document.getElementById("scheduleSummary").innerText=fullSummary


}

/* ===============================
   CALCULATOR MODULE
================================ */

let calculatorOpen = false;

function toggleCalculator(){

document.getElementById("calendarPanel")?.classList.add("hidden");
document.getElementById("timerPanel")?.classList.add("hidden");
document.getElementById("helpPanel")?.classList.add("hidden");

const panel = document.getElementById("calculatorPanel");

panel.classList.toggle("hidden");

calculatorOpen = !panel.classList.contains("hidden");

}

function calcPress(v){

const display = document.getElementById("calcDisplay");

display.value += v;

}

function calcClear(){

document.getElementById("calcDisplay").value = "";

}

function calcEquals(){

const display = document.getElementById("calcDisplay");

try{
display.value = eval(display.value);
}catch{
display.value = "Error";
}

}


let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let timerInterval = null;
let remainingTime = 0;
let totalTime = 0;

function toggleCalendar(){

// close other panels
document.getElementById("timerPanel")?.classList.add("hidden");
document.getElementById("helpPanel")?.classList.add("hidden");

const panel = document.getElementById("calendarPanel");

panel.classList.toggle("hidden");

if(!panel.classList.contains("hidden")){
renderCalendar();
}

}

function changeMonth(step){

currentMonth += step;

if(currentMonth < 0){
currentMonth = 11;
currentYear--;
}

if(currentMonth > 11){
currentMonth = 0;
currentYear++;
}

renderCalendar();

}

function renderCalendar(){

const grid = document.getElementById("calendarGrid");
const title = document.getElementById("calendarTitle");

grid.innerHTML = "";

const today = new Date();

const firstDay = new Date(currentYear,currentMonth,1).getDay();
const daysInMonth = new Date(currentYear,currentMonth+1,0).getDate();

const monthNames = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

title.textContent = monthNames[currentMonth] + " " + currentYear;

// day headers
["S","M","T","W","T","F","S"].forEach(d=>{
const el = document.createElement("div");
el.textContent = d;
el.className = "font-bold text-slate-500";
grid.appendChild(el);
});

// empty start cells
for(let i=0;i<firstDay;i++){
const empty = document.createElement("div");
grid.appendChild(empty);
}

// days
for(let d=1; d<=daysInMonth; d++){

const cell = document.createElement("div");

cell.textContent = d;

cell.className = "p-1 rounded";

if(
d === today.getDate() &&
currentMonth === today.getMonth() &&
currentYear === today.getFullYear()
){
cell.className += " bg-blue-500 text-white";
}

grid.appendChild(cell);

}

}


function toggleTimerPanel(){

// close other panels
document.getElementById("calendarPanel")?.classList.add("hidden");
document.getElementById("helpPanel")?.classList.add("hidden");

document.getElementById("timerPanel").classList.toggle("hidden");

}


function startTimer(seconds){

stopTimer();

remainingTime = seconds;
totalTime = seconds;

updateTimerDisplay();

timerInterval = setInterval(()=>{

remainingTime--;

updateTimerDisplay();

if(remainingTime <= 0){

clearInterval(timerInterval);

playBeep();

setTimeout(()=>{
stopTimer();
},2000);

}

},1000);

}

function startCustomTimer(){

const mins = parseFloat(document.getElementById("customMinutes").value);

if(!mins || mins <= 0){
alert("Enter valid minutes");
return;
}

startTimer(mins * 60);

}

function stopTimer(){

if(timerInterval){
clearInterval(timerInterval);
timerInterval = null;
}

remainingTime = 0;
updateTimerDisplay();

}

function updateTimerDisplay(){

const display = document.getElementById("timerDisplay");
const progress = document.getElementById("timerProgress");

if(!display || !progress) return;

const minutes = Math.floor(remainingTime / 60);
const seconds = remainingTime % 60;

const timeText =
String(minutes).padStart(2,'0') + ":" +
String(seconds).padStart(2,'0');

display.textContent = timeText;

if(remainingTime > 0){

if(remainingTime <= 20){
document.title = "⚠ " + timeText + " • RETURN";
}else{
document.title = timeText + " • ON HOLD";
}

}else{
document.title = MEINOTE.title;
}

if(totalTime > 0){
const percent = (remainingTime / totalTime) * 100;
progress.style.width = percent + "%";
}

if(remainingTime <= 30 && remainingTime > 0){
display.style.color = "#ef4444";
progress.style.background = "#ef4444";
}else{
display.style.color = "";
progress.style.background = "";
}

}

function clearSchedule(){

scheduleData=[]

document.getElementById("scheduleInput").value=""
document.getElementById("scheduleTable").innerHTML=""
document.getElementById("scheduleTotal").innerText=""
document.getElementById("scheduleSummary").innerText=""

}

function playBeep(){
 if(window.MeiSound) MeiSound.play("pulse");
}


function toggleHtmlViewer(url){
document.getElementById("calendarPanel")?.classList.add("hidden");
document.getElementById("calculatorPanel")?.classList.add("hidden");
document.getElementById("timerPanel")?.classList.add("hidden");
document.getElementById("helpPanel")?.classList.add("hidden");
document.getElementById("schedulePanel")?.classList.add("hidden");
const p=document.getElementById("htmlViewerPanel");
const f=document.getElementById("htmlFrame");
const opening=p.classList.contains("hidden");
p.classList.toggle("hidden");
if(opening){
 f.src=url||"MeiScript_V.0.1.0.html";
 document.getElementById("htmlViewerWindow").style.transform="scale(1)";
}else{
 localStorage.setItem("meiViewerLastUrl",f.src);
 f.src="about:blank";
}
}

document.addEventListener("DOMContentLoaded",function(){
const panel=document.getElementById("htmlViewerPanel");
const win=document.getElementById("htmlViewerWindow");
const frame=document.getElementById("htmlFrame");
if(panel && win){
panel.addEventListener("click",function(e){
if(!win.contains(e.target)){
panel.classList.add("hidden");
if(frame) frame.src="about:blank";
}
});
}
});




document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){
  const p=document.getElementById("htmlViewerPanel");
  if(p && !p.classList.contains("hidden")) toggleHtmlViewer();
 }
});
document.addEventListener("DOMContentLoaded",function(){
 const win=document.getElementById("htmlViewerWindow");
 if(!win) return;
 const bar=win.firstElementChild;
 let drag=false,ox=0,oy=0;
 bar.style.cursor="move";
 bar.addEventListener("mousedown",e=>{drag=true;const r=win.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;win.style.position="fixed";});
 document.addEventListener("mousemove",e=>{if(!drag)return;win.style.left=(e.clientX-ox)+"px";win.style.top=(e.clientY-oy)+"px";});
 document.addEventListener("mouseup",()=>drag=false);
});

const memory = {};
let currentTemplate = '';
let templateOnly = false;

function toggleTemplateOnly(btn){
templateOnly = !templateOnly;
btn.textContent = `Template Mode: ${templateOnly ? "ON" : "OFF"}`;
}

function dd(id, opts){
    const defaultValue = opts.includes("Y") ? "Y" : "";

    return `<select id="${id}" class="inp">
        <option value="">Select...</option>
        ${opts.map(o =>
            `<option ${o === defaultValue ? "selected" : ""}>${o}</option>`
        ).join("")}
    </select>`;
}

function val(id){
const el=document.getElementById(id);
return el?el.value:'';
}

function saveMemory(){
if(!currentTemplate) return;
memory[currentTemplate]={};
document.querySelectorAll('#fields input, #fields select, #fields textarea')
.forEach(el=>memory[currentTemplate][el.id]=el.value);
}

function restoreMemory(t){
if(!memory[t]) return;
Object.entries(memory[t]).forEach(([id,v])=>{
const el=document.getElementById(id);
if(el) el.value=v;
});
}

function toggleCCSATPanel(){

    document.getElementById("calendarPanel")
        ?.classList.add("hidden");

    document.getElementById("timerPanel")
        ?.classList.add("hidden");

    document.getElementById("helpPanel")
        ?.classList.add("hidden");

    document.getElementById("calculatorPanel")
        ?.classList.add("hidden");

    document.getElementById("schedulePanel")
        ?.classList.add("hidden");

    const panel =
        document.getElementById("ccsatPanel");

    panel.classList.toggle("hidden");
}

function switchTemplate(){

const selected = document.getElementById("template").value;

//If CS Operations selected → open link
if(selected === "CS Operations Request"){

window.open("https://forms.office.com/pages/responsepage.aspx?id=YzvnuFr0hEm5fvk7hG6uBWhscJSZQatNsdBOl5ePLPVUMUdTTFY5TUUyVVVJNFZHVzJSTVVQODNaUi4u", "_blank");

// Reset dropdown
document.getElementById("template").selectedIndex = 0;

return; // Stop function here
}

//If Report an Agent selected → open link
if(selected === "Report an Agent"){

window.open("https://forms.cloud.microsoft/pages/responsepage.aspx?id=YzvnuFr0hEm5fvk7hG6uBRWXofvZlc5BpyaW5MbsVqhUQjFMNFZRMFVPTlkxRlkzOUtGNlpCT0JRWi4u&route=shorturl", "_blank");

// Reset dropdown
document.getElementById("template").selectedIndex = 0;

return; // Stop function here
}

//If File Salary Dispute selected → open link
if(selected === "File Salary Dispute"){

window.open("https://forms.cloud.microsoft/pages/responsepage.aspx?id=YzvnuFr0hEm5fvk7hG6uBatITmSR0eZIggAn14YvX7VUOUNQTkxRTlYxVjlBQkpMQjFTTVRBVTAzUy4u&route=shorturl", "_blank");

// Reset dropdown
document.getElementById("template").selectedIndex = 0;

return; // Stop function here
}

//CS Correspondence
if(selected === "CS Correspondence"){

window.open("https://forms.office.com/pages/responsepage.aspx?id=YzvnuFr0hEm5fvk7hG6uBVQfHGMOnGVDsKJc-hKTjx9UM0ZaMkpXNDBCUU9LRlpNRUNBNDhTRUFIQy4u&web=1&wdLOR=c07DA3D6B-D2B7-4852-B124-9ADB1B1EE8AA.com", "_blank");
document.getElementById("template").selectedIndex = 0;
return;
}

// Normal behavior
saveMemory();
currentTemplate = selected;
renderTemplate();
setTimeout(()=>restoreMemory(currentTemplate),50);

}

function copyToClipboard(){
const text=document.getElementById('outputArea').value;
if(!text){showToast('Nothing to copy','danger');return;}
if(navigator.clipboard && window.isSecureContext){
 navigator.clipboard.writeText(text).then(()=>showToast('✅ Copied to Clipboard','success')).catch(fallbackCopy);
}else{
 fallbackCopy();
}
function fallbackCopy(){
 const ta=document.getElementById('outputArea');
 ta.removeAttribute('readonly');
 ta.select();
 ta.setSelectionRange(0,999999);
 try{document.execCommand('copy');showToast('✅ Copied to Clipboard','success');}
 catch(e){showToast('❌ Copy failed','danger');}
 ta.setAttribute('readonly','readonly');
}
}
function clearOutput(){

// Clear generated output
document.getElementById('outputArea').value='';

// Target ONLY fields inside left panel template container
const fieldContainer = document.getElementById('fields');

if(fieldContainer){

// Clear ALL input elements EXCEPT dropdowns
fieldContainer.querySelectorAll('input:not([type=checkbox]):not([type=radio])').forEach(input=>{
input.value = '';
});
showToast("🗑️ Output Cleared. It's still in Note history.","danger");

// Clear all textareas
fieldContainer.querySelectorAll('textarea').forEach(area=>{
area.value = '';
});

}

// Do NOT touch selects (Y/NA dropdowns remain)
// Do NOT call saveMemory()
// Do NOT change template

}
function toggleDarkMode(){ document.documentElement.classList.toggle('dark'); }

function toggleHelpPanel(){

// close other panels
document.getElementById("calendarPanel")?.classList.add("hidden");
document.getElementById("timerPanel")?.classList.add("hidden");

const panel = document.getElementById("helpPanel");

panel.classList.toggle("hidden");

if(!panel.classList.contains("hidden")){
searchKB();
}

}

function openArticle(id){
    document.getElementById("helpPanel")
        .classList.add("hidden");

    document.getElementById("articleContent").innerHTML =
        document.getElementById(id).innerHTML;

    const viewer = document.getElementById("articleViewer");
    viewer.dataset.standalone = "true";   // <-- add this
    viewer.classList.remove("hidden");
}

function openStandaloneArticle(id){
    const article = document.getElementById(id);
    if(!article) return;

    document.getElementById("articleContent").innerHTML = article.innerHTML;

    const viewer = document.getElementById("articleViewer");
    viewer.dataset.standalone = "true";

    document.getElementById("articleViewer").classList.remove("hidden");
}

function closeArticle(){
    const viewer = document.getElementById("articleViewer");

    viewer.classList.add("hidden");

    if(viewer.dataset.standalone !== "true"){
        document.getElementById("helpPanel").classList.remove("hidden");
    }
}

function searchKB(){
    const query = document.getElementById("kbSearch").value
        .toLowerCase()
        .trim();

    const container = document.getElementById("kbResults");
    container.innerHTML = "";

    if(query === "") return;

    let results = [];

    // ==========================================
    // 1. SEARCH MEINOTE NOTATION TEMPLATES
    // ==========================================

    const templateSelect = document.getElementById("template");

    if(templateSelect){
        [...templateSelect.options].forEach(option => {

            const templateName = option.textContent.trim();
            const templateValue = option.value;

            // Ignore placeholder and optgroup-related empty items
            if(!templateValue) return;

            const lowerName = templateName.toLowerCase();

            let score = 0;

            // Exact match gets highest priority
            if(lowerName === query){
                score = 20;
            }
            // Template begins with search
            else if(lowerName.startsWith(query)){
                score = 15;
            }
            // Template contains search
            else if(lowerName.includes(query)){
                score = 10;
            }
            // Individual word matching
            else{
                query.split(" ").forEach(word => {
                    if(lowerName.includes(word)){
                        score += 2;
                    }
                });
            }

            if(score > 0){
                results.push({
                    type: "template",
                    title: templateName,
                    value: templateValue,
                    score: score
                });
            }
        });
    }


    // ==========================================
    // 2. SEARCH KNOWLEDGE BASE
    // ==========================================

    const articles =
        document.querySelectorAll("div[style='display:none'] > div");

    articles.forEach(article => {

        const heading = article.querySelector("h2");

        if(!heading) return;

        const title = heading.innerText.trim();
        const text = article.innerText.toLowerCase();

        let score = 0;

        if(title.toLowerCase().includes(query)){
            score += 5;
        }

        if(text.includes(query)){
            score += 2;
        }

        query.split(" ").forEach(word => {
            if(text.includes(word)){
                score += 1;
            }
        });

        if(score > 0){
            results.push({
                type: "article",
                id: article.id,
                title: title,
                score: score
            });
        }
    });


    // ==========================================
    // 3. SORT BEST MATCHES FIRST
    // ==========================================

    results.sort((a,b) => b.score - a.score);


    // ==========================================
    // 4. DISPLAY RESULTS
    // ==========================================

    results.forEach(result => {

        const btn = document.createElement("button");
        btn.className = "articleBtn";

        if(result.type === "template"){

            btn.innerHTML =
                `<span style="color:#2563eb;font-weight:bold">
                    📝 TEMPLATE
                 </span>
                 &nbsp; ${result.title}`;

            btn.onclick = () => {

                // Set main template dropdown
                templateSelect.value = result.value;

                // Load that template
                switchTemplate();

                // Clear search
                document.getElementById("kbSearch").value = "";

                // Clear results
                container.innerHTML = "";

                // Close floating popup if present
                document.getElementById("kbSearchPopup")
                    ?.classList.add("hidden");
            };

        } else {

            btn.innerHTML =
                `<span style="color:#16a34a;font-weight:bold">
                    📖 KB
                 </span>
                 &nbsp; ${result.title}`;

            btn.onclick = () => {
                openArticle(result.id);
            };
        }

        container.appendChild(btn);
    });
}
document.addEventListener("click", function(e){

const calendar = document.getElementById("calendarPanel");
const timer = document.getElementById("timerPanel");
const help = document.getElementById("helpPanel");
const article = document.getElementById("articleViewer");
const calculator = document.getElementById("calculatorPanel");
const schedulePanel=document.getElementById("schedulePanel")
const ccsatPanel = document.getElementById("ccsatPanel");

if(e.target === ccsatPanel){
    ccsatPanel.classList.add("hidden");
}

// close analyzer
if(e.target===schedulePanel){
schedulePanel.classList.add("hidden")
}

// close calendar
if(e.target === calendar){
calendar.classList.add("hidden");
}

// close calculator
if(e.target === calculator){
calculator.classList.add("hidden");
calculatorOpen = false;
}

// close timer
if(e.target === timer){
timer.classList.add("hidden");
}

// close knowledge base
if(e.target === help){
help.classList.add("hidden");
}

// close article viewer and return to search
if(e.target === article){
    article.classList.add("hidden");

    if(article.dataset.standalone !== "true"){
        document.getElementById("helpPanel")?.classList.remove("hidden");
    }
}

});

/* ===============================
   CALCULATOR KEYBOARD INPUT
================================ */

document.addEventListener("keydown", function(e){

if(!calculatorOpen) return;

const display = document.getElementById("calcDisplay");

const allowed = "0123456789+-*/.";

if(allowed.includes(e.key)){
display.value += e.key;
e.preventDefault();
}

if(e.key === "Enter"){
calcEquals();
}

if(e.key === "Backspace"){
display.value = display.value.slice(0,-1);
}

});

/* ---------- Search results dropdown ---------- */
document.addEventListener("DOMContentLoaded", function(){

  const table = document.getElementById("scheduleTable");
  if(!table) return;

  // if thead already exists do nothing
  if(table.querySelector("thead")) return;

  const firstRow = table.querySelector("tr");
  if(!firstRow) return;

  const thead = document.createElement("thead");
  thead.appendChild(firstRow.cloneNode(true));

  const tbody = document.createElement("tbody");

  const rows = table.querySelectorAll("tr");
  rows.forEach((r,i)=>{
    if(i===0) return;
    tbody.appendChild(r);
  });

  table.innerHTML = "";
  table.appendChild(thead);
  table.appendChild(tbody);

});

/* === FLOATING SEARCH RESULTS DROPDOWN === */

document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("kbSearch");
    const results = document.getElementById("kbResults");

    if (!search || !results) return;

    // Create floating popup automatically
    const popup = document.createElement("div");
    popup.id = "kbSearchPopup";
    popup.className =
        "hidden absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-xl max-h-96 overflow-y-auto";

    results.parentNode.insertBefore(popup, results);
    popup.appendChild(results);

    const wrapper = document.createElement("div");
    wrapper.className = "relative";

    search.parentNode.insertBefore(wrapper, search);
    wrapper.appendChild(search);
    wrapper.appendChild(popup);

    // Hide popup when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !popup.contains(e.target) &&
            e.target !== search
        ) {
            popup.classList.add("hidden");
        }
    });

    // Patch existing searchKB
    const originalSearchKB = window.searchKB;

    window.searchKB = function () {

        originalSearchKB();

        if (search.value.trim() === "") {
            popup.classList.add("hidden");
            return;
        }

        if (results.children.length > 0) {
            popup.classList.remove("hidden");
        } else {
            popup.classList.add("hidden");
        }
    };

    // Patch existing openArticle
    const originalOpenArticle = window.openArticle;

    window.openArticle = function (id) {

        popup.classList.add("hidden");

        originalOpenArticle(id);
    };
});



/* ---------- Schedule analyzer table, quick timer, shift countdown, tool links ---------- */

function detectDate(value){
 if(!value) return ""
 const patterns=[
  /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
  /\b\d{4}-\d{1,2}-\d{1,2}\b/,
  /\b\d{1,2}-\d{1,2}-\d{4}\b/
 ]
 for(let p of patterns){
  let m=value.match(p)
  if(m) return m[0]
 }
 return ""
}

/* rebuild table based on spreadsheet columns */
function rebuildAnalyzerTable(){

 const table=document.getElementById("scheduleTable")
 if(!table) return

 const rows=[...table.querySelectorAll("tr")]
 if(rows.length===0) return

 const newHeader=`
 <tr>
  <th>✓</th>
  <th>PS ID</th>
  <th>Date</th>
  <th>Amount</th>
  <th>Bank Fee</th>
  <th>Creditor</th>
  <th>Type</th>
  <th>Status</th>
 </tr>
 `

 let newHTML=newHeader

 rows.slice(1).forEach(r=>{

  const text=r.innerText
  const cols=text.split("\t")

  const psid=cols[1]||""
  const date=detectDate(text)||cols[2]||""
  const amount=cols[3]||""
  const bankFee=cols[4]||""
  const creditor=cols[6]||""
  const type=cols[7]||""
  const status=cols[8]||""

  newHTML+=`
  <tr>
   <td></td>
   <td>${psid}</td>
   <td>${date}</td>
   <td>${amount}</td>
   <td>${bankFee}</td>
   <td>${creditor}</td>
   <td>${type}</td>
   <td>${status}</td>
  </tr>
  `

 })

 table.innerHTML=newHTML
}

/* move summary above table */
function moveSummary(){

 const summary=document.getElementById("scheduleSummary")
 const panel=document.getElementById("creditorSummaryPanel")
 const table=document.getElementById("scheduleTable")

 if(!summary || !table) return

 let top=document.getElementById("summaryTop")

 if(!top){
  top=document.createElement("div")
  top.id="summaryTop"
  table.parentNode.insertBefore(top,table)
 }

 if(panel) top.appendChild(panel)
 top.appendChild(summary)
}

document.addEventListener("DOMContentLoaded",()=>{

 setTimeout(()=>{
  moveSummary()
  rebuildAnalyzerTable()
 },500)

})

document.addEventListener("DOMContentLoaded",()=>{

const table=document.getElementById("scheduleTable");
if(!table) return;

let rows=table.querySelectorAll("tr");
if(rows.length>0){

 // create THEAD if missing
 if(!table.querySelector("thead")){
  const thead=document.createElement("thead");
  thead.appendChild(rows[0]);
  table.insertBefore(thead,table.firstChild);
 }

 // move summary above table if misplaced
 const summary=document.getElementById("scheduleSummary");
 const panel=document.getElementById("creditorSummaryPanel");
 const container=document.getElementById("summaryTop");

 if(container && summary && panel){
  container.appendChild(panel);
  container.appendChild(summary);
 }

}

});

document.addEventListener("DOMContentLoaded",function(){
 const table=document.getElementById("scheduleTable");
 const summary=document.getElementById("scheduleSummary");
 const panel=document.getElementById("creditorSummaryPanel");

 if(table && summary){
   let wrapper=document.getElementById("summaryTop");
   if(!wrapper){
      wrapper=document.createElement("div");
      wrapper.id="summaryTop";
      table.parentNode.insertBefore(wrapper,table);
   }
   if(panel) wrapper.appendChild(panel);
   wrapper.appendChild(summary);
 }
});

document.addEventListener("DOMContentLoaded",function(){

const table=document.getElementById("scheduleTable");
if(!table) return;

let rows=table.querySelectorAll("tr");
if(rows.length===0) return;

/* ensure header row is inside THEAD */
if(!table.querySelector("thead")){
 const thead=document.createElement("thead");
 thead.appendChild(rows[0]);
 table.insertBefore(thead,table.firstChild);
}

/* ensure table is positioned after summary */
const summary=document.getElementById("summaryTop");
if(summary){
 summary.after(table);
}

});

document.addEventListener("DOMContentLoaded", function(){

  const btn = document.getElementById("quickTimerBtn");
  if(!btn) return;

  btn.addEventListener("click", function(){
      if(typeof startTimer === "function"){
          startTimer(120); // always 2 minutes
      }else{
          console.error("startTimer() not found");
      }
  });

});

(function(){
function updateWorkCountdown(){
  const now = new Date();
  const start = new Date();
  start.setHours(...MEINOTE.shiftStart.split(":").map(Number),0,0);
  const end = new Date();
  end.setHours(...MEINOTE.shiftEnd.split(":").map(Number),0,0);

  let display = "";

  if(now < start){
    const diff = start - now;
    display = "Shift Starts in " + formatTime(diff);
  }
  else if(now >= start && now <= end){
    const diff = end - now;
    display = formatTime(diff);
  }
  else{
    display = "Shift Ended";
  }

  const el = document.getElementById("workCountdown");
  if(el) el.textContent = display;
}

function formatTime(ms){
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    String(h).padStart(2,'0') + ":" +
    String(m).padStart(2,'0') + ":" +
    String(s).padStart(2,'0')
  );
}

updateWorkCountdown();
setInterval(updateWorkCountdown, 1000);
})();

function openMissedInteraction(){
 toggleHtmlViewer("missed-interaction-tracker.html");
}

function openUSMapFull(){
    toggleHtmlViewer("ccast-us-tz.html");
}


/* ---------- Live date ---------- */
document.addEventListener("DOMContentLoaded",()=>{
 const el=document.getElementById("liveDate");
 if(!el) return;
 function updateDate(){
   const now=new Date();
   el.textContent=now.toLocaleDateString(undefined,{
      weekday:"long",
      year:"numeric",
      month:"long",
      day:"numeric"
   });
 }
 updateDate();
 setInterval(updateDate,60000);
});

/* ---------- Toasts ---------- */
function showToast(message,type="success"){
 const old=document.querySelector(".mei-toast");
 if(old) old.remove();
 const t=document.createElement("div");
 t.className="mei-toast toast-"+type;
 t.innerHTML=message;
 document.body.appendChild(t);
 setTimeout(()=>t.remove(),2600);
}

/* ---------- Screenshots ---------- */
async function quickScreenshot() {

    try {

        const stream =
            await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "browser"
                },
                audio: false
            });

        const video = document.createElement("video");
        video.srcObject = stream;

        await video.play();

        await new Promise(resolve =>
            setTimeout(resolve, 300)
        );

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        stream.getTracks().forEach(track =>
            track.stop()
        );

        window.lastScreenshot =
            canvas.toDataURL("image/png");

        document.getElementById(
            "screenshotPreview"
        ).src = window.lastScreenshot;

        document.getElementById(
            "screenshotTray"
        ).style.display = "block";

        showToast?.(
            "📸 Screenshot captured",
            "success"
        );

    } catch (e) {

        console.error(e);

        showToast?.(
            "❌ Screenshot cancelled",
            "danger"
        );
    }
}

async function copyScreenshotToClipboard() {

    try {

        if (!window.lastScreenshot) {

            showToast?.(
                "No screenshot available",
                "danger"
            );

            return;
        }

        const response =
            await fetch(window.lastScreenshot);

        const blob =
            await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        showToast?.(
            "📋 Copied to clipboard. Press Ctrl+V.",
            "success"
        );

    } catch (e) {

        console.error(e);

        showToast?.(
            "❌ Clipboard copy failed",
            "danger"
        );
    }
}
