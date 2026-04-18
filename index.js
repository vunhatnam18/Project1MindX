// ============================================================
// DATA
// ============================================================

// danh sách sản phẩm
let allProducts = [
  {id:1,name:'Samsung Galaxy A55 5G 128GB',icon:'📱',price:8990000,ori:12990000,disc:30,sold:1200,soldPct:78,variant:'Màu: Xanh / 128GB',cat:'Điện thoại & Máy tính',stock:45,desc:'Điện thoại Samsung chính hãng.',status:'active',sellerOwned:false},
  {id:2,name:'Tai nghe Sony WH-1000XM5',icon:'🎧',price:5490000,ori:9990000,disc:45,sold:856,soldPct:92,variant:'Màu: Đen',cat:'Điện thoại & Máy tính',stock:23,desc:'Tai nghe chống ồn cao cấp.',status:'active',sellerOwned:false},
  {id:3,name:'Laptop ASUS VivoBook 15 i5',icon:'💻',price:12490000,ori:16590000,disc:25,sold:432,soldPct:55,variant:'RAM: 8GB / SSD: 512GB',cat:'Điện thoại & Máy tính',stock:12,desc:'Laptop mỏng nhẹ hiệu suất cao.',status:'active',sellerOwned:false},
  {id:4,name:'Apple Watch Series 9 GPS 41mm',icon:'⌚',price:9290000,ori:11590000,disc:20,sold:2100,soldPct:88,variant:'Dây: Đen',cat:'Đồng hồ',stock:8,desc:'Đồng hồ thông minh Apple chính hãng.',status:'active',sellerOwned:false},
  {id:5,name:'Máy ảnh Canon EOS M50 Mark II',icon:'📷',price:14990000,ori:22990000,disc:35,sold:318,soldPct:42,variant:'Kit 15-45mm',cat:'Điện thoại & Máy tính',stock:5,desc:'Máy ảnh mirrorless cho người mới.',status:'active',sellerOwned:false},
  {id:6,name:'Giày Nike Air Max 270',icon:'👟',price:2450000,ori:3200000,disc:23,sold:540,soldPct:65,variant:'Size: 42',cat:'Thể thao',stock:30,desc:'Giày thể thao Nike chính hãng.',status:'active',sellerOwned:false},
  {id:7,name:'Balo Laptop chống thấm nước',icon:'🎒',price:389000,ori:650000,disc:40,sold:1800,soldPct:80,variant:'Màu: Xám',cat:'Phụ kiện & Túi xách',stock:60,desc:'Balo chống nước đa ngăn tiện lợi.',status:'active',sellerOwned:false},
  {id:8,name:'Nồi chiên không dầu Xiaomi 5L',icon:'🍳',price:1290000,ori:2190000,disc:41,sold:920,soldPct:72,variant:'Dung tích: 5L',cat:'Nhà cửa & Đời sống',stock:25,desc:'Nồi chiên không dầu Xiaomi tiết kiệm điện.',status:'active',sellerOwned:false},
  {id:9,name:'Vitamin C 1000mg Blackmores',icon:'💊',price:285000,ori:420000,disc:32,sold:3200,soldPct:95,variant:'Hộp 60 viên',cat:'Sức khỏe & Làm đẹp',stock:200,desc:'Vitamin C tăng sức đề kháng.',status:'active',sellerOwned:false},
  {id:10,name:'Bàn chải điện Oral-B Pro 2000',icon:'🪥',price:590000,ori:890000,disc:34,sold:760,soldPct:60,variant:'Màu: Trắng',cat:'Sức khỏe & Làm đẹp',stock:40,desc:'Bàn chải điện làm sạch chuyên sâu.',status:'active',sellerOwned:false},
];

// danh sách lịch sử mua hàng
const ORDERS_DATA=[
  {id:'LAZ2024031501',date:'15/03/2024',status:'delivered',label:'Đã Giao',items:[{name:'Samsung Galaxy A55',icon:'📱',qty:1,price:8990000,variant:'Màu: Xanh'},{name:'Tai nghe Sony',icon:'🎧',qty:1,price:5490000,variant:'Màu: Đen'}],total:14480000},
  {id:'LAZ2024032201',date:'22/03/2024',status:'shipping',label:'Đang Giao',items:[{name:'Laptop ASUS VivoBook',icon:'💻',qty:1,price:12490000,variant:'RAM: 8GB'}],total:12490000},
  {id:'LAZ2024040501',date:'05/04/2024',status:'processing',label:'Đang Xử Lý',items:[{name:'Nồi chiên Xiaomi',icon:'🍳',qty:2,price:1290000,variant:'5L'},{name:'Vitamin C',icon:'💊',qty:3,price:285000,variant:'60 viên'}],total:3435000},
  {id:'LAZ2024020801',date:'08/02/2024',status:'cancelled',label:'Đã Hủy',items:[{name:'Giày Nike Air Max',icon:'👟',qty:1,price:2450000,variant:'Size 42'}],total:2450000},
];

