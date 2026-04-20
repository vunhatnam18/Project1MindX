// ============================================================
// DATA
// ============================================================

// danh sách sản phẩm
let allProducts = [
  {id:1,name:'Samsung Galaxy A55 5G 128GB',icon:'📱',price:8990000,ori:12990000,disc:30,status:'active',sellerOwned:false},
  {id:2,name:'Tai nghe Sony WH-1000XM5',icon:'🎧',price:5490000,ori:9990000,disc:45,status:'active',sellerOwned:false},
  {id:3,name:'Laptop ASUS VivoBook 15 i5',icon:'💻',price:12490000,ori:16590000,disc:25,status:'active',sellerOwned:false},
  {id:4,name:'Apple Watch Series 9 GPS 41mm',icon:'⌚',price:9290000,ori:11590000,disc:20,status:'active',sellerOwned:false},
  {id:5,name:'Máy ảnh Canon EOS M50 Mark II',icon:'📷',price:14990000,ori:22990000,disc:35,status:'active',sellerOwned:false},
  {id:6,name:'Giày Nike Air Max 270',icon:'👟',price:2450000,ori:3200000,disc:23,status:'active',sellerOwned:false},
  {id:7,name:'Balo Laptop chống thấm nước',icon:'🎒',price:389000,ori:650000,disc:40,status:'active',sellerOwned:false},
  {id:8,name:'Nồi chiên không dầu Xiaomi 5L',icon:'🍳',price:1290000,ori:2190000,disc:41,status:'active',sellerOwned:false},
  {id:9,name:'Vitamin C 1000mg Blackmores',icon:'💊',price:285000,ori:420000,disc:32,status:'active',sellerOwned:false},
  {id:10,name:'Bàn chải điện Oral-B Pro 2000',icon:'🪥',price:590000,ori:890000,disc:34,status:'active',sellerOwned:false},
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
let sellerTab = 'dashboard';
let nextProductId = 100;


// ============================================================
// UTILS
// ============================================================
const fmt = (n) => n.toLocaleString('vi-VN') + '₫'; // đưa số tiền hiển thị về kiểu vn
//--tính phần trăm giảm giá--
const calcDisc = (price,ori) => ori>price ? Math.round((1-price/ori)*100) : 0;

// ============================================================
// MODAL
// ============================================================
function openModal(id){ 
    document.getElementById(id).classList.add('show');
  }
function closeModal(id){ 
    document.getElementById(id).classList.remove('show');  
}
function switchModal(a,b){ 
    closeModal(a); setTimeout(()=>openModal(b),100); 
}

// ============================================================
// AUTH - BUYER
// ============================================================
function doLogin(){
    const name = document.getElementById("lgName").value;
    const email=document.getElementById('lgEmail').value;
    const pass=document.getElementById('lgPass').value;
    if(email == null || pass == null || !name){ 
        document.getElementById('loginErr').classList.add('show'); 
    return; 
    }
    document.getElementById('loginErr').classList.remove('show');
    let user = {
        name: name,
        email: email,
        role: "buyer"
    }
    loginSuccess(user);
    closeModal('loginOverlay');
    }

function doBuyerRegister(){
  const name=document.getElementById('rgName').value
  const email=document.getElementById('rgEmail').value, pass=document.getElementById('rgPass').value;
  if(!name||!email||!pass){ 
    document.getElementById('regErr').classList.add('show'); return
 }
  document.getElementById('regOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name: name, email: email, role:'buyer'});
    closeModal('registerOverlay');
  },1000);
}

// ============================================================
// AUTH - SELLER
// ============================================================
function doSellerLogin(){
    const shopName = document.getElementById('slName').value;
  const email=document.getElementById('slEmail').value;
  const pass=document.getElementById('slPass').value;

  if(!email||!pass){ 
    document.getElementById('sellerLoginErr').classList.add('show');
    return;
 }
 setTimeout(() => {loginSuccess({name: shopName, email: email, role:'seller'});
  closeModal('sellerLoginOverlay');
  showPage('seller')},1000);
}

function doSellerRegister(){
    const shopName=document.getElementById('srShop').value;
    const name=document.getElementById('srName').value;
    const email=document.getElementById('srEmail').value;
    const pass=document.getElementById('srPass').value;
    const pass2=document.getElementById('srPass2').value;
    if(!shopName||!name||!email||!pass){ 
        document.getElementById('sellerRegErr').classList.add('show');
    return;
 }
    if(pass!==pass2){ 
        document.getElementById('sellerRegErr').textContent='Mật khẩu xác nhận không khớp.'; 
        document.getElementById('sellerRegErr').classList.add('show'); 
    return; 
    }
    document.getElementById('sellerRegOk').classList.add('show');
  setTimeout(()=>{
    loginSuccess({name: shopName, email: email, role:'seller'});
    closeModal('sellerRegOverlay');
    showPage('seller');
  },1000);
}

