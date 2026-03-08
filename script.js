// =======================
// LANGUAGE SYSTEM
// =======================

let language = "english";

const translations = {

english: {
name: "What is your full name?",
dob: "What is your date of birth?",
address: "What is your address?",
income: "What is your yearly income?"
},

hindi: {
name: "आपका पूरा नाम क्या है?",
dob: "आपकी जन्म तिथि क्या है?",
address: "आपका पता क्या है?",
income: "आपकी वार्षिक आय क्या है?"
},

malayalam: {
name: "നിങ്ങളുടെ മുഴുവൻ പേര് എന്താണ്?",
dob: "നിങ്ങളുടെ ജനനത്തീയതി എന്താണ്?",
address: "നിങ്ങളുടെ വിലാസം എന്താണ്?",
income: "നിങ്ങളുടെ വാർഷിക വരുമാനം എത്രയാണ്?"
}

};

function setLanguage(lang){

language = lang;

let chatbox = document.getElementById("chatbox");

chatbox.innerHTML += `
<div class="chat-message ai">
<div class="bubble">Language changed to ${lang}</div>
</div>
`;

}


// =======================
// FIELD EXPLANATIONS
// =======================

const explanations = {

income: "Annual income means the total money your family earns in one year.",

aadhaar: "Aadhaar is a 12-digit identification number issued by the Government of India.",

dob: "Date of birth means the day you were born.",

address: "Your address is the place where you currently live."

};


// =======================
// FORM QUESTIONS
// =======================

const formQuestions = [
{ field: "name" },
{ field: "dob" },
{ field: "address" },
{ field: "income" }
];

let currentQuestion = 0;

let formData = {};


// =======================
// ASK QUESTION
// =======================

function askQuestion(){

if(currentQuestion < formQuestions.length){

let field = formQuestions[currentQuestion].field;

let question = translations[language][field];

let chatbox = document.getElementById("chatbox");

chatbox.innerHTML += `
<div class="chat-message ai">
<div class="bubble">${question}</div>
</div>
`;

chatbox.scrollTop = chatbox.scrollHeight;

}

}


// =======================
// HANDLE MESSAGE
// =======================

function sendMessage(){

let input = document.getElementById("userInput").value;

if(!input) return;

let chatbox = document.getElementById("chatbox");

chatbox.innerHTML += `
<div class="chat-message user">
<div class="bubble">${input}</div>
</div>
`;

document.getElementById("userInput").value = "";

let message = input.toLowerCase();


// Explanation detection

for(let key in explanations){

if(message.includes(key)){

chatbox.innerHTML += `
<div class="chat-message ai">
<div class="bubble">${explanations[key]}</div>
</div>
`;

chatbox.scrollTop = chatbox.scrollHeight;

return;

}

}


// Save answer

if(currentQuestion < formQuestions.length){

let field = formQuestions[currentQuestion].field;

formData[field] = input;

currentQuestion++;

updatePreview();

askQuestion();

}

chatbox.scrollTop = chatbox.scrollHeight;

}


// =======================
// FORM PREVIEW
// =======================

function updatePreview(){

let preview = document.getElementById("formPreview");

preview.innerHTML = `

Name: ${formData.name || ""} <br>
DOB: ${formData.dob || ""} <br>
Address: ${formData.address || ""} <br>
Income: ${formData.income || ""} <br>
Aadhaar: ${formData.aadhaar || ""}

`;

}


// =======================
// VOICE INPUT
// =======================

function startVoice(){

const recognition = new webkitSpeechRecognition();

recognition.lang = "en-IN";

recognition.start();

recognition.onresult = function(event){

let speechText = event.results[0][0].transcript;

document.getElementById("userInput").value = speechText;

sendMessage();

};

}


// =======================
// OCR FUNCTION
// =======================

async function extractAadhaar(){

let file = document.getElementById("aadhaarUpload").files[0];

if(!file){

alert("Please upload Aadhaar image");

return;

}

let result = await Tesseract.recognize(file,'eng');

let text = result.data.text;

extractDetails(text);

}


// =======================
// EXTRACT DETAILS
// =======================

function extractDetails(text){

let aadhaarRegex = /\d{4}\s\d{4}\s\d{4}/;

let aadhaarMatch = text.match(aadhaarRegex);

if(aadhaarMatch){

let detectedAadhaar = aadhaarMatch[0];

let corrected = prompt(
"Detected Aadhaar Number:\n" + detectedAadhaar +
"\n\nIf incorrect, please edit it:"
);

formData["aadhaar"] = corrected || detectedAadhaar;

}


// DOB detection

let dobRegex = /\d{2}\/\d{2}\/\d{4}/;

let dobMatch = text.match(dobRegex);

if(dobMatch){

formData["dob"] = dobMatch[0];

}

updatePreview();

}


// =======================
// SUBMIT FORM
// =======================

function submitForm(){

alert("Application submitted successfully!");

}


// =======================
// START ASSISTANT
// =======================

window.onload = function(){

askQuestion();

};