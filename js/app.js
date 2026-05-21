// Main Application Controller for Mountain Goat Travel (MGT)
// Controls routing, listing renders, filters, details modal, review submittals, and theme toggle.

const MGTApp = {
  currentProduct: null, // Stores active details item
  reviewSelectedStars: 5, // Default review score

  init() {
    this.initTheme();
    this.initRouting();
    this.bindEvents();
    this.updateAuthUI();
    
    // Core renders
    this.renderFeatured();
    this.renderStays();
    this.renderTours();
  },

  initTheme() {
    const savedTheme = localStorage.getItem('mgt_theme') || 'light';
    const body = document.body;
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      body.classList.remove('dark-mode');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  },

  toggleTheme() {
    const body = document.body;
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('mgt_theme', isDark ? 'dark' : 'light');

    if (isDark) {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      if (window.MGTBooking) window.MGTBooking.showToast("Đã chuyển sang chế độ tối", "info");
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      if (window.MGTBooking) window.MGTBooking.showToast("Đã chuyển sang chế độ sáng", "info");
    }
  },

  initRouting() {
    // Router based on url hash changes
    const handleRoute = () => {
      const hash = window.location.hash || '#home';
      const sections = ['home', 'stays', 'tours', 'dashboard'];
      const target = hash.replace('#', '');

      if (!sections.includes(target)) return;

      // Update active section visibility
      sections.forEach(s => {
        const secEl = document.getElementById(`section-${s}`);
        if (secEl) secEl.classList.remove('active');
      });

      const activeSec = document.getElementById(`section-${target}`);
      if (activeSec) {
        activeSec.classList.add('active');
        // Scroll header threshold
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update header links active style
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === target) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call once on start
  },

  bindEvents() {
    // Header scroll background effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Auth Button click
    document.getElementById('host-mode-btn').addEventListener('click', () => {
      const user = window.MountainGoatDB.getCurrentUser();
      if (user) {
        window.location.hash = '#dashboard';
      } else {
        document.getElementById('login-modal').classList.add('active');
      }
    });

    // Close Modals events
    document.getElementById('btn-close-detail').addEventListener('click', () => {
      document.getElementById('detail-modal').classList.remove('active');
    });
    document.getElementById('btn-close-login').addEventListener('click', () => {
      document.getElementById('login-modal').classList.remove('active');
    });
    document.getElementById('btn-close-contact').addEventListener('click', () => {
      document.getElementById('contact-modal').classList.remove('active');
    });
    document.getElementById('btn-close-contact-action').addEventListener('click', () => {
      document.getElementById('contact-modal').classList.remove('active');
    });

    // Stays filter listeners
    const stayLoc = document.getElementById('stay-loc-filter');
    const stayPrice = document.getElementById('stay-price-filter');
    const staySort = document.getElementById('stay-sort');

    if (stayLoc) stayLoc.addEventListener('change', () => this.renderStays());
    if (stayPrice) {
      stayPrice.addEventListener('input', (e) => {
        document.getElementById('stay-price-val').innerText = parseInt(e.target.value).toLocaleString('vi-VN') + 'đ';
        this.renderStays();
      });
    }
    if (staySort) staySort.addEventListener('change', () => this.renderStays());

    // Tours filter listeners
    const tourDiff = document.getElementById('tour-diff-filter');
    const tourPrice = document.getElementById('tour-price-filter');
    const tourSort = document.getElementById('tour-sort');

    if (tourDiff) tourDiff.addEventListener('change', () => this.renderTours());
    if (tourPrice) {
      tourPrice.addEventListener('input', (e) => {
        document.getElementById('tour-price-val').innerText = parseInt(e.target.value).toLocaleString('vi-VN') + 'đ';
        this.renderTours();
      });
    }
    if (tourSort) tourSort.addEventListener('change', () => this.renderTours());

    // Hero Widget Search Switch tab (stays vs tours UI dates fields config)
    const heroTabs = document.querySelectorAll('.search-tab');
    heroTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        heroTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const type = e.target.getAttribute('data-type');
        const dateField = document.getElementById('search-date-field');
        
        if (type === 'tour') {
          dateField.style.display = 'none';
        } else {
          dateField.style.display = 'flex';
        }
      });
    });

    // Hero Search Action Button
    document.getElementById('btn-hero-search').addEventListener('click', () => this.executeHeroSearch());


    // Trigger Checkout Button
    document.getElementById('btn-trigger-checkout').addEventListener('click', () => this.triggerCheckout());

    // Reviews Star Rating selections inside Modal
    const starSelector = document.getElementById('star-rating-selector');
    if (starSelector) {
      const stars = starSelector.querySelectorAll('.star-input');
      stars.forEach(star => {
        star.addEventListener('click', (e) => {
          const rating = parseInt(e.target.getAttribute('data-rating'), 10);
          this.reviewSelectedStars = rating;
          stars.forEach(s => {
            const r = parseInt(s.getAttribute('data-rating'), 10);
            if (r <= rating) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        });
      });
    }

    // Submit review form
    document.getElementById('btn-submit-review').addEventListener('click', () => this.submitReview());

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
  },

  executeHeroSearch() {
    const activeTab = document.querySelector('.search-tab.active');
    const type = activeTab ? activeTab.getAttribute('data-type') : 'stay';
    const destination = document.getElementById('search-dest').value.trim();
    
    if (type === 'stay') {
      window.location.hash = '#stays';
      // Sync destination select if matches any location, else trigger search filters
      const filterLoc = document.getElementById('stay-loc-filter');
      
      let found = false;
      for (let i = 0; i < filterLoc.options.length; i++) {
        if (destination && filterLoc.options[i].value.toLowerCase().includes(destination.toLowerCase())) {
          filterLoc.value = filterLoc.options[i].value;
          found = true;
          break;
        }
      }
      if (!found) filterLoc.value = 'all';
      
      filterLoc.dispatchEvent(new Event('change'));
    } else {
      window.location.hash = '#tours';
      // Sync and filter
      const diffLoc = document.getElementById('tour-diff-filter');
      diffLoc.value = 'all';
      diffLoc.dispatchEvent(new Event('change'));
    }

    if (window.MGTBooking) {
      window.MGTBooking.showToast(`Đang tìm kiếm ${type === 'stay' ? 'Homestay' : 'Tour'} tại "${destination || 'Tất cả địa điểm'}"...`, "info");
    }
  },

  renderFeatured() {
    const grid = document.getElementById('home-featured-grid');
    if (!grid) return;

    const stays = window.MountainGoatDB.getAllStays().filter(s => s.featured);
    const tours = window.MountainGoatDB.getAllTours().filter(t => t.featured);
    
    // Combine features
    const allFeatured = [...stays, ...tours].slice(0, 3);
    
    grid.innerHTML = allFeatured.map(item => this.createCardHTML(item)).join('');
  },

  renderStays() {
    const grid = document.getElementById('stays-list-grid');
    if (!grid) return;

    let stays = window.MountainGoatDB.getAllStays();

    // 1. Location filter
    const loc = document.getElementById('stay-loc-filter').value;
    if (loc !== "all") {
      stays = stays.filter(s => s.location.includes(loc));
    }

    // 2. Price filter
    const price = parseInt(document.getElementById('stay-price-filter').value, 10);
    stays = stays.filter(s => s.price <= price);

    // 3. Sorting
    const sort = document.getElementById('stay-sort').value;
    if (sort === "price-asc") {
      stays.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      stays.sort((a, b) => b.price - a.price);
    } else {
      stays.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = stays.length > 0 
      ? stays.map(s => this.createCardHTML(s)).join('')
      : `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">Không tìm thấy phòng phù hợp bộ lọc của bạn.</div>`;
  },

  renderTours() {
    const grid = document.getElementById('tours-list-grid');
    if (!grid) return;

    let tours = window.MountainGoatDB.getAllTours();

    // 1. Difficulty filter
    const diff = document.getElementById('tour-diff-filter').value;
    if (diff !== "all") {
      tours = tours.filter(t => t.difficulty === diff);
    }

    // 2. Price filter
    const price = parseInt(document.getElementById('tour-price-filter').value, 10);
    tours = tours.filter(t => t.price <= price);

    // 3. Sorting
    const sort = document.getElementById('tour-sort').value;
    if (sort === "price-asc") {
      tours.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      tours.sort((a, b) => b.price - a.price);
    } else {
      tours.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = tours.length > 0
      ? tours.map(t => this.createCardHTML(t)).join('')
      : `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">Không tìm thấy tour phù hợp bộ lọc của bạn.</div>`;
  },

  createCardHTML(item) {
    const priceVal = window.MGTBooking ? window.MGTBooking.formatVND(item.price) : `${item.price}đ`;
    const priceUnit = item.type === 'stay' ? '/đêm' : '/khách';
    const badgeLabel = item.type === 'stay' ? 'Homestay' : 'Tour';
    const wishlistIds = window.MountainGoatDB.getWishlist();
    const isWishlisted = wishlistIds.includes(item.id) ? 'active' : '';

    let difficultyBadge = '';
    if (item.type === 'tour') {
      let diffClass = 'easy';
      if (item.difficulty === 'Vừa') diffClass = 'medium';
      if (item.difficulty === 'Khó') diffClass = 'hard';
      difficultyBadge = `<span class="badge-difficulty ${diffClass}">${item.difficulty}</span>`;
    }

    return `
      <div class="listing-card">
        <div class="card-img-wrapper">
          <span class="badge-tag">${badgeLabel}</span>
          ${difficultyBadge}
          <img src="${item.images[0]}" alt="${item.name}" class="card-img">
          <button class="wishlist-btn ${isWishlisted}" onclick="MGTApp.toggleWishlist('${item.id}', event)">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="card-category">${item.category}</span>
            <span class="card-rating">★ ${item.rating} (${item.reviewsCount})</span>
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
            <button class="btn-primary" onclick="MGTApp.openDetail('${item.id}')">Chi Tiết</button>
          </div>
        </div>
      </div>
    `;
  },

  toggleWishlist(itemId, event) {
    if (event) event.stopPropagation();
    const isAdded = window.MountainGoatDB.toggleWishlist(itemId);
    
    if (window.MGTBooking) {
      window.MGTBooking.showToast(isAdded ? "Đã thêm vào mục yêu thích!" : "Đã xóa khỏi mục yêu thích!", "success");
    }

    // Refresh UI elements
    this.renderStays();
    this.renderTours();
    this.renderFeatured();
    if (window.MGTDashboard) window.MGTDashboard.renderWishlist();
  },

  openDetail(itemId) {
    const item = window.MountainGoatDB.getItemById(itemId);
    if (!item) return;

    this.currentProduct = item;

    // Open detail modal UI values
    document.getElementById('modal-detail-title').innerText = item.name;
    document.getElementById('modal-detail-desc').innerText = item.description;
    
    const ratingText = `★ ${item.rating} (${item.reviewsCount} đánh giá)`;
    document.getElementById('modal-rev-avg').innerText = ratingText;
    document.getElementById('modal-rev-count').innerText = item.reviewsCount;

    document.getElementById('modal-detail-loc').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px; height:16px;"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>${item.location}</span>
    `;

    // Reset Review input form
    document.getElementById('review-comment-input').value = '';
    
    // Reset star rating UI selection back to 5
    this.reviewSelectedStars = 5;
    const stars = document.getElementById('star-rating-selector').querySelectorAll('.star-input');
    stars.forEach(s => s.classList.add('active'));

    // Sidebar price display config
    const formattedPrice = window.MGTBooking ? window.MGTBooking.formatVND(item.price) : `${item.price}đ`;
    document.getElementById('modal-sidebar-price').innerText = formattedPrice;
    document.getElementById('modal-sidebar-unit').innerText = item.type === 'stay' ? '/đêm' : '/khách';

    // Gallery configuration
    const mainImg = document.getElementById('modal-gallery-img');
    mainImg.src = item.images[0];
    
    const thumbsContainer = document.getElementById('modal-gallery-thumbs');
    thumbsContainer.innerHTML = item.images.map((img, idx) => `
      <img src="${img}" alt="thumbnail" class="thumb ${idx === 0 ? 'active' : ''}" onclick="MGTApp.changeMainGalleryImage('${img}', this)">
    `).join('');

    // Toggle stays vs tours info displays
    if (item.type === "stay") {
      // Render Amenities checklist
      let amenitiesHTML = `
        <h3 style="font-family: var(--font-display); font-size:1.15rem; margin-bottom:12px;">Tiện Nghi Chỗ Ở</h3>
        <div class="amenities-list">
      `;
      item.amenities.forEach(am => {
        amenitiesHTML += `
          <div class="amenity-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>${am}</span>
          </div>
        `;
      });
      amenitiesHTML += `</div>`;
      document.getElementById('modal-spec-container').innerHTML = amenitiesHTML;

    } else {
      // Render Itinerary Timeline list
      let itineraryHTML = `
        <h3 style="font-family: var(--font-display); font-size:1.15rem; margin-bottom:15px;">Lộ Trình Tour</h3>
        <div class="itinerary-timeline">
      `;
      item.itinerary.forEach(step => {
        itineraryHTML += `
          <div class="itinerary-step">
            <span class="step-day">Ngày ${step.day}</span>
            <h4 class="step-title">${step.title}</h4>
            <p class="step-desc">${step.details}</p>
          </div>
        `;
      });
      itineraryHTML += `</div>`;
      document.getElementById('modal-spec-container').innerHTML = itineraryHTML;
    }

    // Load dynamic Reviews list for item
    this.renderModalReviews(itemId);

    // Initial button text
    const btn = document.getElementById('btn-trigger-checkout');
    btn.innerText = `LIÊN HỆ TƯ VẤN`;

    // Show Detail Modal
    document.getElementById('detail-modal').classList.add('active');
  },

  changeMainGalleryImage(imgSrc, thumbElement) {
    document.getElementById('modal-gallery-img').src = imgSrc;
    document.getElementById('modal-gallery-thumbs').querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
  },

  triggerCheckout() {
    // Open Contact Modal instead of Booking Wizard
    document.getElementById('contact-modal').classList.add('active');
  },

  handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = window.MountainGoatDB.login(email, password);
    if (user) {
      if (window.MGTBooking) window.MGTBooking.showToast("Đăng nhập thành công!", "success");
      document.getElementById('login-modal').classList.remove('active');
      this.updateAuthUI();
      window.location.hash = '#dashboard';
      if (window.MGTDashboard) window.MGTDashboard.init();
    } else {
      if (window.MGTBooking) window.MGTBooking.showToast("Email hoặc mật khẩu không chính xác!", "error");
    }
  },

  handleLogout() {
    window.MountainGoatDB.logout();
    if (window.MGTBooking) window.MGTBooking.showToast("Đã đăng xuất!", "info");
    this.updateAuthUI();
    if (window.location.hash === '#dashboard') {
      window.location.hash = '#home';
    }
  },

  updateAuthUI() {
    const user = window.MountainGoatDB.getCurrentUser();
    const authActions = document.getElementById('auth-actions');
    const hostBtn = document.getElementById('host-mode-btn');

    if (user) {
      hostBtn.innerText = 'Bảng điều khiển';

      // Add Logout button if not exists
      if (!document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'btn-primary';
        logoutBtn.style.padding = '8px 16px';
        logoutBtn.innerText = 'Đăng xuất';
        logoutBtn.addEventListener('click', () => this.handleLogout());
        authActions.appendChild(logoutBtn);
      }

      // Show admin only menu items if superadmin
      const adminOnlyMenu = document.getElementById('menu-item-admin-only');
      if (adminOnlyMenu) {
        adminOnlyMenu.style.display = user.role === 'superadmin' ? 'block' : 'none';
      }
    } else {
      hostBtn.innerText = 'Đăng nhập';
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.remove();

      const adminOnlyMenu = document.getElementById('menu-item-admin-only');
      if (adminOnlyMenu) adminOnlyMenu.style.display = 'none';
    }
  },

  renderModalReviews(itemId) {
    const listContainer = document.getElementById('modal-reviews-list');
    if (!listContainer) return;

    const reviews = window.MountainGoatDB.getItemReviews(itemId);

    if (reviews.length === 0) {
      listContainer.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); padding:10px 0;">Chưa có nhận xét nào cho dịch vụ này. Hãy là người đầu tiên đánh giá!</p>`;
      return;
    }

    listContainer.innerHTML = reviews.map(r => `
      <div class="review-item">
        <div class="review-user">
          <img src="${r.userAvatar}" alt="${r.userName}" class="review-avatar">
          <div>
            <div class="review-name">${r.userName}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-comment">${r.comment}</p>
      </div>
    `).join('');
  },

  submitReview() {
    if (!this.currentProduct) return;

    const comment = document.getElementById('review-comment-input').value.trim();
    if (!comment) {
      if (window.MGTBooking) window.MGTBooking.showToast("Vui lòng điền nội dung nhận xét!", "error");
      return;
    }

    const newReview = {
      id: "rev-" + Date.now().toString().slice(-4),
      userId: "user-current",
      userName: "Khách du lịch",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
      targetId: this.currentProduct.id,
      rating: this.reviewSelectedStars,
      date: new Date().toLocaleDateString('vi-VN'),
      comment: comment
    };

    // Save review
    window.MountainGoatDB.addReview(newReview);

    if (window.MGTBooking) window.MGTBooking.showToast("Gửi đánh giá thành công!", "success");

    // Refresh modal review section & stats values
    this.renderModalReviews(this.currentProduct.id);
    
    // Refresh parent listings displays (update stars values)
    this.renderStays();
    this.renderTours();
    this.renderFeatured();

    // Reload Details rating details header
    const updatedItem = window.MountainGoatDB.getItemById(this.currentProduct.id);
    if (updatedItem) {
      const ratingText = `★ ${updatedItem.rating} (${updatedItem.reviewsCount} đánh giá)`;
      document.getElementById('modal-rev-avg').innerText = ratingText;
      document.getElementById('modal-rev-count').innerText = updatedItem.reviewsCount;
    }

    // Reset textarea comment form
    document.getElementById('review-comment-input').value = '';
  }
};

window.MGTApp = MGTApp;
document.addEventListener('DOMContentLoaded', () => MGTApp.init());
