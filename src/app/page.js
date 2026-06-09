"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // --- STATE FOR MAIN DATA ---
  const [stays, setStays] = useState([]);
  const [tours, setTours] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [admins, setAdmins] = useState([]);

  // --- UI STATE ---
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState("light");
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);

  // --- SEARCH STATES ---
  const [searchTab, setSearchTab] = useState("stay");
  const [searchDest, setSearchDest] = useState("");
  const [searchDateIn, setSearchDateIn] = useState("");
  const [searchGuests, setSearchGuests] = useState("2");

  // --- STAYS FILTER STATES ---
  const [stayLocFilter, setStayLocFilter] = useState("all");
  const [stayPriceFilter, setStayPriceFilter] = useState(3000000);
  const [staySort, setStaySort] = useState("rating");

  // --- TOURS FILTER STATES ---
  const [tourDiffFilter, setTourDiffFilter] = useState("all");
  const [tourPriceFilter, setTourPriceFilter] = useState(6000000);
  const [tourSort, setTourSort] = useState("rating");

  // --- VEHICLES FILTER STATES ---
  const [vehicleLocFilter, setVehicleLocFilter] = useState("all");
  const [vehiclePriceFilter, setVehiclePriceFilter] = useState(2000000);
  const [vehicleSort, setVehicleSort] = useState("rating");

  // --- SERVICES FILTER STATES ---
  const [serviceLocFilter, setServiceLocFilter] = useState("all");
  const [servicePriceFilter, setServicePriceFilter] = useState(1000000);
  const [serviceSort, setServiceSort] = useState("rating");

  // --- DASHBOARD STATES ---
  const [dashTab, setDashTab] = useState("user-wishlist");

  // Dashboard listing upload form
  const [listType, setListType] = useState("stay");
  const [listCategory, setListCategory] = useState("");
  const [listName, setListName] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [listLocation, setListLocation] = useState("");
  const [listGuests, setListGuests] = useState(2);
  const [listDifficulty, setListDifficulty] = useState("Dễ");
  const [listImage, setListImage] = useState("https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80");
  const [listDesc, setListDesc] = useState("");
  const [listPhone, setListPhone] = useState("");

  // Dashboard admin creation form
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // --- MODAL STATES ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMainImg, setSelectedMainImg] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [needShuttle, setNeedShuttle] = useState(false);
  const [needMotorbike, setNeedMotorbike] = useState(false);
  const [needPrivateCar, setNeedPrivateCar] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // --- UTILITY FUNCTIONS ---
  const formatVND = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, exit: false }]);

    // Timer to trigger slide-out exit animation
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exit: true } : t))
      );
      // Remove from state after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 4000);
  };

  // --- INITIAL DATA FETCH & SYNC ---
  // Thử API routes trước (local/server), nếu không được thì dùng db.json tĩnh (GitHub Pages)
  const loadData = async () => {
    try {
      // Thử đọc từ API routes (Next.js server mode)
      const staysRes = await fetch("/api/stays");
      if (staysRes.ok) {
        const staysData = await staysRes.json();
        // API trả về mảng hợp lệ => dùng API routes
        setStays(staysData);

        const [toursRes, vehiclesRes, servicesRes, reviewsRes] = await Promise.all([
          fetch("/api/tours"),
          fetch("/api/vehicles"),
          fetch("/api/services"),
          fetch("/api/reviews"),
        ]);
        if (toursRes.ok) setTours(await toursRes.json());
        if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        return;
      }
    } catch (_) {
      // API routes không khả dụng (static export), fallback xuống db.json
    }

    // Fallback: đọc toàn bộ từ db.json tĩnh trong public/
    try {
      const base = typeof window !== 'undefined'
        ? window.location.origin + (window.location.pathname.startsWith('/Moutain-goat-travel') ? '/Moutain-goat-travel' : '')
        : '';
      const res = await fetch(`${base}/db.json`, { cache: 'no-store' });
      if (res.ok) {
        const db = await res.json();
        setStays(db.stays || []);
        setTours(db.tours || []);
        setVehicles(db.vehicles || []);
        setServices(db.services || []);
        setReviews(db.reviews || []);
      }
    } catch (err) {
      console.error("Error loading data from db.json:", err);
    }
  };

  const loadAdmins = async (token) => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: token },
      });
      if (res.ok) {
        setAdmins(await res.json());
      }
    } catch (err) {
      console.error("Error loading admins list:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Sync theme from localStorage
    const savedTheme = localStorage.getItem("mgt_theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Sync user from localStorage
    const savedUser = localStorage.getItem("mgt_current_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      if (parsedUser.role === "superadmin") {
        loadAdmins(parsedUser.token);
      }
    }

    // Sync wishlist from localStorage
    const savedWishlist = localStorage.getItem("mgt_wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Handle initial hash routing
    const handleHash = () => {
      const hash = window.location.hash || "#home";
      const target = hash.replace("#", "");
      const validSections = ["home", "stays", "tours", "vehicles", "services", "dashboard"];
      if (validSections.includes(target)) {
        setActiveSection(target);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();

    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  // --- THEME TOGGLE ---
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("mgt_theme", nextTheme);
    if (nextTheme === "dark") {
      document.body.classList.add("dark-mode");
      showToast("Đã chuyển sang chế độ tối", "info");
    } else {
      document.body.classList.remove("dark-mode");
      showToast("Đã chuyển sang chế độ sáng", "info");
    }
  };

  // --- WISHLIST DYNAMICS ---
  const toggleWishlist = (itemId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (wishlist.includes(itemId)) {
      updated = wishlist.filter((id) => id !== itemId);
      showToast("Đã xóa khỏi mục yêu thích!", "success");
    } else {
      updated = [...wishlist, itemId];
      showToast("Đã thêm vào mục yêu thích!", "success");
    }
    setWishlist(updated);
    localStorage.setItem("mgt_wishlist", JSON.stringify(updated));
  };

  // --- EXECUTE SEARCH FROM HERO BANNER ---
  const executeHeroSearch = () => {
    if (searchTab === "stay") {
      window.location.hash = "#stays";
      // Redirect search filters
      if (searchDest) {
        const matches = ["Sa Pa", "Đà Lạt", "Ninh Bình", "Mộc Châu", "Y Tý"];
        const match = matches.find((m) =>
          m.toLowerCase().includes(searchDest.toLowerCase())
        );
        if (match) {
          setStayLocFilter(match);
        } else {
          setStayLocFilter("all");
        }
      } else {
        setStayLocFilter("all");
      }
      showToast(
        `Đang tìm kiếm Homestay tại "${searchDest || "Tất cả địa điểm"}"...`,
        "info"
      );
    } else if (searchTab === "tour") {
      window.location.hash = "#tours";
      setTourDiffFilter("all");
      showToast(
        `Đang tìm kiếm Tour thám hiểm tại "${searchDest || "Tất cả địa điểm"}"...`,
        "info"
      );
    } else if (searchTab === "vehicle") {
      window.location.hash = "#vehicles";
      if (searchDest) {
        const matches = ["Sa Pa", "Đà Lạt", "Ninh Bình", "Hà Nội"];
        const match = matches.find((m) =>
          m.toLowerCase().includes(searchDest.toLowerCase())
        );
        if (match) {
          setVehicleLocFilter(match);
        } else {
          setVehicleLocFilter("all");
        }
      } else {
        setVehicleLocFilter("all");
      }
      showToast(
        `Đang tìm kiếm Thuê xe tại "${searchDest || "Tất cả địa điểm"}"...`,
        "info"
      );
    } else if (searchTab === "service") {
      window.location.hash = "#services";
      if (searchDest) {
        const matches = ["Sa Pa", "Đà Lạt", "Ninh Bình", "Hà Nội"];
        const match = matches.find((m) =>
          m.toLowerCase().includes(searchDest.toLowerCase())
        );
        if (match) {
          setServiceLocFilter(match);
        } else {
          setServiceLocFilter("all");
        }
      } else {
        setServiceLocFilter("all");
      }
      showToast(
        `Đang tìm kiếm Dịch vụ tại "${searchDest || "Tất cả địa điểm"}"...`,
        "info"
      );
    }
  };

  // --- LOGIN FLOW ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        localStorage.setItem("mgt_current_user", JSON.stringify(user));
        showToast("Đăng nhập thành công!", "success");
        setIsLoginModalOpen(false);
        setLoginEmail("");
        setLoginPassword("");
        window.location.hash = "#dashboard";

        if (user.role === "superadmin") {
          loadAdmins(user.token);
        }
      } else {
        showToast("Email hoặc mật khẩu không chính xác!", "error");
      }
    } catch (err) {
      showToast("Đã xảy ra lỗi hệ thống!", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("mgt_current_user");
    setAdmins([]);
    showToast("Đã đăng xuất!", "info");
    if (window.location.hash === "#dashboard") {
      window.location.hash = "#home";
    }
  };

  // --- DETAIL MODAL FLOW ---
  const openDetail = (item) => {
    setSelectedItem(item);
    setSelectedMainImg(item.images[0]);
    setReviewStars(5);
    setReviewComment("");
    setNeedShuttle(false);
    setNeedMotorbike(false);
    setNeedPrivateCar(false);
    setIsDetailModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedItem) return;
    if (!reviewComment.trim()) {
      showToast("Vui lòng điền nội dung nhận xét!", "error");
      return;
    }

    const newReview = {
      id: "rev-" + Date.now().toString().slice(-4),
      userId: "user-current",
      userName: "Khách du lịch",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
      targetId: selectedItem.id,
      rating: reviewStars,
      date: new Date().toLocaleDateString("vi-VN"),
      comment: reviewComment.trim(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (res.ok) {
        showToast("Gửi đánh giá thành công!", "success");
        setReviewComment("");

        // Refresh database arrays
        await loadData();

        // Update active modal selectedItem values dynamically
        let key = "/api/tours";
        if (selectedItem.type === "stay") key = "/api/stays";
        else if (selectedItem.type === "tour") key = "/api/tours";
        else if (selectedItem.type === "vehicle") key = "/api/vehicles";
        else if (selectedItem.type === "service") key = "/api/services";

        const refreshRes = await fetch(key);
        if (refreshRes.ok) {
          const freshItems = await refreshRes.json();
          const freshMe = freshItems.find((i) => i.id === selectedItem.id);
          if (freshMe) {
            setSelectedItem(freshMe);
          }
        }
      } else {
        showToast("Gửi đánh giá thất bại!", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống khi gửi nhận xét!", "error");
    }
  };

  // --- CREATE NEW LISTING FLOW ---
  const handleCreateListingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Bạn cần đăng nhập để thực hiện chức năng này!", "error");
      return;
    }

    if (!listCategory || !listName || !listPrice || !listLocation || !listDesc) {
      showToast("Vui lòng nhập đầy đủ các trường!", "error");
      return;
    }

    const item = {
      id: `custom-${listType}-${Date.now().toString().slice(-4)}`,
      name: listName,
      category: listCategory,
      type: listType,
      location: listLocation,
      price: parseInt(listPrice, 10),
      rating: 5.0,
      reviewsCount: 0,
      description: listDesc,
      images: [listImage],
      owner: {
        name: currentUser.name,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        badge: currentUser.role === "superadmin" ? "Quản trị viên" : "Chủ nhà",
      },
      featured: false,
      authorId: currentUser.id,
      contactPhone: listPhone || "0988 123 456",
      facebookPage: "https://facebook.com/mountaingoattravel",
    };

    if (listType === "stay") {
      item.maxGuests = parseInt(listGuests, 10) || 2;
      item.amenities = [
        "Wi-Fi miễn phí",
        "Điều hòa nhiệt độ",
        "Bếp chung",
        "Tivi truyền hình cáp",
      ];
    } else if (listType === "tour") {
      item.difficulty = listDifficulty;
      item.inclusions = [
        "Vé tham quan chính",
        "Hướng dẫn viên du lịch",
        "Bảo hiểm du lịch cơ bản",
      ];
      item.departureDates = ["Hàng tuần", "Cuối tuần"];
      item.itinerary = [
        { day: 1, title: "Khởi hành", details: "Xe đón đoàn tại trung tâm." },
        { day: 2, title: "Trải nghiệm", details: "Tham quan và khám phá." },
      ];
    } else if (listType === "vehicle") {
      item.amenities = [
        "Giao xe tận nơi",
        "Kèm 2 mũ bảo hiểm",
        "Hỗ trợ sự cố 24/7",
      ];
    } else if (listType === "service") {
      item.amenities = [
        "Nhận mã QR ngay",
        "Hoàn hủy miễn phí trước 24h",
        "Hỗ trợ 24/7",
      ];
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser.token,
        },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        showToast("Đăng tin thành công!", "success");
        // Reset listing form
        setListCategory("");
        setListName("");
        setListPrice("");
        setListLocation("");
        setListDesc("");
        setListPhone("");

        await loadData();

        setTimeout(() => {
          let hashTarget = `${listType}s`;
          if (listType === "service") hashTarget = "services";
          window.location.hash = `#${hashTarget}`;
        }, 400);
      } else {
        showToast("Đăng tin không thành công!", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống khi đăng tin!", "error");
    }
  };

  // --- CREATE NEW ADMIN FLOW (SUPERADMIN ONLY) ---
  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== "superadmin") {
      showToast("Chỉ Super Admin mới có thể tạo admin mới!", "error");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser.token,
        },
        body: JSON.stringify({
          userData: {
            name: adminName,
            email: adminEmail,
            password: adminPassword,
          },
        }),
      });

      if (res.ok) {
        showToast("Tạo tài khoản admin thành công!", "success");
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
        loadAdmins(currentUser.token);
      } else {
        const errData = await res.json();
        showToast(errData.message || "Tạo tài khoản admin thất bại!", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống khi tạo admin!", "error");
    }
  };

  // --- FILTER & SORT LOGIC ---
  const getFilteredStays = () => {
    let list = [...stays];
    if (stayLocFilter !== "all") {
      list = list.filter((s) => s.location.includes(stayLocFilter));
    }
    list = list.filter((s) => s.price <= stayPriceFilter);

    if (staySort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (staySort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const getFilteredTours = () => {
    let list = [...tours];
    if (tourDiffFilter !== "all") {
      list = list.filter((t) => t.difficulty === tourDiffFilter);
    }
    list = list.filter((t) => t.price <= tourPriceFilter);

    if (tourSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (tourSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const getFilteredVehicles = () => {
    let list = [...vehicles];
    if (vehicleLocFilter !== "all") {
      list = list.filter((v) => v.location.includes(vehicleLocFilter));
    }
    list = list.filter((v) => v.price <= vehiclePriceFilter);

    if (vehicleSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (vehicleSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const getFilteredServices = () => {
    let list = [...services];
    if (serviceLocFilter !== "all") {
      list = list.filter((s) => s.location.includes(serviceLocFilter));
    }
    list = list.filter((s) => s.price <= servicePriceFilter);

    if (serviceSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (serviceSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const getFeaturedList = () => {
    const featuredStays = stays.filter((s) => s.featured);
    const featuredTours = tours.filter((t) => t.featured);
    const featuredVehicles = vehicles.filter((v) => v.featured);
    const featuredServices = services.filter((s) => s.featured);
    return [...featuredStays, ...featuredTours, ...featuredVehicles, ...featuredServices].slice(0, 4);
  };

  const getWishlistItems = () => {
    const all = [...stays, ...tours, ...vehicles, ...services];
    return all.filter((i) => wishlist.includes(i.id));
  };

  const getManageListings = () => {
    const all = [...stays, ...tours, ...vehicles, ...services];
    if (currentUser?.role === "superadmin") {
      return all;
    }
    return all.filter((item) => item.authorId === currentUser?.id);
  };

  const handleDeleteListing = async (itemId, itemType) => {
    if (!currentUser) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) return;

    try {
      const res = await fetch(`/api/listings?id=${itemId}&type=${itemType}`, {
        method: "DELETE",
        headers: {
          Authorization: currentUser.token,
        },
      });

      if (res.ok) {
        showToast("Xóa tin đăng thành công!", "success");
        await loadData();
      } else {
        const errData = await res.json();
        showToast(errData.message || "Xóa tin đăng thất bại!", "error");
      }
    } catch (err) {
      showToast("Lỗi hệ thống khi xóa tin đăng!", "error");
    }
  };

  // --- SVG DOANH THU CHART DRAWING ---
  const renderRevenueChart = () => {
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    const chartValues = [4.5, 3.2, 5.8, 4.0, 7.5, 12.0, 9.5];
    const svgWidth = 600;
    const svgHeight = 250;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const maxVal = Math.max(...chartValues, 10);
    const yMax = Math.ceil(maxVal / 5) * 5;

    const gridLines = [];
    for (let i = 0; i <= 4; i++) {
      const yVal = (yMax / 4) * i;
      const yPos = padding.top + chartHeight - chartHeight * (yVal / yMax);
      gridLines.push({ yPos, label: `${yVal}M` });
    }

    const barWidth = 35;
    const colWidth = chartWidth / chartValues.length;

    const bars = chartValues.map((val, idx) => {
      const xPos = padding.left + colWidth * idx + (colWidth - barWidth) / 2;
      const valHeight = chartHeight * (val / yMax);
      const yPos = padding.top + chartHeight - valHeight;
      return {
        xPos,
        yPos,
        valHeight,
        valLabel: `${val.toFixed(1)} Tr`,
        dayLabel: days[idx],
        val,
      };
    });

    return (
      <svg id="revenue-chart" className="chart-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <defs>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        {/* Style tags for responsive animations and styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 4,4; }
          .axis-label { font-size: 11px; fill: var(--text-muted); font-family: var(--font-sans); }
          .bar-rect { transition: height 0.5s ease, y 0.5s ease; cursor: pointer; }
          .bar-rect:hover { fill: var(--accent); }
          .value-label { font-size: 10px; font-weight: 700; fill: var(--text); font-family: var(--font-display); opacity: 0; transition: opacity 0.2s; text-anchor: middle;}
          .bar-group:hover .value-label { opacity: 1; }
        `}} />

        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={line.yPos}
              x2={svgWidth - padding.right}
              y2={line.yPos}
              className="grid-line"
            />
            <text
              x={padding.left - 10}
              y={line.yPos + 4}
              className="axis-label"
              textAnchor="end"
            >
              {line.label}
            </text>
          </g>
        ))}

        {bars.map((bar, idx) => (
          <g className="bar-group" key={idx}>
            <text
              x={bar.xPos + barWidth / 2}
              y={bar.yPos - 8}
              className="value-label"
            >
              {bar.valLabel}
            </text>
            <rect
              x={bar.xPos}
              y={bar.yPos}
              width={barWidth}
              height={bar.valHeight}
              rx="6"
              ry="6"
              fill="url(#bar-grad)"
              className="bar-rect"
            />
            <text
              x={bar.xPos + barWidth / 2}
              y={svgHeight - 15}
              className="axis-label"
              textAnchor="middle"
            >
              {bar.dayLabel}
            </text>
          </g>
        ))}

        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={svgWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="var(--border)"
          strokeWidth="2"
        />
      </svg>
    );
  };

  // --- CARD GENERATOR COMPONENT ---
  const ListingCard = ({ item }) => {
    const isWishlisted = wishlist.includes(item.id);
    const priceVal = formatVND(item.price);

    let priceUnit = "/khách";
    if (item.type === "stay") priceUnit = "/đêm";
    else if (item.type === "vehicle") priceUnit = "/ngày";
    else if (item.type === "service") priceUnit = "/dịch vụ";

    let badgeLabel = "Tour";
    if (item.type === "stay") badgeLabel = "Homestay";
    else if (item.type === "vehicle") badgeLabel = "Thuê xe";
    else if (item.type === "service") badgeLabel = "Dịch vụ";

    let difficultyBadge = null;
    if (item.type === "tour") {
      let diffClass = "easy";
      if (item.difficulty === "Vừa") diffClass = "medium";
      if (item.difficulty === "Khó") diffClass = "hard";
      difficultyBadge = (
        <span className={`badge-difficulty ${diffClass}`}>{item.difficulty}</span>
      );
    }

    return (
      <div className="listing-card">
        <div className="card-img-wrapper">
          <span className="badge-tag">{badgeLabel}</span>
          {difficultyBadge}
          <img src={item.images[0]} alt={item.name} className="card-img" />
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={(e) => toggleWishlist(item.id, e)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className="card-category">{item.category}</span>
            <span className="card-rating">
              ★ {item.rating} ({item.reviewsCount})
            </span>
          </div>
          <h3 className="card-title">{item.name}</h3>
          <div className="card-location">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{item.location}</span>
          </div>
          <div className="card-footer">
            <div className="card-price">
              <span className="price-label">Giá chỉ từ</span>
              <span className="price-amt">
                {priceVal}
                <span className="price-unit">{priceUnit}</span>
              </span>
            </div>
            <button className="btn-primary" onClick={() => openDetail(item)}>
              Chi Tiết
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. FLOATING TOAST NOTIFICATIONS */}
      <div id="toast-container" className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            style={
              toast.exit
                ? { animation: "slideIn 0.3s ease reverse forwards" }
                : {}
            }
          >
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                  ? "✗"
                  : "i"}
            </span>{" "}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* 2. HEADER NAVIGATION */}
      <header id="main-header" className="scrolled">
        <div className="nav-container">
          <a
            href="#home"
            className="logo"
            id="btn-logo"
            onClick={() => setActiveSection("home")}
          >
            <img src="/assets/logo_sharp.png" alt="Mountain Goat Logo" />
            <span>Mountain Goat</span>
          </a>
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                className={`nav-link ${activeSection === "home" ? "active" : ""}`}
                onClick={() => setActiveSection("home")}
              >
                Trang Chủ
              </a>
            </li>
            <li>
              <a
                href="#stays"
                className={`nav-link ${activeSection === "stays" ? "active" : ""}`}
                onClick={() => setActiveSection("stays")}
              >
                Homestays & Phòng
              </a>
            </li>
            <li>
              <a
                href="#tours"
                className={`nav-link ${activeSection === "tours" ? "active" : ""}`}
                onClick={() => setActiveSection("tours")}
              >
                Tours Trải Nghiệm
              </a>
            </li>
            {/* <li>
              <a
                href="#vehicles"
                className={`nav-link ${activeSection === "vehicles" ? "active" : ""}`}
                onClick={() => setActiveSection("vehicles")}
              >
                Thuê Xe Máy & Ô Tô
              </a>
            </li> */}
            {/* <li>
              <a
                href="#services"
                className={`nav-link ${activeSection === "services" ? "active" : ""}`}
                onClick={() => setActiveSection("services")}
              >
                Dịch Vụ Uy Tín
              </a>
            </li> */}
          </ul>
          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle"
              className="icon-btn"
              title="Đổi giao diện"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg
                  id="theme-icon-sun"
                  className="sun-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 20, height: 20 }}
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  id="theme-icon-moon"
                  className="moon-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 20, height: 20 }}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            {/* Auth Button */}
            <div
              id="auth-actions"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <button
                id="host-mode-btn"
                className="btn-secondary"
                onClick={() => {
                  if (currentUser) {
                    window.location.hash = "#dashboard";
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                {currentUser ? "Bảng điều khiển" : "Đăng nhập"}
              </button>
              {currentUser && (
                <button
                  id="logout-btn"
                  className="btn-primary"
                  style={{ padding: "8px 16px" }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN APP CONTAINER */}
      <main>
        {/* 1. HOME SECTION */}
        <section
          id="section-home"
          className={`page-section ${activeSection === "home" ? "active" : ""}`}
        >
          <div
            className="hero-section"
            style={{ backgroundImage: "url('/assets/hero_mountain.png')" }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>
                Chinh phục đỉnh cao
                <br />
                Trọn vẹn trải nghiệm
              </h1>
              <p>
                Mạng lưới homestay bản địa mộc mạc và các cung trekking thử thách
                kỳ vĩ nhất Việt Nam cùng Mountain Goat.
              </p>

              {/* Floating Search Widget */}
              <div className="search-widget">
                <div className="search-tabs">
                  <button
                    className={`search-tab ${searchTab === "stay" ? "active" : ""}`}
                    onClick={() => setSearchTab("stay")}
                  >
                    Homestay & Phòng
                  </button>
                  <button
                    className={`search-tab ${searchTab === "tour" ? "active" : ""}`}
                    onClick={() => setSearchTab("tour")}
                  >
                    Tours Bản Địa
                  </button>
                  {/* <button
                    className={`search-tab ${searchTab === "vehicle" ? "active" : ""}`}
                    onClick={() => setSearchTab("vehicle")}
                  >
                    Thuê Xe Máy & Ô Tô
                  </button> */}
                  <button
                    className={`search-tab ${searchTab === "service" ? "active" : ""}`}
                    onClick={() => setSearchTab("service")}
                  >
                    Dịch Vụ Khác
                  </button>
                </div>
                <div className="search-grid">
                  <div className="search-field">
                    <label>Điểm đến</label>
                    <div className="search-input-wrapper">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <input
                        type="text"
                        id="search-dest"
                        placeholder="Sapa, Đà Lạt, Hà Giang..."
                        value={searchDest}
                        onChange={(e) => setSearchDest(e.target.value)}
                      />
                    </div>
                  </div>
                  {searchTab === "stay" && (
                    <div className="search-field" id="search-date-field">
                      <label>Ngày đến - Ngày đi</label>
                      <div className="search-input-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <input
                          type="date"
                          id="search-date-in"
                          placeholder="Chọn ngày"
                          value={searchDateIn}
                          onChange={(e) => setSearchDateIn(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="search-field">
                    <label>Số người</label>
                    <div className="search-input-wrapper">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <select
                        id="search-guests"
                        value={searchGuests}
                        onChange={(e) => setSearchGuests(e.target.value)}
                      >
                        <option value="1">1 người</option>
                        <option value="2">2 người</option>
                        <option value="3">3 người</option>
                        <option value="4">4 người+</option>
                      </select>
                    </div>
                  </div>
                  <button
                    className="btn-accent"
                    id="btn-hero-search"
                    style={{ padding: 14, justifyContent: "center" }}
                    onClick={executeHeroSearch}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 22, height: 22 }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Items on Home */}
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <h2>Gợi Ý Nổi Bật</h2>
                <p>Trải nghiệm được du khách đánh giá cao nhất</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-secondary"
                  onClick={() => (window.location.hash = "#stays")}
                >
                  Xem Tất Cả Phòng
                </button>
                <button
                  className="btn-primary"
                  onClick={() => (window.location.hash = "#tours")}
                >
                  Xem Tất Cả Tours
                </button>
              </div>
            </div>
            <div className="listings-grid" id="home-featured-grid">
              {getFeaturedList().map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* 2. STAYS SECTION */}
        <section
          id="section-stays"
          className={`page-section ${activeSection === "stays" ? "active" : ""}`}
        >
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <h2>Homestays & Phòng Nghỉ Dưỡng</h2>
                <p>Nơi cư trú bình yên giữa lòng núi đồi hoang sơ</p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-bar">
              <div className="filter-group">
                <label htmlFor="stay-loc-filter">Vị trí:</label>
                <select
                  id="stay-loc-filter"
                  className="filter-select"
                  value={stayLocFilter}
                  onChange={(e) => setStayLocFilter(e.target.value)}
                >
                  <option value="all">Tất cả điểm đến</option>
                  <option value="Sa Pa">Sa Pa, Lào Cai</option>
                  <option value="Đà Lạt">Đà Lạt, Lâm Đồng</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                  <option value="Mộc Châu">Mộc Châu, Sơn La</option>
                  <option value="Y Tý">Y Tý, Lào Cai</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="stay-price-filter">Giá tối đa:</label>
                <div className="price-range-wrapper">
                  <input
                    type="range"
                    id="stay-price-filter"
                    min="500000"
                    max="3000000"
                    step="100000"
                    value={stayPriceFilter}
                    onChange={(e) => setStayPriceFilter(parseInt(e.target.value))}
                  />
                  <span className="price-val" id="stay-price-val">
                    {stayPriceFilter.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="filter-group" style={{ marginLeft: "auto" }}>
                <label htmlFor="stay-sort">Sắp xếp:</label>
                <select
                  id="stay-sort"
                  className="filter-select"
                  value={staySort}
                  onChange={(e) => setStaySort(e.target.value)}
                >
                  <option value="rating">Đánh giá tốt nhất</option>
                  <option value="price-asc">Giá từ thấp đến cao</option>
                  <option value="price-desc">Giá từ cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="listings-grid" id="stays-list-grid">
              {getFilteredStays().length > 0 ? (
                getFilteredStays().map((s) => (
                  <ListingCard key={s.id} item={s} />
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Không tìm thấy phòng phù hợp bộ lọc của bạn.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. TOURS SECTION */}
        <section
          id="section-tours"
          className={`page-section ${activeSection === "tours" ? "active" : ""}`}
        >
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <h2>Tours Thám Hiểm & Trải Nghiệm</h2>
                <p>Bứt phá giới hạn bản thân, khám phá vẻ đẹp kỳ vĩ</p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-bar">
              <div className="filter-group">
                <label htmlFor="tour-diff-filter">Độ khó:</label>
                <select
                  id="tour-diff-filter"
                  className="filter-select"
                  value={tourDiffFilter}
                  onChange={(e) => setTourDiffFilter(e.target.value)}
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="Dễ">Dễ (Dạo bộ dã ngoại)</option>
                  <option value="Vừa">Vừa (Đồi dốc trung bình)</option>
                  <option value="Khó">Khó (Đá dựng đứng, hiểm trở)</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="tour-price-filter">Giá tối đa:</label>
                <div className="price-range-wrapper">
                  <input
                    type="range"
                    id="tour-price-filter"
                    min="2000000"
                    max="6000000"
                    step="200000"
                    value={tourPriceFilter}
                    onChange={(e) => setTourPriceFilter(parseInt(e.target.value))}
                  />
                  <span className="price-val" id="tour-price-val">
                    {tourPriceFilter.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="filter-group" style={{ marginLeft: "auto" }}>
                <label htmlFor="tour-sort">Sắp xếp:</label>
                <select
                  id="tour-sort"
                  className="filter-select"
                  value={tourSort}
                  onChange={(e) => setTourSort(e.target.value)}
                >
                  <option value="rating">Yêu thích nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="listings-grid" id="tours-list-grid">
              {getFilteredTours().length > 0 ? (
                getFilteredTours().map((t) => (
                  <ListingCard key={t.id} item={t} />
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Không tìm thấy tour phù hợp bộ lọc của bạn.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3.1. VEHICLES SECTION - COMMENTED OUT AS VEHICLES ARE NOW ADD-ONS INSIDE DETAILS
        <section
          id="section-vehicles"
          className={`page-section ${activeSection === "vehicles" ? "active" : ""}`}
        >
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <h2>Thuê Xe Máy & Ô Tô</h2>
                <p>Phương tiện di chuyển thuận tiện, an toàn, giá tốt tại Ninh Bình và Tây Bắc</p>
              </div>
            </div>

            <div className="filter-bar">
              <div className="filter-group">
                <label htmlFor="vehicle-loc-filter">Vị trí:</label>
                <select
                  id="vehicle-loc-filter"
                  className="filter-select"
                  value={vehicleLocFilter}
                  onChange={(e) => setVehicleLocFilter(e.target.value)}
                >
                  <option value="all">Tất cả điểm đến</option>
                  <option value="Sa Pa">Sa Pa, Lào Cai</option>
                  <option value="Đà Lạt">Đà Lạt, Lâm Đồng</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                  <option value="Hà Nội">Hà Nội</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="vehicle-price-filter">Giá tối đa:</label>
                <div className="price-range-wrapper">
                  <input
                    type="range"
                    id="vehicle-price-filter"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={vehiclePriceFilter}
                    onChange={(e) => setVehiclePriceFilter(parseInt(e.target.value))}
                  />
                  <span className="price-val" id="vehicle-price-val">
                    {vehiclePriceFilter.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="filter-group" style={{ marginLeft: "auto" }}>
                <label htmlFor="vehicle-sort">Sắp xếp:</label>
                <select
                  id="vehicle-sort"
                  className="filter-select"
                  value={vehicleSort}
                  onChange={(e) => setVehicleSort(e.target.value)}
                >
                  <option value="rating">Đánh giá tốt nhất</option>
                  <option value="price-asc">Giá từ thấp đến cao</option>
                  <option value="price-desc">Giá từ cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="listings-grid" id="vehicles-list-grid">
              {getFilteredVehicles().length > 0 ? (
                getFilteredVehicles().map((v) => (
                  <ListingCard key={v.id} item={v} />
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Không tìm thấy phương tiện phù hợp bộ lọc của bạn.
                </div>
              )}
            </div>
          </div>
        </section>
        */}

        {/* 3.2. SERVICES SECTION */}
        <section
          id="section-services"
          className={`page-section ${activeSection === "services" ? "active" : ""}`}
        >
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <h2>Dịch Vụ Uy Tín, Tận Tâm</h2>
                <p>Hỗ trợ đặt vé, thuê tàu thuyền, xe đưa đón và hướng dẫn viên bản địa 24/7</p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-bar">
              <div className="filter-group">
                <label htmlFor="service-loc-filter">Vị trí:</label>
                <select
                  id="service-loc-filter"
                  className="filter-select"
                  value={serviceLocFilter}
                  onChange={(e) => setServiceLocFilter(e.target.value)}
                >
                  <option value="all">Tất cả điểm đến</option>
                  <option value="Sa Pa">Sa Pa, Lào Cai</option>
                  <option value="Đà Lạt">Đà Lạt, Lâm Đồng</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="service-price-filter">Giá tối đa:</label>
                <div className="price-range-wrapper">
                  <input
                    type="range"
                    id="service-price-filter"
                    min="100000"
                    max="1000000"
                    step="50000"
                    value={servicePriceFilter}
                    onChange={(e) => setServicePriceFilter(parseInt(e.target.value))}
                  />
                  <span className="price-val" id="service-price-val">
                    {servicePriceFilter.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="filter-group" style={{ marginLeft: "auto" }}>
                <label htmlFor="service-sort">Sắp xếp:</label>
                <select
                  id="service-sort"
                  className="filter-select"
                  value={serviceSort}
                  onChange={(e) => setServiceSort(e.target.value)}
                >
                  <option value="rating">Đánh giá tốt nhất</option>
                  <option value="price-asc">Giá từ thấp đến cao</option>
                  <option value="price-desc">Giá từ cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="listings-grid" id="services-list-grid">
              {getFilteredServices().length > 0 ? (
                getFilteredServices().map((s) => (
                  <ListingCard key={s.id} item={s} />
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Không tìm thấy dịch vụ phù hợp bộ lọc của bạn.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. DASHBOARD SECTION */}
        <section
          id="section-dashboard"
          className={`page-section ${activeSection === "dashboard" ? "active" : ""
            }`}
        >
          <div className="container">
            <div className="dashboard-layout">
              {/* Sidebar Menu */}
              <aside className="dash-sidebar">
                <ul className="dash-menu">
                  <li>
                    <button
                      className={`dash-menu-item ${dashTab === "user-wishlist" ? "active" : ""
                        }`}
                      onClick={() => setDashTab("user-wishlist")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Yêu Thích
                    </button>
                  </li>
                  <li
                    className="divider"
                    style={{ margin: "10px 0", borderTop: "1px solid var(--border)" }}
                  ></li>
                  <li>
                    <button
                      className={`dash-menu-item ${dashTab === "host-stats" ? "active" : ""
                        }`}
                      onClick={() => setDashTab("host-stats")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="21" y1="12" x2="3" y2="12" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                      </svg>
                      Thống Kê Doanh Thu
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dash-menu-item ${dashTab === "host-listing" ? "active" : ""
                        }`}
                      onClick={() => setDashTab("host-listing")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Đăng Tin Mới
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dash-menu-item ${dashTab === "host-manage-listings" ? "active" : ""
                        }`}
                      onClick={() => setDashTab("host-manage-listings")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Quản Lý Tin Đăng
                    </button>
                  </li>
                  {currentUser?.role === "superadmin" && (
                    <li id="menu-item-admin-only">
                      <button
                        className={`dash-menu-item ${dashTab === "admin-users" ? "active" : ""
                          }`}
                        onClick={() => setDashTab("admin-users")}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Quản lý tài khoản
                      </button>
                    </li>
                  )}
                </ul>
              </aside>

              {/* Dynamic Panel Content */}
              <div className="dash-content">
                {/* Panel 1: User Wishlist */}
                {dashTab === "user-wishlist" && (
                  <div id="dash-user-wishlist" className="dash-content-block active">
                    <h3
                      className="summary-title"
                      style={{
                        border: "none",
                        marginBottom: 20,
                        fontSize: "1.5rem",
                      }}
                    >
                      Danh sách yêu thích
                    </h3>
                    <div className="listings-grid" id="user-wishlist-container">
                      {getWishlistItems().length > 0 ? (
                        getWishlistItems().map((item) => (
                          <div className="listing-card" key={item.id}>
                            <div className="card-img-wrapper">
                              <span className="badge-tag">
                                {item.type === "stay" ? "Homestay" : "Tour"}
                              </span>
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="card-img"
                              />
                              <button
                                className="wishlist-btn active"
                                onClick={(e) => toggleWishlist(item.id, e)}
                              >
                                <svg viewBox="0 0 24 24">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                              </button>
                            </div>
                            <div className="card-body">
                              <div className="card-meta">
                                <span className="card-category">{item.category}</span>
                                <span className="card-rating">★ {item.rating}</span>
                              </div>
                              <h3 className="card-title">{item.name}</h3>
                              <div className="card-location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{item.location}</span>
                              </div>
                              <div className="card-footer">
                                <div className="card-price">
                                  <span className="price-label">Giá chỉ từ</span>
                                  <span className="price-amt">
                                    {formatVND(item.price)}
                                    <span className="price-unit">
                                      {item.type === "stay" ? "/đêm" : "/khách"}
                                    </span>
                                  </span>
                                </div>
                                <button
                                  className="btn-primary"
                                  onClick={() => openDetail(item)}
                                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                                >
                                  Chi tiết
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            gridColumn: "1 / -1",
                            textAlign: "center",
                            padding: 40,
                            color: "var(--text-muted)",
                            border: "2px dashed var(--border)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            style={{
                              width: 48,
                              height: 48,
                              marginBottom: 15,
                              opacity: 0.5,
                            }}
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <p>
                            Chưa có mục yêu thích nào. Hãy nhấp vào trái tim tại
                            trang sản phẩm!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Panel 2: Host Revenue Stats */}
                {dashTab === "host-stats" && (
                  <div id="dash-host-stats" className="dash-content-block active">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 25,
                      }}
                    >
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
                        Báo Cáo Doanh Thu Chủ Nhà
                      </h3>
                      <span className="status-badge upcoming">
                        Chế độ Host hoạt động
                      </span>
                    </div>
                    <div className="host-stats-grid">
                      <div className="stat-box">
                        <span className="stat-label">Doanh thu ước tính</span>
                        <div className="stat-val" id="host-stat-revenue">
                          45.500.000đ
                        </div>
                        <span className="stat-change">
                          ↑ 12.4% so với tháng trước
                        </span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Số lượt quan tâm</span>
                        <div className="stat-val" id="host-stat-bookings">
                          {stays.length + tours.length}
                        </div>
                        <span className="stat-change">Từ form liên hệ</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">
                          Tỷ lệ lấp phòng trung bình
                        </span>
                        <div className="stat-val" id="host-stat-occupancy">
                          82.5%
                        </div>
                        <span className="stat-change">↑ 4.2% so với quý I</span>
                      </div>
                    </div>

                    {/* Dynamic Revenue Chart */}
                    <div className="chart-wrapper">
                      <div className="chart-header">
                        <div className="chart-title">
                          Thống Kê Doanh Thu Tuần Gần Nhất (VND)
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Đơn vị: Triệu đồng
                        </span>
                      </div>
                      {renderRevenueChart()}
                    </div>
                  </div>
                )}

                {/* Panel 3: Host Create Listing */}
                {dashTab === "host-listing" && (
                  <div id="dash-host-listing" className="dash-content-block active">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        marginBottom: 25,
                      }}
                    >
                      Thêm Tin Cho Thuê Hoặc Tour Mới
                    </h3>
                    <form
                      id="new-listing-form"
                      className="form-grid"
                      onSubmit={handleCreateListingSubmit}
                    >
                      <div className="form-group">
                        <label htmlFor="list-type">Loại hình sản phẩm</label>
                        <select
                          id="list-type"
                          value={listType}
                          onChange={(e) => setListType(e.target.value)}
                          required
                        >
                          <option value="stay">Homestay / Phòng nghỉ</option>
                          <option value="tour">Tour trekking / khám phá</option>
                          <option value="vehicle">Thuê xe máy & ô tô</option>
                          <option value="service">Dịch vụ uy tín, tận tâm</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="list-category">Danh mục chi tiết</label>
                        <input
                          type="text"
                          id="list-category"
                          placeholder="Ví dụ: Homestay Premium, Trekking Mạo Hiểm"
                          value={listCategory}
                          onChange={(e) => setListCategory(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group full-width">
                        <label htmlFor="list-name">Tiêu đề tin đăng</label>
                        <input
                          type="text"
                          id="list-name"
                          placeholder="Ví dụ: Sa Pa Valley View Bungalow..."
                          value={listName}
                          onChange={(e) => setListName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="list-price">
                          Đơn giá (VND / đêm hoặc khách)
                        </label>
                        <input
                          type="number"
                          id="list-price"
                          min="100000"
                          placeholder="Đơn vị: VNĐ"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="list-location">Địa điểm</label>
                        <input
                          type="text"
                          id="list-location"
                          placeholder="Ví dụ: Tả Van, Sa Pa"
                          value={listLocation}
                          onChange={(e) => setListLocation(e.target.value)}
                          required
                        />
                      </div>
                      {listType === "stay" && (
                        <div className="form-group" id="group-guests">
                          <label htmlFor="list-guests">
                            Số lượng khách tối đa
                          </label>
                          <input
                            type="number"
                            id="list-guests"
                            min="1"
                            value={listGuests}
                            onChange={(e) => setListGuests(e.target.value)}
                          />
                        </div>
                      )}
                      {listType === "tour" && (
                        <div className="form-group" id="group-difficulty">
                          <label htmlFor="list-difficulty">Độ khó của Tour</label>
                          <select
                            id="list-difficulty"
                            value={listDifficulty}
                            onChange={(e) => setListDifficulty(e.target.value)}
                          >
                            <option value="Dễ">Dễ</option>
                            <option value="Vừa">Vừa</option>
                            <option value="Khó">Khó</option>
                          </select>
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="list-image">
                          Liên kết hình ảnh (hoặc dùng mặc định)
                        </label>
                        <select
                          id="list-image"
                          value={listImage}
                          onChange={(e) => setListImage(e.target.value)}
                        >
                          <option value="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80">
                            Sapa Bungalow Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80">
                            Dalat Cabin Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80">
                            Fansipan Trekking Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80">
                            Ninh Binh Green Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80">
                            Motorbike Rental Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80">
                            Car Rental Style
                          </option>
                          <option value="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80">
                            Ticket / Tour Guide Style
                          </option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="list-phone">Số điện thoại / Zalo liên hệ</label>
                        <input
                          type="text"
                          id="list-phone"
                          placeholder="Ví dụ: 0988 123 456"
                          value={listPhone}
                          onChange={(e) => setListPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="list-fb">Facebook Page liên hệ</label>
                        <input
                          type="text"
                          id="list-fb"
                          value="https://facebook.com/mountaingoattravel"
                          disabled
                          style={{ opacity: 0.7, cursor: "not-allowed", backgroundColor: "var(--border)" }}
                        />
                      </div>
                      <div className="form-group full-width">
                        <label htmlFor="list-desc">Mô tả chi tiết</label>
                        <textarea
                          id="list-desc"
                          rows="4"
                          placeholder="Mô tả không gian nghỉ dưỡng hoặc lộ trình tour..."
                          value={listDesc}
                          onChange={(e) => setListDesc(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="form-group full-width">
                        <button
                          type="submit"
                          className="btn-primary"
                          style={{ justifyContent: "center", padding: "12px 0" }}
                        >
                          Đăng Tin Ngay
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Panel: Host Manage Listings */}
                {dashTab === "host-manage-listings" && (
                  <div id="dash-host-manage-listings" className="dash-content-block active">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        marginBottom: 25,
                      }}
                    >
                      Quản Lý Tin Đăng
                    </h3>
                    <div className="manage-listings-wrapper" style={{ overflowX: "auto" }}>
                      {getManageListings().length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                          <thead>
                            <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                              <th style={{ padding: 10 }}>Hình ảnh</th>
                              <th style={{ padding: 10 }}>Tiêu đề</th>
                              <th style={{ padding: 10 }}>Loại</th>
                              <th style={{ padding: 10 }}>Giá</th>
                              <th style={{ padding: 10 }}>Vị trí</th>
                              <th style={{ padding: 10 }}>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getManageListings().map((item) => {
                              let typeName = "Homestay";
                              if (item.type === "tour") typeName = "Tour";
                              else if (item.type === "vehicle") typeName = "Thuê xe";
                              else if (item.type === "service") typeName = "Dịch vụ";
                              
                              return (
                                <tr key={item.id} style={{ borderBottom: "1px solid var(--border)", fontSize: "0.95rem" }}>
                                  <td style={{ padding: 10 }}>
                                    <img
                                      src={item.images[0]}
                                      alt={item.name}
                                      style={{ width: 60, height: 45, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                                    />
                                  </td>
                                  <td style={{ padding: 10, fontWeight: 600 }}>{item.name}</td>
                                  <td style={{ padding: 10 }}>
                                    <span className="status-badge upcoming" style={{ fontSize: "0.8rem", padding: "4px 8px" }}>{typeName}</span>
                                  </td>
                                  <td style={{ padding: 10, color: "var(--accent)", fontWeight: 700 }}>
                                    {formatVND(item.price)}
                                  </td>
                                  <td style={{ padding: 10 }}>{item.location}</td>
                                  <td style={{ padding: 10 }}>
                                    <button
                                      className="btn-secondary"
                                      style={{
                                        padding: "6px 12px",
                                        color: "#ff4d4f",
                                        border: "1px solid #ff4d4f",
                                        background: "rgba(255, 77, 79, 0.1)",
                                        fontSize: "0.85rem",
                                        borderRadius: "var(--radius-sm)",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                      onClick={() => handleDeleteListing(item.id, item.type)}
                                    >
                                      Xóa
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>
                          Bạn chưa đăng tin nào hoặc không có tin để quản lý.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Panel 4: Admin User Management (Visible to superadmin) */}
                {dashTab === "admin-users" && currentUser?.role === "superadmin" && (
                  <div id="dash-admin-users" className="dash-content-block active">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        marginBottom: 25,
                      }}
                    >
                      Quản lý tài khoản Admin
                    </h3>
                    <div
                      className="form-container"
                      style={{
                        background: "var(--bg-card)",
                        padding: 20,
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        marginBottom: 30,
                      }}
                    >
                      <h4 style={{ marginBottom: 15 }}>
                        Cấp tài khoản Admin mới
                      </h4>
                      <form
                        id="create-admin-form"
                        className="form-grid"
                        onSubmit={handleCreateAdminSubmit}
                      >
                        <div className="form-group">
                          <label htmlFor="admin-name">Họ tên</label>
                          <input
                            type="text"
                            id="admin-name"
                            placeholder="Nguyễn Văn A"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="admin-email">Email (Tài khoản)</label>
                          <input
                            type="email"
                            id="admin-email"
                            placeholder="admin2@mountaingoat.vn"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="admin-password">Mật khẩu</label>
                          <input
                            type="password"
                            id="admin-password"
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ display: "flex", alignItems: "flex-end" }}
                        >
                          <button
                            type="submit"
                            className="btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              padding: "10px 0",
                            }}
                          >
                            Tạo tài khoản
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="admin-list-wrapper">
                      <h4 style={{ marginBottom: 15 }}>Danh sách tài khoản</h4>
                      <div id="admin-users-list">
                        {admins.length > 0 ? (
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginTop: 10,
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  textAlign: "left",
                                  borderBottom: "2px solid var(--border)",
                                }}
                              >
                                <th style={{ padding: 10 }}>Họ tên</th>
                                <th style={{ padding: 10 }}>Email</th>
                                <th style={{ padding: 10 }}>Vai trò</th>
                              </tr>
                            </thead>
                            <tbody>
                              {admins.map((u) => (
                                <tr
                                  key={u.id}
                                  style={{ borderBottom: "1px solid var(--border)" }}
                                >
                                  <td style={{ padding: 10 }}>{u.name}</td>
                                  <td style={{ padding: 10 }}>{u.email}</td>
                                  <td style={{ padding: 10 }}>
                                    <span
                                      className={`status-badge ${u.role === "superadmin"
                                        ? "upcoming"
                                        : "completed"
                                        }`}
                                    >
                                      {u.role}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ color: "var(--text-muted)" }}>
                            Chưa có tài khoản nào hoặc không có quyền truy cập.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL: STAY / TOUR DETAIL */}
      {isDetailModalOpen && selectedItem && (
        <div id="detail-modal" className="modal-overlay active">
          <div className="modal-wrapper">
            <button
              className="modal-close"
              id="btn-close-detail"
              title="Đóng"
              onClick={() => setIsDetailModalOpen(false)}
            >
              &times;
            </button>
            <div className="detail-grid">
              {/* Left Side: Gallery & Info */}
              <div className="detail-main">
                <div className="detail-gallery">
                  <img
                    className="gallery-main"
                    id="modal-gallery-img"
                    src={selectedMainImg}
                    alt={selectedItem.name}
                  />
                  <div className="gallery-thumbs" id="modal-gallery-thumbs">
                    {selectedItem.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="thumbnail"
                        className={`thumb ${selectedMainImg === img ? "active" : ""}`}
                        onClick={() => setSelectedMainImg(img)}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="detail-title" id="modal-detail-title">
                  {selectedItem.name}
                </h2>
                <div
                  className="card-location"
                  id="modal-detail-loc"
                  style={{ marginBottom: 15 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 16, height: 16 }}
                  >
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{selectedItem.location}</span>
                </div>
                <p className="detail-desc" id="modal-detail-desc">
                  {selectedItem.description}
                </p>

                {/* Special characteristics */}
                <div id="modal-spec-container">
                  {selectedItem.type === "stay" ? (
                    <>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.15rem",
                          marginBottom: 12,
                        }}
                      >
                        Tiện Nghi Chỗ Ở
                      </h3>
                      <div className="amenities-list">
                        {selectedItem.amenities.map((am, idx) => (
                          <div className="amenity-item" key={idx}>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.15rem",
                          marginBottom: 15,
                        }}
                      >
                        Lộ Trình Tour
                      </h3>
                      <div className="itinerary-timeline">
                        {selectedItem.itinerary.map((step, idx) => (
                          <div className="itinerary-step" key={idx}>
                            <span className="step-day">Ngày {step.day}</span>
                            <h4 className="step-title">{step.title}</h4>
                            <p className="step-desc">{step.details}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Interactive Review list */}
                <div className="reviews-section">
                  <div className="reviews-header">
                    <h3>
                      Đánh Giá Khách Hàng (
                      <span id="modal-rev-count">{selectedItem.reviewsCount}</span>
                      )
                    </h3>
                    <div
                      className="card-rating"
                      id="modal-rev-avg"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ★ {selectedItem.rating.toFixed(2)}
                    </div>
                  </div>
                  <div className="reviews-list" id="modal-reviews-list">
                    {reviews.filter((r) => r.targetId === selectedItem.id).length >
                      0 ? (
                      reviews
                        .filter((r) => r.targetId === selectedItem.id)
                        .map((r) => (
                          <div className="review-item" key={r.id}>
                            <div className="review-user">
                              <img
                                src={r.userAvatar}
                                alt={r.userName}
                                className="review-avatar"
                              />
                              <div>
                                <div className="review-name">{r.userName}</div>
                                <div className="review-date">{r.date}</div>
                              </div>
                              <div className="review-stars">
                                {"★".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                              </div>
                            </div>
                            <p className="review-comment">{r.comment}</p>
                          </div>
                        ))
                    ) : (
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          padding: "10px 0",
                        }}
                      >
                        Chưa có nhận xét nào cho dịch vụ này. Hãy là người đầu tiên
                        đánh giá!
                      </p>
                    )}
                  </div>

                  {/* Submit Review Form */}
                  <div className="review-form">
                    <h4>Viết Đánh Giá Của Bạn</h4>
                    <div className="review-rating-select" id="star-rating-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star-input ${reviewStars >= star ? "active" : ""
                            }`}
                          onClick={() => setReviewStars(star)}
                          style={{ cursor: "pointer" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea
                      id="review-comment-input"
                      placeholder="Chia sẻ trải nghiệm thực tế của bạn..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                    <button
                      className="btn-primary"
                      id="btn-submit-review"
                      onClick={submitReview}
                    >
                      Gửi Đánh Giá
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Panel */}
              <div className="detail-sidebar">
                <div className="sidebar-sticky-box">
                  <div className="price-calc-row" style={{ marginBottom: 20 }}>
                    <span className="price-label">Giá tham khảo</span>
                    <div>
                      <span className="amt" id="modal-sidebar-price">
                        {formatVND(selectedItem.price)}
                      </span>
                      <span className="price-unit" id="modal-sidebar-unit">
                        {selectedItem.type === "stay" ? "/đêm" : "/khách"}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginBottom: 20,
                    }}
                  >
                    Giá có thể thay đổi tùy theo thời điểm và số lượng khách. Vui
                    lòng liên hệ để nhận báo giá chính xác nhất.
                  </p>

                  {(selectedItem.type === "stay" || selectedItem.type === "tour") && (
                    <div className="vehicle-addon-box" style={{
                      marginTop: 20,
                      marginBottom: 20,
                      padding: 15,
                      background: "var(--bg)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)"
                    }}>
                      <h4 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        marginBottom: 12,
                        color: "var(--text)",
                        letterSpacing: "0.5px"
                      }}>
                        ĐĂNG KÝ XE ĐƯA ĐÓN & THUÊ XE
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text)" }}>
                          <input
                            type="checkbox"
                            checked={needShuttle}
                            onChange={(e) => setNeedShuttle(e.target.checked)}
                            style={{ marginTop: 3 }}
                          />
                          <div>
                            <strong>Đặt hộ xe đưa đón tận nơi</strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                              Hỗ trợ đặt xe Limousine / Xe riêng đưa đón Hà Nội - homestay.
                            </div>
                          </div>
                        </label>

                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text)" }}>
                          <input
                            type="checkbox"
                            checked={needMotorbike}
                            onChange={(e) => setNeedMotorbike(e.target.checked)}
                            style={{ marginTop: 3 }}
                          />
                          <div>
                            <strong>Thuê xe máy tự lái tại điểm đến</strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                              Hỗ trợ thuê xe máy giao nhận trực tiếp tại Homestay/Tour.
                            </div>
                          </div>
                        </label>

                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text)" }}>
                          <input
                            type="checkbox"
                            checked={needPrivateCar}
                            onChange={(e) => setNeedPrivateCar(e.target.checked)}
                            style={{ marginTop: 3 }}
                          />
                          <div>
                            <strong>Thuê ô tô tự lái / kèm tài xế</strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                              Hỗ trợ đặt xe 4-7 chỗ phục vụ nhu cầu tham quan tự do.
                            </div>
                          </div>
                        </label>
                      </div>

                      {(needShuttle || needMotorbike || needPrivateCar) && (
                        <div style={{
                          marginTop: 15,
                          padding: 10,
                          backgroundColor: "rgba(37, 211, 102, 0.08)",
                          borderLeft: "3px solid #25D366",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.8rem",
                          color: "var(--text)",
                          animation: "fadeIn 0.3s ease"
                        }}>
                          <strong>Dịch vụ hỗ trợ đã chọn:</strong>
                          <ul style={{ margin: "5px 0 0 15px", padding: 0 }}>
                            {needShuttle && <li>Đặt hộ xe đưa đón tận nơi</li>}
                            {needMotorbike && <li>Hỗ trợ thuê xe máy tự lái</li>}
                            {needPrivateCar && <li>Hỗ trợ thuê xe ô tô đi lại</li>}
                          </ul>
                          <div style={{ marginTop: 6, fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
                            * Mountain Goat sẽ chủ động liên hệ Zalo/Hotline để tư vấn, báo giá chi tiết và chuẩn bị xe tốt nhất cho quý khách!
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="contact-box-detail" style={{
                    marginTop: 15,
                    padding: 15,
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}>
                    <h4 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      marginBottom: 12,
                      color: "var(--text)",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}>
                      LIÊN HỆ TƯ VẤN
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <a
                        href={`tel:${selectedItem.contactPhone || "0988 123 456"}`}
                        className="btn-primary"
                        style={{
                          justifyContent: "center",
                          gap: 8,
                          padding: "10px",
                          fontSize: "0.95rem",
                          color: "#fff",
                          backgroundColor: "#25D366",
                          border: "none",
                          borderRadius: "var(--radius-md)"
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Hotline: {selectedItem.contactPhone || "0988 123 456"}
                      </a>

                      <a
                        href={`https://zalo.me/${(selectedItem.contactPhone || "0988 123 456").replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent"
                        style={{
                          justifyContent: "center",
                          gap: 8,
                          padding: "10px",
                          fontSize: "0.95rem",
                          color: "#fff",
                          backgroundColor: "#0068FF",
                          border: "none",
                          borderRadius: "var(--radius-md)"
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Zalo:</span> {selectedItem.contactPhone || "0988 123 456"}
                      </a>

                      <a
                        href={selectedItem.facebookPage || "https://facebook.com/mountaingoattravel"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{
                          justifyContent: "center",
                          gap: 8,
                          padding: "10px",
                          fontSize: "0.95rem",
                          color: "#fff",
                          backgroundColor: "#1877F2",
                          border: "none",
                          borderRadius: "var(--radius-md)"
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        Facebook Page
                      </a>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 20,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ width: 18, height: 18, color: "var(--primary)" }}
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Tư vấn 24/7</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ width: 18, height: 18, color: "var(--primary)" }}
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Hỗ trợ đặt vé, xe đưa đón</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOGIN */}
      {isLoginModalOpen && (
        <div id="login-modal" className="modal-overlay active">
          <div className="modal-wrapper" style={{ maxWidth: 400 }}>
            <button
              className="modal-close"
              id="btn-close-login"
              title="Đóng"
              onClick={() => setIsLoginModalOpen(false)}
            >
              &times;
            </button>
            <div style={{ padding: "40px 30px" }}>
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <img
                  src="/assets/logo_sharp.png"
                  alt="Logo"
                  style={{ height: 60, marginBottom: 15 }}
                />
                <h2 style={{ fontFamily: "var(--font-display)" }}>
                  Đăng nhập Admin
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Hệ thống quản lý Mountain Goat Travel
                </p>
              </div>
              <form id="login-form" onSubmit={handleLoginSubmit}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label htmlFor="login-email">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="admin@mountaingoat.vn"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 30 }}>
                  <label htmlFor="login-password">Mật khẩu</label>
                  <input
                    type="password"
                    id="login-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "12px 0",
                    fontSize: "1rem",
                  }}
                >
                  Đăng Nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONTACT */}
      {isContactModalOpen && (
        <div id="contact-modal" className="modal-overlay active">
          <div className="modal-wrapper" style={{ maxWidth: 500 }}>
            <button
              className="modal-close"
              id="btn-close-contact"
              title="Đóng"
              onClick={() => setIsContactModalOpen(false)}
            >
              &times;
            </button>
            <div style={{ padding: "40px 30px", textAlign: "center" }}>
              <div style={{ marginBottom: 25 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 40, height: 40 }}
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 10 }}>
                  Liên Hệ Đặt Chỗ
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                  Vui lòng liên hệ trực tiếp với chúng tôi để được tư vấn và hỗ
                  trợ đặt dịch vụ tốt nhất.
                </p>
              </div>

              <div
                className="contact-info-grid"
                style={{ display: "grid", gap: 15, textAlign: "left", marginBottom: 30 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    padding: 15,
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ color: "var(--primary)" }}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 24, height: 24 }}
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Hotline / Zalo
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                      1900 6868 / 0988 123 456
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    padding: 15,
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ color: "var(--primary)" }}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 24, height: 24 }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Email
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                      hello@mountaingoat.vn
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                id="btn-close-contact-action"
                style={{ width: "100%", justifyContent: "center", padding: "12px 0" }}
                onClick={() => setIsContactModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 15,
              }}
            >
              <img
                src="/assets/logo_clean.png"
                alt="Mountain Goat Logo"
                style={{ height: 45, width: "auto", objectFit: "contain" }}
              />
              <h3 style={{ marginBottom: 0 }}>Mountain Goat Travel</h3>
            </div>
            <p>
              Nhà tổ chức các tour trải nghiệm núi cao độc bản và cung cấp chỗ
              ở homestay bản địa chuẩn chất lượng hàng đầu tại Việt Nam. Đồng
              hành cùng phát triển du lịch cộng đồng bền vững.
            </p>
          </div>
          <div className="footer-links-col">
            <h4>Về Chúng Tôi</h4>
            <ul>
              <li>
                <a href="#home" onClick={() => setActiveSection("home")}>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#stays" onClick={() => setActiveSection("stays")}>
                  Danh sách Homestay
                </a>
              </li>
              <li>
                <a href="#tours" onClick={() => setActiveSection("tours")}>
                  Danh sách Tours
                </a>
              </li>
              <li>
                <a href="#vehicles" onClick={() => setActiveSection("vehicles")}>
                  Thuê Xe Máy & Ô Tô
                </a>
              </li>
              <li>
                <a href="#services" onClick={() => setActiveSection("services")}>
                  Dịch Vụ Uy Tín
                </a>
              </li>
              <li>
                <a
                  href="#dashboard"
                  onClick={() => {
                    if (currentUser) {
                      setActiveSection("dashboard");
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                >
                  Bảng điều khiển
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>Điểm Đến Hot</h4>
            <ul>
              <li>
                <a
                  href="#stays"
                  onClick={() => {
                    setActiveSection("stays");
                    setStayLocFilter("Sa Pa");
                  }}
                >
                  Sa Pa - Lào Cai
                </a>
              </li>
              <li>
                <a
                  href="#stays"
                  onClick={() => {
                    setActiveSection("stays");
                    setStayLocFilter("Đà Lạt");
                  }}
                >
                  Đà Lạt - Lâm Đồng
                </a>
              </li>
              <li>
                <a
                  href="#stays"
                  onClick={() => {
                    setActiveSection("stays");
                    setStayLocFilter("Ninh Bình");
                  }}
                >
                  Tràng An - Ninh Bình
                </a>
              </li>
              <li>
                <a
                  href="#stays"
                  onClick={() => {
                    setActiveSection("stays");
                    setStayLocFilter("Y Tý");
                  }}
                >
                  Y Tý - Bát Xát
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>Liên Hệ</h4>
            <ul>
              <li>Email: hello@mountaingoat.vn</li>
              <li>Hotline: 1900 6868</li>
              <li>Địa chỉ: Hoa Lư, Ninh Bình</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Mountain Goat Travel.</p>
          <p>Điều khoản dịch vụ | Chính sách bảo mật</p>
        </div>
      </footer>
    </>
  );
}
