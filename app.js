// Supabase config
const SUPABASE_URL = "https://fsunuzocjcunvrjzyckn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdW51em9jamN1bnZyanp5Y2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDI1NTQsImV4cCI6MjA5MDE3ODU1NH0._xrZ7bTsixv_mA4DsF3LnDRIjyulKd8e63V22WJlpX8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// get amount
function getAmount(){
let params=new URLSearchParams(window.location.search);
return params.get("amount");
}

// UPI link
function getUPI(){
let amt=getAmount();
return "upi://pay?pa=7606991266@fam&pn=Corvion&am="+amt+"&cu=INR";
}

// Pay via UPI
function payUPI(){
window.location.href=getUPI();
}

// Generate QR
function generateQR(){
let qr="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data="+encodeURIComponent(getUPI());
document.getElementById("qr").src=qr;
}

// ✅ Submit + Save + Redirect
async function submitData(){

let utr=document.getElementById("utr").value.trim();
let file=document.getElementById("file").files[0];

// validation
if(!utr && !file){
alert("Please enter UTR OR upload screenshot");
return;
}

let imageUrl="";

// upload image
if(file){
let fileName=Date.now()+"_"+file.name;

let { data, error } = await supabaseClient.storage
.from("payments")
.upload(fileName, file);

if(error){
alert("Image upload failed ❌");
return;
}

// generate public URL
imageUrl = SUPABASE_URL + "/storage/v1/object/public/payments/" + fileName;
}

// insert data
let { error } = await supabaseClient
.from("payments")
.insert([{
time:new Date().toISOString(),
utr:utr,
image:imageUrl
}]);

if(error){
alert("Submission failed ❌");
return;
}

// success message
alert("Payment Submitted Successfully ✅");

// redirect to home
setTimeout(()=>{
window.location.href="index.html";
},2000);

}
