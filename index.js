// ============================================================
// DATA
// ============================================================
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

const ORDERS_DATA = [
  {id:'LAZ2024031501',date:'15/03/2024',status:'delivered',label:'Đã Giao',items:[{name:'Samsung Galaxy A55',icon:'📱',qty:1,price:8990000,variant:'Màu: Xanh'},{name:'Tai nghe Sony',icon:'🎧',qty:1,price:5490000,variant:'Màu: Đen'}],total:14480000},
  {id:'LAZ2024032201',date:'22/03/2024',status:'shipping',label:'Đang Giao',items:[{name:'Laptop ASUS VivoBook',icon:'💻',qty:1,price:12490000,variant:'RAM: 8GB'}],total:12490000},
  {id:'LAZ2024040501',date:'05/04/2024',status:'processing',label:'Đang Xử Lý',items:[{name:'Nồi chiên Xiaomi',icon:'🍳',qty:2,price:1290000,variant:'5L'},{name:'Vitamin C',icon:'💊',qty:3,price:285000,variant:'60 viên'}],total:3435000},
  {id:'LAZ2024020801',date:'08/02/2024',status:'cancelled',label:'Đã Hủy',items:[{name:'Giày Nike Air Max',icon:'👟',qty:1,price:2450000,variant:'Size 42'}],total:2450000},
];

const EMOJIS = ['📱','💻','🎧','📷','⌚','🖨️','🖥️','⌨️','🖱️','🎮','📺','📡','👗','👔','👟','👠','👜','🎒','🧣','🧢','🏠','🛋️','🪑','🛏️','🍳','🫖','🧹','🪣','💊','🧴','💄','🪥','🏋️','⚽','🏸','🚴','🎯','🎸','📚','✏️','🧸','🎁','🌿','🍎','🧃','🚗','🏍️','🛵','✈️'];

// ============================================================
// STATE
// ============================================================
let currentUser = null;
let cart = [];
let currentPage = 'home';
let nextProductId = 100;
let editingProductId = null;
let sellerTab = 'dashboard';

// ============================================================
// UTILS
// ============================================================
const fmt = n => n.toLocaleString('vi-VN') + '₫';
const calcDisc = (price, ori) => ori > price ? Math.round((1 - price / ori) * 100) : 0;

// ============================================================
// MODAL
// ============================================================
function openModal(id){ 
    document.getElementById(id).classList.add('show'); 
    document.body.style.overflow = 'hidden'; 
}
function closeModal(id){ 
    document.getElementById(id).classList.remove('show'); 
    document.body.style.overflow = ''; 
}
function switchModal(a,b){ 
    closeModal(a); 
    setTimeout(()=>openModal(b),130); 
}

// ============================================================
// AUTH FUNCTIONS (giữ nguyên)
// ============================================================
function doLogin(){
  const email = document.getElementById('lgEmail').value.trim();
  const pass = document.getElementById('lgPass').value.trim();
  if(!email || !pass){ document.getElementById('loginErr').classList.add('show'); return; }
  document.getElementById('loginErr').classList.remove('show');
  loginSuccess({name: email.includes('@') ? email.split('@')[0] : email, email, role:'buyer'});
  closeModal('loginOverlay');
  showToast('success','✓ Xin chào ' + currentUser.name + '!');
}

function doBuyerRegister(){
  const first = document.getElementById('rgFirst').value.trim();
  const last = document.getElementById('rgLast').value.trim();
  const email = document.getElementById('rgEmail').value.trim();
  const pass = document.getElementById('rgPass').value.trim();
  if(!first || !last || !email || !pass){ document.getElementById('regErr').classList.add('show'); return; }
  document.getElementById('regErr').classList.remove('show');
  document.getElementById('regOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name: first + ' ' + last, email, role:'buyer'});
    closeModal('registerOverlay');
    showToast('success','🎉 Đăng ký thành công! Xin chào ' + first);
  },1100);
}

function doSellerLogin(){
  const email = document.getElementById('slEmail').value.trim();
  const pass = document.getElementById('slPass').value.trim();
  if(!email || !pass){ document.getElementById('sellerLoginErr').classList.add('show'); return; }
  document.getElementById('sellerLoginErr').classList.remove('show');
  const shopName = email.split('@')[0] + ' Shop';
  loginSuccess({name: email.split('@')[0], email, role:'seller', shopName});
  closeModal('sellerLoginOverlay');
  showToast('success','🏪 Chào mừng trở lại ' + shopName + '!');
  showPage('seller');
}