const EMOJIS=['📱','💻','🎧','📷','⌚','🖨️','🖥️','⌨️','🖱️','🎮','📺','📡','👗','👔','👟','👠','👜','🎒','🧣','🧢','🏠','🛋️','🪑','🛏️','🍳','🫖','🧹','🪣','💊','🧴','💄','🪥','🏋️','⚽','🏸','🚴','🎯','🎸','📚','✏️','🧸','🎁','🌿','🍎','🧃','🚗','🏍️','🛵','✈️'];

// ============================================================
// STATE
// ============================================================
let currentUser = null; // {name, email, role: 'buyer'|'seller', shopName?}
let cart = [];
let currentPage = 'home';
let nextProductId = 100;
let editingProductId = null;
let sellerTab = 'dashboard';

// ============================================================
// UTILS
// ============================================================
const fmt = (n) => n.toLocaleString('vi-VN') + '₫'; // đưa số tiền hiển thị về kiểu vn
//--tính phần trăm giảm giá--
const calcDisc = (price,ori) => ori>price ? Math.round((1-price/ori)*100) : 0;

// ============================================================
// MODAL
// ============================================================
function openModal(id){ document.getElementById(id).classList.add('show'); document.body.style.overflow='hidden'; }
function closeModal(id){ document.getElementById(id).classList.remove('show'); document.body.style.overflow=''; }
function switchModal(a,b){ closeModal(a); setTimeout(()=>openModal(b),130); }

// ============================================================
// AUTH - BUYER
// ============================================================
function doLogin(){
  const email=document.getElementById('lgEmail').value.trim();
  const pass=document.getElementById('lgPass').value.trim();
  if(!email||!pass){ 
    document.getElementById('loginErr').classList.add('show'); 
    return; 
  }
  document.getElementById('loginErr').classList.remove('show');
  loginSuccess({name:email,email,role:'buyer'});
  closeModal('loginOverlay');
  showToast('success','✓ Xin chào ' + currentUser.name + '!');
}

function doBuyerRegister(){
  const first=document.getElementById('rgFirst').value.trim(), last=document.getElementById('rgLast').value.trim();
  const email=document.getElementById('rgEmail').value.trim(), pass=document.getElementById('rgPass').value.trim();
  if(!first||!last||!email||!pass){ document.getElementById('regErr').classList.add('show'); return; }
  document.getElementById('regErr').classList.remove('show');
  document.getElementById('regOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name:first+' '+last, email, role:'buyer'});
    closeModal('registerOverlay');
    showToast('success','🎉 Đăng ký thành công! Xin chào '+first);
  },1100);
}

// ============================================================
// AUTH - SELLER
// ============================================================
function doSellerLogin(){
  const email=document.getElementById('slEmail').value.trim();
  const pass=document.getElementById('slPass').value.trim();
  if(!email||!pass){ document.getElementById('sellerLoginErr').classList.add('show'); return; }
  document.getElementById('sellerLoginErr').classList.remove('show');
  const shopName=email.split('@')[0]+' Shop';
  loginSuccess({name:email.split('@')[0], email, role:'seller', shopName});
  closeModal('sellerLoginOverlay');
  showToast('success','🏪 Chào mừng trở lại '+shopName+'!');
  showPage('seller');
}

function doSellerRegister(){
  const shop=document.getElementById('srShop').value.trim();
  const name=document.getElementById('srName').value.trim();
  const email=document.getElementById('srEmail').value.trim();
  const pass=document.getElementById('srPass').value.trim();
  const pass2=document.getElementById('srPass2').value.trim();
  const biz=document.getElementById('srBizType').value;
  const cat=document.getElementById('srCategory').value;
  if(!shop||!name||!email||!pass||!biz||!cat){ document.getElementById('sellerRegErr').classList.add('show'); return; }
  if(pass!==pass2){ document.getElementById('sellerRegErr').textContent='Mật khẩu xác nhận không khớp.'; document.getElementById('sellerRegErr').classList.add('show'); return; }
  document.getElementById('sellerRegErr').classList.remove('show');
  document.getElementById('sellerRegOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name, email, role:'seller', shopName:shop});
    closeModal('sellerRegOverlay');
    showToast('success','🎉 Đăng ký gian hàng thành công! Chào mừng '+shop);
    showPage('seller');
  },1200);
}

function loginSuccess(user){
  currentUser=user;
  updateAuthUI();
}

function doLogout(){
  currentUser=null; cart=[];
  updateAuthUI(); updateCartBadge();
  document.querySelectorAll('.user-dropdown').forEach(d=>d.classList.remove('show'));
  showToast('','👋 Đã đăng xuất');
  showPage('home');
}

