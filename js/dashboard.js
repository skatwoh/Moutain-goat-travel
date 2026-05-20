// Dashboard Management Module
// Handles user bookings history, wishlists, host metrics, and SVG chart rendering.

const MGTDashboard = {
  init() {
    this.bindEvents();
    this.renderBookings();
    this.renderWishlist();
    this.renderStats();
  },

  bindEvents() {
    // Menu tab switching
    const menuButtons = document.querySelectorAll('.dash-menu-item');
    menuButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(targetTab, e.currentTarget);
      });
    });

    // Handle listing type toggle (stays vs tours show/hide difficulty or guests fields)
    const typeSelect = document.getElementById('list-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        const difficultyGroup = document.getElementById('group-difficulty');
        const guestsGroup = document.getElementById('group-guests');
        if (e.target.value === "tour") {
          difficultyGroup.style.display = "block";
          guestsGroup.style.display = "none";
        } else {
          difficultyGroup.style.display = "none";
          guestsGroup.style.display = "block";
        }
      });
    }

    // Submit new listing form
    const listingForm = document.getElementById('new-listing-form');
    if (listingForm) {
      listingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createNewListing();
      });
    }
  },

  switchTab(tabId, buttonElement) {
    // Reset active buttons
    document.querySelectorAll('.dash-menu-item').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    // Reset active panels
    document.querySelectorAll('.dash-content-block').forEach(panel => panel.classList.remove('active'));
    
    // Show selected panel
    const targetPanel = document.getElementById(`dash-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Special renders when switching
    if (tabId === 'user-bookings') this.renderBookings();
    if (tabId === 'user-wishlist') this.renderWishlist();
    if (tabId === 'host-stats') this.renderStats();
  },

  renderBookings() {
    const container = document.getElementById('user-bookings-container');
    if (!container) return;

    const bookings = window.MountainGoatDB.getBookings();

    if (bookings.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted); border: 2px dashed var(--border); border-radius: var(--radius-md);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; margin-bottom:15px; opacity:0.5;">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Bạn chưa có đặt chỗ nào. Hãy lựa chọn homestay hoặc tour yêu thích nhé!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => {
      let statusClass = "upcoming";
      let statusText = "Chờ khởi hành";
      let cancelButton = "";

      if (b.status === "cancelled") {
        statusClass = "cancelled";
        statusText = "Đã Hủy";
      } else if (b.status === "completed") {
        statusClass = "completed";
        statusText = "Đã hoàn thành";
      } else {
        // Can only cancel upcoming bookings
        cancelButton = `<button class="btn-secondary" onclick="MGTDashboard.cancelBooking('${b.id}')" style="padding: 6px 12px; font-size: 0.8rem; color: var(--danger); border-color: var(--danger);">Hủy Đặt</button>`;
      }

      const totalVal = window.MGTBooking ? window.MGTBooking.formatVND(b.calculation.total) : `${b.calculation.total}đ`;
      const dateRange = b.itemType === 'stay' 
        ? `${new Date(b.params.startDate).toLocaleDateString('vi-VN')} - ${new Date(b.params.endDate).toLocaleDateString('vi-VN')}`
        : `Ngày đi: ${b.params.startDate}`;

      return `
        <div class="history-card" id="booking-card-${b.id}">
          <img src="${b.image}" alt="${b.itemName}" class="history-item-img">
          <div class="history-card-details">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <h4 style="margin-top: 6px;">${b.itemName}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              <span>${dateRange}</span> | <strong>${b.params.guests} khách</strong>
            </p>
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-top: 4px;">
              Tổng tiền: ${totalVal}
            </p>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
            <span style="font-size:0.75rem; color:var(--text-muted);">Mã đơn: <strong>${b.id}</strong></span>
            ${cancelButton}
          </div>
        </div>
      `;
    }).join('');
  },

  cancelBooking(bookingId) {
    if (confirm("Bạn có chắc chắn muốn hủy đặt chỗ này không?")) {
      const success = window.MountainGoatDB.cancelBooking(bookingId);
      if (success) {
        if (window.MGTBooking) {
          window.MGTBooking.showToast("Hủy đặt phòng thành công!", "success");
        }
        this.renderBookings();
        this.renderStats();
      } else {
        if (window.MGTBooking) {
          window.MGTBooking.showToast("Không tìm thấy đơn hàng!", "error");
        }
      }
    }
  },

  renderWishlist() {
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

    container.innerHTML = wishlistIds.map(id => {
      const item = window.MountainGoatDB.getItemById(id);
      if (!item) return '';
      
      const priceVal = window.MGTBooking ? window.MGTBooking.formatVND(item.price) : `${item.price}đ`;
      const priceUnit = item.type === 'stay' ? '/đêm' : '/khách';
      const badgeClass = item.type === 'stay' ? 'stay' : 'tour';
      const badgeLabel = item.type === 'stay' ? 'Homestay' : 'Tour';

      return `
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
    }).join('');
  },

  toggleWishlistItem(itemId, event) {
    if (event) event.stopPropagation();
    window.MountainGoatDB.toggleWishlist(itemId);
    this.renderWishlist();
    if (window.MGTApp) {
      window.MGTApp.renderStays();
      window.MGTApp.renderTours();
      window.MGTApp.renderFeatured();
    }
  },

  renderStats() {
    const bookings = window.MountainGoatDB.getBookings() || [];
    
    // Filter active bookings (exclude cancelled)
    const activeBookings = bookings.filter(b => b.status !== "cancelled");
    
    // Calculate total revenue
    const revenue = activeBookings.reduce((sum, b) => sum + b.calculation.total, 0);

    // Render Stats values
    const revEl = document.getElementById('host-stat-revenue');
    const bookingsEl = document.getElementById('host-stat-bookings');
    
    if (revEl && bookingsEl) {
      revEl.innerText = window.MGTBooking ? window.MGTBooking.formatVND(revenue) : `${revenue}đ`;
      bookingsEl.innerText = activeBookings.length;
    }

    // Draw SVG Chart
    const chartSvg = document.getElementById('revenue-chart');
    if (!chartSvg) return;

    // Define last 7 days names (in Vietnamese)
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    
    // Mock baseline values based on total bookings (add active bookings revenue dynamically into the chart elements)
    // To make it look dynamic and interesting, let's distribute revenue or use baseline values
    let chartValues = [4.5, 3.2, 5.8, 4.0, 7.5, 12.0, 9.5]; // Baseline in million VND
    
    // If there is real revenue, distribute it or add weight to weekend days
    if (revenue > 0) {
      const revenueMillion = revenue / 1000000;
      // Distribute a portion of real revenue into the weekend/latest days of chart values
      chartValues[5] += revenueMillion * 0.6; // Saturday gets 60%
      chartValues[6] += revenueMillion * 0.4; // Sunday gets 40%
    }

    // Dimensions
    const svgWidth = 600;
    const svgHeight = 250;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // Find Max Value for scaling
    const maxVal = Math.max(...chartValues, 10);
    const yMax = Math.ceil(maxVal / 5) * 5; // Round to nearest multiple of 5

    // Build SVG Elements
    let svgContent = `
      <defs>
        <!-- Bar Gradient -->
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--primary)" />
        </linearGradient>
        <!-- Background Grid Style -->
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

    // Draw Y Axis grid lines & labels (4 subdivisions)
    for (let i = 0; i <= 4; i++) {
      const yVal = (yMax / 4) * i;
      const yPos = padding.top + chartHeight - (chartHeight * (yVal / yMax));
      
      // Horizontal grid lines
      svgContent += `<line x1="${padding.left}" y1="${yPos}" x2="${svgWidth - padding.right}" y2="${yPos}" class="grid-line" />`;
      // Y labels
      svgContent += `<text x="${padding.left - 10}" y="${yPos + 4}" class="axis-label" text-anchor="end">${yVal}M</text>`;
    }

    // Draw bars & X labels
    const barWidth = 35;
    const colWidth = chartWidth / chartValues.length;

    chartValues.forEach((val, idx) => {
      const xPos = padding.left + (colWidth * idx) + (colWidth - barWidth) / 2;
      const valHeight = chartHeight * (val / yMax);
      const yPos = padding.top + chartHeight - valHeight;

      // Group for interactions
      svgContent += `
        <g class="bar-group">
          <!-- Text label on hover -->
          <text x="${xPos + barWidth/2}" y="${yPos - 8}" class="value-label">${val.toFixed(1)} Tr</text>
          <!-- Rounded Rectangle Bar -->
          <rect x="${xPos}" y="${yPos}" width="${barWidth}" height="${valHeight}" rx="6" ry="6" fill="url(#bar-grad)" class="bar-rect" />
          <!-- X Axis Label -->
          <text x="${xPos + barWidth/2}" y="${svgHeight - 15}" class="axis-label" text-anchor="middle">${days[idx]}</text>
        </g>
      `;
    });

    // Draw base line
    svgContent += `<line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${svgWidth - padding.right}" y2="${padding.top + chartHeight}" stroke="var(--border)" stroke-width="2" />`;

    chartSvg.innerHTML = svgContent;
  },

  createNewListing() {
    const type = document.getElementById('list-type').value;
    const category = document.getElementById('list-category').value.trim();
    const name = document.getElementById('list-name').value.trim();
    const price = parseInt(document.getElementById('list-price').value, 10);
    const location = document.getElementById('list-location').value.trim();
    const image = document.getElementById('list-image').value;
    const desc = document.getElementById('list-desc').value.trim();

    if (!category || !name || !price || !location || !desc) {
      if (window.MGTBooking) {
        window.MGTBooking.showToast("Vui lòng nhập đầy đủ các trường!", "error");
      }
      return;
    }

    // Build listing object
    const newId = `custom-${type}-${Date.now().toString().slice(-4)}`;
    const newListing = {
      id: newId,
      name: name,
      category: category,
      type: type,
      location: location,
      price: price,
      rating: 5.0, // default rating
      reviewsCount: 0,
      description: desc,
      images: [image],
      owner: {
        name: "Chủ nhà Tôi",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Thành viên mới"
      },
      featured: false
    };

    if (type === "stay") {
      newListing.maxGuests = parseInt(document.getElementById('list-guests').value, 10) || 2;
      newListing.amenities = ["Wi-Fi miễn phí", "Điều hòa nhiệt độ", "Bếp chung", "Tivi truyền hình cáp"];
    } else {
      newListing.difficulty = document.getElementById('list-difficulty').value;
      newListing.inclusions = ["Vé tham quan chính", "Hướng dẫn viên du lịch", "Bảo hiểm du lịch cơ bản"];
      newListing.departureDates = ["Hàng tuần", "Cuối tuần"];
      newListing.itinerary = [
        { day: 1, title: "Khởi hành & Nhận đoàn", details: "Xe đón đoàn tại trung tâm và di chuyển đến địa điểm khám phá." },
        { day: 2, title: "Trải nghiệm & Trở về", details: "Tham quan đỉnh cao, ăn tối bản địa và xe tiễn đoàn về lại điểm hẹn ban đầu." }
      ];
    }

    // Save
    window.MountainGoatDB.addListing(newListing);

    if (window.MGTBooking) {
      window.MGTBooking.showToast(`Đăng tin ${type === 'stay' ? 'homestay' : 'tour'} mới thành công!`, "success");
    }

    // Reset Form
    document.getElementById('new-listing-form').reset();

    // Trigger tab redirection & refresh listings views
    setTimeout(() => {
      if (window.MGTApp) {
        window.MGTApp.renderStays();
        window.MGTApp.renderTours();
        window.MGTApp.renderFeatured();
      }
      
      // Redirect to section listings
      window.location.hash = `#${type}s`;
    }, 400);
  }
};

window.MGTDashboard = MGTDashboard;
document.addEventListener('DOMContentLoaded', () => MGTDashboard.init());
