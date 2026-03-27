const SUPABASE_URL = "https://fsunuzocjcunvrjzyckn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdW51em9jamN1bnZyanp5Y2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDI1NTQsImV4cCI6MjA5MDE3ODU1NH0._xrZ7bTsixv_mA4DsF3LnDRIjyulKd8e63V22WJlpX8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// submit
async function submitData(){

let utr = document.getElementById("utr").value.trim();
let file = document.getElementById("file").files[0];

if(!utr && !file){
alert("Enter UTR or upload screenshot");
return;
}

let imageUrl = "";

// upload image
if(file){

let fileName = Date.now() + ".png";

let { error } = await supabaseClient.storage
.from("payments")
.upload(fileName, file);

if(error){
alert("UPLOAD ERROR: " + error.message);
console.log(error);
return;
}

// get public url
let { data } = supabaseClient.storage
.from("payments")
.getPublicUrl(fileName);

imageUrl = data.publicUrl;
}

// save data
let { error } = await supabaseClient
.from("payments")
.insert([{
time: new Date().toISOString(),
utr: utr,
image: imageUrl
}]);

if(error){
alert("DB ERROR: " + error.message);
console.log(error);
return;
}

alert("Payment Submitted ✅");

setTimeout(()=>{
window.location.href = "index.html";
},2000);

}
