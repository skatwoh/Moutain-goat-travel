// Dashboard Management Module
// Handles user wishlists, host metrics, and admin management.

const MGTDashboard = {
  eventsBound: false,

  async init() {
    this.checkAccess();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
    await this.renderWishlist();
    await this.renderStats();
    await this.renderAdmins();
  },

  checkAccess() {
    const user = window.MountainGoatDB.getCurrentUser();
    const hash = window.location.hash;
    if (hash === '#dashboard' && !user) {
      window.location.hash = '#home';
      if (window.MGTBooking) window.MGTBooking.showToast("Vui lòng đăng nhập để truy cập trang này!", "error");
    }
  },

  bindEvents() {
    const menuButtons = document.querySelectorAll('.dash-menu-item');
    menuButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        await this.switchTab(targetTab, e.currentTarget);
      });
    });

    const typeSelect = document.getElementById('list-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        const difficultyGroup = document.getElementById('group-difficulty');
        const guestsGroup = document.getElementById('group-guests');
        if (e.target.value === "tour") {
          if (difficultyGroup) difficultyGroup.style.display = "block";
          if (guestsGroup) guestsGroup.style.display = "none";
        } else {
          if (difficultyGroup) difficultyGroup.style.display = "none";
          if (guestsGroup) guestsGroup.style.display = "block";
        }
      });
    }

    const listingForm = document.getElementById('new-listing-form');
    if (listingForm) {
      listingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createNewListing();
      });
    }

    const createAdminForm = document.getElementById('create-admin-form');
    if (createAdminForm) {
      createAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateAdmin();
      });
    }
  },

  async switchTab(tabId, buttonElement) {
    document.querySelectorAll('.dash-menu-item').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    document.querySelectorAll('.dash-content-block').forEach(panel => panel.classList.remove('active'));
    
    const targetPanel = document.getElementById(`dash-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    if (tabId === 'user-wishlist') await this.renderWishlist();
    if (tabId === 'host-stats') await this.renderStats();
    if (tabId === 'admin-users') await this.renderAdmins();
  },

  async renderWishlist() {
    const container = document.getElementById('user-wishlist-container');
    if (!container) return;

    const wishlistIds = window.MountainGoatDB.getWishlist();

    if (wishlistIds.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); border: 2px dashed var(--border); border-radius: var(--radius-md);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; margin-bottom:15px; opacity:0.5;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>Chưa có mục yêu thích nào. Hãy nhấp vào trái tim tại trang sản phẩm!</p>
        </div>
      `;
      return;
    }

    let html = '';
    for (const id of wishlistIds) {
      const item = await window.MountainGoatDB.getItemById(id);
      if (!item) continue;
      
      const priceVal = window.MGTBooking ? window.MGTBooking.formatVND(item.price) : `${item.price}đ`;
      const priceUnit = item.type === 'stay' ? '/đêm' : '/khách';
      const badgeLabel = item.type === 'stay' ? 'Homestay' : 'Tour';

      html += `
        <div class="listing-card">
          <div class="card-img-wrapper">
            <span class="badge-tag">${badgeLabel}</span>
            <img src="${item.images[0]}" alt="${item.name}" class="card-img">
            <button class="wishlist-btn active" onclick="MGTDashboard.toggleWishlistItem('${item.id}', event)">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="card-category">${item.category}</span>
              <span class="card-rating">★ ${item.rating}</span>
            </div>
            <h3 class="card-title">${item.name}</h3>
            <div class="card-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${item.location}</span>
            </div>
            <div class="card-footer">
              <div class="card-price">
                <span class="price-label">Giá chỉ từ</span>
                <span class="price-amt">${priceVal}<span class="price-unit">${priceUnit}</span></span>
              </div>
              <button class="btn-primary" onclick="window.MGTApp.openDetail('${item.id}')" style="padding: 8px 16px; font-size: 0.85rem;">Chi tiết</button>
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  async toggleWishlistItem(itemId, event) {
    if (event) event.stopPropagation();
    window.MountainGoatDB.toggleWishlist(itemId);
    await this.renderWishlist();
    if (window.MGTApp) {
      await window.MGTApp.renderStays();
      await window.MGTApp.renderTours();
      await window.MGTApp.renderFeatured();
    }
  },

  async renderStats() {
    // Stats are currently based on existing listings as a mock for real "interest"
    const stays = await window.MountainGoatDB.getAllStays();
    const tours = await window.MountainGoatDB.getAllTours();
    const all = [...stays, ...tours];

    const bookingsEl = document.getElementById('host-stat-bookings');
    if (bookingsEl) {
      bookingsEl.innerText = all.length;
    }

    const chartSvg = document.getElementById('revenue-chart');
    if (!chartSvg) return;

    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    let chartValues = [4.5, 3.2, 5.8, 4.0, 7.5, 12.0, 9.5];

    const svgWidth = 600;
    const svgHeight = 250;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const maxVal = Math.max(...chartValues, 10);
    const yMax = Math.ceil(maxVal / 5) * 5;

    let svgContent = `
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--primary)" />
        </linearGradient>
        <style>
          .grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 4,4; }
          .axis-label { font-size: 11px; fill: var(--text-muted); font-family: var(--font-sans); }
          .bar-rect { transition: height 0.5s ease, y 0.5s ease; cursor: pointer; }
          .bar-rect:hover { fill: var(--accent); }
          .value-label { font-size: 10px; font-weight: 700; fill: var(--text); font-family: var(--font-display); opacity: 0; transition: opacity 0.2s; text-anchor: middle;}
          .bar-group:hover .value-label { opacity: 1; }
        </style>
      </defs>
    `;

    for (let i = 0; i <= 4; i++) {
      const yVal = (yMax / 4) * i;
      const yPos = padding.top + chartHeight - (chartHeight * (yVal / yMax));
      svgContent += `<line x1="${padding.left}" y1="${yPos}" x2="${svgWidth - padding.right}" y2="${yPos}" class="grid-line" />`;
      svgContent += `<text x="${padding.left - 10}" y="${yPos + 4}" class="axis-label" text-anchor="end">${yVal}M</text>`;
    }

    const barWidth = 35;
    const colWidth = chartWidth / chartValues.length;

    chartValues.forEach((val, idx) => {
      const xPos = padding.left + (colWidth * idx) + (colWidth - barWidth) / 2;
      const valHeight = chartHeight * (val / yMax);
      const yPos = padding.top + chartHeight - valHeight;

      svgContent += `
        <g class="bar-group">
          <text x="${xPos + barWidth/2}" y="${yPos - 8}" class="value-label">${val.toFixed(1)} Tr</text>
          <rect x="${xPos}" y="${yPos}" width="${barWidth}" height="${valHeight}" rx="6" ry="6" fill="url(#bar-grad)" class="bar-rect" />
          <text x="${xPos + barWidth/2}" y="${svgHeight - 15}" class="axis-label" text-anchor="middle">${days[idx]}</text>
        </g>
      `;
    });

    svgContent += `<line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${svgWidth - padding.right}" y2="${padding.top + chartHeight}" stroke="var(--border)" stroke-width="2" />`;
    chartSvg.innerHTML = svgContent;
  },

  async createNewListing() {
    const user = window.MountainGoatDB.getCurrentUser();
    if (!user) {
      if (window.MGTBooking) window.MGTBooking.showToast("Bạn cần đăng nhập để thực hiện chức năng này!", "error");
      return;
    }

    const type = document.getElementById('list-type').value;
    const category = document.getElementById('list-category').value.trim();
    const name = document.getElementById('list-name').value.trim();
    const price = parseInt(document.getElementById('list-price').value, 10);
    const location = document.getElementById('list-location').value.trim();
    const image = document.getElementById('list-image').value;
    const desc = document.getElementById('list-desc').value.trim();

    if (!category || !name || !price || !location || !desc) {
      if (window.MGTBooking) window.MGTBooking.showToast("Vui lòng nhập đầy đủ các trường!", "error");
      return;
    }

    const newListing = {
      id: `custom-${type}-${Date.now().toString().slice(-4)}`,
      name: name,
      category: category,
      type: type,
      location: location,
      price: price,
      rating: 5.0,
      reviewsCount: 0,
      description: desc,
      images: [image],
      owner: {
        name: user.name,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        badge: user.role === 'superadmin' ? "Quản trị viên" : "Chủ nhà"
      },
      featured: false,
      authorId: user.id
    };

    if (type === "stay") {
      newListing.maxGuests = parseInt(document.getElementById('list-guests').value, 10) || 2;
      newListing.amenities = ["Wi-Fi miễn phí", "Điều hòa nhiệt độ", "Bếp chung", "Tivi truyền hình cáp"];
    } else {
      newListing.difficulty = document.getElementById('list-difficulty').value;
      newListing.inclusions = ["Vé tham quan chính", "Hướng dẫn viên du lịch", "Bảo hiểm du lịch cơ bản"];
      newListing.departureDates = ["Hàng tuần", "Cuối tuần"];
      newListing.itinerary = [
        { day: 1, title: "Khởi hành", details: "Xe đón đoàn tại trung tâm." },
        { day: 2, title: "Trải nghiệm", details: "Tham quan và khám phá." }
      ];
    }

    await window.MountainGoatDB.addListing(newListing);

    if (window.MGTBooking) window.MGTBooking.showToast(`Đăng tin thành công!`, "success");
    document.getElementById('new-listing-form').reset();

    setTimeout(async () => {
      if (window.MGTApp) {
        await window.MGTApp.renderStays();
        await window.MGTApp.renderTours();
        await window.MGTApp.renderFeatured();
      }
      window.location.hash = `#${type}s`;
    }, 400);
  },

  async handleCreateAdmin() {
    const name = document.getElementById('admin-name').value;
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
      await window.MountainGoatDB.createAdmin({ name, email, password });
      if (window.MGTBooking) window.MGTBooking.showToast("Tạo tài khoản admin thành công!", "success");
      document.getElementById('create-admin-form').reset();
      await this.renderAdmins();
    } catch (error) {
      if (window.MGTBooking) window.MGTBooking.showToast(error.message, "error");
    }
  },

  async renderAdmins() {
    const container = document.getElementById('admin-users-list');
    if (!container) return;

    const users = await window.MountainGoatDB.getUsers();

    if (!users || users.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">Chưa có tài khoản nào hoặc không có quyền truy cập.</p>`;
      return;
    }

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="text-align: left; border-bottom: 2px solid var(--border);">
            <th style="padding: 10px;">Họ tên</th>
            <th style="padding: 10px;">Email</th>
            <th style="padding: 10px;">Vai trò</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 10px;">${u.name}</td>
              <td style="padding: 10px;">${u.email}</td>
              <td style="padding: 10px;"><span class="status-badge ${u.role === 'superadmin' ? 'upcoming' : 'completed'}">${u.role}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
};

window.MGTDashboard = MGTDashboard;
document.addEventListener('DOMContentLoaded', () => MGTDashboard.init());
