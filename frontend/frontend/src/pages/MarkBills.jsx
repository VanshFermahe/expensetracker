import { useEffect, useState } from "react";
import billService from "../services/billService";
import BillRow from "../components/BillRow";
import EmptyState from "../components/EmptyState";

export default function MarkBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    setLoading(true);
    const data = await billService.getUnpaidBills();

    // ✅ Sort by due date (nearest first)
    const sorted = data.sort(
      (a, b) => new Date(a.due_date) - new Date(b.due_date)
    );

    setBills(sorted);
    setLoading(false);
  }

  async function handleMarkPaid(id) {
    try {
      setPayingId(id);
      await billService.markAsPaid(id);

      // remove from UI after success
      setBills((prev) => prev.filter((bill) => bill.id !== id));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to mark bill as paid");
    } finally {
      setPayingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">
        Loading bills...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-6 text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          🧾 Pending Bills
        </h1>

        {bills.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <BillRow
                key={bill.id}
                bill={bill}
                onMarkPaid={handleMarkPaid}
                loading={payingId === bill.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
