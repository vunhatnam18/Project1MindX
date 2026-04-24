// ============================================================
// DATA
// ============================================================

// danh sách sản phẩm
let allProducts = [
  {id:1,name:'IPhone 17 Promax',icon:'https://i.pinimg.com/736x/19/28/7c/19287c8799f8c0ce38103cfe7a240bea.jpg',price:8990000,ori:12990000,disc:30,status:'active',sellerOwned:false},
  {id:2,name:'Tai nghe Baseus Wm2',icon:'https://i.pinimg.com/736x/32/53/ee/3253eee1d4d2f9079076d005fce8631a.jpg',price:5490000,ori:9990000,disc:45,status:'active',sellerOwned:false},
  {id:3,name:'Laptop ThinkPad X1 Carbon Gen 15',icon:'https://i.pinimg.com/736x/10/41/61/1041617893c350c59c14bca6639f102e.jpg',price:12490000,ori:16590000,disc:25,status:'active',sellerOwned:false},
  {id:4,name:'Apple Watch Series 10',icon:'https://i.pinimg.com/736x/32/e1/60/32e16036e4c88b0079199a697b464bdc.jpg',price:9290000,ori:11590000,disc:20,status:'active',sellerOwned:false},
  {id:5,name:'Máy ảnh Canon V12',icon:'https://i.pinimg.com/736x/0c/30/ab/0c30ab1f0e78f71a0e66be03fcc79c57.jpg',price:14990000,ori:22990000,disc:35,status:'active',sellerOwned:false},
  {id:6,name:'Giày Nike AF1',icon:"https://i.pinimg.com/736x/63/e9/da/63e9da7962190e04440a5c8ba2e65aa0.jpg",price:2450000,ori:3200000,disc:23,status:'active',sellerOwned:false},
  {id:7,name:'Hộp Gói quà',icon:'https://i.pinimg.com/736x/88/68/c1/8868c1254d97a25cc596f634f7f7ebaf.jpg',price:389000,ori:650000,disc:40,status:'active',sellerOwned:false},
  {id:8,name:'Nồi Chiên Không Dầu AceCook',icon:'https://i.pinimg.com/736x/06/dd/b6/06ddb6e51ef064bfb5842a099e2d84aa.jpg',price:1290000,ori:2190000,disc:41,status:'active',sellerOwned:false},
  {id:9,name:'Vitamin C Pharmacy',icon:'https://i.pinimg.com/736x/d9/de/e1/d9dee1dff4bc97cc67b4f0d483173980.jpg',price:285000,ori:420000,disc:32,status:'active',sellerOwned:false},
  {id:10,name:'Bàn Chải Điện Colgate',icon:'https://i.pinimg.com/736x/a5/d6/d5/a5d6d548a5f03ca7a28f7dec3db977b0.jpg',price:590000,ori:890000,disc:34,status:'active',sellerOwned:false},
];