function updateAuthUI(){
  const topBar=document.getElementById('topBarAuth');
  const navArea=document.getElementById('navAuthArea');
  if(currentUser){
    const initials=currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const isSeller=currentUser.role==='seller';
    topBar.innerHTML=`<span style="color:rgba(255,255,255,0.9)">Xin chào, <strong>${currentUser.name.split(' ')[0]}</strong>${isSeller?` <span style="background:#00b14f;color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px">NGƯỜI BÁN</span>`:''}</span>`;
    navArea.innerHTML=`<div class="user-wrap">
      <div class="user-avatar ${isSeller?'seller-av':''}" onclick="toggleDropdown()">${initials}</div>
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-header">
          <div class="ud-name">${currentUser.name}</div>
          <div class="ud-email">${currentUser.email}</div>
          <span class="ud-role ${isSeller?'role-seller':'role-buyer'}">${isSeller?'🏪 Người bán':'🛒 Người mua'}</span>
          ${isSeller&&currentUser.shopName?`<div style="font-size:11px;color:#00863c;margin-top:2px">${currentUser.shopName}</div>`:''}
        </div>
        ${isSeller?`<a class="seller-menu-item" onclick="showPage('seller');closeDropdown()">🏪 Quản lý gian hàng</a>`:''}
        <a onclick="showPage('orders');closeDropdown()">📦 Đơn hàng của tôi</a>
        <a onclick="closeDropdown()">👤 Tài khoản</a>
        <a onclick="closeDropdown()">❤️ Yêu thích</a>
        <a class="logout-item" onclick="doLogout()">🚪 Đăng xuất</a>
      </div>
    </div>`;
  } else {
    topBar.innerHTML=`<a onclick="openModal('loginOverlay')">Đăng Nhập</a><a onclick="openModal('registerOverlay')">Đăng Ký</a>`;
    navArea.innerHTML='';
  }
}

function toggleDropdown(){ const dd=document.getElementById('userDropdown'); if(dd)dd.classList.toggle('show'); }
function closeDropdown(){ document.querySelectorAll('.user-dropdown').forEach(d=>d.classList.remove('show')); }
document.addEventListener('click',e=>{ if(!e.target.closest('.user-wrap'))closeDropdown(); });

// ============================================================
// PAGES
// ============================================================
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  currentPage=name; window.scrollTo(0,0);
  if(name==='cart') renderCart();
  if(name==='orders') renderOrders();
  if(name==='seller') renderSeller();
}

// ============================================================
// PRODUCTS (HOME)
// ============================================================
function makeProductCard(p, showSold=true){
  const sellerOwned=p.sellerOwned;
  return `<div class="lz-prod-card">
    <div class="lz-prod-img">
      ${sellerOwned?`<span class="seller-badge">Người bán</span>`:''}
      ${p.icon}
    </div>
    <div class="lz-prod-info">
      <div class="lz-prod-name">${p.name}</div>
      <div style="display:flex;align-items:center;gap:4px">
        <span class="lz-prod-price">${fmt(p.price)}</span>
        ${p.disc>0?`<span class="lz-prod-disc">-${p.disc}%</span>`:''}
      </div>
      ${p.ori>p.price?`<div class="lz-prod-ori">${fmt(p.ori)}</div>`:''}
      ${showSold?`<div class="lz-prod-sold">Đã bán ${p.sold>=1000?(p.sold/1000).toFixed(1)+'k':p.sold}</div>
      <div class="lz-sold-bar"><div class="lz-sold-fill" style="width:${p.soldPct}%"></div></div>`:''}
    </div>
    <button class="add-cart-btn" id="cart-btn-${p.id}" onclick="addToCart(${p.id})">+ Thêm vào giỏ</button>
  </div>`;
}

function initProducts(){
  const activeProds=allProducts.filter(p=>p.status==='active');
  document.getElementById('flashProducts').innerHTML=activeProds.slice(0,5).map(p=>makeProductCard(p,true)).join('');
  document.getElementById('recProducts').innerHTML=activeProds.slice(5,10).map(p=>makeProductCard(p,false)).join('');
}

function refreshHomeProducts(){
  const activeProds=allProducts.filter(p=>p.status==='active');
  const fp=document.getElementById('flashProducts');
  const rp=document.getElementById('recProducts');
  if(fp) fp.innerHTML=activeProds.slice(0,5).map(p=>makeProductCard(p,true)).join('');
  if(rp) rp.innerHTML=activeProds.slice(5,10).map(p=>makeProductCard(p,false)).join('');
}

// ============================================================
// CART
// ============================================================
function addToCart(pid){
  const prod=allProducts.find(p=>p.id===pid); if(!prod)return;
  const ex=cart.find(c=>c.product.id===pid);
  if(ex) ex.qty++; else cart.push({product:prod,qty:1,checked:true});
  updateCartBadge();
  showToast('success','✓ Đã thêm vào giỏ: '+prod.name.slice(0,28)+'...');
  const btn=document.getElementById('cart-btn-'+pid);
  if(btn){btn.textContent='✓ Đã thêm';btn.classList.add('added');setTimeout(()=>{btn.textContent='+ Thêm vào giỏ';btn.classList.remove('added');},2000);}
  if(currentPage==='cart')renderCart();
}

function updateCartBadge(){
  const total=cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cartBadge').textContent=total;
  const lbl=document.getElementById('cartCountLabel');
  if(lbl)lbl.textContent=total>0?`(${total} sản phẩm)`:'';
}

