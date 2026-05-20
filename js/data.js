// Data module for Mountain Goat Travel (MGT)
// Contains high-quality, realistic listings for Homestays, Rooms, and Tours.

const MGT_DATA = {
  stays: [
    {
      id: "stay-sapa-01",
      name: "Sapa Cloud Retreat & Bungalow",
      category: "Homestay Premium",
      type: "stay",
      location: "Tả Van, Sa Pa, Lào Cai",
      price: 1350000, // VND per night
      rating: 4.9,
      reviewsCount: 154,
      description: "Nằm ẩn mình giữa những tầng mây của thung lũng Mường Hoa, Sapa Cloud Retreat mang đến trải nghiệm nghỉ dưỡng mộc mạc nhưng không kém phần sang trọng. Các bungalow được làm từ gỗ tự nhiên, tre nứa bản địa với ban công rộng mở ngắm trọn ruộng bậc thang kỳ vĩ. Buổi sáng, bạn có thể thưởng thức ly cà phê ấm nóng khi sương mù tràn qua ô cửa kính.",
      amenities: ["Wi-Fi tốc độ cao", "View thung lũng ruộng bậc thang", "Bếp sưởi củi ấm áp", "Dịch vụ BBQ ngoài trời", "Bể ngâm nước nóng thảo dược", "Ăn sáng miễn phí", "Bãi đỗ xe rộng rãi"],
      images: [
        "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        name: "A Hờ & Chị Mây",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Chủ nhà siêu cấp"
      },
      featured: true,
      maxGuests: 4
    },
    {
      id: "stay-dalat-01",
      name: "Dalat Pine Chalet & Glasshouse",
      category: "Cabin Biệt Thự",
      type: "stay",
      location: "Phường 11, Đà Lạt, Lâm Đồng",
      price: 1850000,
      rating: 4.85,
      reviewsCount: 98,
      description: "Thiết kế nhà kính độc đáo ẩn mình dưới những rặng thông già rì rào của Đà Lạt. Pine Chalet mang phong cách Bắc Âu kết hợp giữa gỗ thông ấm áp và các mảng kính lớn đón nắng ngập tràn. Nơi đây sở hữu khu vườn nhỏ trồng hoa cẩm tú cầu, lò sưởi hiện đại trong nhà và bồn tắm gỗ bách ngoài trời cực kỳ lãng mạn cho các cặp đôi.",
      amenities: ["Wi-Fi miễn phí", "Bồn tắm bách thảo dược ngoài trời", "Lò sưởi ấm cúng", "Khu BBQ & Sân vườn", "Máy chiếu phim HD", "Nhà bếp đầy đủ dụng cụ", "Thân thiện với thú cưng"],
      images: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        name: "Minh Thư",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Phản hồi nhanh"
      },
      featured: true,
      maxGuests: 2
    },
    {
      id: "stay-ninhbinh-01",
      name: "Tràng An Karst Valley Homestay",
      category: "Homestay Sinh Thái",
      type: "stay",
      location: "Trường Yên, Hoa Lư, Ninh Bình",
      price: 950000,
      rating: 4.92,
      reviewsCount: 210,
      description: "Nằm ngay chân những dãy núi đá vôi triệu năm tuổi của di sản Tràng An. Homestay có hồ bơi vô cực ngắm nhìn ra hồ nước xanh ngắt và vách đá sừng sững. Khách lưu trú được sử dụng xe đạp miễn phí để dạo quanh các cánh đồng lúa chín và khám phá chùa cổ trong hang đá bên cạnh.",
      amenities: ["Hồ bơi vô cực ngoài trời", "Xe đạp miễn phí", "View núi đá vôi hùng vĩ", "Wi-Fi miễn phí", "Nhà hàng món ăn bản địa", "Tour chèo thuyền kayak", "Điều hòa nhiệt độ"],
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        name: "Chú Khánh",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Người bản địa am hiểu"
      },
      featured: false,
      maxGuests: 3
    },
    {
      id: "stay-mocchau-01",
      name: "Mộc Châu Tea Hill Wooden House",
      category: "Nhà gỗ Đồi chè",
      type: "stay",
      location: "Thị trấn Mộc Châu, Sơn La",
      price: 800000,
      rating: 4.78,
      reviewsCount: 64,
      description: "Những căn nhà gỗ hình chóp xinh xắn nằm ngay giữa đồi chè trái tim Mộc Châu xanh mướt. Sáng sớm thức dậy đón bình minh lơ đãng giữa luống chè ngậm sương, tận hưởng không khí trong lành của cao nguyên lộng gió. Phù hợp cho những ai muốn 'trốn' sự xô bồ của thành thị.",
      amenities: ["Wi-Fi miễn phí", "View đồi chè 360 độ", "Sân cỏ cắm trại", "Dịch vụ thuê trang phục dân tộc", "Thu hoạch chè trải nghiệm", "Bình nước nóng siêu tốc", "Bếp chung"],
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        name: "Hoàng Đức",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Thân thiện chu đáo"
      },
      featured: false,
      maxGuests: 2
    },
    {
      id: "stay-yty-01",
      name: "Y Tý Cloud Hunter Nest",
      category: "Nhà Trình Tường Hà Nhì",
      type: "stay",
      location: "Lao Chải, Y Tý, Bát Xát, Lào Cai",
      price: 650000,
      rating: 4.95,
      reviewsCount: 42,
      description: "Trải nghiệm lưu trú tại ngôi nhà trình tường bằng đất nện độc đáo của người Hà Nhì, tường đất dày giữ ấm vào mùa đông và mát mẻ vào mùa hè. Nằm ở độ cao trên 2.000m, đây là điểm săn mây lý tưởng bậc nhất Việt Nam. Bạn có thể đón 'biển mây' ngay tại hiên nhà vào những ngày thu đông.",
      amenities: ["Bữa tối gia đình Hà Nhì", "Trà tuyết san cổ thụ miễn phí", "Tắm lá thuốc người Dao đỏ", "Bếp lửa sưởi ấm truyền thống", "Wi-Fi cơ bản", "Hỗ trợ dẫn đường săn mây"],
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        name: "Ly Xá Xoe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
        badge: "Chuyên gia săn mây"
      },
      featured: true,
      maxGuests: 5
    }
  ],
  tours: [
    {
      id: "tour-fansipan-01",
      name: "Trekking Chinh Phục Đỉnh Fansipan - Mái Nhà Đông Dương",
      category: "Trekking Mạo Hiểm",
      type: "tour",
      location: "Dãy Hoàng Liên Sơn, Sa Pa, Lào Cai",
      price: 2850000, // VND per guest
      duration: "2 ngày 1 đêm",
      difficulty: "Khó",
      rating: 4.95,
      reviewsCount: 312,
      description: "Hành trình trekking huyền thoại vượt qua những cánh rừng trúc rậm rạp, những con dốc dựng đứng thử thách ý chí để đứng trên đỉnh Fansipan ở độ cao 3.143m. Cảm nhận niềm kiêu hãnh tột cùng khi chạm tay vào chóp inox, phóng tầm mắt ngắm nhìn biển mây cuồn cuộn dưới ánh nắng bình minh rực rỡ.",
      inclusions: ["Vé vườn quốc gia & Lệ phí leo núi", "Hướng dẫn viên & Porter mang đồ", "Các bữa ăn suốt tuyến (bữa nóng trên núi)", "Túi ngủ, lều trại cách nhiệt", "Chứng nhận & Huy chương leo núi", "Bảo hiểm du lịch 50,000,000 VND"],
      itinerary: [
        {
          day: 1,
          title: "Trạm Tôn (1.900m) lên Trạm 2 (2.800m)",
          details: "Xe đón tại Sa Pa di chuyển lên Trạm Tôn. Bắt đầu hành trình leo dốc thoai thoải qua rừng nguyên sinh, dừng chân ăn trưa cạnh suối thơ mộng. Buổi chiều dốc cao hơn thử thách sức bền, đến điểm cắm trại 2.800m trước khi trời tối. Ăn tối ấm cúng do các porter bản địa chuẩn bị bên bếp lửa dã chiến."
        },
        {
          day: 2,
          title: "Trạm 2 lên Đỉnh Fansipan (3.143m) - Trở về Sa Pa",
          details: "Thức dậy lúc 4:00 sáng leo chặng cuối vượt dốc đá hiểm trở đón bình minh. Chạm đỉnh Fansipan lúc 6:30 sáng, chụp ảnh lưu niệm vinh quang. Sau đó xuống núi theo lối cũ về lại Trạm Tôn, xe trung chuyển đưa về Sa Pa. Tận hưởng dịch vụ tắm lá thuốc Dao Đỏ hồi phục thể lực."
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
      ],
      departureDates: ["Thứ 7 hàng tuần", "25/05/2026", "01/06/2026", "08/06/2026"],
      featured: true
    },
    {
      id: "tour-hagiang-01",
      name: "Khám Phá Hà Giang Loop - Con Đường Hạnh Phúc",
      category: "Tour Trải Nghiệm Xe Máy",
      type: "tour",
      location: "Hà Giang - Đồng Văn - Mèo Vạc",
      price: 3600000,
      duration: "3 ngày 2 đêm",
      difficulty: "Vừa",
      rating: 4.9,
      reviewsCount: 189,
      description: "Chinh phục những cung đường đèo uốn lượn ngoạn mục nhất hành tinh, ngắm nhìn cao nguyên đá Đồng Văn kỳ vĩ và dòng sông Nho Quế xanh ngọc bích ẩn dưới đèo Mã Pí Lèng sâu thẳm. Bạn sẽ đi cùng các xế bản địa cực kỳ thân thiện và chuyên nghiệp, khám phá bản làng dân tộc Mông, Dao đầy sắc màu văn hóa.",
      inclusions: ["Xe máy bán tự động & Xăng suốt tuyến", "Tài xế bản địa kiêm hướng dẫn viên (Easy Rider)", "Phòng homestay bản địa sạch đẹp", "Vé tham quan & Thuyền sông Nho Quế", "Tất cả các bữa ăn chính đặc sản", "Giáp bảo hộ chân tay & Mũ bảo hiểm chất lượng"],
      itinerary: [
        {
          day: 1,
          title: "Hà Giang - Quản Bạ - Yên Minh",
          details: "Khởi hành từ TP Hà Giang, chinh phục dốc Bắc Sum quanh co. Ghé Cổng trời Quản Bạ ngắm núi đôi Cô Tiên quyến rũ. Đi xuyên qua những cánh rừng thông Yên Minh mát lành, nhận phòng nghỉ ngơi và thưởng thức lẩu gà đen thơm phức."
        },
        {
          day: 2,
          title: "Yên Minh - Đồng Văn - Đèo Mã Pí Lèng - Mèo Vạc",
          details: "Vượt dốc Thẩm Mã huyền thoại, thăm Dinh thự Vua Mèo cổ kính và Làng văn hóa Lũng Cẩm (nhà của Pao). Chinh phục 'tứ đại đỉnh đèo' Mã Pí Lèng hùng vĩ, chèo thuyền Kayak trên sông Nho Quế lướt qua hẻm vực Tu Sản sâu nhất Đông Nam Á. Tối giao lưu văn nghệ tại homestay."
        },
        {
          day: 3,
          title: "Mèo Vạc - Mậu Duệ - Hà Giang",
          details: "Thưởng ngoạn cung đường Mậu Duệ với ruộng bậc thang trập trùng, vượt dốc cua chữ M kỳ lạ. Trở lại TP Hà Giang tắm rửa, ăn nhẹ trước khi lên xe limousine giường nằm chất lượng cao về Hà Nội."
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
      ],
      departureDates: ["Thứ 5 & Thứ 6 hàng tuần", "28/05/2026", "29/05/2026", "04/06/2026"],
      featured: true
    },
    {
      id: "tour-phongnha-01",
      name: "Thám Hiểm Hệ Thống Hang Động Phong Nha - Kẻ Bàng Wild",
      category: "Thám Hiểm Hang Động",
      type: "tour",
      location: "Vườn quốc gia Phong Nha - Kẻ Bàng, Quảng Bình",
      price: 4500000,
      duration: "2 ngày 1 đêm",
      difficulty: "Khó",
      rating: 4.88,
      reviewsCount: 75,
      description: "Hành trình đưa bạn đi sâu vào lòng di sản thiên nhiên thế giới. Tránh xa lối mòn du lịch thông thường, bạn sẽ được trang bị mũ bảo hiểm có đèn siêu sáng, đai an toàn để trekking 10km xuyên rừng nguyên sinh, bơi trong sông ngầm hang tối mát lạnh và chiêm ngưỡng những khối thạch nhũ lấp lánh như kim cương.",
      inclusions: ["Chuyên gia an toàn & Hướng dẫn viên hang động", "Thiết bị bảo hộ đạt chuẩn quốc tế (Mũ bảo hiểm, đai an toàn, áo phao)", "Vé vào cổng VQG Phong Nha", "Các bữa ăn dã ngoại chất lượng cao", "Lều trại tại khu cắm trại ven sông rừng", "Túi chống nước chuyên dụng"],
      itinerary: [
        {
          day: 1,
          title: "Vượt rừng nguyên sinh Rào Thương - Cắm trại Hang Én",
          details: "Trekking vượt dốc Ba Giàn thử thách, lội suối cát mát lạnh đến bản Đoòng của người Vân Kiều. Sau bữa trưa dã ngoại, tiếp tục hành trình đến Hang Én - hang động lớn thứ 3 thế giới. Thiết lập lều trại trên bãi cát trắng mịn ngay trong hang, ăn tối lãng mạn dưới vòm hang khổng lồ."
        },
        {
          day: 2,
          title: "Khám phá chiều sâu Hang Én - Trở về Phong Nha",
          details: "Đón những tia nắng đầu ngày xuyên thẳng qua cửa hang khổng lồ. Leo lên các khối thạch nhũ chiêm ngưỡng hóa thạch triệu năm tuổi. Bơi lội trong hồ nước ngọc bích tự nhiên. Buổi chiều trekking ngược dốc rừng trở về đường Hồ Chí Minh Tây, xe đón về trung tâm Phong Nha nghỉ ngơi."
        }
      ],
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
      ],
      departureDates: ["Thứ 3 & Thứ 7 hàng tuần", "26/05/2026", "30/05/2026", "02/06/2026"],
      featured: false
    }
  ],
  reviews: [
    {
      id: "rev-01",
      userId: "user-01",
      userName: "Nguyễn Hải Nam",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
      targetId: "stay-sapa-01",
      rating: 5,
      date: "15/05/2026",
      comment: "Homestay tuyệt đẹp! View thẳng ra thung lũng ruộng bậc thang đúng như mô tả. Đêm nằm ngủ nghe tiếng suối róc rách, sương tràn cả vào phòng. Anh chủ A Hờ nhiệt tình vô cùng, nấu ăn rất ngon và giới thiệu nhiều điểm leo núi tự do không mất vé cực đẹp."
    },
    {
      id: "rev-02",
      userId: "user-02",
      userName: "Trần Mai Anh",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      targetId: "tour-fansipan-01",
      rating: 5,
      date: "10/05/2026",
      comment: "Hành trình mệt nhưng vô cùng xứng đáng. Đứng trên đỉnh Fansipan lúc bình minh cảm giác tự hào khó tả. Các anh porter người Mông siêu khỏe, vừa gùi đồ ăn vừa cổ vũ đoàn nhiệt tình. Đồ ăn nấu trên núi nóng hổi rất ngon miệng. Dịch vụ tắm lá thuốc sau tour thực sự cứu rỗi đôi chân rã rời!"
    },
    {
      id: "rev-03",
      userId: "user-03",
      userName: "Lê Minh Triết",
      userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100&q=80",
      targetId: "stay-dalat-01",
      rating: 4.8,
      date: "18/05/2026",
      comment: "Nhà gỗ thơm phức mùi thông, tối ngủ ấm áp nhờ có lò sưởi. Bồn tắm thảo dược ngoài trời ngắm sao đêm đỉnh cao. Duy nhất đường vào homestay hơi dốc một chút, xế yếu nên nhờ chủ nhà đón hộ."
    }
  ]
};

