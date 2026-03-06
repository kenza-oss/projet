import axios from "./axios";

// ✅ Helper to attach token if it exists
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -------------------------
// 🔹 Get a profile by ID
// -------------------------
export const getProfileById = async (id) => {
  try {
    const res = await axios.get(`profiles/${id}/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch profile by ID:", err);
    return null;
  }
};

// -------------------------
// 🔹 List all profiles
// -------------------------
export const getProfiles = async () => {
  try {
    // Corrected endpoint to match user specs
    const res = await axios.get("profiles/", {
      headers: getAuthHeaders(),
    });
    // Handle pagination (results array) or direct array
    const data = res.data;
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Failed to fetch profiles:", err);
    return [];
  }
};

// -------------------------
// 🔹 Create a new profile
// -------------------------
export const createProfile = async (profileData) => {
  try {
    const res = await axios.post("profiles/", profileData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create profile:", err);
    return null;
  }
};

// -------------------------
// 🔹 Update a profile by ID
// -------------------------
export const updateProfile = async (id, profileData) => {
  try {
    const res = await axios.put(`profiles/${id}/`, profileData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    return null;
  }
};

// -------------------------
// 🔹 Partial update (PATCH)
// -------------------------
export const patchProfile = async (id, profileData) => {
  try {
    const res = await axios.patch(`profiles/${id}/`, profileData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to patch profile:", err);
    return null;
  }
};

// -------------------------
// 🔹 Delete profile by ID
// -------------------------
export const deleteProfile = async (id) => {
  try {
    await axios.delete(`profiles/${id}/`, {
      headers: getAuthHeaders(),
    });
    return true;
  } catch (err) {
    console.error("❌ Failed to delete profile:", err);
    return false;
  }
};

// -------------------------
// 🔹 Logged-in producer profile
// -------------------------
export const getProducerProfile = async (userId) => {
  try {
    // 🚀 Optimisation: Tenter d'abord de récupérer le profil "me" si dispo
    // Cela correspond à la demande de l'utilisateur pour /api/producers/me/
    try {
      // Prioritize profiles/me/ for producers (mapped to ProducerProfileViewSet)
      const meRes = await axios.get("profiles/me/", {
        headers: getAuthHeaders(),
      });
      if (meRes.data) return meRes.data;
    } catch (ignore) {
      // Fallback to profiles/me/ if producers/me/ fails (e.g. for non-producers)
      try {
        const profileRes = await axios.get("profiles/me/", {
          headers: getAuthHeaders(),
        });
        if (profileRes.data) return profileRes.data;
      } catch (e) {
        console.warn("Endpoints /me failed, falling back to list filter.");
      }
    }

    // --- ANCIENNE METHODE (FALLBACK) ---
    // Swagger does not have a "me" endpoint for profiles, only list.
    // We must fetch all profiles and filter by the current User ID (UUID).
    if (!userId) {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        userId = parsed.id || parsed.pk || parsed.user_id;
      }
    }

    if (!userId) {
      console.error("❌ User ID is required to find producer profile");
      return null;
    }

    const res = await axios.get("profiles/", {
      headers: getAuthHeaders(),
    });

    const data = res.data;
    // Handle both direct array and paginated response { results: [] }
    const profiles = Array.isArray(data) ? data : (data.results || []);

    // Find the profile that belongs to this user
    const myProfile = profiles.find(p => p.user === userId || p.user_id === userId);

    if (!myProfile) {
      console.warn("No profile found for user", userId);
      return null;
    }

    return myProfile;
  } catch (err) {
    console.error("❌ Failed to fetch producer profile:", err);
    throw err;
  }
};

export const updateProducerProfile = async (profileData) => {
  try {
    // Try profiles/me/ first for producer profile updates
    const res = await axios.patch("profiles/me/", profileData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    // Fallback if profiles/me/ fails
    console.warn("Patch to profiles/me/ failed", err);
    throw err;
  }
};
