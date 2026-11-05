/* =====================================================================
   MeiNote · TEMPLATE FORMS
   One block per template: the fields shown on the left when a template is picked.
   Field ids here are read by notes.js (val("id")). Keep ids the same in both files.
   dd(id, [options]) makes a dropdown; options containing "Y" default to Y.
   ===================================================================== */

function renderTemplate(){
const f=document.getElementById('fields');
const t=currentTemplate;
if(!t){ f.innerHTML=''; return; }

/* ✅ BASIC NOTES */
if(t==="General"){
f.innerHTML=`
<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>
<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}


/* ✅ Expedited Graduation Request */
if(t==="Expedite Graduation"){
f.innerHTML=`

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div><label class="lbl">Current Status equals (Active)</label>${dd("details",["Y","N"])}</div>
<div><label class="lbl">Total Active debt equals 0:</label>${dd("name4",["Y","N"])}</div>
<div><label class="lbl">PS Committed Unpaid Creditors equals 0</label>${dd("balances",["Y","N"])}</div>
<div><label class="lbl">PS Committed Unbilled Fees equals 0</label>${dd("verbal",["Y","N"])}</div>
<div><label class="lbl">Savings Balance greater than or equal to 0</label>${dd("payment",["Y","N"])}</div>
<div><label class="lbl">Scheduled Advance Repayments equals 0</label>${dd("method",["Y","N"])}</div>
<div><label class="lbl">The client has NO Pending Deposits</label>${dd("nofunds",["Y","N"])}</div>
<div><label class="lbl">All creditor payments have posted</label>${dd("approved",["Y","N"])}</div>
<div><label class="lbl">DS Number</label>
<input id="vc" class="inp"></div>
 <div> <label class="lbl">DS Link</label>
<input id="vc2" class="inp"></div>
`;
}

/* ✅ Void SIF and Remove Creditor */
if(t==="Void SIF and Remove Creditor"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">Reason:</label>
<textarea id="notes2" class="inp"></textarea>
</div>
<div>
<label class="lbl">Program Type:</label>
<input id="main4" class="inp" placeholder="Input Progrm Type (NDR or Gitmeid Law)">
</div>
<div>
<label class="lbl">DS Number:</label>
<input id="main5" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">CC Number:</label>
<input id="main6" class="inp" placeholder="Input CC Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main7" class="inp" placeholder="Input DS Link">
</div>
<div>
<label class="lbl">Additional Notes:</label>
<input id="main8" class="inp" placeholder="Input All Additonal Notes">
</div>

`;
}

/* ✅ Consult */
if(t==="Consult"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">Concern:</label>
<textarea id="notes2" class="inp"></textarea>
</div>
<div>
<label class="lbl">DS Number:</label>
<input id="main4" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main5" class="inp" placeholder="Input DS link">
</div>
<div>
<label class="lbl">CC Number:</label>
<input id="main6" class="inp" placeholder="Input CC Number">
</div>
<div>
<label class="lbl">CC Link:</label>
<input id="main7" class="inp" placeholder="Input CC Link">
</div>
<div>
<label class="lbl">Cases:</label>
<input id="main8" class="inp" placeholder="Input All Cases">
</div>

`;
}

/* ✅ NSF Exception */
if(t==="NSF Exception"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div><label class="lbl">Reason</label>${dd("reason",["Prenote","C Scheduled on Client Portal","Prev Agent already resched"])}</div>
<div>
<label class="lbl">Concern:</label>
<textarea id="notes2" class="inp"></textarea>
</div>
<div>
<label class="lbl">DS Number:</label>
<input id="main4" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main5" class="inp" placeholder="Input DS link">
</div>
<div>
<label class="lbl">CC Number:</label>
<input id="main6" class="inp" placeholder="Input CC Number">
</div>
<div>
<label class="lbl">CC Link:</label>
<input id="main7" class="inp" placeholder="Input CC Link">
</div>
<div>
<label class="lbl">Cases:</label>
<input id="main8" class="inp" placeholder="Input All Cases">
</div>

`;
}

/* ✅ Remove Deposit (Multiple) */
if(t==="Remove Deposit (Multiple)"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">Reason:</label>
<textarea id="notes2" class="inp"></textarea>
</div>
<div>
<label class="lbl">Number of Deposits:</label>
<input id="main4" class="inp" placeholder="Input the Nuber of Deposits">
</div>
<div>
<label class="lbl">Amount:</label>
<input id="main5" class="inp" placeholder="Input Amount">
</div>
<div>
<label class="lbl">Start Date:</label>
<input id="main6" class="inp" placeholder="Input Start Date">
</div>
<div>
<label class="lbl">End Date:</label>
<input id="main7" class="inp" placeholder="Input End Date">
</div>
<div>
<label class="lbl">DS Number:</label>
<input id="main8" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main9" class="inp" placeholder="Input DS Link">
</div>

`;
}

/* ✅ Bank Update */
if(t==="Internal Case Bank Update"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">DS Number:</label>
<input id="main3" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main4" class="inp" placeholder="Input DS Link">
</div>
<div>
<label class="lbl">Pending Deposit Date & Amount:</label>
<input id="main5" class="inp" placeholder="Input Date and Amount">
</div>
<div>
<label class="lbl">EST Post date + 1BD:</label>
<input id="main6" class="inp" placeholder="Input Date + 1 Business Day">
</div>
<div>
<label class="lbl">Request Type(Bank update, NSF, PSR, Refund): </label>
<input id="main7" class="inp" placeholder="Input Type">
</div>
<div><label class="lbl">Will the deposit clear?</label>${dd("depoc",["Y","N"])}</div>
<div>

<label class="lbl">EST Post Date</label>
<input id="main8" class="inp" placeholder="Input Est Post Date">
</div>
<div><label class="lbl">Do they want it to clear?</label>${dd("clear",["Y","N"])}</div>

<div><label class="lbl">C wants to use new bank after deposit?</label>${dd("dep",["Y","N"])}</div>

<div><label class="lbl">ATD Signed?</label>${dd("atd",["Y","N"])}</div>
<div>
<div><label class="lbl">Validation Completed?</label>${dd("val",["Y","N"])}</div></div>
<div> 
<label class="lbl">Account Number</label>
<input id="main9" class="inp" placeholder="Input Account Number">
</div><div>
<label class="lbl">Routing Number</label>
<input id="main0" class="inp" placeholder="Input Routing Number">
</div><div><label class="lbl">OTP/KBA Verified?</label>${dd("otp",["Y","N"])}</div>
<div><label class="lbl">Checking or Savings?</label>${dd("check",["Checking","Savings"])}</div></div>
</div>
<div> 
 <div><label class="lbl">Did C requested Callback?</label>${dd("call",["Y","N"])}</div></div>
</div>

<label class="lbl">Notes/Additional Info</label>
<textarea id="notes" class="inp"></textarea>

`;
}


/* ✅ Force Refund */
if(t==="Internal Case Force Refund"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">DS Number:</label>
<input id="main3" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main4" class="inp" placeholder="Input DS Link">
</div>
<div>
<label class="lbl">Pending Deposit Date & Amount:</label>
<input id="main5" class="inp" placeholder="Input Date and Amount">
</div>
<div>
<label class="lbl">EST Post date + 1BD:</label>
<input id="main6" class="inp" placeholder="Input Date + 1 Business Day">
</div>
<div>
<label class="lbl">Request Type(Bank update, NSF, PSR, Refund): </label>
<input id="main7" class="inp" placeholder="Input Type">
</div>
<div><label class="lbl">Funds will clear?</label>${dd("depoc",["Y","N"])}</div>

<div><label class="lbl">Adv about the timeframe?</label>${dd("clear",["Y","N"])}</div>

<div><label class="lbl">Authentication (OTP/KBA)</label>${dd("dep",["Y","N"])}</div>

 <div><label class="lbl">Did C requested Callback?</label>${dd("call",["Y","N"])}</div></div>
</div>

<label class="lbl">Notes/Additional Info</label>
<textarea id="notes" class="inp"></textarea>

`;
}

/* ✅ Internal NSF */
if(t==="Internal Case Internal NSF"){
f.innerHTML=`

<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">DS Number:</label>
<input id="main3" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link:</label>
<input id="main4" class="inp" placeholder="Input DS Link">
</div>
<div>
<label class="lbl">Pending Deposit Date & Amount:</label>
<input id="main5" class="inp" placeholder="Input Date and Amount">
</div>
<div>
<label class="lbl">EST Post date + 1BD:</label>
<input id="main6" class="inp" placeholder="Input Date + 1 Business Day">
</div>
<div>
<label class="lbl">Request Type(Bank update, NSF, PSR, Refund): </label>
<input id="main7" class="inp" placeholder="Input Type">
</div>
<div><label class="lbl">NSF Waterfall Completed?</label>${dd("depoc",["Y","N"])}</div>
<div>
<label class="lbl">What date & amount were rescheduled (if applicable):</label>
<input id="main44" class="inp" placeholder="Input Date and Amount">
</div>
<div><label class="lbl">Exp set that if pending deposit clear, resch amt will still pull?</label>${dd("clear",["Y","N"])}</div>

<div><label class="lbl">Is the C req the deposit (NSF) to be skipped?</label>${dd("dep",["Y","N"])}</div>

 <div><label class="lbl">Did client specifically request a callback?</label>${dd("call",["Y","N"])}</div></div>
</div>

<label class="lbl">Reason for callback:</label>
<textarea id="notes" class="inp"></textarea>

`;
}


/* ✅ REQUIRED ITEMS */
if(t==="Required Items"){
f.innerHTML=`
<label class="lbl">Required Item</label>
<input id="main" class="inp" placeholder="Required Item">

<label class="lbl">RI current status/For:</label>
<input id="spec" class="inp" placeholder="enter specifics">
<div class="grid-3">
<div><label class="lbl">Adv C to ret doc within 24h</label>${dd("24h",["Y","NA"])}</div>
<div><label class="lbl">Closed/Hold RI for:</label>${dd("closed RI",["closed","hold for 1D","hold for 2D","hold for 3D","hold for 4D","hold for 5D","hold for 6D","hold for 7D"])}</div>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ OTP OVERRIDE */
if(t==="OTP Override"){
f.innerHTML=`


<label class="lbl">Client Full Name</label>
<input id="main2" class="inp" placeholder="C's name as it appears in the account">

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label class="lbl">DS Number</label>
<input id="main3" class="inp" placeholder="Input DS Number">
</div><div>
<label class="lbl">DS Link</label>
<input id="main31" class="inp" placeholder="Input DS Link">
</div><div>
<div><label class="lbl">DS Link verification Done </label>${dd("24h",["Y","N"])}</div></div>
<div>
<label class="lbl">Client Current #</label>
<input id="main4" class="inp" placeholder="Input Old #">
</div><div>
<label class="lbl">Client Updated #</label>
<input id="main5" class="inp" placeholder="Input New#">
</div><div>
<label class="lbl">Client Old Email</label>
<input id="main6" class="inp" placeholder="Input Old Email">
</div><div>
<label class="lbl">Client Updated Email</label>
<input id="main7" class="inp" placeholder="Input New Email">
</div>



</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

`;
}

/* ✅ Advance Request */
if(t==="Advance Request"){
f.innerHTML=`


<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label class="lbl">CC Number</label>
<input id="main3" class="inp" placeholder="Input CC Number">
</div>

<div><label class="lbl">Legal</label>${dd("legal",["Y","N"])}</div>
<div>

<div><label class="lbl">Judgement</label>${dd("jaj",["Y","N"])}</div></div>
<div>

<div><label class="lbl">Good Deposit Schedule</label>${dd("dep",["Y","N"])}</div></div>
<div>

<div><label class="lbl">First/Last Account</label>${dd("1st",["Y","N"])}</div></div>
<div>

 <div><label class="lbl">B/H Updated</label>${dd("b/h",["Y","N"])}</div></div>
<div> 

 <div><label class="lbl">Unemployed</label>${dd("jobless",["Y","N"])}</div></div>
<div> 

 <div><label class="lbl">Committed to Deposits</label>${dd("deposit",["Y","N"])}</div></div>

<div> 
<label class="lbl">Total Fees Cleared</label>
<input id="main31" class="inp" placeholder="Total Fees Cleared">
</div>
<div>
<label class="lbl">Amount Needed</label>
<input id="main5" class="inp" placeholder="Amount Needed">
</div>
<div>
<label class="lbl">Recoup Time</label>
<input id="main6" class="inp" placeholder="MM/DD/YY">
</div>
<div>
<label class="lbl">DS Link</label>
<input id="main7" class="inp" placeholder="Input DS LINK - https://...">
</div>



</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

`;
}

/* ✅ ADD DEBT REQUEST */
if(t==="Add Debt Request"){
f.innerHTML=`


<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label class="lbl">Creditor Name</label>
<input id="main333" class="inp" placeholder="Input Creditor Name">
</div>
<div>
<label class="lbl">CC Number</label>
<input id="main3" class="inp" placeholder="Input CC Number">
</div>
<div> 
<label class="lbl">Account Balance</label>
<input id="main31" class="inp" placeholder="Input Account Balance">
</div>

<div>
<label class="lbl">Account Number</label>
<input id="main51" class="inp" placeholder="Input Account Number">
</div>

<div>
<label class="lbl">Case Number</label>
<input id="main5" class="inp" placeholder="Input Case Number">
</div>

<div><label class="lbl">Debt Not Enrolled?</label>${dd("legal",["Y","N"])}</div>

<div><label class="lbl">Debt Acceptable?</label>${dd("dep",["Y","N"])}</div>

<div><label class="lbl">Debt not in Legal Status?</label>${dd("1st",["Y","N"])}</div>


<div><label class="lbl">Debt is Unsecured?</label>${dd("b/h",["Y","N"])}</div>

<div><label class="lbl">Verified Debt Amount?</label>${dd("jobless",["Y","N"])}</div>
<div><label class="lbl">Need PS Refresh?</label>${dd("deposit",["Y","N"])}</div>
<div>

 <div><label class="lbl">Creditor Loan/Debt Statement Sent</label>${dd("state",["Y","N"])}</div>
</div></div>

<label class="lbl">DS Link</label>
<input id="main7" class="inp" placeholder="https://...">



<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

`;
}

/* ✅ ESCALATIONS */
if(t==="Escalations/Manager Request"){
f.innerHTML=`

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">Coach/Team Leader</label>
<input id="main2" class="inp" placeholder="Coach Name/Nickname">
</div>

<div>
<label class="lbl">DS Number</label>
<input id="main333" class="inp" placeholder="Input DS Number">
</div>
<div>
<label class="lbl">DS Link</label>
<input id="link" class="inp" placeholder="Input DS Link">
</div>
<div>
<label class="lbl">Call Back Time</label>
<input id="main51" class="inp" placeholder="Input C's Preferred Call Back Time">
</div>
<div>
<label class="lbl">C's PTN/Contact Number to Call</label>
<input id="main5" class="inp" placeholder="Client's Preferred Number to Call">
</div>
</div>
<div> 
<label class="lbl">Issue</label>
<textarea id="main3" class="inp" placeholder="Input Issue"></textarea>
</div>

<div>
<label class="lbl">Resolution Provided</label>
<textarea id="Resolution" class="inp" placeholder="Resolution"></textarea>
</div>

<div>
<label class="lbl">Help Needed</label>
<textarea id="main31" class="inp" placeholder="Input Help Needed"></textarea>
</div>


`;
}

/* ✅ EXPEDITED NEGOTIATIONS REQUEST */
if(t==="Expedited Negotiations Request"){
f.innerHTML=`

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">Creditor Name(s)</label>
<input id="main2" class="inp" placeholder="Input Creditor Name(s)">
</div>

<div>
<label class="lbl">CC Number(s)</label>
<input id="main333" class="inp" placeholder="Input CC #(s)">
</div>

<div>
<label class="lbl">CC Number(s) Link</label>
<input id="main51" class="inp" placeholder="Input CC Links">
</div>

<div>
<div><label class="lbl">Request Type</label>${dd("req",["Expedite Negotiation","Expedite Negotiation/Last Account","Expedite Negotiation/Rework Creditor"])}</div>
</div> 
</div>
<div>
<div><label class="lbl">Does the client have at least 25% of the OB (original balance) in their savings account?</label>${dd("jobless",["Y","N"])}</div>
</div> 

<div>
<div><label class="lbl">Bulk Creditor</label>${dd("24h",["Y","N"])}</div>
</div>

<div>
<label class="lbl">Provide Creditor Bulk Name (Otherwise, put "NA")</label>
<input id="main69" class="inp" placeholder="Creditor Bulk Name, if applicable">
</div>

<div>
<label class="lbl">Please provide more details on the urgency of this request</label>
<textarea id="main31" class="inp" placeholder="Provide more information"></textarea>
</div>


`;
}

/* ✅ LUMP SUM REQUEST */
if(t==="Lump Sum Request"){
f.innerHTML=`

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="lbl">DS Number(s)</label>
<input id="main2" class="inp" placeholder="Input Creditor(s) DS Number">
</div>

<div>
<label class="lbl">DS Link(s)</label>
<input id="main333" class="inp" placeholder="https://...">
</div>

<div>
<label class="lbl">CC Number(s)</label>
<input id="main51" class="inp" placeholder="Input CC Number">
</div>

<div>
<div><label class="lbl">Request Type</label>${dd("req",["Expedite LS for Creditor","Expedite LS/Last Account","Expedite Lump Sum (All)"])}</div>
</div> 
</div>


<div>
<label class="lbl">Reason for Expedited Request</label>
<textarea id="main31" class="inp" placeholder="Provide more information"></textarea>
</div>


`;
}

/* ✅ PS REFRESH */
if(t==="PS Refresh"){
f.innerHTML=`


<label class="lbl">Agent Full Name</label>
<input id="main2" class="inp" placeholder="Agent Full Name">

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label class="lbl">DS NUMBER</label>
<input id="main333" class="inp" placeholder="Input DS Nmber">
</div>
<div>
<label class="lbl">TOTAL ENROLLED DEBT</label>
<input id="main3" class="inp" placeholder="Input Total Enrolled Debt">
</div>
<div> 
<label class="lbl">CURRENT TERM</label>
<input id="main31" class="inp" placeholder="Input Current Term">
</div>

<div>
<label class="lbl">TOTAL ENROLLED MONTHS</label>
<input id="main51" class="inp" placeholder="Input Total Enrolled Months">
</div>

<div>
<label class="lbl">OLD DEPOSIT AMOUNT</label>
<input id="main5" class="inp" placeholder="Input Old Deposit Amount">
</div>

<div>
<label class="lbl">NEW DEPOSIT AMOUNT</label>
<input id="main55" class="inp" placeholder="Input New Deposit Amount">
</div>

<div><label class="lbl">OLD FREQUENCY</label>${dd("legal",["Monthly","Semi - Monthly","Bi - Weekly"])}</div>

<div><label class="lbl">NEW FREQUENCY</label>${dd("dep",["Monthly","Semi - Monthly","Bi - Weekly"])}</div>
</div>

<label class="lbl">DS LINK</label>
<input id="main7" class="inp" placeholder="https://...">
<label class="lbl">REASON</label>
<textarea id="psreason" class="inp"></textarea>

`;
}

/* ✅ MOVE DEPOSIT */
if(t==="Move Deposit"){
f.innerHTML=`
<label class="lbl">Move Deposit</label>
<input id="main" class="inp" placeholder="Date and amount">

<div class="grid-3">
<div><label class="lbl">Rev hardship</label>${dd("hardship",["Y","NA"])}</div>
<div><label class="lbl">Rev account/runner</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">Rev Waterfall</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">Rev 90DD</label>${dd("dd90",["Y","NA"])}</div>
<div><label class="lbl">Checked/Rev ISD</label>${dd("isd",["Y","delete"])}</div>
<div><label class="lbl">Sent draft</label>${dd("draft",["Y","NA"])}</div>

<button
    onclick="openStandaloneArticle('DCID')"
    class="text-red-500 hover:text-red text-xl"
    title="Deposit Change Impact Disclosure">
    DCID <i class="fas fa-warning"></i>
</button>

<button
    onclick="openStandaloneArticle('ISD')"
    class="text-red-500 hover:text-red text-xl"
    title="Impacted Settlement Disclosure">
    ISD <i class="fas fa-warning"></i>
</button>

</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ SKIP DEPOSIT */
if(t==="Skip Deposit"){
f.innerHTML=`
<label class="lbl">Skip Deposit</label>
<input id="main" class="inp" placeholder="Date and amount">

<div class="grid-3">
<div><label class="lbl">Rev hardship</label>${dd("hardship",["Y","NA"])}</div>
<div><label class="lbl">Rev account/runner</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">Rev Waterfall</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">Rev 90DD</label>${dd("dd90",["Y","NA"])}</div>
<div><label class="lbl">Checked/Rev ISD</label>${dd("isd",["Y","delete"])}</div>
<div><label class="lbl">Sent draft</label>${dd("draft",["Y","NA"])}</div>
<button
    onclick="openStandaloneArticle('DCID')"
    class="text-red-500 hover:text-red text-xl"
    title="Deposit Change Impact Disclosure">
    DCID <i class="fas fa-warning"></i>
</button>

<button
    onclick="openStandaloneArticle('ISD')"
    class="text-red-500 hover:text-red text-xl"
    title="Impacted Settlement Disclosure">
    ISD <i class="fas fa-warning"></i>
</button>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ LOWER DEPOSIT */
if(t==="Lower Deposit"){
f.innerHTML=`
<label class="lbl">Lower Deposit</label>
<input id="main" class="inp" placeholder="Date and amount → amount">

<div class="grid-3">
<div><label class="lbl">Rev hardship</label>${dd("hardship",["Y","NA"])}</div>
<div><label class="lbl">Rev account/runner</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">Rev Waterfall</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">Rev 90DD</label>${dd("dd90",["Y","NA"])}</div>
<div><label class="lbl">Checked/Rev ISD</label>${dd("isd",["Y","delete"])}</div>
<div><label class="lbl">Sent draft</label>${dd("draft",["Y","NA"])}</div>
<button
    onclick="openStandaloneArticle('DCID')"
    class="text-red-500 hover:text-red text-xl"
    title="Deposit Change Impact Disclosure">
    DCID <i class="fas fa-warning"></i>
</button>

<button
    onclick="openStandaloneArticle('ISD')"
    class="text-red-500 hover:text-red text-xl"
    title="Impacted Settlement Disclosure">
    ISD <i class="fas fa-warning"></i>
</button>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ NSF DEPOSIT*/
if(t==="NSF Deposit"){
f.innerHTML=`
<label class="lbl">NSF Deposit</label>
<input id="main" class="inp" placeholder="Date and amount">

<div class="grid-3">
<div><label class="lbl">Rev hardship</label>${dd("hardship",["Y","NA"])}</div>
<div><label class="lbl">Rev account/runner</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">Rev Waterfall</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">C requested to</label>${dd("requested to",["Resch full amount","Resch partial amount" ,"Skip"])}</div>

<div><label class="lbl">Rev 90DD</label>${dd("dd90",["Y","NA"])}</div>
<div><label class="lbl">Checked/Rev ISD</label>${dd("isd",["Y","delete"])}</div>
<div><label class="lbl">Sent draft</label>${dd("draft",["Y","NA"])}</div>
<button
    onclick="openStandaloneArticle('DCID')"
    class="text-red-500 hover:text-red text-xl"
    title="Deposit Change Impact Disclosure">
    DCID <i class="fas fa-warning"></i>
</button>

<button
    onclick="openStandaloneArticle('ISD')"
    class="text-red-500 hover:text-red text-xl"
    title="Impacted Settlement Disclosure">
    ISD <i class="fas fa-warning"></i>
</button>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ UPDATE BANKING INFO*/
if(t==="Update Banking Info"){
f.innerHTML=`

<div class="grid-3">
<div><label class="lbl">Ver no pending deposits</label>${dd("deposit",["Y","NA"])}</div>
<div><label class="lbl">Reviewed if deposits in 5 bd</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">ADVISED Bank Disc</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">Verified Acnt/Rout</label>${dd("acnt",["Y","NA"])}</div>

<div><label class="lbl">Sent ATD</label>${dd("ATD",["Y","NA"])}</div>
<div><label class="lbl">C signed on the line</label>${dd("sign",["Y","NA"])}</div>
<div><label class="lbl">Adv should take 5 bd to update</label>${dd("draft",["Y","NA"])}</div>
  <div><label class="lbl">Rev next deposit</label>${dd("depo",["Y","NA"])}</div>


<button
    onclick="openStandaloneArticle('Authorization to Draft')"
    class="text-red-500 hover:text-red text-xl"
    title="ATD">
    ATD <i class="fas fa-warning"></i>
</button>

</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ REFUND*/
if(t==="Refund"){
f.innerHTML=`

<label class="lbl">Refund</label>
<input id="main" class="inp" placeholder="Amount">

<div class="grid-3">
<div><label class="lbl">Rev hardship</label>${dd("hardship",["Y","NA"])}</div>
<div><label class="lbl">Rev DSA Balance</label>${dd("runner",["Y","NA"])}</div>
<div><label class="lbl">Rev Waterfall</label>${dd("waterfall",["Y","NA"])}</div>
<div><label class="lbl">Rev 90DD</label>${dd("dd90",["Y","delete"])}</div>
<div><label class="lbl">Checked/Rev ISD</label>${dd("isd",["Y","delete"])}</div>
<div><label class="lbl">Sent contact info email</label>${dd("draft",["Y","NA"])}</div>
</div>
  <div><label class="lbl">Adv refund verbiage</label>${dd("verb",["Y","NA"])}
</div>

</div>


<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ NO FUNDS NEEDED SIF */
if(t==="No Funds Needed"){
f.innerHTML=`
<label class="lbl">Settlement for</label>
<input id="creditor" class="inp">

<div class="grid-3">
<div><label class="lbl">Reviewed SIF Details</label>${dd("details",["Y","NA"])}</div>
<div><label class="lbl">Name, Last 4</label>${dd("name4",["Y","NA"])}</div>
<div><label class="lbl">Orig. Bal, Curr. Bal, Sif Bal</label>${dd("balances",["Y","NA"])}</div>
<div><label class="lbl">Verbal/Written</label>${dd("verbal",["Y","NA"])}</div>
<div><label class="lbl">Payment amount/date ranges</label>${dd("payment",["Y","NA"])}</div>
<div><label class="lbl">Payment method</label>${dd("method",["Y","NA"])}</div>
<div><label class="lbl">Adv no additional funds needed</label>${dd("nofunds",["Y","NA"])}</div>
<div><label class="lbl">Client approved</label>${dd("approved",["Y","NA"])}</div>
<div><label class="lbl">Rev Approval Disc</label>${dd("disc",["Y","NA"])}</div>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ ADDED FUNDS */
if(t==="Added Funds"){
f.innerHTML=`
<label class="lbl">Settlement for</label>
<input id="creditor" class="inp">
<label class="lbl">Scheduled</label>
<input id="schedule" class="inp">
<div class="grid-3">
<div><label class="lbl">Reviewed SIF Details</label>${dd("details",["Y","NA"])}</div>
<div><label class="lbl">Name, Last 4</label>${dd("name4",["Y","NA"])}</div>
<div><label class="lbl">Orig. Bal, Curr. Bal, Sif Bal</label>${dd("balances",["Y","NA"])}</div>
<div><label class="lbl">Verbal/Written</label>${dd("verbal",["verbal","written"])}</div>
<div><label class="lbl">Payment amount/date ranges</label>${dd("payment",["Y","NA"])}</div>
<div><label class="lbl">Payment method</label>${dd("method",["Y","NA"])}</div>
<div><label class="lbl">Reviewed funds needed</label>${dd("withfunds",["Y","NA"])}</div> 
<div><label class="lbl">Client approved of SIF</label>${dd("app",["Y","N","NA"])}</div>
  <div><label class="lbl">Rev Approval Disc</label>${dd("rev",["Y","NA"])}</div>
<div><label class="lbl">Sent Draft</label>${dd("approved",["Y","NA"])}</div>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ REJECTED */
if(t==="Rejected"){
f.innerHTML=`
<label class="lbl">Settlement for</label>
<input id="creditor" class="inp">
<label class="lbl">Scheduled funds</label>
<input id="schedule" class="inp">
<div class="grid-3">
<div><label class="lbl">Reviewed SIF Details</label>${dd("details",["Y","NA"])}</div>
<div><label class="lbl">Name, Last 4</label>${dd("name4",["Y","NA"])}</div>
<div><label class="lbl">Orig. Bal, Curr. Bal, Sif Bal</label>${dd("balances",["Y","NA"])}</div>
<div><label class="lbl">Verbal/Written</label>${dd("verbal",["verbal","written"])}</div>
<div><label class="lbl">Payment amount/date ranges</label>${dd("payment",["Y","NA"])}</div>
<div><label class="lbl">Payment method</label>${dd("method",["Y","NA"])}</div>
<div><label class="lbl">Reviewed funds needed</label>${dd("withfunds",["Y","NA"])}</div> 
<div><label class="lbl">C unable to amount needed</label>${dd("app",["Y","NA"])}</div>
<div><label class="lbl">Rev if we can add less</label>${dd("less",["Y","NA"])}</div>
<div><label class="lbl">Rev Approval Disc</label>${dd("rev",["Y","NA"])}</div>
<div><label class="lbl">Sent Draft</label>${dd("approved",["Y","NA"])}</div>
<div><label class="lbl">Addtl funds still needed</label>${dd("addtl",["Y","NA"])}</div>

<div><label class="lbl">Advance rev/approved</label>${dd("adv",["Y","NA"])}</div>
<div><label class="lbl">Advance rej disc.</label>${dd("rej",["Y","N"])}</div>

<div><label class="lbl">Advance rejected</label>${dd("r",["Y","N"])}</div>

</div><div><label class="lbl">C approved reject offer</label>${dd("rj",["Y","N"])}</div>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ MOVED FEES */
if(t==="Moved Fees"){
f.innerHTML=`
<label class="lbl">Settlement for</label>
<input id="creditor" class="inp">
<label class="lbl">Scheduled funds</label>
<input id="schedule" class="inp">
<div class="grid-3">
<div><label class="lbl">Reviewed SIF Details</label>${dd("details",["Y","NA"])}</div>
<div><label class="lbl">Name, Last 4</label>${dd("name4",["Y","NA"])}</div>
<div><label class="lbl">Orig. Bal, Curr. Bal, Sif Bal</label>${dd("balances",["Y","NA"])}</div>
<div><label class="lbl">Verbal/Written</label>${dd("verbal",["verbal","written"])}</div>
<div><label class="lbl">Payment amount/date ranges</label>${dd("payment",["Y","NA"])}</div>
<div><label class="lbl">Payment method</label>${dd("method",["Y","NA"])}</div>
<div><label class="lbl">Reviewed funds needed</label>${dd("withfunds",["Y","NA"])}</div> 
<div><label class="lbl">C unable to amount needed</label>${dd("app",["Y","NA"])}</div>
<div><label class="lbl">Rev if we can add less</label>${dd("less",["Y","NA"])}</div>
<div><label class="lbl">Rev Approval Disc</label>${dd("rev",["Y","NA"])}</div>
<div><label class="lbl">Sent Draft</label>${dd("approved",["Y","NA"])}</div>
<div><label class="lbl">Addtl funds still needed</label>${dd("addtl",["Y","NA"])}</div>

<div><label class="lbl">Ver no needed funds</label>${dd("noaddtl",["Y","N"])}</div>

</div><div><label class="lbl">C approved SIF</label>${dd("rj",["Y","N"])}</div>
</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ LEGAL INTAKE */
if(t==="Legal Intake"){
f.innerHTML=`
<label class="lbl">C informed us they received a summons for:</label>
<input id="main" class="inp" placeholder="Creditor Name">

<div class="grid-3">
<div><label class="lbl">Completed legal intake</label>${dd("li",["Y","N"])}</div>
</div>
<label class="lbl">(1) What date were you served?</label>
<input id="date" class="inp" placeholder="Date">
  <label class="lbl">(2)In what manner were you served?</label>
<input id="manner" class="inp" placeholder="Via mail, sheriff, etc.">
  <label class="lbl">(3)What state was the summons filed in?</label>
<input id="state" class="inp" placeholder="State">
  <label class="lbl">(4)Who is listed as the
Plaintiff:</label>
<input id="plaintiff" class="inp" placeholder="Plaintiff name">
  <label class="lbl">Defendant</label>
<input id="defend" class="inp" placeholder="List all names">
  <label class="lbl">Attorney for Plaintiff:</label>
<input id="atty" class="inp" placeholder="List all names">
  <label class="lbl">(5)What is the docket or case number listed on
the summons?</label>
<input id="docket" class="inp" placeholder="Docket/Case Number">
    <label class="lbl">(6)How many days do you have to respond?</label>
<input id="days" class="inp" placeholder="How many days">
    <label class="lbl">(7)When is the response or answer to the summons
due?</label>
<input id="respo" class="inp" placeholder="Response Due">
    <label class="lbl">(8)Please review the summons carefully - Do you
have a court appearance or hearing scheduled?
If so when?</label>
<input id="court" class="inp" placeholder="Hearing Schedule">
<div><label class="lbl">(9)Do you or anyone listed on the summons receive any form of government income? If they say yes, pls request to send us proof in
the next 24 hrs</label>${dd("rip",["Y","N"])}</div>

  <div><label class="lbl">Set up RI for summons needed/created urgency
to send it to us</label>${dd("gi",["Y","N"])}</div>

<div><label class="lbl">Filled in lawsuit info box</label>${dd("law",["Y","N"])}</div>

<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}

/* ✅ Pro Se */
if(t==="Pro Se"){
f.innerHTML=`
<label class="lbl">C informed us they received a summons for:</label>
<input id="main" class="inp" placeholder="Creditor Name">

<div class="grid-3">
<div><label class="lbl">Completed legal intake</label>${dd("li",["Y","N"])}</div>
</div>
<label class="lbl">(1) What date were you served?</label>
<input id="date" class="inp" placeholder="Date">
  <label class="lbl">(2)In what manner were you served?</label>
<input id="manner" class="inp" placeholder="Via mail, sheriff, etc.">
  <label class="lbl">(3)What state was the summons filed in?</label>
<input id="state" class="inp" placeholder="State">
  <label class="lbl">(4)Who is listed as the
Plaintiff:</label>
<input id="plaintiff" class="inp" placeholder="Plaintiff name">
  <label class="lbl">Defendant</label>
<input id="defend" class="inp" placeholder="List all names">
  <label class="lbl">Attorney for Plaintiff:</label>
<input id="atty" class="inp" placeholder="List all names">
  <label class="lbl">(5)What is the docket or case number listed on
the summons?</label>
<input id="docket" class="inp" placeholder="Docket/Case Number">
    <label class="lbl">(6)How many days do you have to respond?</label>
<input id="days" class="inp" placeholder="How many days">
    <label class="lbl">(7)When is the response or answer to the summons
due?</label>
<input id="respo" class="inp" placeholder="Response Due">
    <label class="lbl">(8)Please review the summons carefully - Do you
have a court appearance or hearing scheduled?
If so when?</label>
<input id="court" class="inp" placeholder="Hearing Schedule">
<div><label class="lbl">(9)Do you or anyone listed on the summons receive any form of government income? If they say yes, pls request to send us proof in
the next 24 hrs</label>${dd("rip",["Y","N"])}</div>

  <div><label class="lbl">Set up RI for summons needed/created urgency

to send it to us</label>${dd("gi",["Y","N"])}</div>
<div><label class="lbl">Offered option for Prose</label>${dd("prose",["C Approved","C Denied"])}</div>

<div><label class="lbl">Filled in lawsuit info box</label>${dd("law",["Y","N"])}</div>
<label class="lbl">Notes</label>
<textarea id="notes" class="inp"></textarea>

<label class="lbl">VC Link</label>
<input id="vc" class="inp">
`;
}


}
