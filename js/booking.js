// Booking and Checkout Management Module
// Manages wizard states, fields validation, and interactive payment visualizers.

const MGTBooking = {
  currentBooking: null, // Stores active checkout parameters

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Payment method toggle
    const payRadios = document.querySelectorAll('input[name="pay-method"]');
    payRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.togglePaymentMethod(e.target.value);
      });
    });

    // Wizard Next & Back buttons
    document.getElementById('btn-wizard-next-1').addEventListener('click', () => this.goToStep(2));
    document.getElementById('btn-wizard-next-2').addEventListener('click', () => this.goToStep(3));
    document.getElementById('btn-wizard-back-2').addEventListener('click', () => this.goToStep(1));
    document.getElementById('btn-wizard-back-3').addEventListener('click', () => this.goToStep(2));

    // Form submission
    document.getElementById('checkout-wizard-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.completeBooking();
    });

    // Card inputs sync with visualizer
    const cardNum = document.getElementById('card-num-input');
    const cardName = document.getElementById('card-name-input');
    const cardExp = document.getElementById('card-exp-input');
    const cardCvv = document.getElementById('card-cvv-input');
    const visualCard = document.getElementById('visual-card-element');

    cardNum.addEventListener('input', (e) => {
      // Format: 1111 2222 3333 4444
      let val = e.target.value.replace(/\D/g, '');
      let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
      e.target.value = formatted;
      document.getElementById('vis-card-number').innerText = formatted || '•••• •••• •••• ••••';
    });

    cardName.addEventListener('input', (e) => {
      let val = e.target.value.toUpperCase();
      e.target.value = val;
      document.getElementById('vis-card-name').innerText = val || 'NGUYỄN VĂN A';
    });

    cardExp.addEventListener('input', (e) => {
      // Format: MM/YY
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
      document.getElementById('vis-card-exp').innerText = val || 'MM/YY';
    });

    cardCvv.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      document.getElementById('vis-card-cvv').innerText = val || '•••';
    });

    // Flip card when focus/blur on CVV
    cardCvv.addEventListener('focus', () => {
      visualCard.classList.add('flipped');
    });
    cardCvv.addEventListener('blur', () => {
      visualCard.classList.remove('flipped');
    });
  },

  calculateCost(item, params) {
    let basePrice = item.price;
    let total = 0;
    let addonsTotal = 0;
    let details = [];

    if (item.type === "stay") {
      // Stays: dates check
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Base stay cost
      let stayBase = basePrice * nights;
      total += stayBase;
      details.push({ name: `Tiền phòng (${nights} đêm)`, cost: stayBase });

      // Guests surcharge (base capacity 2 guests, 100k extra per person per night)
      if (params.guests > 2) {
        let surcharge = (params.guests - 2) * 100000 * nights;
        total += surcharge;
        addonsTotal += surcharge;
        details.push({ name: `Phụ thu thêm người (${params.guests - 2} người)`, cost: surcharge });
      }

      // Addons / Extras
      if (params.extras && params.extras.length > 0) {
        params.extras.forEach(extra => {
          if (extra === "bbq") {
            total += 250000;
            addonsTotal += 250000;
            details.push({ name: "Tiệc nướng BBQ trọn gói", cost: 250000 });
          } else if (extra === "motorbike") {
            let motoCost = 150000 * nights;
            total += motoCost;
            addonsTotal += motoCost;
            details.push({ name: `Thuê xe máy (${nights} ngày)`, cost: motoCost });
          } else if (extra === "guide") {
            let guideCost = 600000 * nights;
            total += guideCost;
            addonsTotal += guideCost;
            details.push({ name: `Hướng dẫn viên bản địa (${nights} ngày)`, cost: guideCost });
          }
        });
      }
      
      return { total, baseTotal: stayBase, addonsTotal, durationLabel: `${nights} đêm`, details, nights };
    } else {
      // Tours: per person pricing
      let tourBase = basePrice * params.guests;
      total += tourBase;
      details.push({ name: `Vé tour (${params.guests} khách)`, cost: tourBase });

      // Addons / Extras for tours
      if (params.extras && params.extras.length > 0) {
        params.extras.forEach(extra => {
          if (extra === "porter") {
            let porterCost = 350000 * params.guests;
            total += porterCost;
            addonsTotal += porterCost;
            details.push({ name: `Porter hỗ trợ vác đồ`, cost: porterCost });
          } else if (extra === "camping") {
            let gearCost = 150000 * params.guests;
            total += gearCost;
            addonsTotal += gearCost;
            details.push({ name: `Thuê lều & túi ngủ xịn`, cost: gearCost });
          }
        });
      }

      return { total, baseTotal: tourBase, addonsTotal, durationLabel: "Tour trọn gói", details, nights: 1 };
    }
  },

  openCheckout(item, params) {
    const calculation = this.calculateCost(item, params);
    
    this.currentBooking = {
      itemId: item.id,
      itemName: item.name,
      itemType: item.type,
      image: item.images[0],
      params: params,
      calculation: calculation,
      status: "upcoming" // default
    };

    // Close details modal
    document.getElementById('detail-modal').classList.remove('active');

    // Populate Wizard Step 1 UI
    document.getElementById('checkout-summary-name').innerText = item.name;
    document.getElementById('summary-base-price').innerText = this.formatVND(item.price) + (item.type === 'stay' ? ' /đêm' : ' /khách');
    document.getElementById('summary-duration-label').innerText = item.type === 'stay' ? 'Số đêm lưu trú' : 'Thời gian';
    document.getElementById('summary-duration-val').innerText = calculation.durationLabel;
    document.getElementById('summary-guests-val').innerText = `${params.guests} khách`;
    document.getElementById('summary-addons-val').innerText = this.formatVND(calculation.addonsTotal);
    document.getElementById('summary-total-val').innerText = this.formatVND(calculation.total);

    // Sync banking metadata just in case they choose QR code
    const randomMemo = "MGT" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('qr-bank-amount').innerText = this.formatVND(calculation.total);
    document.getElementById('qr-bank-memo').innerText = randomMemo;
    this.currentBooking.memo = randomMemo;

    // Reset Wizard steps
    this.goToStep(1);

    // Reset forms
    document.getElementById('checkout-wizard-form').reset();
    document.getElementById('payment-card-fields').style.display = 'block';
    document.getElementById('payment-qr-fields').style.display = 'none';
    document.getElementById('payment-visual-card-wrapper').style.display = 'block';
    document.getElementById('payment-visual-qr-wrapper').style.display = 'none';
    document.getElementById('vis-card-number').innerText = '•••• •••• •••• ••••';
    document.getElementById('vis-card-name').innerText = 'NGUYỄN VĂN A';
    document.getElementById('vis-card-exp').innerText = 'MM/YY';
    document.getElementById('vis-card-cvv').innerText = '•••';

    // Show Modal
    document.getElementById('checkout-modal').classList.add('active');
  },

  goToStep(stepNum) {
    // Hide all contents
    document.querySelectorAll('.wizard-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.wizard-step-node').forEach(el => {
      el.classList.remove('active');
      el.classList.remove('completed');
    });

    // Show targeted step content
    document.getElementById(`wizard-step-${stepNum}-content`).classList.add('active');

    // Color steps nodes
    for (let i = 1; i <= 3; i++) {
      const node = document.getElementById(`node-step-${i}`);
      if (i < stepNum) {
        node.classList.add('completed');
      } else if (i === stepNum) {
        node.classList.add('active');
      }
    }

    // Apply validations when navigating forward
    if (stepNum === 3) {
      // Validate customer fields
      const name = document.getElementById('cust-fullname').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const email = document.getElementById('cust-email').value.trim();

      if (!name || !phone || !email) {
        this.showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
        this.goToStep(2);
      }
    }
  },

  togglePaymentMethod(method) {
    const cardInputs = document.getElementById('payment-card-fields');
    const qrInputs = document.getElementById('payment-qr-fields');
    const cardVis = document.getElementById('payment-visual-card-wrapper');
    const qrVis = document.getElementById('payment-visual-qr-wrapper');

    if (method === "card") {
      cardInputs.style.display = "block";
      qrInputs.style.display = "none";
      cardVis.style.display = "block";
      qrVis.style.display = "none";
      
      document.getElementById('card-num-input').setAttribute('required', 'true');
      document.getElementById('card-exp-input').setAttribute('required', 'true');
      document.getElementById('card-cvv-input').setAttribute('required', 'true');
      document.getElementById('card-name-input').setAttribute('required', 'true');
    } else {
      cardInputs.style.display = "none";
      qrInputs.style.display = "block";
      cardVis.style.display = "none";
      qrVis.style.display = "block";

      document.getElementById('card-num-input').removeAttribute('required');
      document.getElementById('card-exp-input').removeAttribute('required');
      document.getElementById('card-cvv-input').removeAttribute('required');
      document.getElementById('card-name-input').removeAttribute('required');
    }
  },

  completeBooking() {
    // Collect contact data
    const customer = {
      name: document.getElementById('cust-fullname').value.trim(),
      phone: document.getElementById('cust-phone').value.trim(),
      email: document.getElementById('cust-email').value.trim(),
      note: document.getElementById('cust-note').value.trim()
    };

    const paymentMethod = document.querySelector('input[name="pay-method"]:checked').value;

    // Validate details depending on payment method
    if (paymentMethod === "card") {
      const cardNum = document.getElementById('card-num-input').value.replace(/\s+/g, '');
      const cardExp = document.getElementById('card-exp-input').value;
      const cardCvv = document.getElementById('card-cvv-input').value;

      if (cardNum.length < 16 || cardExp.length < 5 || cardCvv.length < 3) {
        this.showToast("Thông tin thẻ thanh toán không hợp lệ!", "error");
        return;
      }
    }

    // Set up final booking schema
    const newBooking = {
      id: "MGT-" + Date.now().toString().slice(-6),
      itemId: this.currentBooking.itemId,
      itemName: this.currentBooking.itemName,
      itemType: this.currentBooking.itemType,
      image: this.currentBooking.image,
      customer: customer,
      params: this.currentBooking.params,
      calculation: this.currentBooking.calculation,
      paymentMethod: paymentMethod,
      memo: this.currentBooking.memo,
      status: "upcoming",
      dateCreated: new Date().toLocaleDateString('vi-VN')
    };

    // Save in Local DB
    window.MountainGoatDB.addBooking(newBooking);

    // Show Success notification
    this.showToast("Đặt chỗ thành công! Mã đơn của bạn là: " + newBooking.id, "success");

    // Close Modal
    document.getElementById('checkout-modal').classList.remove('active');

    // Route to reservation page dashboard
    setTimeout(() => {
      window.location.hash = "#dashboard";
      // Refresh dashboard view if dashboard scripts are active
      if (window.MGTDashboard) {
        window.MGTDashboard.renderBookings();
        window.MGTDashboard.renderStats();
      }
    }, 400);
  },

  formatVND(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  },

  showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✗';
    else icon = 'i';

    toast.innerHTML = `<span style="font-size:1.1rem; font-weight:bold;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

window.MGTBooking = MGTBooking;
document.addEventListener('DOMContentLoaded', () => MGTBooking.init());