function removeFromCart(pid){ cart=cart.filter(c=>c.product.id!==pid); updateCartBadge(); renderCart(); }
function changeQty(pid,d){ const i=cart.find(c=>c.product.id===pid); if(!i)return; i.qty+=d; if(i.qty<=0){removeFromCart(pid);return;} renderCart(); }
function toggleCheck(pid){ const i=cart.find(c=>c.product.id===pid); if(i)i.checked=!i.checked; renderCart(); }
function toggleAll(v){ cart.forEach(c=>c.checked=v); renderCart(); }

function renderCart(){
  const box=document.getElementById('cartContent');
  const lbl=document.getElementById('cartCountLabel');
  if(lbl)lbl.textContent=cart.length>0?`(${cart.reduce((s,c)=>s+c.qty,0)} sản phẩm)`:'';
  if(cart.length===0){
    box.innerHTML=`<div style="max-width:1200px;margin:0 auto;padding:8px"><div class="cart-empty-box"><div class="ei">🛒</div><p>Giỏ hàng của bạn đang trống</p><button onclick="showPage('home')">Tiếp tục mua sắm</button></div></div>`;
    return;
  }
  const checked=cart.filter(c=>c.checked);
  const subtotal=checked.reduce((s,c)=>s+c.product.price*c.qty,0);
  const ship=checked.length>0?30000:0, disc=checked.length>0?15000:0;
  const total=subtotal+ship-disc;
  const allCh=cart.every(c=>c.checked);
  box.innerHTML=`<div class="cart-wrap">
    <div>
      <div class="cart-items-box">
        <div class="select-all-row">
          <input type="checkbox" class="cart-cb" id="selAll" ${allCh?'checked':''} onchange="toggleAll(this.checked)">
          <label for="selAll">Chọn tất cả (${cart.length} sp)</label>
          ${checked.length>0?`<span style="margin-left:auto;font-size:12px;color:#f05b5a;cursor:pointer" onclick="cart=cart.filter(c=>!c.checked);updateCartBadge();renderCart()">Xóa đã chọn</span>`:''}
        </div>
        <div class="cart-shop-hdr">🏪 Lazada Official Store</div>
        ${cart.map(c=>`<div class="cart-item">
          <input type="checkbox" class="item-cb" ${c.checked?'checked':''} onchange="toggleCheck(${c.product.id})">
          <div class="cart-img">${c.product.icon}</div>
          <div class="cart-info">
            <div class="ci-name">${c.product.name}</div>
            <div class="ci-var">${c.product.variant}</div>
            <div><span class="ci-price">${fmt(c.product.price)}</span>${c.product.ori>c.product.price?`<span class="ci-ori">${fmt(c.product.ori)}</span>`:''}</div>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${c.product.id},-1)">−</button>
            <input class="qty-val" type="text" value="${c.qty}" readonly>
            <button class="qty-btn" onclick="changeQty(${c.product.id},1)">+</button>
          </div>
          <div class="ci-total">${fmt(c.product.price*c.qty)}</div>
          <button class="rm-btn" onclick="removeFromCart(${c.product.id})">🗑</button>
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="cart-summary-box">
        <h3>Tóm Tắt Đơn Hàng</h3>
        <div class="voucher-row"><input type="text" placeholder="Mã giảm giá / Voucher"><button>Áp dụng</button></div>
        <div class="sum-row"><span>Tạm tính (${checked.reduce((s,c)=>s+c.qty,0)} sp)</span><span>${fmt(subtotal)}</span></div>
        <div class="sum-row"><span>Phí vận chuyển</span><span>${ship>0?fmt(ship):'--'}</span></div>
        <div class="sum-row" style="color:#27ae60"><span>Giảm giá</span><span>-${disc>0?fmt(disc):'0₫'}</span></div>
        <div class="sum-row total"><span>Tổng cộng</span><span>${fmt(total)}</span></div>
        <button class="checkout-btn" onclick="doCheckout()">Đặt Hàng (${checked.length} sp)</button>
        <p style="font-size:11px;color:#aaa;text-align:center;margin-top:9px">Miễn phí đổi trả trong 30 ngày</p>
      </div>
    </div>
  </div>`;
}

function doCheckout(){
  if(!cart.filter(c=>c.checked).length){showToast('error','⚠ Chọn sản phẩm để đặt hàng');return;}
  if(!currentUser){openModal('loginOverlay');return;}
  cart=cart.filter(c=>!c.checked); updateCartBadge();
  showToast('success','🎉 Đặt hàng thành công! Cảm ơn bạn.');
  setTimeout(renderCart,200);
}

// ============================================================
// ORDERS
// ============================================================
function renderOrders(){
  const box=document.getElementById('ordersContent');
  if(!currentUser){
    box.innerHTML=`<div class="need-login"><div class="nl-icon">🔐</div><h3>Vui lòng đăng nhập</h3><p>Bạn cần đăng nhập để xem lịch sử đơn hàng</p><button onclick="openModal('loginOverlay')">Đăng Nhập Ngay</button></div>`;
    return;
  }
  const tabs=['Tất cả','Chờ xử lý','Đang giao','Đã giao','Đã hủy'];
  const statusMap={delivered:'s-delivered',shipping:'s-shipping',processing:'s-processing',cancelled:'s-cancelled'};
  box.innerHTML=`<div class="orders-wrap">
    <div class="orders-tab-bar">${tabs.map((t,i)=>`<button class="${i===0?'active':''}" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${t}</button>`).join('')}</div>
    ${ORDERS_DATA.map(o=>`<div class="order-card">
      <div class="order-hdr"><div class="order-id">Mã đơn: <strong>#${o.id}</strong> · ${o.date}</div><span class="order-status ${statusMap[o.status]}">${o.label}</span></div>
      ${o.items.map(it=>`<div class="order-item-row"><div class="order-img">${it.icon}</div><div class="order-item-detail"><div class="order-item-name">${it.name}</div><div class="order-item-meta">x${it.qty} · ${it.variant}</div></div><div class="order-item-price">${fmt(it.price*it.qty)}</div></div>`).join('')}
      <div class="order-footer">
        <div class="order-total">Tổng: <strong>${fmt(o.total)}</strong></div>
        <div class="order-actions">
          ${o.status==='delivered'?`<button class="btn-outline" onclick="showToast('success','✓ Đã gửi yêu cầu đánh giá')">Đánh Giá</button>`:''}
          <button class="btn-outline">Chi Tiết</button>
          <button class="btn-reorder" onclick="showToast('info','🛒 Đang thêm lại vào giỏ...')">Mua Lại</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

// ============================================================
// SELLER DASHBOARD
// ============================================================
function getMyProducts(){ return allProducts.filter(p=>p.sellerOwned); }

function renderSeller(){
  const box=document.getElementById('sellerContent');
  if(!currentUser||currentUser.role!=='seller'){
    box.innerHTML=`<div class="need-seller">
      <div class="ns-icon">🏪</div>
      <h3>Kênh Người Bán Lazada</h3>
      <p>Đăng nhập tài khoản người bán để quản lý gian hàng, thêm sản phẩm và theo dõi doanh thu của bạn.</p>
      <div class="ns-btns">
        <button class="ns-btn-login" onclick="openModal('sellerLoginOverlay')">Đăng Nhập Người Bán</button>
        <button class="ns-btn-reg" onclick="openModal('sellerRegOverlay')">Đăng Ký Ngay</button>
      </div>
    </div>`;
    return;
  }
  const myProds=getMyProducts();
  const totalRevenue=myProds.reduce((s,p)=>s+p.price*(p.sold||0),0);
  const activeCount=myProds.filter(p=>p.status==='active').length;
  const totalStock=myProds.reduce((s,p)=>s+(p.stock||0),0);

  box.innerHTML=`<div class="seller-layout">
    <div class="seller-sidebar">
      <div class="seller-sidebar-brand"><h3>🏪 ${currentUser.shopName||'My Shop'}</h3><p>${currentUser.email}</p></div>
      <nav class="seller-nav">
        <a class="${sellerTab==='dashboard'?'active':''}" onclick="switchSellerTab('dashboard')"><span class="nav-icon">📊</span>Tổng quan</a>
        <a class="${sellerTab==='products'?'active':''}" onclick="switchSellerTab('products')"><span class="nav-icon">📦</span>Quản lý sản phẩm</a>
        <a onclick="switchSellerTab('orders-s')"><span class="nav-icon">🛒</span>Đơn hàng</a>
        <a onclick="switchSellerTab('analytics')"><span class="nav-icon">📈</span>Doanh thu</a>
        <a onclick="switchSellerTab('settings')"><span class="nav-icon">⚙️</span>Cài đặt gian hàng</a>
        <a onclick="showPage('home')" style="margin-top:auto;border-top:1px solid rgba(255,255,255,0.1)"><span class="nav-icon">🏠</span>Về trang chủ</a>
        <a class="logout-item" onclick="doLogout()"><span class="nav-icon">🚪</span>Đăng xuất</a>
      </nav>
    </div>
    <div class="seller-main" id="sellerMainContent">
      ${renderSellerTab()}
    </div>
  </div>`;
}

function switchSellerTab(tab){
  sellerTab=tab;
  const main=document.getElementById('sellerMainContent');
  if(main) main.innerHTML=renderSellerTab();
  // update sidebar active
  document.querySelectorAll('.seller-nav a').forEach((a,i)=>{
    a.classList.remove('active');
    const tabs=['dashboard','products','orders-s','analytics','settings'];
    if(tabs[i]===tab) a.classList.add('active');
  });
}

function renderSellerTab(){
  if(sellerTab==='dashboard') return renderDashboard();
  if(sellerTab==='products') return renderProductManager();
  if(sellerTab==='orders-s') return renderSellerOrders();
  if(sellerTab==='analytics') return renderAnalytics();
  if(sellerTab==='settings') return renderSellerSettings();
  return renderDashboard();
}

function renderDashboard(){
  const myProds=getMyProducts();
  const totalRevenue=myProds.reduce((s,p)=>s+p.price*(p.sold||0),0);
  const activeCount=myProds.filter(p=>p.status==='active').length;
  const totalStock=myProds.reduce((s,p)=>s+(p.stock||0),0);
  return `<div class="seller-topbar"><h2>📊 Tổng Quan Gian Hàng</h2><button class="btn-add-product" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>
  <div class="seller-stats">
    <div class="stat-card green"><div class="sc-label">Doanh thu ước tính</div><div class="sc-val">${totalRevenue>0?fmt(totalRevenue):'--'}</div><div class="sc-sub">↑ Cập nhật theo sản phẩm</div></div>
    <div class="stat-card orange"><div class="sc-label">Tổng sản phẩm</div><div class="sc-val">${myProds.length}</div><div class="sc-sub">${activeCount} đang bán · ${myProds.length-activeCount} tạm ngưng</div></div>
    <div class="stat-card blue"><div class="sc-label">Tổng tồn kho</div><div class="sc-val">${totalStock}</div><div class="sc-sub">${myProds.filter(p=>p.stock<=5).length} sản phẩm sắp hết</div></div>
    <div class="stat-card red"><div class="sc-label">Đơn hàng chờ</div><div class="sc-val">0</div><div class="sc-sub">Không có đơn mới</div></div>
  </div>
  <div class="seller-section">
    <div class="seller-section-hdr"><h3>Sản phẩm gần đây</h3><button class="btn-add-product" style="font-size:12px;padding:7px 14px" onclick="switchSellerTab('products')">Xem tất cả →</button></div>
    ${myProds.length===0
      ? `<div class="empty-table"><div class="ei">📦</div><p>Bạn chưa có sản phẩm nào.<br>Bắt đầu thêm sản phẩm đầu tiên!</p><button class="btn-add-product" style="margin:10px auto" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>`
      : `<table class="prod-table"><thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Tồn kho</th><th>Trạng thái</th></tr></thead><tbody>
      ${myProds.slice(0,5).map(p=>`<tr>
        <td><div class="prod-name-cell"><div class="prod-thumb">${p.icon}</div><div><div class="pn-name">${p.name}</div><div class="pn-cat">${p.cat}</div></div></div></td>
        <td><div class="tbl-price">${fmt(p.price)}</div>${p.disc>0?`<div class="tbl-discount">-${p.disc}%</div>`:''}</td>
        <td><span class="stock-badge ${p.stock>10?'stock-ok':p.stock>0?'stock-low':'stock-out'}">${p.stock} cái</span></td>
        <td><span class="${p.status==='active'?'status-active':'status-inactive'}"></span>${p.status==='active'?'Đang bán':'Tạm ngưng'}</td>
      </tr>`).join('')}
      </tbody></table>`
    }
  </div>`;
}

function renderProductManager(){
  const myProds=getMyProducts();
  return `<div class="seller-topbar">
    <h2>📦 Quản Lý Sản Phẩm</h2>
    <button class="btn-add-product" onclick="openProductForm(null)">➕ Thêm Sản Phẩm Mới</button>
  </div>
  <div class="seller-section">
    <div class="seller-section-hdr">
      <h3>Danh sách sản phẩm (${myProds.length})</h3>
      <div class="seller-search-bar">
        <input type="text" placeholder="Tìm tên sản phẩm..." oninput="filterSellerProducts(this.value)">
        <select onchange="filterSellerProducts('',this.value)"><option value="">Tất cả trạng thái</option><option value="active">Đang bán</option><option value="inactive">Tạm ngưng</option></select>
      </div>
    </div>
    <div id="sellerProductTable">
      ${renderProductTable(myProds)}
    </div>
  </div>`;
}

function renderProductTable(prods){
  if(prods.length===0) return `<div class="empty-table"><div class="ei">📦</div><p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p><button class="btn-add-product" style="margin:10px auto" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>`;
  return `<table class="prod-table">
    <thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Giá gốc</th><th>Giảm giá</th><th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${prods.map(p=>`<tr id="prod-row-${p.id}">
      <td><div class="prod-name-cell"><div class="prod-thumb">${p.icon}</div><div><div class="pn-name">${p.name}</div><div class="pn-cat">${p.cat} · ${p.variant}</div></div></div></td>
      <td><div class="tbl-price">${fmt(p.price)}</div></td>
      <td><div style="color:#aaa;font-size:12px">${p.ori>p.price?fmt(p.ori):'--'}</div></td>
      <td><span class="tbl-discount">${p.disc>0?'-'+p.disc+'%':'--'}</span></td>
      <td><span class="stock-badge ${p.stock>10?'stock-ok':p.stock>0?'stock-low':'stock-out'}">${p.stock} cái</span></td>
      <td><span class="${p.status==='active'?'status-active':'status-inactive'}"></span>${p.status==='active'?'Đang bán':'Tạm ngưng'}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openProductForm(${p.id})">✏️ Sửa</button>
        <button class="btn-toggle-active" onclick="toggleProductStatus(${p.id})">${p.status==='active'?'⏸ Tạm ngưng':'▶ Kích hoạt'}</button>
        <button class="btn-del" onclick="confirmDelete(${p.id})">🗑 Xóa</button>
      </div></td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function filterSellerProducts(name='', status=''){
  let prods=getMyProducts();
  if(name) prods=prods.filter(p=>p.name.toLowerCase().includes(name.toLowerCase()));
  if(status) prods=prods.filter(p=>p.status===status);
  const tbl=document.getElementById('sellerProductTable');
  if(tbl) tbl.innerHTML=renderProductTable(prods);
}

function toggleProductStatus(pid){
  const p=allProducts.find(p=>p.id===pid); if(!p)return;
  p.status=p.status==='active'?'inactive':'active';
  showToast('success',`${p.status==='active'?'✅ Đã kích hoạt':'⏸ Đã tạm ngưng'}: ${p.name.slice(0,25)}...`);
  switchSellerTab('products');
  refreshHomeProducts();
}

// ============================================================
// PRODUCT FORM (ADD/EDIT)
// ============================================================
function openProductForm(pid){
  editingProductId=pid;
  // Build emoji grid
  const grid=document.getElementById('emojiGrid');
  grid.innerHTML=EMOJIS.map(e=>`<div class="emoji-opt ${e==='📦'?'selected':''}" onclick="selectEmoji('${e}')">${e}</div>`).join('');

  if(pid){
    const p=allProducts.find(x=>x.id===pid);
    document.getElementById('pfTitle').textContent='✏️ Chỉnh Sửa Sản Phẩm';
    document.getElementById('pfSubtitle').textContent='Cập nhật thông tin sản phẩm';
    document.getElementById('pfIcon').value=p.icon;
    document.getElementById('pfIconPreview').textContent=p.icon;
    document.getElementById('pfName').value=p.name;
    document.getElementById('pfCat').value=p.cat;
    document.getElementById('pfVariant').value=p.variant;
    document.getElementById('pfPrice').value=p.price;
    document.getElementById('pfOri').value=p.ori||'';
    document.getElementById('pfStock').value=p.stock||0;
    document.getElementById('pfDesc').value=p.desc||'';
    document.getElementById('pfStatus').value=p.status||'active';
    // highlight selected emoji
    grid.querySelectorAll('.emoji-opt').forEach(el=>{ el.classList.toggle('selected',el.textContent===p.icon); });
  } else {
    document.getElementById('pfTitle').textContent='➕ Thêm Sản Phẩm Mới';
    document.getElementById('pfSubtitle').textContent='Điền thông tin sản phẩm của bạn';
    document.getElementById('pfIcon').value='📦';
    document.getElementById('pfIconPreview').textContent='📦';
    document.getElementById('pfName').value='';
    document.getElementById('pfCat').value='';
    document.getElementById('pfVariant').value='';
    document.getElementById('pfPrice').value='';
    document.getElementById('pfOri').value='';
    document.getElementById('pfStock').value='100';
    document.getElementById('pfDesc').value='';
    document.getElementById('pfStatus').value='active';
  }
  openModal('productFormOverlay');
}

function selectEmoji(e){
  document.getElementById('pfIcon').value=e;
  document.getElementById('pfIconPreview').textContent=e;
  document.querySelectorAll('.emoji-opt').forEach(el=>el.classList.toggle('selected',el.textContent===e));
}

function saveProduct(){
  const name=document.getElementById('pfName').value.trim();
  const cat=document.getElementById('pfCat').value;
  const price=parseInt(document.getElementById('pfPrice').value)||0;
  if(!name||!cat||!price){ showToast('error','⚠ Vui lòng điền đủ tên, danh mục và giá bán'); return; }
  const icon=document.getElementById('pfIcon').value;
  const variant=document.getElementById('pfVariant').value.trim()||'Mặc định';
  const ori=parseInt(document.getElementById('pfOri').value)||price;
  const stock=parseInt(document.getElementById('pfStock').value)||0;
  const desc=document.getElementById('pfDesc').value.trim();
  const status=document.getElementById('pfStatus').value;
  const disc=calcDisc(price,ori);

  if(editingProductId){
    const idx=allProducts.findIndex(p=>p.id===editingProductId);
    if(idx>=0){
      allProducts[idx]={...allProducts[idx],name,cat,icon,variant,price,ori,stock,desc,status,disc};
      showToast('success','✅ Đã cập nhật: '+name.slice(0,28));
    }
  } else {
    const newProd={id:nextProductId++,name,cat,icon,variant,price,ori,disc,stock,desc,status,sold:0,soldPct:0,sellerOwned:true};
    allProducts.push(newProd);
    showToast('success','🎉 Đã thêm sản phẩm: '+name.slice(0,28));
  }
  closeModal('productFormOverlay');
  refreshHomeProducts();
  switchSellerTab('products');
}

// ============================================================
// DELETE PRODUCT
// ============================================================
function confirmDelete(pid){
  const p=allProducts.find(x=>x.id===pid);
  document.getElementById('deleteConfirmMsg').textContent=`Xóa "${p?.name}"? Hành động này không thể hoàn tác.`;
  document.getElementById('confirmDelBtn').onclick=()=>doDeleteProduct(pid);
  openModal('deleteConfirmOverlay');
}

function doDeleteProduct(pid){
  const p=allProducts.find(x=>x.id===pid);
  allProducts=allProducts.filter(x=>x.id!==pid);
  cart=cart.filter(c=>c.product.id!==pid);
  updateCartBadge();
  closeModal('deleteConfirmOverlay');
  showToast('success','🗑 Đã xóa: '+(p?.name?.slice(0,28)||'sản phẩm'));
  refreshHomeProducts();
  switchSellerTab('products');
}

// ============================================================
// SELLER: OTHER TABS
// ============================================================
function renderSellerOrders(){
  return `<div class="seller-topbar"><h2>🛒 Đơn Hàng Nhận Được</h2></div>
  <div class="seller-section">
    <div class="empty-table" style="padding:60px 20px"><div class="ei">📭</div><p>Chưa có đơn hàng nào.<br>Thêm sản phẩm để bắt đầu nhận đơn!</p></div>
  </div>`;
}

function renderAnalytics(){
  const myProds=getMyProducts();
  return `<div class="seller-topbar"><h2>📈 Doanh Thu & Thống Kê</h2></div>
  <div class="seller-stats">
    <div class="stat-card green"><div class="sc-label">Tháng này</div><div class="sc-val">--</div><div class="sc-sub">Chưa có giao dịch</div></div>
    <div class="stat-card orange"><div class="sc-label">Tháng trước</div><div class="sc-val">--</div><div class="sc-sub">--</div></div>
    <div class="stat-card blue"><div class="sc-label">Lượt xem</div><div class="sc-val">${myProds.length*24}</div><div class="sc-sub">↑ 12% so với tuần trước</div></div>
    <div class="stat-card red"><div class="sc-label">Tỷ lệ chuyển đổi</div><div class="sc-val">--</div><div class="sc-sub">Cần thêm dữ liệu</div></div>
  </div>
  <div class="seller-section">
    <div style="text-align:center;padding:50px 20px;color:#aaa">
      <div style="font-size:44px;margin-bottom:12px">📊</div>
      <p>Bắt đầu bán hàng để xem báo cáo doanh thu chi tiết</p>
    </div>
  </div>`;
}

function renderSellerSettings(){
  return `<div class="seller-topbar"><h2>⚙️ Cài Đặt Gian Hàng</h2></div>
  <div class="seller-section" style="padding:20px">
    <div class="form-group"><label>Tên gian hàng</label><input type="text" value="${currentUser.shopName||''}" placeholder="Tên gian hàng"></div>
    <div class="form-group"><label>Email liên hệ</label><input type="email" value="${currentUser.email}" placeholder="email@example.com"></div>
    <div class="form-group"><label>Số điện thoại</label><input type="tel" placeholder="0912 345 678"></div>
    <div class="form-group"><label>Địa chỉ kho hàng</label><input type="text" placeholder="Địa chỉ kho hàng"></div>
    <div class="form-group"><label>Mô tả gian hàng</label><textarea placeholder="Mô tả về gian hàng của bạn..."></textarea></div>
    <button class="btn-seller-primary" style="max-width:200px" onclick="showToast('success','✅ Đã lưu cài đặt')">💾 Lưu Cài Đặt</button>
  </div>`;
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(type,msg){
  const t=document.getElementById('toast');
  const m=document.getElementById('toast-msg');
  t.className='toast show'+(type?' '+type:'');
  m.textContent=msg;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),3200);
}

// ============================================================
// BANNER SLIDESHOW
// ============================================================
let cur=0;
const slides=['s1','s2','s3'],dots=['d1','d2','d3'];
function goSlide(n){
  document.getElementById(slides[cur]).classList.remove('active');
  document.getElementById(dots[cur]).classList.remove('active');
  cur=n;
  document.getElementById(slides[cur]).classList.add('active');
  document.getElementById(dots[cur]).classList.add('active');
}
setInterval(()=>goSlide((cur+1)%3),3600);
dots.forEach((d,i)=>document.getElementById(d).addEventListener('click',()=>goSlide(i)));

// FLASH SALE COUNTDOWN
let secs=2*3600+34*60+15;
function tick(){ if(secs<=0)return; secs--;
  const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),s=secs%60;
  document.getElementById('th').textContent=String(h).padStart(2,'0');
  document.getElementById('tm').textContent=String(m).padStart(2,'0');
  document.getElementById('ts').textContent=String(s).padStart(2,'0');
}
setInterval(tick,1000);
document.querySelectorAll('.lz-flash-tab button').forEach(b=>b.addEventListener('click',function(){ document.querySelectorAll('.lz-flash-tab button').forEach(x=>x.classList.remove('active')); this.classList.add('active'); }));

// CLOSE OVERLAY ON BG CLICK
document.querySelectorAll('.overlay').forEach(ov=>{ ov.addEventListener('click',e=>{ if(e.target===ov)closeModal(ov.id); }); });

// INIT
initProducts();
updateAuthUI();