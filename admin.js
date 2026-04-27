
// ADMIN JS - FULL VERSION


let allProducts = [];
let allSellers = [];
let allBuyers = [];
let allOrders = [];
let allVouchers = [];
let notifications = [];

// UTILS 
const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

function loadAdminData() {
  allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]');
  allSellers  = JSON.parse(localStorage.getItem('allSellers')  || '[]');
  allBuyers   = JSON.parse(localStorage.getItem('allBuyers')   || '[]');
  allOrders   = JSON.parse(localStorage.getItem('allOrders')   || '[]');
  allVouchers = JSON.parse(localStorage.getItem('allVouchers') || '[]');
  notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
}

function saveKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  loadAdminData();
}

// TAB SWITCH 
function switchTab(tab) {
  document.querySelectorAll('.admin-menu a').forEach((a, i) => {
    a.classList.toggle('active', i === tab);
  });
  if (tab === 0) renderDashboard();
  if (tab === 1) renderStoreManagement();
  if (tab === 2) renderProductManagement();
  if (tab === 3) renderOrderManagement();
  if (tab === 4) renderBuyerManagement();
  if (tab === 5) renderSellerManagement();
}

//  DASHBOARD 
function renderDashboard() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Tổng Quan Hệ Thống';
  const totalRevenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <h2 style="margin-bottom:18px">Thống Kê Tổng Quan</h2>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:22px;border-radius:12px;text-align:center">
          <div style="font-size:32px;font-weight:700">${allProducts.length}</div>
          <div style="margin-top:6px;opacity:0.9">Sản phẩm</div>
        </div>
        <div style="background:linear-gradient(135deg,#f093fb,#f5576c);color:white;padding:22px;border-radius:12px;text-align:center">
          <div style="font-size:32px;font-weight:700">${allSellers.length}</div>
          <div style="margin-top:6px;opacity:0.9">Người bán</div>
        </div>
        <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;padding:22px;border-radius:12px;text-align:center">
          <div style="font-size:32px;font-weight:700">${allBuyers.length}</div>
          <div style="margin-top:6px;opacity:0.9">Khách hàng</div>
        </div>
        <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;padding:22px;border-radius:12px;text-align:center">
          <div style="font-size:32px;font-weight:700">${allOrders.length}</div>
          <div style="margin-top:6px;opacity:0.9">Đơn hàng</div>
        </div>
      </div>
      <div style="background:#fff7f0;border:2px solid #ee4d2d;border-radius:10px;padding:20px;display:inline-block">
        <div style="font-size:13px;color:#888;margin-bottom:6px">Tổng doanh thu</div>
        <div style="font-size:28px;font-weight:700;color:#ee4d2d">${fmt(totalRevenue)}</div>
      </div>
    </div>
  `;
}

//  STORE MANAGEMENT (Tab 1)
function renderStoreManagement() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Quản Lý Cửa Hàng';

  // Lấy thông báo đang active mới nhất
  const activeNotif = notifications.find(n => n.active);
  const currentBanner = localStorage.getItem('admin_bannerTitle') || 'Siêu Sale Tháng 4';

  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <h3 style="margin-bottom:16px">Chỉnh sửa Banner</h3>
      <div class="form-group">
        <label>Tiêu đề Banner Chính</label>
        <input type="text" id="bannerTitle" value="${currentBanner}" placeholder="Nhập tiêu đề banner...">
      </div>
      <button class="btn-save" onclick="applyBanner()">Lưu Banner</button>
    </div>

    <div class="admin-section">
      <h3 style="margin-bottom:16px">Thông Báo Hệ Thống</h3>
      <div class="form-group">
        <label>Nội dung thông báo</label>
        <textarea id="notifMsg" rows="3" placeholder="Ví dụ: Hệ thống bảo trì từ 23h-01h ngày 01/05...">${activeNotif ? activeNotif.message : ''}</textarea>
      </div>
      <div style="margin-bottom:14px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600">
          <input type="checkbox" id="notifActive" ${activeNotif ? 'checked' : ''} style="width:16px;height:16px;accent-color:#ee4d2d">
          Kích hoạt thông báo (hiển thị trên trang bán hàng)
        </label>
      </div>
      <button class="btn-save" onclick="applyNotification()">Đăng Thông Báo</button>

      ${notifications.length > 0 ? `
      <h4 style="margin-top:24px;margin-bottom:10px">Lịch sử thông báo</h4>
      <table>
        <thead><tr><th>Nội dung</th><th>Trạng thái</th><th>Ngày</th><th>Hành động</th></tr></thead>
        <tbody>
          ${notifications.map((n, i) => `
            <tr>
              <td style="max-width:300px">${n.message}</td>
              <td><span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:${n.active ? '#e8f5e9' : '#f5f5f5'};color:${n.active ? '#2e7d32' : '#999'}">${n.active ? 'Đang hiển thị' : 'Tắt'}</span></td>
              <td style="font-size:12px;color:#888">${new Date(n.date).toLocaleDateString('vi-VN')}</td>
              <td>
                <button onclick="toggleNotif(${i})" style="background:${n.active ? '#ff9800' : '#4caf50'};color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;margin-right:4px">${n.active ? 'Tắt' : 'Bật'}</button>
                <button onclick="deleteNotif(${i})" style="background:#f44336;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px">Xóa</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>` : ''}
    </div>

    <div class="admin-section">
      <h3 style="margin-bottom:16px">Quản Lý Voucher</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;margin-bottom:16px">
        <div class="form-group" style="margin:0">
          <label>Mã voucher</label>
          <input type="text" id="voucherCode" placeholder="VD: SALE20" style="text-transform:uppercase">
        </div>
        <div class="form-group" style="margin:0">
          <label>Giảm (%)</label>
          <input type="number" id="voucherDisc" placeholder="VD: 20" min="1" max="100">
        </div>
        <button class="btn-save" onclick="addNewVoucher()" style="height:42px;padding:0 20px">Tạo Voucher</button>
      </div>
      <table>
        <thead><tr><th>Mã Voucher</th><th>Giảm giá</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
        <tbody id="voucherTable"></tbody>
      </table>
    </div>
  `;
  renderVoucherTable();
}

function applyBanner() {
  const val = document.getElementById('bannerTitle').value.trim();
  if (!val) return alert('Vui lòng nhập tiêu đề banner');
  localStorage.setItem('admin_bannerTitle', val);
  alert('Da luu tieu de banner!\nTieu de: ' + val);
}

function applyNotification() {
  const msg = document.getElementById('notifMsg').value.trim();
  const active = document.getElementById('notifActive').checked;
  if (!msg) return alert('Vui lòng nhập nội dung thông báo');

  // Tắt tất cả thông báo cũ nếu đang bật cái mới
  if (active) {
    notifications.forEach(n => n.active = false);
  }

  notifications.unshift({ message: msg, active: active, date: new Date().toISOString() });
  saveKey('notifications', notifications);
  alert('Da dang thong bao!\nTrang thai: ' + (active ? 'Đang hiển thị' : 'Đã tắt'));
  renderStoreManagement();
}

function toggleNotif(index) {
  // Nếu bật thông báo này thì tắt tất cả cái khác
  const willActivate = !notifications[index].active;
  if (willActivate) {
    notifications.forEach(n => n.active = false);
  }
  notifications[index].active = willActivate;
  saveKey('notifications', notifications);
  renderStoreManagement();
}

function deleteNotif(index) {
  if (confirm('Xóa thông báo này?')) {
    notifications.splice(index, 1);
    saveKey('notifications', notifications);
    renderStoreManagement();
  }
}

function addNewVoucher() {
  const code = document.getElementById('voucherCode').value.trim().toUpperCase();
  const disc = parseInt(document.getElementById('voucherDisc').value) || 0;
  if (!code) return alert('Vui lòng nhập mã voucher');
  if (disc <= 0 || disc > 100) return alert('Giảm giá phải từ 1-100%');
  if (allVouchers.some(v => v.code === code)) return alert('Mã voucher này đã tồn tại!');

  allVouchers.unshift({ code, discount: disc, active: true });
  saveKey('allVouchers', allVouchers);
  document.getElementById('voucherCode').value = '';
  document.getElementById('voucherDisc').value = '';
  renderVoucherTable();
  alert('Voucher ' + code + ' đã được tạo!');
}

function renderVoucherTable() {
  const tbody = document.getElementById('voucherTable');
  if (!tbody) return;
  if (allVouchers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px">Chưa có voucher nào</td></tr>';
    return;
  }
  tbody.innerHTML = allVouchers.map(v => `
    <tr>
      <td><strong style="color:#ee4d2d;font-size:15px">${v.code}</strong></td>
      <td><span style="background:#fff3e0;color:#e65100;padding:4px 12px;border-radius:20px;font-weight:700">-${v.discount}%</span></td>
      <td><span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:${v.active ? '#e8f5e9' : '#f5f5f5'};color:${v.active ? '#2e7d32' : '#999'}">${v.active ? 'Hoạt động' : 'Tắt'}</span></td>
      <td>
        <button onclick="toggleVoucher('${v.code}')" style="background:${v.active ? '#ff9800' : '#4caf50'};color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;margin-right:4px">${v.active ? 'Tắt' : 'Bật'}</button>
        <button onclick="deleteVoucher('${v.code}')" style="background:#f44336;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function toggleVoucher(code) {
  const v = allVouchers.find(v => v.code === code);
  if (v) { v.active = !v.active; saveKey('allVouchers', allVouchers); renderVoucherTable(); }
}

