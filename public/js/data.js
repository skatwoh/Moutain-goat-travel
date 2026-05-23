// Data module for Mountain Goat Travel (MGT) - API version

const API_BASE_URL = '/api';

const MountainGoatDB = {
  async init() {
    // Initial data is now managed on the server
    console.log("MountainGoatDB initialized (API mode)");
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("mgt_current_user", JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem("mgt_current_user");
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("mgt_current_user") || "null");
  },

  async getUsers() {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== "superadmin") return [];

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { 'Authorization': currentUser.token }
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  },

  async createAdmin(userData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== "superadmin") {
      throw new Error("Only superadmin can create new admin accounts.");
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': currentUser.token
      },
      body: JSON.stringify({ userData })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create admin");
    }

    return await response.json();
  },

  async getAllStays() {
    const response = await fetch(`${API_BASE_URL}/stays`);
    return await response.json();
  },

  async getAllTours() {
    const response = await fetch(`${API_BASE_URL}/tours`);
    return await response.json();
  },

  async getAllReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    return await response.json();
  },

  async getItemById(id) {
    const stays = await this.getAllStays();
    const tours = await this.getAllTours();
    return stays.find(s => s.id === id) || tours.find(t => t.id === id);
  },

  async getItemReviews(id) {
    const reviews = await this.getAllReviews();
    return reviews.filter(r => r.targetId === id);
  },

  async addListing(item) {
    const currentUser = this.getCurrentUser();
    const headers = { 'Content-Type': 'application/json' };
    if (currentUser && currentUser.token) {
      headers['Authorization'] = currentUser.token;
    }

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error("Failed to add listing");
    return await response.json();
  },

  async addReview(review) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) throw new Error("Failed to add review");
    return await response.json();
  },

  // Note: Wishlist is still kept in localStorage for guest convenience
  getWishlist() {
    return JSON.parse(localStorage.getItem("mgt_wishlist") || "[]");
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