function doSellerRegister(){
  const shop = document.getElementById('srShop').value.trim();
  const name = document.getElementById('srName').value.trim();
  const email = document.getElementById('srEmail').value.trim();
  const pass = document.getElementById('srPass').value.trim();
  const pass2 = document.getElementById('srPass2').value.trim();
  const biz = document.getElementById('srBizType').value;
  const cat = document.getElementById('srCategory').value;
  if(!shop || !name || !email || !pass || !biz || !cat){ 
    document.getElementById('sellerRegErr').classList.add('show'); 
    return; 
  }
  if(pass !== pass2){ 
    document.getElementById('sellerRegErr').textContent = 'Mật khẩu xác nhận không khớp.'; 
    document.getElementById('sellerRegErr').classList.add('show'); 
    return; 
  }
  document.getElementById('sellerRegErr').classList.remove('show');
  document.getElementById('sellerRegOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name, email, role:'seller', shopName:shop});
    closeModal('sellerRegOverlay');
    showToast('success','🎉 Đăng ký gian hàng thành công! Chào mừng ' + shop);
    showPage('seller');
  },1200);
}

function loginSuccess(user){
  currentUser = user;
  updateAuthUI();
}

function doLogout(){
  currentUser = null; 
  cart = [];
  updateAuthUI(); 
  updateCartBadge();
  document.querySelectorAll('.user-dropdown').forEach(d => d.classList.remove('show'));
  showToast('','👋 Đã đăng xuất');
  showPage('home');
}

function updateAuthUI(){
  const topBar = document.getElementById('topBarAuth');
  const navArea = document.getElementById('navAuthArea');
  if(currentUser){
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const isSeller = currentUser.role === 'seller';
    topBar.innerHTML = `<span style="color:rgba(255,255,255,0.9)">Xin chào, <strong>${currentUser.name.split(' ')[0]}</strong>${isSeller ? ` <span style="background:#00b14f;color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px">NGƯỜI BÁN</span>` : ''}</span>`;
    navArea.innerHTML = `<div class="user-wrap">
      <div class="user-avatar ${isSeller?'seller-av':''}" onclick="toggleDropdown()">${initials}</div>
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-header">
          <div class="ud-name">${currentUser.name}</div>
          <div class="ud-email">${currentUser.email}</div>
          <span class="ud-role ${isSeller?'role-seller':'role-buyer'}">${isSeller?'🏪 Người bán':'🛒 Người mua'}</span>
          ${isSeller && currentUser.shopName ? `<div style="font-size:11px;color:#00863c;margin-top:2px">${currentUser.shopName}</div>` : ''}
        </div>
        ${isSeller ? `<a class="seller-menu-item" onclick="showPage('seller');closeDropdown()">🏪 Quản lý gian hàng</a>` : ''}
        <a onclick="showPage('orders');closeDropdown()">📦 Đơn hàng của tôi</a>
        <a onclick="closeDropdown()">👤 Tài khoản</a>
        <a onclick="closeDropdown()">❤️ Yêu thích</a>
        <a class="logout-item" onclick="doLogout()">🚪 Đăng xuất</a>
      </div>
    </div>`;
  } else {
    topBar.innerHTML = `<a onclick="openModal('loginOverlay')">Đăng Nhập</a><a onclick="openModal('registerOverlay')">Đăng Ký</a>`;
    navArea.innerHTML = '';
  }
}

function toggleDropdown(){ 
    const dd = document.getElementById('userDropdown'); 
    if(dd) dd.classList.toggle('show'); 
}
function closeDropdown(){ 
    document.querySelectorAll('.user-dropdown').forEach(d => d.classList.remove('show')); 
}
document.addEventListener('click', e => { 
    if(!e.target.closest('.user-wrap')) closeDropdown(); 
});

// ============================================================
// PAGES
// ============================================================
function showPage(name){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  currentPage = name; 
  window.scrollTo(0,0);
  if(name === 'cart') renderCart();
  if(name === 'orders') renderOrders();
  if(name === 'seller') renderSeller();
}

// ============================================================
// PRODUCTS
// ============================================================
function makeProductCard(p, showSold = true){
  const sellerOwned = p.sellerOwned;
  return `<div class="lz-prod-card">
    <div class="lz-prod-img">
      ${sellerOwned ? `<span class="seller-badge">Người bán</span>` : ''}
      ${p.icon}
    </div>
    <div class="lz-prod-info">
      <div class="lz-prod-name">${p.name}</div>
      <div style="display:flex;align-items:center;gap:4px">
        <span class="lz-prod-price">${fmt(p.price)}</span>
        ${p.disc > 0 ? `<span class="lz-prod-disc">-${p.disc}%</span>` : ''}
      </div>
      ${p.ori > p.price ? `<div class="lz-prod-ori">${fmt(p.ori)}</div>` : ''}
      ${showSold ? `<div class="lz-prod-sold">Đã bán ${p.sold >= 1000 ? (p.sold/1000).toFixed(1)+'k' : p.sold}</div>
      <div class="lz-sold-bar"><div class="lz-sold-fill" style="width:${p.soldPct}%"></div></div>` : ''}
    </div>
    <button class="add-cart-btn" id="cart-btn-${p.id}" onclick="addToCart(${p.id})">+ Thêm vào giỏ</button>
  </div>`;
}

