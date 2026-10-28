const DEFAULT_PRODUCTS = [
{id:1,name:"کنسرو لوبیا چیتی بهروز",unit:"هر عدد",price:160000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:2,name:"کنسرو لوبیا چیتی گلنوش",unit:"هر عدد",price:162000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:3,name:"کنسرو مایه ماکارونی بهروز",unit:"هر عدد",price:190000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:4,name:"کنسرو نخود سبز بهروز",unit:"هر عدد",price:200000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:5,name:"کنسرو ذرت بهروز",unit:"هر عدد",price:215000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:6,name:"کنسرو لوبیا چیتی با قارچ یک و یک",unit:"هر عدد",price:209000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:7,name:"رب شیشه سمیه ۲۸۵ گرم",unit:"هر عدد",price:384000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:8,name:"کنسرو خوراک بادمجان گلنوش",unit:"هر عدد",price:183000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:9,name:"کنسرو عدسی بهروز",unit:"هر عدد",price:180000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:10,name:"کنسرو نخود آبگوشتی بهروز",unit:"هر عدد",price:152000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:11,name:"کنسرو خوراک بادمجان بهروز",unit:"هر عدد",price:130000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:12,name:"رب گوجه مکنزی ۸۰۰ گرم",unit:"هر عدد",price:280000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:13,name:"رب گوجه گلنوش ۸۰۰ گرم",unit:"هر عدد",price:335800,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:14,name:"رب گوجه شیلتون۲۳۰ گرم",unit:"هر عدد",price:45000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:15,name:"رب گوجه آیدین ۴۰۰ گرم",unit:"هر عدد",price:126000,cat:"canned",emoji:"🥫",bg:"#FFEED6"},
{id:16,name:"رب گوجه گلنوش ۴۰۰ گرم",unit:"هر عدد",price:185000,cat:"canned",emoji:"🥫",bg:"#FFEED6"}
];
const CATS = {dairy:"لبنیات",canned:"کنسرویجات",jam:"مرباها",wash:"شوینده",hygiene:"بهداشتی",misc:"خرده ریز",beans:"حبوبات",pasta:"ماکارونی ها",drink:"نوشیدنی",tea:"چای",sauce:"سس ها",protein:"سوسیس و کالباس",snack:"تنقلات"};
const CAT_BG = {dairy:"#E8F9EF",canned:"#FFEED6",jam:"#FFF3D6",wash:"#E7F5FE",hygiene:"#F1EAFE",misc:"#FFF3D6",beans:"#E8F9EF",pasta:"#F1EAFE",drink:"#E7F5FE",tea:"#FFEED6",sauce:"#FFE3E3",protein:"#FFEED6",snack:"#FFF3D6",bread:"#FFF3D6",grocery:"#E8F9EF"};

function migrateOldCat(p){
  if(!p) return p;
  const nm=(p.name||"")+" "+(p.unit||"");
  if(p.cat==="bread"){ p.cat="misc"; }
  else if(p.cat==="grocery"){
    if(/ماکارونی|رشته|اسپاگتی|لازانیا/.test(nm)) p.cat="pasta";
    else if(/برنج|لوبیا|عدس|نخود|لپه|حبوبات/.test(nm)) p.cat="beans";
    else p.cat="misc";
  }
  else if(p.cat==="hygiene"){
    // قدیمی‌ها اکثرا شوینده بودن، بهداشتی‌ها رو جدا کن
    if(/بهداشتی|مسواک|شامپو|صابون|پوشک|خمیر دندان|دستمال کاغذی/.test(nm)) p.cat="hygiene";
    else p.cat="wash";
  }
  return p;
}
function loadProducts(){
  try{
    const s = localStorage.getItem("az_products");
    if(s){
      const arr = JSON.parse(s);
      if(Array.isArray(arr) && arr.length){
        let cleaned = arr.filter(p=>p && p.cat!=="fruit");
        let changed=false;
        cleaned=cleaned.map(p=>{
          const before=p.cat;
          migrateOldCat(p);
          if(p.cat!==before) changed=true;
          // رنگ پس‌زمینه رو هم با دسته جدید هماهنگ کن
          try{ if(CAT_BG[p.cat]) p.bg=CAT_BG[p.cat]; }catch(e){}
          return p;
        });
        if(cleaned.length!==arr.length) changed=true;
        if(changed){ try{localStorage.setItem("az_products",JSON.stringify(cleaned));}catch(e){} }
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
  const def = {phone:"09108659424", phoneFa:"۰۹۱۰۸۶۵۹۴۲۴", manager:"آقای نویدی", addr:"شهرستان چهارباغ، روستای عرب‌آباد، خیابان شهید صمدی، کوچه نور", eitaa:"Azarbayjanshap"};
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
