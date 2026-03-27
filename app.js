// Supabase config
const SUPABASE_URL = "https://fsunuzocjcunvrjzyckn.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY"; // paste key here

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

// Save data to Supabase
async function submitData(){

let utr=document.getElementById("utr").value;
let file=document.getElementById("file").files[0];

let imageUrl="";

if(file){
let fileName=Date.now()+"_"+file.name;

let { data, error } = await supabaseClient.storage
.from("payments")
.upload(fileName, file);

if(data){
imageUrl = SUPABASE_URL+"/storage/v1/object/public/payments/"+fileName;
}
}

await supabaseClient
.from("payments")
.insert([{
time:new Date(),
utr:utr,
image:imageUrl
}]);

alert("Submitted Successfully");
}
