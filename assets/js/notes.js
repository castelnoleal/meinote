/* =====================================================================
   MeiNote · NOTE TEXT
   generateNote() builds the note for the selected template.
   line("Label","id") prints "Label: value" and skips blanks and "delete".
   The opening block (BPO Agent ...) and closing block (B/H ...) are added for every note.
   ===================================================================== */

function line(label,id){
const v=val(id);
if(!v || v==="Delete" || v==="delete") return '';
return `${label}: ${v}\n`;
}

function generateNote(){
if(!currentTemplate){ alert("Select template"); return; }

let note="";

note+=`BPO Agent
Sw: C
Greet, rec disc, validated: Y
Discussed w. C:

`;

if(currentTemplate==="Expedite Graduation"){
note+=`Request for Early Graduation${val("main2")}\n`;
note+=line("Current Status equals (Active)","details");
note+=line("Total Active debt equals 0","name4");
note+=line("PS Committed Unpaid Creditors equals 0","balances");
note+=line("PS Committed Unbilled Fees equals 0","verbal");
note+=line("Savings Balance greater than or equal to 0","payment");
note+=line("Scheduled Advance Repayments equals 0","method");
note+=line("The client has NO Pending Deposits","nofunds");
note+=line("All creditor payments have posted","approved");
note+=`DS Number: ${val("vc")}\n`;
note+=`DS Link: ${val("vc2")}\n`;
}

if(currentTemplate==="Void SIF and Remove Creditor"){

note+=`Cancel SIF Request -  ${val("main2")}\n`;
note+=`Reason: ${val("notes2")}\n`;

note+=`Program Type: ${val("main4")}\n`;
note+=`DS Number: ${val("main5")}\n`;
note+=`CC Number: ${val("main6")}\n`;
note+=`DS Link: ${val("main7")}\n`;
note+=`Additonal Notes: ${val("main8")}\n`;
}

if(currentTemplate==="Consult"){

note+=`Consult -  ${val("main2")}\n`;
note+=`Concern: ${val("notes2")}\n`;

note+=`DS Number: ${val("main4")}\n`;
note+=`DS Link: ${val("main5")}\n`;
note+=`CC Number: ${val("main6")}\n`;
note+=`CC Link: ${val("main7")}\n`;
note+=`Notes: ${val("main8")}\n`;
}

if(currentTemplate==="NSF Exception"){

note+=`NSF Exception -  ${val("main2")}\n`;

note+=line("Reason: ","reason");
note+=`Concern: ${val("notes2")}\n`;
note+=`DS Number: ${val("main4")}\n`;
note+=`DS Link: ${val("main5")}\n`;
note+=`CC Number: ${val("main6")}\n`;
note+=`CC Link: ${val("main7")}\n`;
note+=`Notes: ${val("main8")}\n`;
}

if(currentTemplate==="Remove Deposit (Multiple)"){

note+=`Remove Deposit -  ${val("main2")}\n`;
note+=`Reason: ${val("notes2")}\n`;

note+=`Number of Deposit: ${val("main4")}\n`;
note+=`Amount: ${val("main5")}\n`;
note+=`Start Date: ${val("main6")}\n`;
note+=`End Date: ${val("main7")}\n`;
note+=`DS Number: ${val("main8")}\n`;
note+=`DS Link: ${val("main9")}\n`;
}

if(currentTemplate==="Internal Case Bank Update"){

note+=`Internal Case Request -  ${val("main2")}\n`;
note+=`DS Number: ${val("main3")}\n`;
note+=`DS Link: ${val("main4")}\n`;
note+=`Pending Deposit Date & Amount: ${val("main5")}\n`;
note+=`EST Post date + 1BD: ${val("main6")}\n`;
note+=`Request Type(Bank update, NSF, PSR,Refund): ${val("main7")}\n`;

note+=`[Banking Update]
Will the deposit clear?: ${val("depoc")}\n`;
note+=`EST Post Date: ${val("main8")}\n`;
note+=line("Do they want it to clear? ","clear");
note+=line("C wants to use new bank after deposit? ","dep");
note+=line("ATD Signed? ","atd");
note+=line("OTP/KBA Verified? ","otp");
note+=line("Validation Completed? ","val");
note+=`Account Number: ${val("main9")}\n`;
note+=`Routing Number: ${val("main0")}\n`;
note+=`Checking or Savings? ${val("check")}\n`;
note+=`Did C requested a callback? ${val("call")}\n`;
}

if(currentTemplate==="Internal Case Force Refund"){

note+=`Internal Case Request -  ${val("main2")}\n`;
note+=`DS Number: ${val("main3")}\n`;
note+=`DS Link: ${val("main4")}\n`;
note+=`Pending Deposit Date & Amount: ${val("main5")}\n`;
note+=`EST Post date + 1BD: ${val("main6")}\n`;
note+=`Request Type(Bank update, NSF, PSR,Refund): ${val("main7")}\n`;

note+=`Funds will clear? ${val("depoc")}\n`;
note+=line("Adv about timeframe? ","clear");
note+=line("Authentication (OTP/KBA) ","dep");
note+=`Did C requested a callback? ${val("call")}\n`;
}

if(currentTemplate==="Internal Case Internal NSF"){

note+=`Internal Case Request -  ${val("main2")}\n`;
note+=`DS Number: ${val("main3")}\n`;
note+=`DS Link: ${val("main4")}\n`;
note+=`Pending Deposit Date & Amount: ${val("main5")}\n`;
note+=`EST Post date + 1BD: ${val("main6")}\n`;
note+=`Request Type(Bank update, NSF, PSR,Refund): ${val("main7")}\n`;

note+=`NSF Waterfall Completed?: ${val("depoc")}\n`;
note+=`What date & amount were rescheduled (if applicable): ${val("main44")}\n`;
note+=line("Expectations set that should pending deposit clear, rescheduled amount will also still pull?? ","clear");
note+=line("Is the client requesting the deposit (NSF) to be skipped? ","dep");
note+=`Did C requested a callback?: ${val("call")}\n`;
}

if(currentTemplate==="Skip Deposit"){
note+=`Skip Deposit: ${val("main")}\n`;
note+=line("Rev hardship","hardship");
note+=line("Rev account/runner","runner");
note+=line("Rev Waterfall","waterfall");
note+=line("Rev 90DD","dd90");
note+=line("[Checked/Rev ISD]","isd");
note+=line("Sent draft","draft");
}

if(currentTemplate==="Basic"){
}

if(currentTemplate==="Required Items"){
note+=`Required Item: ${val("main")}\n`;
note+=`RI current status/For: ${val("spec")}\n`;
note+=line("Adv C to expedite and send/return doc in within 24h","24h");
note+=line("Closed/Hold RI for","closed RI");
}

if(currentTemplate==="OTP Override"){
note+=`OTP OVERRIDE REQUEST${val("main")}\n`;
note+=`Client Full Name: ${val("main2")}\n`;
note+=`DS Number: ${val("main3")}\n`;
note+=`DS Link: ${val("main31")}\n`;
note+=line("DS Link verification Done:","24h");
note+=`Client Current #: ${val("main4")}\n`;
note+=`Client Updated #: ${val("main5")}\n`;
note+=`Client Old Email: ${val("main6")}\n`;
note+=`Client Updated Email: ${val("main7")}\n`;
}

if(currentTemplate==="Advance Request"){

note+=`Advance Request -  ${val("main2")}\n`;
note+=`CC Number: ${val("main3")}\n`;
note+=line("Legal","legal");
note+=line("Good Dep. Sched","dep");
note+=line("First/Last Acc","1st");
note+=line("B/H Updated","b/h");
note+=line("Unemployed?","jobless");
note+=line("Committed to Deposits?","deposit");
note+=`Total Fess Cleared: ${val("main31")}\n`;
note+=`Amount Needed: ${val("main5")}\n`;
note+=`Recoup Time: ${val("main6")}\n`;
note+=`DS Link: ${val("main7")}\n`;
}

if(currentTemplate==="Add Debt Request"){

note+=`Add Debt Request -  ${val("main2")}\n`;
note+=`Creditor Name: ${val("main333")}\n`;
note+=`CC Number: ${val("main3")}\n`;
note+=`Account Balance: ${val("main31")}\n`;
note+=`Account Number: ${val("main51")}\n`;
note+=`Case Number: ${val("main5")}\n`;
note+=line("Debt Not Enrolled?","legal");
note+=line("Debt Acceptable?","dep");
note+=line("Debt Not in Legal Status?","1st");
note+=line("Debt is Unsecured?","b/h");
note+=line("Verified Debt Amount?","jobless");
note+=line("PS Refresh Needed","deposit");
note+=line("Creditor Statement Sent?","state");
note+=`DS LINK: ${val("main7")}\n`;
}

if(currentTemplate==="PS Refresh"){

note+=`PS Refresh Request -  ${val("main2")}\n`;
note+=`DS Number: ${val("main333")}\n`;
note+=`TOTAL Enrolled Debt: ${val("main3")}\n`;
note+=`Current Term: ${val("main31")}\n`;
note+=`Total Enrolled Months: ${val("main51")}\n`;
note+=`Old Deposit Amount: ${val("main5")}\n`;
note+=`New Deposit Amount: ${val("main55")}\n`;
note+=line("Old Frequency","legal");
note+=line("New Frequency","dep");
note+=`DS Link: ${val("main7")}\n`;
note+=`Reason: ${val("psreason")}\n`;
}

if(currentTemplate==="Escalations/Manager Request"){
note+=`Escalation/Manager Request${val("main1")}\n`;
note+=`${val("main0")}\n`;
note+=`Coach: ${val("main2")}\n`;
note+=`DS Number: ${val("main333")}\n`;
note+=`DS Link: ${val("link")}\n`;
note+=`Call Back Time: ${val("main51")}\n`;
note+=`C's PTN: ${val("main5")}\n`;
note+=`Issue: ${val("main3")}\n`;
note+=`Resolution Provided: ${val("Resolution")}\n`;
note+=`Help needed: ${val("main31")}\n`;
}

if(currentTemplate==="Expedited Negotiations Request"){
note+=`Expedited Negotiations Request${val("main1")}\n`;
note+=`${val("main0")}\n`;
note+=`Creditor Name: ${val("main2")}\n`;
note+=`CC Number: ${val("main333")}\n`;
note+=`CC Number(s) Link: ${val("main51")}\n`;
note+=line("Does the client have at least 25% of the OB (original balance) in their DSA?","jobless");
note+=line("Buk Creditor","24h");
note+=line("Request Type","req");
note+=`Provide Creditor Bulk Name: ${val("main69")}\n`;
note+=`Please provide more details on the urgency of this request: ${val("main31")}\n`;
}

if(currentTemplate==="Lump Sum Request"){
note+=`Lump Sum Request${val("main1")}\n`;
note+=`${val("main0")}\n`;
note+=`DS Number(s): ${val("main2")}\n`;
note+=`DS Link(s): ${val("main333")}\n`;
note+=`CC NUMBER(S): ${val("main51")}\n`;

note+=line("Request Type: ","req");

note+=`Reason for Lumpsum Request: ${val("main31")}\n`;
}

if(currentTemplate==="Lower Deposit"){
note+=`Lower Deposit: ${val("main")}\n`;
note+=line("Rev hardship","hardship");
note+=line("Rev account/runner","runner");
note+=line("Rev Waterfall","waterfall");
note+=line("Rev 90DD","dd90");
note+=line("[Checked/Rev ISD]","isd");
note+=line("Sent draft","draft");
}

if(currentTemplate==="Move Deposit"){
note+=`Move Deposit: ${val("main")}\n`;
note+=line("Rev hardship","hardship");
note+=line("Rev account/runner","runner");
note+=line("Rev Waterfall","waterfall");
note+=line("Rev 90DD","dd90");
note+=line("[Checked/Rev ISD]","isd");
note+=line("Sent draft","draft");
}

if(currentTemplate==="NSF Deposit"){
note+=`NSF: ${val("main")}\n`;
note+=line("Rev hardship","hardship");
note+=line("Rev importance to resch","resch");
note+=line("Rev account/runner","runner");
note+=line("Rev Waterfall","waterfall");
note+=line("Rev 90DD","dd90");

note+=line("C requested to","requested to");
note+=line("[Checked/Rev ISD]","isd");
note+=line("Sent draft","draft");
}

if(currentTemplate==="Update Banking Info"){
note+=`Update Banking Info: ${val("main")}\n`;
note+=line("Ver no pending deposits","deposit");
note+=line("Reviewed if deposits 5 bd","runner");
note+=line("Verified Acnt/Rout","acnt");
note+=line("Verified Bank","waterfall");
note+=line("Sent ATD","ATD");

note+=line("C signed on the line","sign");
note+=line("Adv should take 5 bd to update","draft");
note+=line("Rev next deposit","depo");
}

if(currentTemplate==="Refund"){
note+=`Refund: ${val("main")}\n`;
note+=line("Rev hardship","hardship");
note+=line("Rev DSA Balance","runner");
note+=line("Rev Waterfall","waterfall");
note+=line("Rev 90DD","dd90");
note+=line("[Checked/Rev ISD]","isd");
note+=line("Sent contact info email","draft");
note+=line("Adv refund verbiage","verb");
}

if(currentTemplate==="No Funds Needed"){
note+=`Settlement for ${val("creditor")}\n`;
note+=line("Reviewed SIF Details","details");
note+=line("Name, Last 4","name4");
note+=line("Orig. Bal, Curr. Bal, Sif Bal","balances");
note+=line("Verbal/Written","verbal");
note+=line("Payment amount/date ranges","payment");
note+=line("Payment method","method");
note+=line("Adv no additional funds needed","nofunds");
note+=line("Client approved","approved");
note+=line("Rev Approval Disc","disc");
}

if(currentTemplate==="Added Funds"){
note+=`Settlement for ${val("creditor")}\n`;
note+=`Scheduled funds${val("schedule")}\n`;
note+=line("Reviewed SIF Details","details");
note+=line("Name, Last 4","name4");
note+=line("Orig. Bal, Curr. Bal, Sif Bal","balances");
note+=line("Verbal/Written","verbal");
note+=line("Payment amount/date ranges","payment");
note+=line("Payment method","method");
note+=line("Reviewed funds needed","withfunds");
note+=line("Client approved SIF","app");
note+=line("Rev Approval Disc","rev");
note+=line("Sent Draft","approved");

}

if(currentTemplate==="Rejected"){
note+=`Settlement for ${val("creditor")}\n`;
note+=`Scheduled funds ${val("schedule")}\n`;
note+=line("Reviewed SIF Details","details");
note+=line("Name, Last 4","name4");
note+=line("Orig. Bal, Curr. Bal, Sif Bal","balances");
note+=line("Verbal/Written","verbal");
note+=line("Payment amount/date ranges","payment");
note+=line("Payment method","method");
note+=line("Reviewed funds needed","withfunds");
note+=line("C unable to amount needed","app");
note+=line("Rev if we can add less","less");
note+=line("Rev Approval Disc","rev");
note+=line("Sent Draft","approved");
note+=line("Addtl funds still needed","addtl");
note+=line("Advance rev/approved","adv");
note+=line("Advance rej disc.","rej");
note+=line("Advance rejected.","r");
note+=line("C approved reject offer","rj");

}

if(currentTemplate==="Moved Fees"){
note+=`Settlement for ${val("creditor")}\n`;
note+=`Scheduled funds ${val("schedule")}\n`;
note+=line("Reviewed SIF Details","details");
note+=line("Name, Last 4","name4");
note+=line("Orig. Bal, Curr. Bal, Sif Bal","balances");
note+=line("Verbal/Written","verbal");
note+=line("Payment amount/date ranges","payment");
note+=line("Payment method","method");
note+=line("Reviewed funds needed","withfunds");
note+=line("C unable to amount needed","app");
note+=line("Rev if we can add less","less");
note+=line("Rev Approval Disc","rev");
note+=line("Sent Draft","approved");
note+=line("Addtl funds still needed","addtl");
note+=line("Ver no needed funds ","noaddtl");
note+=line("C approved SIF","rj");

}

if(currentTemplate==="Legal Intake"){
note+=`C informed us they received a summons for:${val("main")}\n`;
note+=line("Completed legal intake","li");
note+=`(1) What date were you served? ${val("date")}\n`;
note+=`(2)In what manner were you served? ${val("manner")}\n`;
note+=`(3)What state was the summons filed in? ${val("state")}\n`;
note+=`(4)Who is listed as the
Plaintiff: ${val("plaintiff")}\n`;
note+=`Defendant: ${val("defend")}\n`;
note+=`Attorney for Plaintiff: ${val("atty")}\n`;
note+=`(5)What is the docket or case number listed on
the summons? ${val("docket")}\n`;
note+=`(6)How many days do you have to respond? ${val("days")}\n`;
note+=`(7)When is the response or answer to the summons
due? ${val("respo")}\n`;
note+=`(8)Please review the summons carefully - Do you
have a court appearance or hearing scheduled?
If so when? ${val("court")}\n`;
note+=line("(9)Do you or anyone listed on the summons receive any form of government income? -If they say yes, pls request to send us proof in the next 24 hrs","rip");
note+=line("-Set up RI for summons needed/created urgency to send it to us","gi");
note+=line("-Filled in lawsuit info box","law");

}

if(currentTemplate==="Pro Se"){
note+=`C informed us they received a summons for:${val("main")}\n`;
note+=line("Completed legal intake","li");
note+=`(1) What date were you served? ${val("date")}\n`;
note+=`(2)In what manner were you served? ${val("manner")}\n`;
note+=`(3)What state was the summons filed in? ${val("state")}\n`;
note+=`(4)Who is listed as the
Plaintiff: ${val("plaintiff")}\n`;
note+=`Defendant: ${val("defend")}\n`;
note+=`Attorney for Plaintiff: ${val("atty")}\n`;
note+=`(5)What is the docket or case number listed on
the summons? ${val("docket")}\n`;
note+=`(6)How many days do you have to respond? ${val("days")}\n`;
note+=`(7)When is the response or answer to the summons
due? ${val("respo")}\n`;
note+=`(8)Please review the summons carefully - Do you
have a court appearance or hearing scheduled?
If so when? ${val("court")}\n`;
note+=line("(9)Do you or anyone listed on the summons receive any form of government income? -If they say yes, pls request to send us proof in the next 24 hrs","rip");
note+=line("-Set up RI for summons needed/created urgency to send it to us","gi");
note+=line("-Offered option for Prose","prose");
note+=line("-Filled in lawsuit info box","law");

}

const n=val("notes");
if(n) note+=`\n${n}\n`;

note+=`
B/H: Y
Portal: Y
Ans all questions: Y
Survey: Y
VC Link: ${val("vc")}
`;

let finalNote = note.trim();

if(templateOnly){

// Remove title (first line + blank line)
const firstBreak = finalNote.indexOf("\n\n");
if(firstBreak !== -1){
finalNote = finalNote.substring(firstBreak + 2);
}

// Remove opening block
const openingStart = finalNote.indexOf("BPO Agent");
const openingEnd = finalNote.indexOf("Discussed w. C:");
if(openingStart !== -1 && openingEnd !== -1){
const afterOpening = finalNote.indexOf("\n\n", openingEnd);
if(afterOpening !== -1){
finalNote = finalNote.substring(afterOpening + 2);
}
}

// Remove closing block (B/H to Survey)
const closingStart = finalNote.indexOf("\nB/H:");
if(closingStart !== -1){
finalNote = finalNote.substring(0, closingStart);
}

}

document.getElementById("outputArea").value = finalNote.trim();
}
