import React from "react";

export default function BillRow({ bill, onMarkPaid, loading }) {
  const isOverdue = new Date(bill.due_date) < new Date();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/10 hover:shadow-xl transition">

      {/* 📄 Bill Info */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          {bill.name}
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Due Date:{" "}
          <span className={isOverdue ? "text-red-400" : "text-yellow-300"}>
            {bill.due_date}
          </span>
        </p>

        <p className="text-xl font-bold mt-2 text-white">
          ₹{bill.amount}
        </p>
      </div>

      {/* ✅ Action */}
      <button
        onClick={() => onMarkPaid(bill.id)}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
          loading
            ? "bg-slate-500 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 active:scale-95"
        }`}
      >
        {loading ? "Marking..." : "Mark as Paid"}
      </button>
    </div>
  );
}
