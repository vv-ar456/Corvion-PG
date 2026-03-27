// Supabase config
const SUPABASE_URL = "https://fsunuzocjcunvrjzyckn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdW51em9jamN1bnZyanp5Y2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDI1NTQsImV4cCI6MjA5MDE3ODU1NH0._xrZ7bTsixv_mA4DsF3LnDRIjyulKd8e63V22WJlpX8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Get amount
function getAmount(){
let params = new URLSearchParams(window.location.search);
return params.get("amount");
}

// UPI link
function getUPI(){
let amt = getAmount();
return "upi://pay?pa=7606991266@fam&pn=Corvion&am="+amt+"&cu=INR";
}

// Pay via UPI
function payUPI(){
window.location.href = getUPI();
}

// Generate QR
function generateQR(){
let qr = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data="+encodeURIComponent(getUPI());
document.getElementById("qr").src = qr;
}

// Submit data
async function submitData(){

let utr = document.getElementById("utr").value.trim();
let file = document.getElementById("file").files[0];

// Validation
if(!utr && !file){
alert("Enter UTR or upload screenshot");
return;
}

let imageUrl = "";

// Upload image
if(file){

let fileName = Date.now() + "_" + file.name;

let { error } = await supabaseClient.storage
.from("payments")
.upload(fileName, file);

if(error){
alert("Upload error: " + error.message);
return;
}

// Get public URL
let { data } = supabaseClient.storage
.from("payments")
.getPublicUrl(fileName);

imageUrl = data.publicUrl;
}

// Insert data
let { error } = await supabaseClient
.from("payments")
.insert([{
time: new Date().toISOString(),
utr: utr,
image: imageUrl
}]);

if(error){
alert("Database error: " + error.message);
return;
}

// Success
alert("Payment Submitted Successfully ✅");

// Redirect
setTimeout(()=>{
window.location.href = "index.html";
},2000);

}
