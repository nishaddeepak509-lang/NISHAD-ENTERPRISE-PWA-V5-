const SERVICES=[
["⚡","Electrical Services","Installation, repair, maintenance and fault finding."],
["🔧","Plumbing Services","Leakage, fittings, piping and maintenance work."],
["🚢","Marine Electrical Services","Professional electrical support for vessels."],
["🛠️","Marine Maintenance Support","Technical maintenance support for marine systems."],
["💡","Lighting & Power","Commercial, residential and vessel lighting solutions."],
["🧰","Repair & Maintenance","Reliable technical repair and preventive maintenance."]
];
const KEY="ne_v5_data";
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{media:[],quotes:[],phones:["",""],password:"Admin@123"};
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
function renderServices(){serviceGrid.innerHTML=SERVICES.map(s=>`<article class="service"><div class="ico">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join("");document.getElementById("serviceCount").textContent=SERVICES.length}
function renderMedia(){
 const g=document.getElementById("mediaGrid"), n=document.getElementById("noMedia");
 g.innerHTML=data.media.map((m,i)=>`<div class="media">${m.type.startsWith("video")?`<video src="${m.url}" controls preload="metadata"></video>`:`<img src="${m.url}" alt="${m.name}">`}</div>`).join("");
 n.classList.toggle("hidden",data.media.length>0);
 document.getElementById("mediaCount").textContent=data.media.length;
 document.getElementById("adminMedia").innerHTML=data.media.map((m,i)=>`<div class="adminItem"><span>${m.type.startsWith("video")?"🎬":"🖼️"} ${m.name}</span><button onclick="deleteMedia(${i})">Delete</button></div>`).join("")||'<p class="muted">No media uploaded yet.</p>';
}
function renderQuotes(){document.getElementById("quoteCount").textContent=data.quotes.length;document.getElementById("quoteList").innerHTML=data.quotes.map((q,i)=>`<div class="adminItem"><span><b>${q.customer||"Customer"}</b><br>${q.service||"Service"} • ₹${q.amount||0}</span><button onclick="deleteQuote(${i})">Delete</button></div>`).join("")||'<p class="muted">No quotes yet.</p>'}
function renderAdminServices(){document.getElementById("adminServices").innerHTML=SERVICES.map(s=>`<div class="adminItem"><span>${s[0]} ${s[1]}</span><span class="muted">Customer visible</span></div>`).join("")}
function render(){renderServices();renderMedia();renderQuotes();renderAdminServices();document.getElementById("phone1").value=data.phones[0];document.getElementById("phone2").value=data.phones[1]}
function showCustomer(){customerView.classList.remove("hidden");adminView.classList.add("hidden");window.scrollTo(0,0)}
function openAdmin(){loginModal.classList.remove("hidden");menu.classList.add("hidden")}
function login(){
 const pass=document.getElementById("loginPass").value;
 if(pass===data.password){
   document.getElementById("loginModal").classList.add("hidden");
   document.getElementById("customerView").classList.add("hidden");
   document.getElementById("adminView").classList.remove("hidden");
   render();
   toast("Admin access granted");
 }else{
   toast("Wrong admin password");
 }
}
function closeModal(id){document.getElementById(id).classList.add("hidden")}
function toggleMenu(){menu.classList.toggle("hidden")}
function callBusiness(){const p=data.phones.find(Boolean);if(!p)return toast("Business call number is not configured by Admin");location.href="tel:"+p}
function whatsappBusiness(){const p=data.phones.find(Boolean);if(!p)return toast("Business WhatsApp number is not configured by Admin");location.href="https://wa.me/"+p.replace(/\D/g,"")}
function savePhones(){data.phones=[document.getElementById("phone1").value.trim(),document.getElementById("phone2").value.trim()];save();toast("Two contact numbers saved securely");}
function changePassword(){const p=document.getElementById("newPass").value;if(p.length<8)return toast("Use at least 8 characters");data.password=p;save();document.getElementById("newPass").value="";toast("Admin password changed")}
function deleteMedia(i){data.media.splice(i,1);save();renderMedia();toast("Media deleted")}
function deleteQuote(i){data.quotes.splice(i,1);save();renderQuotes();toast("Quote deleted")}
function createQuote(){data.quotes.unshift({customer:qCustomer.value,service:qService.value,amount:qAmount.value,notes:qNotes.value});save();document.getElementById("qCustomer").value="";document.getElementById("qService").value="";document.getElementById("qAmount").value="";document.getElementById("qNotes").value="";renderQuotes();toast("Quote created")}
mediaInput.addEventListener("change",async e=>{for(const f of e.target.files){if(!f.type.startsWith("image/")&&!f.type.startsWith("video/"))continue;const url=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(f)});data.media.unshift({name:f.name,type:f.type,url});}save();renderMedia();toast("Media added")});
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".tabpanel").forEach(x=>x.classList.add("hidden"));document.getElementById(b.dataset.tab).classList.remove("hidden")});
function showOtp(){otpModal.classList.remove("hidden")}
function sendDemoOtp(){otpMsg.textContent="Demo OTP sent. For production, connect a real OTP provider.";toast("Demo OTP: 123456")}
function verifyDemoOtp(){if(otpCode.value==="123456"){otpMsg.textContent="Verification successful (demo).";toast("OTP verified")}else toast("Invalid OTP")}
let deferredPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});function installApp(){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}else toast("Use Chrome menu → Install app / Add to Home screen")}
render();

if("serviceWorker" in navigator){navigator.serviceWorker.register("service-worker.js").catch(()=>{});}

document.addEventListener("DOMContentLoaded",()=>{
 const b=document.querySelector('[onclick="login()"]');
 if(b) b.addEventListener("click",()=>window.login());
});
