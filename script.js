const CATS=["Electronics","Food & drink","Apparel","Home & garden","Beauty","Tools"];
const COLORS={"Electronics":"#2b6cb0","Food & drink":"#2e7d5b","Apparel":"#8a4fa0","Home & garden":"#b7791f","Beauty":"#c2527a","Tools":"#4a5568"};
let lots=[
 {id:1,t:"120 × Bluetooth speakers",c:"Electronics",loc:"Austin, TX",p:19.5,r:31,q:120,m:20},
 {id:2,t:"1 pallet organic oat milk (96 cartons)",c:"Food & drink",loc:"Portland, OR",p:12.3,r:16.5,q:96,m:24},
 {id:3,t:"300 × cotton tees, mixed sizes",c:"Apparel",loc:"Charlotte, NC",p:5.5,r:9,q:300,m:50},
 {id:4,t:"60 × ceramic planters, 3 sizes",c:"Home & garden",loc:"Tucson, AZ",p:12,r:18,q:60,m:10},
 {id:5,t:"80 × vitamin C serums, 30 ml",c:"Beauty",loc:"Miami, FL",p:6.2,r:14,q:80,m:16},
 {id:6,t:"45 × cordless drill kits",c:"Tools",loc:"Columbus, OH",p:48,r:72,q:45,m:5},
 {id:7,t:"500 × loose-leaf tea tins",c:"Food & drink",loc:"Seattle, WA",p:3.1,r:5.4,q:500,m:100},
 {id:8,t:"200 × USB-C chargers, 65 W",c:"Electronics",loc:"San Jose, CA",p:8.9,r:15,q:200,m:25},
 {id:9,t:"150 × denim jackets, returns-free",c:"Apparel",loc:"Atlanta, GA",p:17,r:34,q:150,m:30}
];
let nextId=10,cat="All",query="",cur=null;
const $=s=>document.querySelector(s);
const money=n=>"$"+n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function chips(){
 $("#chips").innerHTML=["All",...CATS].map(c=>`<button class="chip" type="button" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
 $("#f-cat").innerHTML=CATS.map(c=>`<option>${c}</option>`).join("");
}
function render(){
 let list=lots.filter(l=>(cat==="All"||l.c===cat)&&(l.t+" "+l.c+" "+l.loc).toLowerCase().includes(query.toLowerCase()));
 const s=$("#sort").value,sv=l=>1-l.p/l.r;
 list.sort((a,b)=>s==="low"?a.p-b.p:s==="save"?sv(b)-sv(a):s==="moq"?a.m-b.m:b.id-a.id);
 $("#count").textContent=list.length+(list.length===1?" lot":" lots");
 $("#grid").innerHTML=list.length?list.map(l=>`
 <article class="card" style="--c:${COLORS[l.c]}">
  <div><div class="cat">${l.c} · ${esc(l.loc)}</div><h3>${esc(l.t)}</h3></div>
  <div class="price">${money(l.p)} <small>per unit</small></div>
  <div class="save">${Math.round((1-l.p/l.r)*100)}% below supplier price (${money(l.r)})</div>
  <dl class="meta"><dt>Available</dt><dd>${l.q} units</dd><dt>Minimum order</dt><dd>${l.m} units</dd></dl>
  <button class="btn" data-id="${l.id}">Make offer</button>
 </article>`).join(""):`<div class="empty" style="grid-column:1/-1">No lots match. Clear the search or pick another category, or <a href="#sell">post one yourself</a>.</div>`;
}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove("on"),3200)}
function total(){const n=+$("#oQty").value||0;$("#oTotal").textContent=n?`Offer total: ${money(n*cur.p)}`:""}

$("#chips").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;cat=b.dataset.c;chips();render()});
$("#sort").addEventListener("change",render);
$("#heroSearch").addEventListener("submit",e=>{e.preventDefault();query=$("#q").value.trim();render();$("#market").scrollIntoView()});
$("#q").addEventListener("input",e=>{query=e.target.value.trim();render()});
$("#grid").addEventListener("click",e=>{
 const b=e.target.closest("[data-id]");if(!b)return;
 cur=lots.find(l=>l.id==b.dataset.id);
 $("#dTitle").textContent=cur.t;
 $("#dSub").textContent=`${money(cur.p)} per unit. Order ${cur.m} to ${cur.q} units.`;
 const q=$("#oQty");q.min=cur.m;q.max=cur.q;q.value=cur.m;total();
 $("#dlg").showModal();
});
$("#oQty").addEventListener("input",total);
$("#dlg").addEventListener("close",()=>{
 if($("#dlg").returnValue==="ok")toast(`Offer sent for ${$("#oQty").value} units. The seller has 24 hours to reply.`);
});
$("#lotForm").addEventListener("submit",e=>{
 e.preventDefault();
 const g=id=>$("#"+id).value.trim();
 const l={id:nextId++,t:g("f-title"),c:g("f-cat"),loc:g("f-loc"),p:+g("f-price"),r:+g("f-retail"),q:+g("f-qty"),m:+g("f-moq")};
 if(l.m>l.q){toast("Minimum order can't be more than the units available.");return}
 if(l.r<l.p){toast("Supplier price should be at least your price per unit.");return}
 lots.unshift(l);e.target.reset();cat="All";query="";$("#q").value="";$("#sort").value="new";chips();render();
 toast("Lot published. It's now first in the list.");$("#market").scrollIntoView();
});
chips();render();