const EMOJIS=['Phone','Laptop','Device','Camera','Appliance','Gaming','Television','Fashion','Daily','Family','Interior','Food','Medical','Transport'];

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
      <img src = ${p.icon} style = "max-height:100%;max-width:100%">
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
    box.innerHTML=`<div style="max-width:1200px;margin:0 auto;padding:8px"><div class="cart-empty-box"><div class="ei"></div><p>Giỏ hàng của bạn đang trống</p><button onclick="showPage('home')">Tiếp tục mua sắm</button></div></div>`;
    return;
  }
  const checked=cart.filter(c=>c.checked);
  const subtotal=checked.reduce((s,c)=>s+c.product.price*c.qty,0);
  const ship= 0.02*subtotal;
  const total=subtotal+ship
  const allCh=cart.every(c=>c.checked);
  box.innerHTML=`<div class="cart-wrap">
    <div>
      <div class="cart-items-box">
        <div class="cart-shop-hdr"> Official Store</div>
        ${cart.map(c=>`<div class="cart-item">
          <input type="checkbox" class="item-cb" ${c.checked?'checked':''} onchange="toggleCheck(${c.product.id})">
          <div class="cart-img">${c.product.icon}</div>
          <div class="cart-info">
            <div class="ci-name">${c.product.name}</div>
            <div><span class="ci-price">${fmt(c.product.price)}</span>${c.product.ori>c.product.price?`<span class="ci-ori">${fmt(c.product.ori)}</span>`:''}</div>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${c.product.id},-1)">−</button>
            <input class="qty-val" type="text" value="${c.qty}" readonly>
            <button class="qty-btn" onclick="changeQty(${c.product.id},1)">+</button>
          </div>
          <div class="ci-total">${fmt(c.product.price*c.qty)}</div>
          <button class="rm-btn" onclick="removeFromCart(${c.product.id})">Xoá</button>
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="cart-summary-box">
        <h3>Thanh toán</h3>
        <div class="sum-row"><span>Tạm tính (${checked.reduce((s,c)=>s+c.qty,0)} sp)</span><span>${fmt(subtotal)}</span></div>
        <div class="sum-row"><span>Phí vận chuyển</span><span>${checked.length>0?fmt(ship):'--'}</span></div>
        <div class="sum-row total"><span>Tổng cộng</span><span>${fmt(total)}</span></div>
        <button class="checkout-btn" onclick="doCheckout()">Đặt Hàng</button>
      </div>
    </div>
  </div>`;
}

function doCheckout(){
  if(!cart.filter(c=>c.checked).length){showToast('error','⚠ Chọn sản phẩm để đặt hàng');return;}
  if(!currentUser){openModal('loginOverlay');return;}
  cart=cart.filter(c=>!c.checked); updateCartBadge();
  showToast('success', 'Đặt hàng thành công');
  setTimeout(renderCart,200);
}

// ============================================================
// ORDERS
// ============================================================



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
      <div class="seller-sidebar-brand"><h3> ${currentUser.shopName||'Shop'}</h3><p>${currentUser.email}</p></div>
      <nav class="seller-nav">
        <a class="${sellerTab==='dashboard'?'active':''}" onclick="switchSellerTab('dashboard')"><span class="nav-icon"></span>Tổng quan</a>
        <a class="${sellerTab==='products'?'active':''}" onclick="switchSellerTab('products')"><span class="nav-icon"></span>Quản lý sản phẩm</a>
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
    <h2> Quản Lý Sản Phẩm</h2>
    <button class="btn-add-product" onclick="openProductForm(null)">Thêm Sản Phẩm Mới</button>
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
  if(prods.length===0) return `<div class="empty-table"><div class="ei"></div><p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p><button class="btn-add-product" style="margin:10px auto" onclick="openProductForm(null)">➕ Thêm Sản Phẩm</button></div>`;
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
  grid.innerHTML=EMOJIS.map(e=>`<div class="emoji-opt ${e==='?'}" onclick="selectEmoji('${e.split('').slice(0,3).join('')}')">${e}</div>`).join('');

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
    document.getElementById('pfTitle').textContent=' Thêm Sản Phẩm Mới';
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
  document.getElementById('deleteConfirmMsg').textContent=`Xóa "${p?.name}"? Hành động này không thể quay lại.`;
  document.getElementById('confirmDelBtn').onclick=()=>doDeleteProduct(pid);
  openModal('deleteConfirmOverlay');
}

function doDeleteProduct(pid){
  const p=allProducts.find(x=>x.id===pid);
  allProducts=allProducts.filter(x=>x.id!==pid);
  cart=cart.filter(c=>c.product.id!==pid);
  updateCartBadge();
  closeModal('deleteConfirmOverlay');
  showToast('success','Đã xóa sản phẩm');
  refreshHomeProducts();
  switchSellerTab('products');
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

// INIT
initProducts();
updateAuthUI();