function deleteVoucher(code) {
  if (confirm('Xóa voucher ' + code + '?')) {
    allVouchers = allVouchers.filter(v => v.code !== code);
    saveKey('allVouchers', allVouchers);
    renderVoucherTable();
  }
}

// PRODUCT MANAGEMENT (Tab 2) 
function renderProductManagement() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Quản Lý Sản Phẩm';
  let rows = allProducts.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${p.icon}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #eee">
          <span>${p.name}</span>
        </div>
      </td>
      <td>${fmt(p.price)}</td>
      <td>${fmt(p.ori)}</td>
      <td><span style="background:${p.status==='active'?'#e8f5e9':'#fce4ec'};color:${p.status==='active'?'#2e7d32':'#c62828'};padding:3px 10px;border-radius:20px;font-size:12px">${p.status}</span></td>
      <td>${p.sellerOwned ? 'Người bán' : 'Hệ thống'}</td>
    </tr>
  `).join('');
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <h3 style="margin-bottom:16px">Tất cả sản phẩm (${allProducts.length})</h3>
      <table>
        <thead><tr><th>Tên sản phẩm</th><th>Giá bán</th><th>Giá gốc</th><th>Trạng thái</th><th>Nguồn</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px">Chưa có sản phẩm</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

// ORDER MANAGEMENT (Tab 3) 
function renderOrderManagement() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Quản Lý Đơn Hàng';
  const totalRevenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
  let rows = allOrders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>
        <div style="font-weight:600">${o.buyerName}</div>
        <div style="font-size:12px;color:#888">${o.buyerEmail}</div>
      </td>
      <td>
        ${o.items.map(i => `<div style="font-size:12px">• ${i.name} x${i.qty}</div>`).join('')}
      </td>
      <td style="color:#ee4d2d;font-weight:700">${fmt(o.total)}</td>
      <td style="font-size:12px">${new Date(o.date).toLocaleDateString('vi-VN')}</td>
      <td>${o.voucherCode ? `<span style="background:#e8f5e9;color:#2e7d32;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:600">${o.voucherCode} (-${fmt(o.discount)})</span>` : '<span style="color:#ccc">-</span>'}</td>
    </tr>
  `).join('');
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3>Tất cả đơn hàng (${allOrders.length})</h3>
        <div style="background:#fff7f0;border:1px solid #ee4d2d;border-radius:8px;padding:10px 18px">
          <span style="font-size:12px;color:#888">Tổng doanh thu: </span>
          <strong style="color:#ee4d2d;font-size:16px">${fmt(totalRevenue)}</strong>
        </div>
      </div>
      <table>
        <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Voucher</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Chưa có đơn hàng nào</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

