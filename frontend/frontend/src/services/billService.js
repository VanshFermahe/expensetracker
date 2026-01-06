import axiosClient from "./axiosClient";

const billService = {
  // Get all bills
  getBills: async () => {
    const res = await axiosClient.get("/bills/");
    return res.data;
  },

  // Create a new bill
  createBill: async (data) => {
    const res = await axiosClient.post("/bills/", data);
    return res.data;
  },

  // Update bill
  updateBill: async (id, data) => {
    const res = await axiosClient.put(`/bills/${id}/`, data);
    return res.data;
  },

  // Delete a bill
  deleteBill: async (id) => {
    const res = await axiosClient.delete(`/bills/${id}/`);
    return res.data;
  },

  // Mark a bill as paid
  markAsPaid: async (id) => {
    const res = await axiosClient.patch(`/bills/${id}/mark_paid/`);
    return res.data;
  },

  // Fetch unpaid bills
  getUnpaidBills: async () => {
    const res = await axiosClient.get("/bills/?paid=false");
    return res.data;
  },

  // Fetch paid bills
  getPaidBills: async () => {
    const res = await axiosClient.get("/bills/paid/");
    return res.data;
  },

  // Notifications
  getNotifications: async () => {
    const res = await axiosClient.get("/notifications/");
    return res.data; // backend auto-creates notifications
  },

  // Dashboard analytics
  getDashboard: async () => {
    const res = await axiosClient.get("/dashboard/");
    return res.data;
  },
};

export default billService;
