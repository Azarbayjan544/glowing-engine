const DEFAULT_PRODUCTS = [
{id:1,name:"شیر پرچرب آذربایجان",unit:"بطر ۱ لیتری",price:38000,old:45000,cat:"dairy",emoji:"🥛",bg:"#E7F5FE"},
{id:2,name:"ماست موسیر چکیده",unit:"دبه ۱ کیلویی",price:65000,cat:"dairy",emoji:"🍶",bg:"#FFF3D6"},
{id:3,name:"پنیر تبریزی اصل",unit:"بسته ۵۰۰ گرمی",price:120000,old:138000,cat:"dairy",emoji:"🧀",bg:"#E8F9EF"},
{id:4,name:"تخم‌مرغ تازه محلی",unit:"شانه ۳۰ عددی",price:145000,cat:"dairy",emoji:"🥚",bg:"#FFF3D6"},
{id:5,name:"نان بربری داغ تنوری",unit:"هر قرص",price:15000,cat:"bread",emoji:"🥖",bg:"#FFEED6"},
{id:6,name:"نان لواش بسته‌ای",unit:"بسته ۱۰ عددی",price:28000,cat:"bread",emoji:"🫓",bg:"#FFF3D6"},
{id:7,name:"برنج ایرانی درجه‌یک",unit:"کیسه ۵ کیلویی",price:850000,old:920000,cat:"grocery",emoji:"🍚",bg:"#E8F9EF"},
{id:8,name:"روغن آفتابگردان",unit:"بطری ۳ لیتری",price:285000,cat:"grocery",emoji:"🫗",bg:"#E7F5FE"},
{id:9,name:"ماکارونی رشته‌ای",unit:"بسته ۷۰۰ گرمی",price:42000,cat:"grocery",emoji:"🍝",bg:"#F1EAFE"},
{id:14,name:"نوشابه خانواده",unit:"بطری ۱/۵ لیتری",price:45000,cat:"drink",emoji:"🥤",bg:"#E7F5FE"},
{id:15,name:"دوغ نعنایی آذربایجان",unit:"بطری ۱/۵ لیتری",price:40000,cat:"drink",emoji:"🥛",bg:"#E8F9EF"},
{id:16,name:"چیپس سرکه‌ای",unit:"بسته بزرگ",price:38000,cat:"snack",emoji:"🍟",bg:"#FFF3D6"},
{id:17,name:"بیسکوییت کرمدار",unit:"بسته ۴ عددی",price:32000,old:38000,cat:"snack",emoji:"🍪",bg:"#FFEED6"},
{id:18,name:"مایع ظرفشویی لیمویی",unit:"بطری ۱ لیتری",price:55000,cat:"hygiene",emoji:"🧴",bg:"#E7F5FE"}
];
const CATS = {dairy:"لبنیات",bread:"نان تازه",grocery:"خواربار",drink:"نوشیدنی",snack:"تنقلات",hygiene:"شوینده"};
const CAT_BG = {dairy:"#E8F9EF",bread:"#FFF3D6",grocery:"#E8F9EF",drink:"#E7F5FE",snack:"#FFF3D6",hygiene:"#E7F5FE"};

function loadProducts(){
  try{
    const s = localStorage.getItem("az_products");
    if(s){
      const arr = JSON.parse(s);
      if(Array.isArray(arr) && arr.length){
        const cleaned = arr.filter(p=>p && p.cat!=="fruit");
        if(cleaned.length!==arr.length){ try{localStorage.setItem("az_products",JSON.stringify(cleaned));}catch(e){} }
        return cleaned;
      }
      if(Array.isArray(arr) && arr.length===0) return [];
    }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}
let PRODUCTS = loadProducts();
function persistProducts(){ try{localStorage.setItem("az_products",JSON.stringify(PRODUCTS));}catch(e){} }

// فروشگاه (شماره تماس و تنظیمات - قابل تغییر از پنل مدیریت)
function loadStore(){
  const def = {phone:"09108659424", phoneFa:"۰۹۱۰۸۶۵۹۴۲۴", manager:"آقای نویدی", addr:"شهرستان چهارباغ، روستای عرب‌آباد، خیابان شهید صمدی، کوچه نور", eitaa:"Azarbayjanshap", rubika:"Azarbayjanshap"};
  try{
    const s = localStorage.getItem("az_store");
    if(s){ const o = JSON.parse(s); return Object.assign(def,o); }
  }catch(e){}
  return def;
}
let STORE = loadStore();
function persistStore(){ try{localStorage.setItem("az_store",JSON.stringify(STORE));}catch(e){} }
function applyStore(){
  document.querySelectorAll(".store-phone").forEach(el=>{ el.textContent = STORE.phoneFa; });
  document.querySelectorAll("a.store-phone-link").forEach(el=>{ el.href = "tel:"+STORE.phone.replace(/\D/g,""); });
  document.querySelectorAll(".store-addr").forEach(el=>{ el.textContent = STORE.addr; });
  document.querySelectorAll(".store-manager").forEach(el=>{ el.textContent = STORE.manager; });
}

let cart = {};
try{cart = JSON.parse(localStorage.getItem("az_cart")||"{}");}catch(e){cart={};}
// پاک کردن اقلامی که دیگر در لیست محصولات نیستند
Object.keys(cart).forEach(id=>{ const pp=PRODUCTS.find(p=>p.id==id); if(!pp || pp.cat==="fruit") delete cart[id]; });

const fa = n => Number(n||0).toLocaleString("fa-IR") + " تومان";
// اعداد فارسی ورودی را به انگلیسی تبدیل کن (برای قیمت و موبایل)
function faToEn(s){ return String(s||"").replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[^0-9]/g,""); }
function save(){localStorage.setItem("az_cart",JSON.stringify(cart));updateBadge();}
function cartCount(){return Object.values(cart).reduce((a,b)=>a+(Number(b)||0),0);}
function cartTotal(){return Object.entries(cart).reduce((s,[id,q])=>{const p=PRODUCTS.find(x=>x.id==id);return s+(p?p.price*q:0);},0);}
function updateBadge(){document.querySelectorAll(".cart-count").forEach(el=>el.textContent=Number(cartCount()).toLocaleString("fa-IR"));}
function toast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove("show"),2200);}
function addToCart(id){cart[id]=(Number(cart[id])||0)+1;save();renderCart();const p=PRODUCTS.find(x=>x.id==id);if(p)toast("«"+p.name+"» به سبد اضافه شد 🛒");}
function decFromCart(id){if(!cart[id])return;cart[id]--;if(cart[id]<=0)delete cart[id];save();renderCart();refreshQtyButtons();}
function renderCart(){
  const box=document.getElementById("cartItems");if(!box)return;
  const ids=Object.keys(cart);
  if(!ids.length){box.innerHTML='<div class="empty"><div style="font-size:56px">🧺</div><b>سبدت خالیه!</b><br>یه چرخی تو فروشگاه بزن و خوشمزه‌ها رو بردار 😋</div>';}
  else{box.innerHTML=ids.map(id=>{const p=PRODUCTS.find(x=>x.id==id);if(!p)return "";const q=cart[id];
    return `<div class="citem"><div class="e">${p.emoji}</div><div><div class="n">${p.name}</div><div class="p">${p.unit} • ${fa(p.price)}</div></div><div class="q"><button onclick="decFromCart(${p.id})">−</button><b>${Number(q).toLocaleString("fa-IR")}</b><button onclick="addToCart(${p.id});refreshQtyButtons()">+</button></div></div>`;}).join("");}
  const t=document.getElementById("cartTotal");if(t)t.textContent=fa(cartTotal());
  const b=document.getElementById("checkoutBtn");if(b)b.style.display=ids.length?"":"none";
}

