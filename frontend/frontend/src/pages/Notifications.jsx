import { useEffect, useState } from "react";
import billService from "../services/billService";
import NotificationCard from "../components/NotificationCard";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await billService.getNotifications();

        // 🚫 Remove already paid bills
        const unpaidOnly = data.filter(
          (n) => !n.bill?.is_paid
        );

        setNotifications(unpaidOnly);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  // ✅ When bill marked as paid
  const handleBillPaid = async (billId) => {
    try {
      await billService.markAsPaid(billId);

      // 🔥 Instantly remove from UI
      setNotifications((prev) =>
        prev.filter((n) => n.bill.id !== billId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark bill as paid");
    }
  };

  /* 🔄 Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-slate-600 border-t-cyan-400 rounded-full" />
          <p className="text-slate-300">Checking upcoming bills…</p>
        </div>
      </div>
    );
  }

  /* ❌ Error */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-red-900/40 border border-red-500 text-red-300 p-6 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">

        {/* 🔔 Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Notifications
          </h1>
          <p className="text-slate-400 mt-2">
            Bills due in the next 5 days
          </p>
        </div>

        {/* 📭 Empty State */}
        {notifications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10 text-center">
            <div className="text-3xl mb-3">🎉</div>
            <p className="text-lg font-semibold text-white">
              No urgent bills
            </p>
            <p className="text-sm text-slate-400 mt-1">
              You’re all caught up. Enjoy your peace 😌
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onPaid={handleBillPaid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