// Add helper functions to query data, support custom local listings, and persist in localStorage
const MountainGoatDB = {
  init() {
    if (!localStorage.getItem("mgt_stays")) {
      localStorage.setItem("mgt_stays", JSON.stringify(MGT_DATA.stays));
    }
    if (!localStorage.getItem("mgt_tours")) {
      localStorage.setItem("mgt_tours", JSON.stringify(MGT_DATA.tours));
    }
    if (!localStorage.getItem("mgt_reviews")) {
      localStorage.setItem("mgt_reviews", JSON.stringify(MGT_DATA.reviews));
    }
    if (!localStorage.getItem("mgt_bookings")) {
      localStorage.setItem("mgt_bookings", JSON.stringify([]));
    }
    if (!localStorage.getItem("mgt_wishlist")) {
      localStorage.setItem("mgt_wishlist", JSON.stringify([]));
    }
  },

  getAllStays() {
    this.init();
    return JSON.parse(localStorage.getItem("mgt_stays"));
  },

  getAllTours() {
    this.init();
    return JSON.parse(localStorage.getItem("mgt_tours"));
  },

  getAllReviews() {
    this.init();
    return JSON.parse(localStorage.getItem("mgt_reviews"));
  },

  getItemById(id) {
    const stays = this.getAllStays();
    const tours = this.getAllTours();
    return stays.find(s => s.id === id) || tours.find(t => t.id === id);
  },

  getItemReviews(id) {
    const reviews = this.getAllReviews();
    return reviews.filter(r => r.targetId === id);
  },

  addListing(item) {
    const key = item.type === "stay" ? "mgt_stays" : "mgt_tours";
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.unshift(item);
    localStorage.setItem(key, JSON.stringify(items));
    return items;
  },

  addReview(review) {
    const reviews = this.getAllReviews();
    reviews.unshift(review);
    localStorage.setItem("mgt_reviews", JSON.stringify(reviews));
    
    // Recalculate average rating of target listing
    const stays = this.getAllStays();
    const tours = this.getAllTours();
    const targetStay = stays.find(s => s.id === review.targetId);
    const targetTour = tours.find(t => t.id === review.targetId);
    
    if (targetStay) {
      const itemReviews = reviews.filter(r => r.targetId === review.targetId);
      const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
      targetStay.rating = Math.round((totalRating / itemReviews.length) * 100) / 100;
      targetStay.reviewsCount = itemReviews.length;
      localStorage.setItem("mgt_stays", JSON.stringify(stays));
    } else if (targetTour) {
      const itemReviews = reviews.filter(r => r.targetId === review.targetId);
      const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
      targetTour.rating = Math.round((totalRating / itemReviews.length) * 100) / 100;
      targetTour.reviewsCount = itemReviews.length;
      localStorage.setItem("mgt_tours", JSON.stringify(tours));
    }
    
    return review;
  },

  getBookings() {
    this.init();
    return JSON.parse(localStorage.getItem("mgt_bookings"));
  },

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem("mgt_bookings", JSON.stringify(bookings));
    return booking;
  },

  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = "cancelled";
      localStorage.setItem("mgt_bookings", JSON.stringify(bookings));
      return true;
    }
    return false;
  },

  getWishlist() {
    this.init();
    return JSON.parse(localStorage.getItem("mgt_wishlist"));
  },

  toggleWishlist(itemId) {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(itemId);
    if (index === -1) {
      wishlist.push(itemId);
    } else {
      wishlist.splice(index, 1);
    }
    localStorage.setItem("mgt_wishlist", JSON.stringify(wishlist));
    return wishlist.includes(itemId);
  }
};

window.MountainGoatDB = MountainGoatDB;
MountainGoatDB.init();
