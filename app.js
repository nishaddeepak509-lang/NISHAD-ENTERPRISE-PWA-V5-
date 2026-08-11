const SERVICES=[
["⚡","Electrical Services","Installation, repair, maintenance and fault finding."],
["🔧","Plumbing Services","Leakage, fittings, piping and maintenance work."],
["🏠","Home Renovation","Electrical, plumbing, repair and renovation support for homes."],
["🚢","Marine Electrical Services","Professional electrical support for vessels."],
["🛠️","Marine Maintenance Support","Technical maintenance support for marine systems."],
["💡","Lighting & Power","Commercial, residential and vessel lighting solutions."],
["🧰","Repair & Maintenance","Reliable technical repair and preventive maintenance."]
];

const KEY="ne_v5_professional_data";
const DEFAULT_PHONES=["7350411992","8806934449"];
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{
 media:[], enquiries:[], activity:[], phones:DEFAULT_PHONES,
 password:"Admin@123", unread:0
};

function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2500)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function renderServices(){
 document.getElementById("serviceGrid").innerHTML=SERVICES.map(s=>`<article class="service"><div class="ico">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join("");
 document.getElementById("serviceCount").textContent=SERVICES.length;
 document.getElementById("eService").innerHTML='<option value="">Select service</option>'+SERVICES.map(s=>`<option>${esc(s[1])}</option>`).join("");
 document.getElementById("adminServices").innerHTML=SERVICES.map(s=>`<div class="adminItem"><span>${s[0]} ${esc(s[1])}</span><span class="muted">Customer visible</span></div>`).join("");
}

function renderMedia(){
 const g=document.getElementById("mediaGrid"), n=document.getElementById("noMedia");
 g.innerHTML=data.media.map((m,i)=>`
 <article class="media">
   ${m.type.startsWith("video")?`<video src="${m.url}" controls preload="metadata"></video>`:`<img src="${m.url}" alt="${esc(m.name)}">`}
   <div class="mediaBody">
     <b>${esc(m.name)}</b>
     <div class="mediaActions">
       <button onclick="likeMedia(${i})">❤️ ${m.likes||0}</button>
       <button onclick="commentMedia(${i})">💬 ${m.comments?.length||0}</button>
       <button onclick="shareMedia(${i})">↗ Share</button>
     </div>
     ${(m.comments||[]).slice(-2).map(c=>`<div class="comment"><b>${esc(c.name||"Customer")}:</b> ${esc(c.text)}</div>`).join("")}
   </div>
 </article>`).join("");
 n.classList.toggle("hidden",data.media.length>0);
 document.getElementById("mediaCount").textContent=data.media.length;
 document.getElementById("mediaCountLabel").textContent=`${data.media.length} post${data.media.length===1?"":"s"}`;
 document.getElementById("adminMedia").innerHTML=data.media.map((m,i)=>`
 <div class="adminItem"><span>${m.type.startsWith("video")?"🎬":"🖼️"} ${esc(m.name)} • ❤️ ${m.likes||0} • 💬 ${m.comments?.length||0}</span><button onclick="deleteMedia(${i})">Delete</button></div>`
 ).join("")||'<p class="muted">No media uploaded yet.</p>';
}

function renderEnquiries(){
 const list=document.getElementById("enquiryList");
 list.innerHTML=data.enquiries.map((e,i)=>`
 <div class="adminItem enquiryItem">
   <div><b>${esc(e.name||"Customer")}</b> ${e.read?"":"<span class='newTag'>NEW</span"}<br>
   <span class="muted">${esc(e.phone)} • ${esc(e.service||"General enquiry")}</span><br>
   <span>${esc(e.message)}</span><br><small>${new Date(e.time).toLocaleString()}</small></div>
   <div class="miniActions"><button onclick="markRead(${i})">${e.read?"Read":"Mark read"}</button><button onclick="deleteEnquiry(${i})">Delete</button></div>
 </div>`).join("")||'<p class="muted">No customer enquiries yet.</p>';
 document.getElementById("enquiryCount").textContent=data.enquiries.length;
 document.getElementById("enquiryBadge").textContent=data.unread;
 document.getElementById("enquiryBadge").classList.toggle("hidden",data.unread===0);
 document.getElementById("notificationSummary").textContent=data.unread?`${data.unread} new customer enquiry notification${data.unread===1?"":"s"}. Open Enquiries to review.`:"No new customer activity.";
 document.getElementById("activityCount").textContent=data.activity.length;
}

function render(){
 renderServices();renderMedia();renderEnquiries();
 document.getElementById("phone1").value=data.phones[0]||"";
 document.getElementById("phone2").value=data.phones[1]||"";
}

function showCustomer(){document.getElementById("customerView").classList.remove("hidden");document.getElementById("adminView").classList.add("hidden");window.scrollTo(0,0)}
function openAdmin(){document.getElementById("loginModal").classList.remove("hidden");document.getElementById("menu").classList.add("hidden")}
function login(){
 const pass=document.getElementById("loginPass").value;
 if(pass===data.password){
  closeModal("loginModal");document.getElementById("customerView").classList.add("hidden");document.getElementById("adminView").classList.remove("hidden");render();toast("Admin access granted");
 }else toast("Wrong admin password");
}
function closeModal(id){document.getElementById(id).classList.add("hidden")}
function toggleMenu(){document.getElementById("menu").classList.toggle("hidden")}
function switchTab(id){document.querySelector(`.tab[data-tab="${id}"]`)?.click()}
function callBusiness(){const p=data.phones.find(Boolean);if(!p)return toast("Business call number is not configured by Admin");location.href="tel:"+p.replace(/\D/g,"")}
function whatsappBusiness(){const p=data.phones.find(Boolean);if(!p)return toast("Business WhatsApp number is not configured by Admin");location.href="https://wa.me/"+p.replace(/\D/g,"")}
function savePhones(){
 const a=document.getElementById("phone1").value.trim(),b=document.getElementById("phone2").value.trim();
 if(!a&&!b)return toast("Enter at least one business number");
 data.phones=[a,b];save();toast("Business numbers saved");
}
function changePassword(){const p=document.getElementById("newPass").value;if(p.length<8)return toast("Use at least 8 characters");data.password=p;save();document.getElementById("newPass").value="";toast("Admin password changed")}
function deleteMedia(i){data.media.splice(i,1);save();renderMedia();toast("Media deleted")}
function deleteEnquiry(i){if(!confirm("Delete this enquiry?"))return;data.enquiries.splice(i,1);save();renderEnquiries();toast("Enquiry deleted")}
function markRead(i){if(!data.enquiries[i].read){data.enquiries[i].read=true;data.unread=Math.max(0,data.unread-1);save();renderEnquiries();}}
function likeMedia(i){data.media[i].likes=(data.media[i].likes||0)+1;data.activity.unshift({type:"like",media:data.media[i].name,time:Date.now()});save();renderMedia();renderEnquiries();toast("Liked")}
function commentMedia(i){
 const text=prompt("Write a comment");if(!text?.trim())return;
 const name=prompt("Your name")||"Customer";
 data.media[i].comments=data.media[i].comments||[];data.media[i].comments.push({name,text:text.trim(),time:Date.now()});
 data.activity.unshift({type:"comment",media:data.media[i].name,time:Date.now()});save();renderMedia();renderEnquiries();toast("Comment added");
}
async function shareMedia(i){
 const title="NISHAD ENTERPRISES — "+data.media[i].name;
 try{if(navigator.share)await navigator.share({title,text:"NISHAD ENTERPRISES work",url:location.href});else await navigator.clipboard.writeText(location.href);toast("Share link ready")}
 catch(e){}
}
function openEnquiry(){document.getElementById("enquiryModal").classList.remove("hidden")}
function submitEnquiry(){
 const name=document.getElementById("eName").value.trim(),phone=document.getElementById("ePhone").value.trim(),service=document.getElementById("eService").value,message=document.getElementById("eMessage").value.trim();
 if(!name||!phone||!message)return toast("Please enter name, mobile and requirement");
 data.enquiries.unshift({name,phone,service,message,time:Date.now(),read:false});
 data.unread++;
 data.activity.unshift({type:"enquiry",name,time:Date.now()});
 save();closeModal("enquiryModal");
 ["eName","ePhone","eMessage"].forEach(id=>document.getElementById(id).value="");document.getElementById("eService").value="";
 toast("Enquiry sent to Admin panel");
 try{if("Notification" in window&&Notification.permission==="granted")new Notification("NISHAD ENTERPRISES",{body:"New customer enquiry received."})}catch(e){}
}
function enableNotifications(){
 if(!("Notification" in window))return toast("Browser notifications are not supported");
 Notification.requestPermission().then(p=>toast(p==="granted"?"Notifications enabled":"Notification permission not granted"));
}
function sendDemoOtp(){toast("OTP demo is not enabled in this professional build")}
function installApp(){toast("Use Chrome menu → Install app / Add to Home screen")}
document.getElementById("mediaInput").addEventListener("change",async e=>{
 for(const f of e.target.files){
  if(!f.type.startsWith("image/")&&!f.type.startsWith("video/"))continue;
  const url=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(f)});
  data.media.unshift({name:f.name,type:f.type,url,likes:0,comments:[]});
 }
 save();renderMedia();toast("Media added");
});
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 document.querySelectorAll(".tabpanel").forEach(x=>x.classList.add("hidden"));document.getElementById(b.dataset.tab).classList.remove("hidden");
 if(b.dataset.tab==="enquiries"){data.enquiries.forEach(e=>{});renderEnquiries()}
}));
render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("service-worker.js").catch(()=>{});
