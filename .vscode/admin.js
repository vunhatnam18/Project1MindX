// ==================== ADMIN JS - CÓ TÁC DỤNG THỰC VỚI TRANG BÁN HÀNG ====================

function renderStoreManagement() {
    document.getElementById('adminTitle').textContent = "🏪 Quản Lý Cửa Hàng";
    document.getElementById('adminContent').innerHTML = `
        <div class="admin-section">
            <h3>Chỉnh sửa giao diện trang bán hàng</h3>
            
            <div class="form-group">
                <label>Tên Website</label>
                <input type="text" id="siteName" value="Shopee Vietnam">
            </div>
            
            <div class="form-group">
                <label>Màu Chủ Đạo</label>
                <input type="color" id="mainColor" value="#ee4d2d">
            </div>
            
            <div class="form-group">
                <label>Tiêu đề Banner Chính</label>
                <input type="text" id="bannerTitle" value="Siêu Sale Tháng 4 🎉">
            </div>

            <button class="btn-save" onclick="applyChangesToMainSite()">💾 ÁP DỤNG THAY ĐỔI VÀO TRANG BÁN HÀNG</button>
        </div>
        
        <p style="margin-top:20px; color:#666; font-size:14px;">
            ⚠️ Sau khi áp dụng, hãy mở lại hoặc refresh trang bán hàng (index.html) để thấy thay đổi.
        </p>
    `;
}

function applyChangesToMainSite() {
    const newName = document.getElementById('siteName').value.trim();
    const newColor = document.getElementById('mainColor').value;
    const newBanner = document.getElementById('bannerTitle').value.trim();

    if (!newName) {
        alert("Vui lòng nhập tên website!");
        return;
    }

    // Lưu vào localStorage để trang bán hàng đọc được
    localStorage.setItem('admin_siteName', newName);
    localStorage.setItem('admin_mainColor', newColor);
    localStorage.setItem('admin_bannerTitle', newBanner);

    alert(`✅ ĐÃ ÁP DỤNG THAY ĐỔI!\n\nTên website: ${newName}\nMàu chủ đạo: ${newColor}\nBanner: ${newBanner}\n\nHãy mở hoặc refresh trang bán hàng để xem kết quả.`);
}

// Các hàm khác giữ nguyên (Dashboard, Product Management, ...)
function renderDashboard() {
    document.getElementById('adminTitle').textContent = "📊 Tổng Quan Hệ Thống";
    document.getElementById('adminContent').innerHTML = `
        <div class="admin-section">
            <h3>Thống kê hệ thống</h3>
            <p style="font-size:18px; margin:15px 0;">
                Tổng sản phẩm: <strong>${allProducts.length}</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
                Tổng đơn hàng: <strong>45,890</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
                Doanh thu tháng: <strong>15.68 tỷ ₫</strong>
            </p>
        </div>
    `;
}

function renderProductManagement() {
    document.getElementById('adminTitle').textContent = "📦 Quản Lý Sản Phẩm";
    let html = `<div class="admin-section">
        <button onclick="addNewProduct()" class="btn-save" style="margin-bottom:15px;">➕ Thêm Sản Phẩm Mới</button>
        <table>
            <thead><tr><th>Tên sản phẩm</th><th>Giá bán</th><th>Danh mục</th><th>Hành động</th></tr></thead>
            <tbody>`;

    allProducts.forEach(p => {
        html += `<tr>
            <td>${p.name}</td>
            <td>${fmt(p.price)}</td>
            <td>${p.cat}</td>
            <td>
                <button onclick="editProduct(${p.id})" style="background:#4CAF50;color:white;border:none;padding:6px 12px;border-radius:5px;">Sửa</button>
                <button onclick="deleteProduct(${p.id})" style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:5px;margin-left:8px;">Xóa</button>
            </td>
        </tr>`;
    });

    html += `</tbody></table></div>`;
    document.getElementById('adminContent').innerHTML = html;
}

function addNewProduct() { alert("Chức năng thêm sản phẩm sẽ được mở rộng sau"); }
function editProduct(id) { alert(`Chỉnh sửa sản phẩm ID: ${id}`); }
function deleteProduct(id) {
    if (confirm("Xóa sản phẩm này?")) {
        allProducts = allProducts.filter(p => p.id !== id);
        alert("Đã xóa!");
        renderProductManagement();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.admin-menu a')[tab].classList.add('active');

    if (tab === 0) renderDashboard();
    if (tab === 1) renderStoreManagement();
    if (tab === 2) renderProductManagement();
    if (tab === 3 || tab === 4 || tab === 5) {
        document.getElementById('adminContent').innerHTML = `
            <div class="admin-section">
                <h3>Chức năng đang phát triển</h3>
                <p>Tab này sẽ được hoàn thiện trong phiên bản sau.</p>
            </div>`;
    }
}

function logoutAdmin() {
    if (confirm("Đăng xuất khỏi Admin?")) {
        window.location.href = "index.html";
    }
}

// Khởi chạy
window.onload = () => {
    renderDashboard();
};