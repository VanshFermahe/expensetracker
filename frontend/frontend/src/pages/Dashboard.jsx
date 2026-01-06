import { useEffect, useState } from "react";
import billService from "../services/billService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [paidBills, setPaidBills] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardData, paidData, unpaidData] = await Promise.all([
          billService.getDashboard(),
          billService.getPaidBills(),
          billService.getUnpaidBills(),
        ]);

        setSummary(dashboardData);
        setPaidBills(paidData);
        setUnpaidBills(unpaidData);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
        <div className="animate-spin h-12 w-12 border-4 border-white/30 border-t-white rounded-full" />
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-red-500/10 backdrop-blur p-6 rounded-xl text-red-400 font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-wide">
            📊 Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Track your bills, payments & due dates
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <SummaryCard title="Total Bills" value={summary.total_bills} />
          <SummaryCard title="Paid Bills" value={summary.paid_bills} type="success" />
          <SummaryCard title="Unpaid Bills" value={summary.unpaid_bills} type="danger" />
          <SummaryCard title="Amount Due" value={`₹${summary.total_amount_due}`} />
        </div>

        {/* Paid Bills */}
        <Section title="Paid Bills" subtitle="Completed payments">
          {paidBills.length === 0 ? (
            <EmptyState text="No paid bills yet" />
          ) : (
            <BillGrid>
              {paidBills.map((bill) => (
                <BillCard key={bill.id} bill={bill} paid />
              ))}
            </BillGrid>
          )}
        </Section>

        {/* Unpaid Bills */}
        <Section title="Unpaid Bills" subtitle="Pending payments">
          {unpaidBills.length === 0 ? (
            <EmptyState text="All bills are paid 🎉" />
          ) : (
            <BillGrid>
              {unpaidBills.map((bill) => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </BillGrid>
          )}
        </Section>

      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function SummaryCard({ title, value, type }) {
  const color =
    type === "success"
      ? "from-green-400 to-emerald-600"
      : type === "danger"
      ? "from-red-400 to-rose-600"
      : "from-indigo-400 to-blue-600";

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
      <p className="text-sm text-slate-300 mb-2">{title}</p>
      <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-slate-400 text-sm mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function BillGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

function BillCard({ bill, paid }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:shadow-xl hover:-translate-y-1 transition">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{bill.name}</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full font-bold ${
            paid
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {paid ? "PAID" : "DUE"}
        </span>
      </div>

      <p className="text-slate-400 text-sm">Amount</p>
      <p className="text-2xl font-bold mb-2">₹{bill.amount}</p>

      {paid ? (
        <p className="text-slate-400 text-sm">
          Paid on {bill.paid_at?.slice(0, 10)}
        </p>
      ) : (
        <p className="text-red-400 text-sm font-medium">
          Due by {bill.due_date}
        </p>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-white/10 backdrop-blur p-4 rounded-xl text-slate-400 italic">
      {text}
    </div>
  );
}