function initProducts(){
  const activeProds = allProducts.filter(p => p.status === 'active');
  document.getElementById('flashProducts').innerHTML = activeProds.slice(0,5).map(p => makeProductCard(p,true)).join('');
  document.getElementById('recProducts').innerHTML = activeProds.slice(5,10).map(p => makeProductCard(p,false)).join('');
}

function refreshHomeProducts(){
  const activeProds = allProducts.filter(p => p.status === 'active');
  const fp = document.getElementById('flashProducts');
  const rp = document.getElementById('recProducts');
  if(fp) fp.innerHTML = activeProds.slice(0,5).map(p => makeProductCard(p,true)).join('');
  if(rp) rp.innerHTML = activeProds.slice(5,10).map(p => makeProductCard(p,false)).join('');
}

// ============================================================
// CART, ORDERS, SELLER... (giữ nguyên như cũ)
// ============================================================
// (Tôi rút gọn phần này để tiết kiệm chỗ, bạn giữ nguyên từ file cũ của bạn)

function addToCart(pid){ /* ... giữ nguyên */ }
function updateCartBadge(){ /* ... giữ nguyên */ }
function renderCart(){ /* ... giữ nguyên */ }
function doCheckout(){ /* ... giữ nguyên */ }
function renderOrders(){ /* ... giữ nguyên */ }
function renderSeller(){ /* ... giữ nguyên */ }
function switchSellerTab(tab){ /* ... giữ nguyên */ }
function renderSellerTab(){ /* ... giữ nguyên */ }
function renderDashboard(){ /* ... giữ nguyên */ }
function renderProductManager(){ /* ... giữ nguyên */ }
function renderProductTable(prods){ /* ... giữ nguyên */ }
function filterSellerProducts(name = '', status = ''){ /* ... giữ nguyên */ }
function toggleProductStatus(pid){ /* ... giữ nguyên */ }
function openProductForm(pid){ /* ... giữ nguyên */ }
function selectEmoji(e){ /* ... giữ nguyên */ }
function saveProduct(){ /* ... giữ nguyên */ }
function confirmDelete(pid){ /* ... giữ nguyên */ }
function doDeleteProduct(pid){ /* ... giữ nguyên */ }
function renderSellerOrders(){ /* ... giữ nguyên */ }
function renderAnalytics(){ /* ... giữ nguyên */ }
function renderSellerSettings(){ /* ... giữ nguyên */ }

// ============================================================
// TOAST, BANNER, COUNTDOWN (giữ nguyên)
// ============================================================
let toastTimer;
function showToast(type, msg){
  const t = document.getElementById('toast');
  const m = document.getElementById('toast-msg');
  t.className = 'toast show' + (type ? ' ' + type : '');
  m.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// Banner slideshow và countdown giữ nguyên như cũ...

// ============================================================
// PHẦN MỚI: ÁP DỤNG THAY ĐỔI TỪ ADMIN
// ============================================================
function applyAdminChanges() {
    const savedName = localStorage.getItem('admin_siteName');
    const savedColor = localStorage.getItem('admin_mainColor');
    const savedBanner = localStorage.getItem('admin_bannerTitle');

    // Thay đổi tên website
    if (savedName) {
        const logo = document.querySelector('.lz-logo');
        if (logo) logo.innerHTML = savedName;
    }

    // Thay đổi màu chủ đạo
    if (savedColor) {
        document.documentElement.style.setProperty('--main-color', savedColor);

        const dynamicStyle = document.createElement('style');
        dynamicStyle.innerHTML = `
            .lz-header { 
                background: linear-gradient(135deg, #1a1463, ${savedColor}) !important; 
            }
            .btn-primary, 
            .add-cart-btn, 
            .checkout-btn, 
            .lz-prod-disc, 
            .lz-search button {
                background: linear-gradient(90deg, ${savedColor}, #ff6b4a) !important;
            }
            .lz-prod-price, 
            .ci-price, 
            .order-item-price {
                color: ${savedColor} !important;
            }
            .lz-cats a.active,
            .lz-flash-tab button.active {
                color: ${savedColor} !important;
                border-bottom-color: ${savedColor} !important;
            }
        `;
        document.head.appendChild(dynamicStyle);
    }

    // Thay đổi tiêu đề banner
    if (savedBanner) {
        const bannerH2 = document.querySelector('.lz-banner-text h2');
        if (bannerH2) bannerH2.textContent = savedBanner;
    }
}

// Gọi hàm khi trang load
window.addEventListener('load', applyAdminChanges);

// ============================================================
// INIT
// ============================================================
initProducts();
updateAuthUI();
console.log("✅ Script loaded with Admin integration");