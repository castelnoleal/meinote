/* =====================================================================
   MeiNote · PAGE LAYOUT
   The HTML for the header, the left/right panels and every pop-up.
   Shared by Openers, Midshift and Closers, so a change here applies to all three.
   Edit the HTML between the backticks.
   ===================================================================== */

document.body.insertAdjacentHTML("afterbegin", `
<!-- ============ MAIN WINDOW ============ -->
<div id="meiShell" class="bg-white dark:bg-slate-800 w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden">

<!-- HEADER -->
<div id="meiHeader" class="bg-blue-900 px-6 py-4 flex justify-between items-center">
<div class="flex flex-col">

<h1 class="text-lg md:text-xl text-white uppercase tracking-[0.2em] font-light leading-tight">
<span class="font-semibold text-blue-300">MeiNote</span> ${MEINOTE.shift} V.6.0
</h1>

<span class="text-[10px] text-blue-200 tracking-wider">
Multi Entry Interface for Notation, Organization & Task Execution | by Castel Noleal | <a href="legacy/${MEINOTE.legacyPage}" class="underline hover:text-white" title="Open the classic V.5 screen">Classic V.5</a>
</span>

</div>

<div class="flex flex-col items-center">
  <div id="workCountdown" class="text-white text-lg font-mono font-bold">
    --:--:--
  </div><center>
  <div id="liveDate" class="text-[11px] text-blue-100 mt-3 font-medium w-full"></div></center>
</div>

<div id="meiTools" class="flex items-center gap-4">

<div class="flex flex-col items-center">

<div id="timerDisplay" class="text-blue-200 text-3xl font-bold font-mono leading-none">
00:00
</div>

<div id="timerBar" class="w-24 h-1.5 bg-slate-600 rounded mt-1 overflow-hidden">
<div id="timerProgress" class="h-full bg-blue-400 w-full"></div>
</div>

</div>

<button onclick="quickScreenshot()"
class="text-blue-200 hover:text-white text-xl"
title="Quick Screenshot">
    <i class="fas fa-camera"></i>
</button>

<button id="quickTimerBtn" class="text-blue-200 hover:text-white text-xl mx-2" title="Start 2 Minute Timer">⚡</button>
<button onclick="toggleTimerPanel()" class="text-blue-200 hover:text-white text-xl" title="Open Timer Settings">
<i class="fas fa-stopwatch"></i>
</button>

<button
    onclick="toggleCCSATPanel()"
    class="text-blue-200 hover:text-white text-xl"
    title="Open CSAT Calculator">
    <i class="fas fa-chart-line"></i>
</button>

<button onclick="openUSMapFull()"
class="text-blue-200 hover:text-white text-xl"
title="Open US Timezone Map">
<i class="fas fa-map"></i>
</button>

<button onclick="toggleHtmlViewer()"
class="text-blue-200 hover:text-white text-xl"
title="Open CasTools KB Navigator">
<i class="fas fa-compass"></i>
</button>

<button onclick="toggleCalendar()" class="text-blue-200 hover:text-white text-xl" title="Open Calendar">
<i class="fas fa-calendar"></i>
</button>

<button onclick="openMissedInteraction()" 
class="text-blue-200 hover:text-white text-xl"
title="Open Missed Interaction Tracker">
<i class="fas fa-exclamation-circle"></i>
</button>


<button onclick="toggleCalculator()" class="text-blue-200 hover:text-white text-xl" title="Open Calculator">
<i class="fas fa-calculator"></i>
</button>

<button id="meiAlarmBtn" type="button" class="text-blue-200 hover:text-white text-xl relative" title="Callback Alarms (Alt+A)">
<i class="fas fa-bell"></i><b hidden></b>
</button>

<button onclick="toggleDarkMode()" class="text-blue-200 text-xl" title="Turn NightMode On/Off">
<i class="fas fa-moon dark:hidden"></i>
<i class="fas fa-sun hidden dark:block text-yellow-300"></i>
</button>

</div>
</div>

<div id="meiMain" class="flex flex-col lg:flex-row">

<!-- LEFT PANEL -->
<div id="meiLeft" class="w-full lg:w-3/5 p-5 border-r border-slate-200 dark:border-slate-700">

<label class="lbl">Choose Note / Request Template to initiate</label>
<select id="template" class="inp" onchange="switchTemplate()">
<option value="">Cast...</option>


<optgroup label="BASIC NOTES">
<option>General</option>
<option>Required Items</option>
</optgroup>

<optgroup label="DEPOSIT NOTES">
<option>Move Deposit</option>
<option>Lower Deposit</option>
<option>Skip Deposit</option>
<option>NSF Deposit</option>
<option>Update Banking Info</option>
<option>Refund</option>
</optgroup>

<optgroup label="SIF NOTES">
<option>No Funds Needed</option>
<option>Added Funds</option>
<option>Rejected</option>
<option>Moved Fees</option>
</optgroup>

<optgroup label="REQUESTS">
<option>Advance Request</option>
<option>Add Debt Request</option>
<option>PS Refresh</option>
<option>Escalations/Manager Request</option>
<option>Expedited Negotiations Request</option>
<option>Remove Deposit (Multiple)</option>
<option>Lump Sum Request</option>
<option>Expedite Graduation</option>
</optgroup>

<optgroup label="INTERNAL CASES">
<option>Internal Case Bank Update</option>
<option>Internal Case Force Refund</option>
<option>Internal Case Internal NSF</option>
</optgroup>

<optgroup label="DEPARTAMENTAL SPECIAL REQUESTS">
<option>Consult</option>
<option>NSF Exception</option>
<option>OTP Override</option>
<option>Void SIF and Remove Creditor</option>
<option>CS Operations Request</option>
<option>CS Correspondence</option>
<option>Report an Agent</option>
<option>File Salary Dispute</option>
</optgroup>

</select>

<div id="fields"></div>

<button id="meiGenerate" onclick="generateNote()" title="Generate (Ctrl+Enter)" class="mt-3 w-full bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-2">
Generate
</button>


<button id="meiTplMode" onclick="toggleTemplateOnly(this)" 
class="mt-2 w-full bg-slate-200 hover:bg-slate-300 text-sm rounded-lg py-2">
Template Mode: OFF
</button>


</div>

<!-- RIGHT PANEL -->
<div id="meiRight" class="w-full lg:w-2/5 p-5 bg-slate-50 dark:bg-slate-900">
<input 
id="kbSearch" 
class="inp mb-3" 
placeholder="Search Articles, Templates or Requests, etc..." 
oninput="searchKB()"
>

<div id="kbResults" class="space-y-2"></div>
<label class="lbl">Generated Output</label>
<textarea id="outputArea" readonly class="inp h-96 font-mono"></textarea>

<div class="grid grid-cols-2 gap-2">
<button onclick="copyToClipboard()" title="Copy (Alt+C)" class="bg-blue-50 border rounded py-2 text-sm"><i class="far fa-copy text-xs"></i> Copy</button>
<button onclick="clearOutput()" title="Clear (Alt+X)" class="bg-white border rounded py-2 text-sm"><i class="fas fa-eraser text-xs"></i> Clear</button>
<br>
</div>

</div>
</div>
</div>
<!-- ============ POP-UP PANELS ============ -->
<div id="calendarPanel" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[320px] rounded-xl p-5 shadow-xl">

<div class="flex justify-between items-center mb-3">

<button onclick="changeMonth(-1)" class="text-lg">◀</button>

<div id="calendarTitle" class="font-semibold text-slate-800 dark:text-white"></div>

<button onclick="changeMonth(1)" class="text-lg">▶</button>

<button onclick="toggleCalendar()" class="text-red-500 text-lg">
<i class="fas fa-times"></i>
</button>

</div>

<div id="calendarGrid" class="grid grid-cols-7 gap-1 text-center text-sm"></div>

</div>
</div>


<div id="helpPanel" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[650px] max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-xl">

<div class="flex justify-between items-center mb-4">
<h2 class="text-lg font-semibold text-slate-800 dark:text-white">
Mei Knowledge Base Scripts
</h2>

<button onclick="toggleHelpPanel()" class="text-red-500 text-lg">
<i class="fas fa-times"></i>
</button>
</div>

<p class="text-sm text-slate-500">Use the search box on the right of the main window.</p>

</div>
</div>


<div id="calculatorPanel" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[320px] rounded-xl p-5 shadow-xl">

<div class="flex justify-between items-center mb-3">

<h2 class="text-lg font-semibold text-slate-800 dark:text-white">
Mei Calculator
</h2>

<button onclick="toggleCalculator()" class="text-red-500 text-lg">
<i class="fas fa-times"></i>
</button>

</div>

<input id="calcDisplay" class="inp text-right text-lg font-mono" readonly>

<div class="grid grid-cols-4 gap-2 mt-3">

<button onclick="calcPress('7')" class="articleBtn">7</button>
<button onclick="calcPress('8')" class="articleBtn">8</button>
<button onclick="calcPress('9')" class="articleBtn">9</button>
<button onclick="calcPress('/')" class="articleBtn">÷</button>

<button onclick="calcPress('4')" class="articleBtn">4</button>
<button onclick="calcPress('5')" class="articleBtn">5</button>
<button onclick="calcPress('6')" class="articleBtn">6</button>
<button onclick="calcPress('*')" class="articleBtn">×</button>

<button onclick="calcPress('1')" class="articleBtn">1</button>
<button onclick="calcPress('2')" class="articleBtn">2</button>
<button onclick="calcPress('3')" class="articleBtn">3</button>
<button onclick="calcPress('-')" class="articleBtn">−</button>

<button onclick="calcPress('0')" class="articleBtn">0</button>
<button onclick="calcPress('.')" class="articleBtn">.</button>
<button onclick="calcEquals()" class="articleBtn bg-blue-200">=</button>
<button onclick="calcPress('+')" class="articleBtn">+</button>

<button onclick="calcClear()" class="col-span-4 articleBtn bg-red-200">
Clear
</button>

</div>

</div>
</div>

<div id="articleViewer" class="hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[900px] h-[80vh] rounded-xl shadow-xl flex flex-col">

<div class="flex justify-between items-center p-4 border-b border-slate-300">

<h2 class="text-lg font-semibold">Mei Scripts and Help Desk</h2>

<button onclick="closeArticle()" class="text-red-500 text-lg">
<i class="fas fa-times"></i>
</button>

</div>

<div id="articleContent" class="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200"></div>

</div>

</div>

<!-- Schedule Spreadsheet Analyzer -->
<div id="schedulePanel" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[950px] max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-xl">

<div class="flex justify-between items-center mb-3">
<h2 class="text-lg font-semibold text-slate-800 dark:text-white">
Mei Payment Schedule Analyzer
</h2>
<button onclick="toggleSchedulePanel()" class="text-red-500 text-lg">✕</button>
</div>

<textarea id="scheduleInput"
class="inp w-full h-32 font-mono"
placeholder="Paste schedule here..."></textarea>

<div class="flex gap-2 mt-3">
<button onclick="parseSchedule()" class="bg-blue-600 text-white px-3 py-1 rounded">
Analyze
</button>

<button onclick="clearSchedule()" class="bg-red-500 text-white px-3 py-1 rounded">
Clear
</button>
</div>

<table class="w-full text-sm mt-4 border">



<tbody id="scheduleTable"></tbody>

</table>

<div id="scheduleTotal" class="mt-3 font-bold text-blue-400"></div>

<pre id="scheduleSummary" class="text-sm text-blue-300"></pre>
<div id="creditorSummaryPanel"></div>

</div>
</div>

<div id="timerPanel" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white dark:bg-slate-800 w-[350px] rounded-xl p-6 shadow-xl">

<div class="flex justify-between items-center mb-4">

<h2 class="text-lg font-semibold text-slate-800 dark:text-white">
Timer Settings
</h2>

<button onclick="toggleTimerPanel()" class="text-red-500 text-lg">
<i class="fas fa-times"></i>
</button>

</div>

<div class="space-y-3">

<button onclick="startTimer(120)" class="articleBtn">
Start 2 Minute Timer
</button>

<button onclick="startTimer(900)" class="articleBtn">
Start 15 Minute Timer
</button>

<button onclick="startTimer(3600)" class="articleBtn">
Start 60 Minute Timer
</button>

<div class="flex gap-2">
<input id="customMinutes" class="inp" placeholder="Custom minutes">
<button onclick="startCustomTimer()" class="bg-blue-600 text-white px-3 rounded">
Start
</button>
</div>

<button onclick="stopTimer()" class="bg-red-500 text-white w-full py-2 rounded">
Stop Timer
</button>


</div>

</div>

</div>
<!-- ============ TOOL VIEWER (KB Navigator, US map, Missed Interaction) ============ -->
<div id="htmlViewerPanel" class="hidden fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
<div class="bg-white dark:bg-slate-800 w-[96%] h-[92%] rounded-xl shadow-2xl overflow-hidden flex flex-col" id="htmlViewerWindow">
<div class="bg-blue-900 text-white px-4 py-2 flex justify-between items-center">
<span class="font-semibold">MeiNote Version 5.0 by Castel | Project Empower</span>
<button onclick="toggleHtmlViewer()" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Close</button>
</div>
<iframe id="htmlFrame" src="about:blank" style="border:none;width:100%;height:100%;"></iframe>
</div>
</div>
<!-- ============ SCREENSHOT TRAY ============ -->
<div id="screenshotTray"
style="
position:fixed;
bottom:20px;
right:20px;
z-index:99999;
display:none;
background:#1e293b;
color:white;
padding:12px;
border-radius:12px;
box-shadow:0 10px 25px rgba(0,0,0,.4);
max-width:350px;
">

    <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:8px;
    ">
        <strong>📸 Screenshot</strong>

        <button onclick="document.getElementById('screenshotTray').style.display='none'"
        style="
        background:none;
        border:none;
        color:white;
        cursor:pointer;
        font-size:16px;
        ">
            ✕
        </button>
    </div>

    <img id="screenshotPreview"
    style="
    width:100%;
    border-radius:8px;
    display:block;
    ">

    <button
    onclick="copyScreenshotToClipboard()"
    style="
    width:100%;
    margin-top:10px;
    padding:10px;
    border:none;
    border-radius:8px;
    background:#2563eb;
    color:white;
    cursor:pointer;
    font-weight:bold;
    ">
        📋 Copy Screenshot
    </button>

</div>
<!-- ============ CSAT CALCULATOR ============ -->
<div id="ccsatPanel"
class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div
        class="bg-white dark:bg-slate-800
               w-[550px]
               h-[650px]
               rounded-xl
               shadow-2xl
               overflow-hidden
               flex
               flex-col">

        <!-- Header -->
        <div
            class="bg-blue-900
                   text-white
                   px-4
                   py-3
                   flex
                   justify-between
                   items-center">

            <h2 class="font-semibold">
                CCSAT Recovery Calculator
            </h2>

            <button
                onclick="toggleCCSATPanel()"
                class="text-red-300 hover:text-white text-lg">

                ✕

            </button>

        </div>

        <!-- Calculator -->
        <iframe src="ccast-calculator.html"
            style="
                width:100%;
                height:100%;
                border:none;
                flex:1;
            ">
        </iframe>

    </div>

</div>
`);
