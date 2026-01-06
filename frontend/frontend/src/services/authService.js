import axiosClient from "./axiosClient";

const authService = {
  register: async (data) => {
    const res = await axiosClient.post("/auth/register/", data);
    return res.data;
  },

  login: async ({ email, password }) => {
    try {
      const res = await axiosClient.post("/auth/login/", { email, password });

      // Save tokens & user if login successful
      if (res.data.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return { ok: true, data: res.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  },
};

export default authService;