// ===== سفارش‌ها و مشتری‌ها (پنل مشتری + مدیر) =====
function getOrders(){ try{ const s=localStorage.getItem("az_orders"); const a=s?JSON.parse(s):[]; return Array.isArray(a)?a:[]; }catch(e){ return []; } }
function persistOrders(a){ try{ localStorage.setItem("az_orders", JSON.stringify(a.slice(0,200))); }catch(e){} }
function addOrder(o){ try{ const a=getOrders(); a.unshift(o); persistOrders(a); }catch(e){} }
function findOrderByCode(code){ code=String(code||"").trim().toUpperCase(); return getOrders().find(o=>String(o.code||"").toUpperCase()===code); }
function ordersByPhone(phone){ phone=String(phone||"").replace(/\D/g,""); return getOrders().filter(o=>String(o.phone||"").replace(/\D/g,"")===phone); }
function setOrderStatus(code,st){ const a=getOrders(); const o=a.find(x=>x.code===code); if(o){ o.status=st; persistOrders(a); } }
function delOrder(code){ persistOrders(getOrders().filter(x=>x.code!==code)); }
function clearOrders(){ persistOrders([]); }
function getCustomers(){ try{ const s=localStorage.getItem("az_customers"); const o=s?JSON.parse(s):{}; return (o&&typeof o==="object")?o:{}; }catch(e){ return {}; } }
function persistCustomers(o){ try{ localStorage.setItem("az_customers",JSON.stringify(o)); }catch(e){} }
function getCustomer(phone){ const cs=getCustomers(); phone=String(phone||"").replace(/\D/g,""); return cs[phone]||null; }
function saveCustomer(c){ try{ const cs=getCustomers(); const ph=String(c.phone||"").replace(/\D/g,""); if(!ph) return; cs[ph]={name:c.name||"",phone:ph,addr:c.addr||""}; persistCustomers(cs); try{localStorage.setItem("az_customer_current",ph);}catch(e){} }catch(e){} }
function currentCustomerPhone(){ try{ return localStorage.getItem("az_customer_current")||""; }catch(e){ return ""; } }
function orderStatusFa(s){ return {new:"ثبت شد 🆕",preparing:"در حال آماده‌سازی 👨‍🍳",sending:"در راه 🛵",done:"تحویل شد ✅",cancelled:"لغو شد ❌"}[s]||"ثبت شد 🆕"; }
function fmtDT(ts){ try{ return new Date(ts).toLocaleString("fa-IR",{dateStyle:"medium",timeStyle:"short"}); }catch(e){ return ""; } }

function refreshQtyButtons(){
  if(typeof renderProducts==="function")try{renderProducts(false);}catch(e){}
  if(typeof renderBill==="function")try{renderBill();}catch(e){}
  if(typeof renderMini==="function")try{renderMini();}catch(e){}
}
function openCart(){renderCart();document.getElementById("drawer").classList.add("open");document.getElementById("overlay").classList.add("show");}
function closeCart(){const d=document.getElementById("drawer");if(d)d.classList.remove("open");const o=document.getElementById("overlay");if(o)o.classList.remove("show");}
function goCheckout(){if(!cartCount()){toast("سبدت خالیه عزیزم! 🧺");return;}location.href="shop.html";}
document.addEventListener("DOMContentLoaded",()=>{updateBadge();renderCart();applyStore();});