function loginSuccess(user){
  currentUser=user;
  updateAuthUI();
}

function doLogout(){
  currentUser=null; cart=[];
  updateAuthUI(); updateCartBadge();
  document.querySelectorAll('.user-dropdown').forEach(d=>d.classList.remove('show'));
  showPage('home');
}

function updateAuthUI(){
  const topBar=document.getElementById('topBarAuth');
  const navArea=document.getElementById('navAuthArea');
  if(currentUser != null){
    const initials=currentUser.name.charAt(0).toUpperCase();
    const isSeller=currentUser.role==='seller';
    navArea.innerHTML=`<div class="user-wrap">
      <div class="user-avatar ${isSeller?'seller-av':''}" onclick="toggleDropdown()">${initials}</div>
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-header">
          <div class="ud-name">${currentUser.name}</div>
          <div class="ud-email">${currentUser.email}</div>
          <span class="ud-role ${isSeller?'role-seller':'role-buyer'}">${isSeller?'Người bán':''}</span>
        </div>
        ${isSeller?`<a class="seller-menu-item" onclick="showPage('seller');closeDropdown()">Quản lý gian hàng</a>`:''}
        <a onclick="showPage('orders');closeDropdown()">Đơn hàng của tôi</a>
        <a class="logout-item" onclick="doLogout()">Đăng xuất</a>
      </div>
    </div>`;
  } else {
    topBar.innerHTML=`<a onclick="openModal('loginOverlay')">Đăng Nhập  </a><a onclick="openModal('registerOverlay')">Đăng Ký</a>`;
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
  currentPage=name;
  if(name==='cart'){
    renderCart();
  }
  if(name==='orders'){
    renderOrders();
  }
  if(name==='seller'){
    renderSeller();
  }
}

// ============================================================
// PRODUCTS (HOME)
// ============================================================
function makeProductCard(p){
  return `<div class="lz-prod-card">
    <div class="lz-prod-img">
      ${p.icon}
    </div>
    <div class="lz-prod-info">
      <div class="lz-prod-name">${p.name}</div>
      <div style="display:flex;align-items:center;gap:4px">
        <span class="lz-prod-price">${fmt(p.price)}</span>
      <span class="lz-prod-disc">-${p.disc}%</span>
      </div>
      <div class="lz-prod-ori">${fmt(p.ori)}</div>
    </div>
    <button class="add-cart-btn" id="cart-btn-${p.id}" onclick="addToCart(${p.id})">+ Thêm vào giỏ</button>
  </div>`
}

function initProducts(){
  let actived = allProducts.filter(p => p.status ==="active");
  document.getElementById('objectProducts').innerHTML=actived.map(p=>makeProductCard(p)).join('');
}

function refreshHomeProducts(){
  const fp=document.getElementById('objectProducts');
  let actived = allProducts.filter(p => p.status ==="active");
  fp.innerHTML=actived.map(p=>makeProductCard(p)).join('');
}

// ============================================================
// CART
// ============================================================
function addToCart(pid){
  const prod=allProducts.find(p=>p.id===pid); 
  const ex=cart.find(c=>c.product.id===pid);
  if(ex != null){
  ex.qty++
  }else cart.push({product:prod,qty:1,checked:true});
  updateCartBadge();
  const btn=document.getElementById('cart-btn-'+pid);
  if(btn){btn.textContent='Đã thêm';btn.classList.add('added');setTimeout(()=>{btn.textContent='+ Thêm vào giỏ';btn.classList.remove('added');},2000);}
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
      <h3>Kênh Người Bán</h3>
      <div class="ns-btns">
        <button class="ns-btn-login" onclick="openModal('sellerLoginOverlay')">Đăng Nhập </button>
        <button class="ns-btn-reg" onclick="openModal('sellerRegOverlay')">Đăng Ký </button>
      </div>
    </div>`;
    return;
  }
  const myProds= getMyProducts();
  const totalRevenue=myProds.reduce((s,p)=>s+p.price*(p.sold||0),0);
  const activeCount=myProds.filter(p=>p.status==='active').length;
  const totalStock=myProds.reduce((s,p)=>s+(p.stock||0),0);

  box.innerHTML=`<div class="seller-layout">
    <div class="seller-sidebar">
      <div class="seller-sidebar-brand"><h3>🏪 ${currentUser.shopName||'My Shop'}</h3><p>${currentUser.email}</p></div>
      <nav class="seller-nav">
        <a class="${sellerTab==='dashboard'?'active':''}" onclick="switchSellerTab('dashboard')"><span class="nav-icon">📊</span>Tổng quan</a>
        <a class="${sellerTab==='products'?'active':''}" onclick="switchSellerTab('products')"><span class="nav-icon">📦</span>Quản lý sản phẩm</a>
        <a class="logout-item" onclick="doLogout()"><span class="nav-icon"></span>Đăng xuất</a>
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
    const tabs=['dashboard','products'];
    if(tabs[i]===tab) a.classList.add('active');
  });
}

