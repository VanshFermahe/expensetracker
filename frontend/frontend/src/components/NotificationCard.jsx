import { Clock, CheckCircle } from "lucide-react";

export default function NotificationCard({ notification, onPaid }) {
  const { bill } = notification;

  const daysLeft = Math.ceil(
    (new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg flex items-center justify-between">
      
      {/* 📄 Bill Info */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          {bill.name}
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Amount: ₹{bill.amount}
        </p>

        <div className="flex items-center gap-2 mt-2 text-sm text-yellow-400">
          <Clock size={16} />
          Due in {daysLeft} day{daysLeft !== 1 && "s"}
        </div>
      </div>

      {/* ✅ Action */}
      <button
        onClick={async () => {
          await onPaid(bill.id);
        }}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
      >
        <CheckCircle size={18} />
        Mark Paid
      </button>
    </div>
  );
}