// BUYER MANAGEMENT (Tab 4) 
function renderBuyerManagement() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Quản Lý Khách Hàng';
  let rows = allBuyers.map(b => {
    const buyerOrders = allOrders.filter(o => o.buyerEmail === b.email);
    const totalSpent = buyerOrders.reduce((s, o) => s + (o.total || 0), 0);
    return `
      <tr>
        <td><strong>${b.name}</strong></td>
        <td>${b.email}</td>
        <td style="font-size:12px;color:#888">${b.registerDate || '-'}</td>
        <td style="text-align:center">${buyerOrders.length}</td>
        <td style="color:#ee4d2d;font-weight:600">${fmt(totalSpent)}</td>
        <td>
          <button onclick="deleteBuyer('${b.email}')" style="background:#f44336;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:12px">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <h3 style="margin-bottom:16px">Khách hàng đã đăng ký (${allBuyers.length})</h3>
      <table>
        <thead><tr><th>Tên</th><th>Email</th><th>Ngày đăng ký</th><th style="text-align:center">Đơn hàng</th><th>Tổng chi tiêu</th><th>Hành động</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Chưa có khách hàng nào</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function deleteBuyer(email) {
  if (confirm('Xóa tài khoản khách hàng này?')) {
    allBuyers = allBuyers.filter(b => b.email !== email);
    saveKey('allBuyers', allBuyers);
    renderBuyerManagement();
  }
}

//SELLER MANAGEMENT (Tab 5) 
function renderSellerManagement() {
  loadAdminData();
  document.getElementById('adminTitle').textContent = 'Quản Lý Người Bán';
  let rows = allSellers.map(s => {
    const sellerProducts = allProducts.filter(p => p.sellerOwned && p.sellerId === s.id);
    const sellerOrders = allOrders.filter(o => o.items.some(item => sellerProducts.some(p => p.name === item.name)));
    const revenue = sellerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return `
      <tr>
        <td>
          <div style="font-weight:700;color:#333">${s.shopName}</div>
          <div style="font-size:12px;color:#888">${s.name}</div>
        </td>
        <td>${s.email}</td>
        <td style="font-size:12px;color:#888">${s.registerDate || '-'}</td>
        <td style="text-align:center">
          <span style="background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">${sellerProducts.length} sp</span>
        </td>
        <td style="color:#ee4d2d;font-weight:600">${fmt(revenue)}</td>
        <td>
          <button onclick="viewSellerProducts(${s.id})" style="background:#0066cc;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px;margin-right:5px">Xem SP</button>
          <button onclick="deleteSeller(${s.id})" style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px">Xóa TK</button>
        </td>
      </tr>
    `;
  }).join('');
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <h3 style="margin-bottom:16px">Người bán đã đăng ký (${allSellers.length})</h3>
      <table>
        <thead><tr><th>Tên Shop / Chủ shop</th><th>Email</th><th>Ngày đăng ký</th><th style="text-align:center">Sản phẩm</th><th>Doanh thu</th><th>Hành động</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Chưa có người bán nào</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function viewSellerProducts(sellerId) {
  loadAdminData();
  const seller = allSellers.find(s => s.id === sellerId);
  if (!seller) return;
  const products = allProducts.filter(p => p.sellerOwned && p.sellerId === sellerId);
  document.getElementById('adminTitle').textContent = `San pham cua ${seller.shopName}`;

  let rows = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${p.icon}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #eee">
          <span style="font-weight:500">${p.name}</span>
        </div>
      </td>
      <td style="color:#ee4d2d;font-weight:700">${fmt(p.price)}</td>
      <td style="color:#999;text-decoration:line-through">${fmt(p.ori)}</td>
      <td><span style="background:#fff3e0;color:#e65100;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700">-${p.disc}%</span></td>
      <td><span style="background:${p.status==='active'?'#e8f5e9':'#fce4ec'};color:${p.status==='active'?'#2e7d32':'#c62828'};padding:3px 10px;border-radius:20px;font-size:12px">${p.status}</span></td>
      <td>
        <button onclick="deleteSellerProduct(${p.id}, ${sellerId})" style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px">Xóa</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('adminContent').innerHTML = `
    <div class="admin-section">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <button onclick="switchTab(5)" style="padding:8px 16px;background:#666;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px">← Quay lại</button>
        <h3>Sản phẩm của shop: <span style="color:#ee4d2d">${seller.shopName}</span> (${products.length} sản phẩm)</h3>
      </div>
      <table>
        <thead><tr><th>Tên sản phẩm</th><th>Giá bán</th><th>Giá gốc</th><th>Giảm giá</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Shop này chưa có sản phẩm nào</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function deleteSellerProduct(productId, sellerId) {
  if (confirm('Xóa sản phẩm này khỏi hệ thống?')) {
    allProducts = allProducts.filter(p => p.id !== productId);
    saveKey('allProducts', allProducts);
    viewSellerProducts(sellerId);
  }
}

function deleteSeller(id) {
  const seller = allSellers.find(s => s.id === id);
  if (!seller) return;
  if (confirm(`Xóa tài khoản người bán "${seller.shopName}"?\n\nLưu ý: Sản phẩm của họ sẽ không còn thuộc seller này.`)) {
    allSellers = allSellers.filter(s => s.id !== id);
    allProducts.forEach(p => {
      if (p.sellerOwned && p.sellerId === id) p.sellerOwned = false;
    });
    saveKey('allSellers', allSellers);
    saveKey('allProducts', allProducts);
    renderSellerManagement();
  }
}

// LOGOUT 
function logoutAdmin() {
  if (confirm('Đăng xuất khỏi trang admin?')) {
    window.location.href = 'hieu.html';
  }
}

//  INIT 
window.onload = () => {
  loadAdminData();
  renderDashboard();
};