function renderSellerTab(){
  if(sellerTab==='dashboard') return renderDashboard();
  if(sellerTab==='products') return renderProductManager();
  return renderDashboard();
}

function renderDashboard(){
  const myProds=getMyProducts();
  const totalRevenue=myProds.reduce((s,p)=>s+p.price*(p.sold||0),0);
  const activeCount=myProds.filter(p=>p.status==='active').length;
  return `${myProds.length===0
      ? `<div class="empty-table"><div class="ei"></div><p>Bạn chưa có sản phẩm nào.<br>Thêm sản phẩm</p><button class="btn-add-product" style="margin:10px auto" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>`
      : `<table class="prod-table"><thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Trạng thái</th></tr></thead><tbody>
      ${myProds.map(p=>`<tr>
        <td><div class="prod-name-cell"><div class="prod-thumb">${p.icon}</div><div><div class="pn-name">${p.name}</div><div class="pn-cat">${p.icon}</div></div></div></td>
        <td><div class="tbl-price">${fmt(p.price)}</div>${p.disc>0?`<div class="tbl-discount">-${p.disc}%</div>`:''}</td>
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
    </div>
    <div id="sellerProductTable">
      ${renderProductTable(myProds)}
    </div>
  </div>`;
}

function renderProductTable(prods){
  if(prods.length===0) return `<div class="empty-table"><div class="ei">📦</div><p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p><button class="btn-add-product" style="margin:10px auto" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>`;
  return `<table class="prod-table">
    <thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Giá gốc</th><th>Giảm giá</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${prods.map(p=>`<tr id="prod-row-${p.id}">
      <td><div class="prod-name-cell"><div class="prod-thumb">${p.icon}</div><div><div class="pn-name">${p.name}</div><div class="pn-cat">${p.icon}</div></div></div></td>
      <td><div class="tbl-price">${fmt(p.price)}</div></td>
      <td><div style="color:#aaa;font-size:12px">${p.ori>=p.price?fmt(p.ori):'--'}</div></td>
      <td><span class="tbl-discount">${p.disc>=0?'-'+p.disc+'%':'--'}</span></td>
      <td><span class="${p.status==='active'?'status-active':'status-inactive'}"></span>${p.status==='active'?'Đang bán':'Tạm ngưng'}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openProductForm(${p.id})">✏️ Sửa</button>
        <button class="btn-toggle-active" onclick="toggleProductStatus(${p.id})">${p.status==='active'?'Tạm ngưng':' Kích hoạt'}</button>
        <button class="btn-del" onclick="confirmDelete(${p.id})">Xóa</button>
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
  showToast('success',`${p.status==='active'?'Đã mở bán':'Đang tạm ngừng bán'}: ${p.name.slice(0,25)}...`);
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
    document.getElementById('pfTitle').textContent=' Chỉnh Sửa Sản Phẩm';
    document.getElementById('pfIcon').value=p.icon;
    document.getElementById('pfName').value=p.name;
    document.getElementById('pfPrice').value=p.price;
    document.getElementById('pfOri').value=p.ori||'';
    // highlight selected emoji
    grid.querySelectorAll('.emoji-opt').forEach(el=>{ el.classList.toggle('selected',el.textContent===p.icon); });
  } else {
    document.getElementById('pfTitle').textContent='➕ Thêm Sản Phẩm Mới';
    document.getElementById('pfName').value='';
    document.getElementById('pfPrice').value='';
    document.getElementById('pfOri').value='';
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
  const price=parseInt(document.getElementById('pfPrice').value)||0;
  if(!name||!price){ showToast('error','Vui lòng điền đủ thông tin'); return; }
  const icon=document.getElementById('pfIcon').value;
  const ori=parseInt(document.getElementById('pfOri').value)||price;
  const disc=calcDisc(price,ori);

  if(editingProductId){
    const idx=allProducts.findIndex(p=>p.id===editingProductId);
    if(idx>=0){
      allProducts[idx]={...allProducts[idx],name,icon,price,ori,disc,sellerOwned: true};
      showToast('success','Đã cập nhật');
    }
  } else {
    const newProd={id:nextProductId++,name,icon,price,ori,disc,sellerOwned: true};
    allProducts.push(newProd);
    showToast('success',' Đã thêm sản phẩm');
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