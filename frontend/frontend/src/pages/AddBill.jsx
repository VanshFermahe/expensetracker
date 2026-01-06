import { useState } from "react";
import billService from "../services/billService";
import { CreditCard, Calendar, Repeat, FileText } from "lucide-react";

export default function AddBill() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    amount: "",
    due_date: "",
    notes: "",
    is_recurring: false,
    recurrence_interval_days: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (!form.is_recurring) {
      delete payload.recurrence_interval_days;
    } else {
      payload.recurrence_interval_days = Number(
        form.recurrence_interval_days
      );
    }

    try {
      await billService.createBill(payload);
      alert("Bill Added Successfully");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to add bill");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Add New Bill
        </h2>
        <p className="text-slate-300 text-center mb-8">
          Keep track of your expenses easily
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bill Name */}
          <div className="relative">
            <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              name="name"
              placeholder="Bill Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Type */}
          <div className="relative">
            <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              name="type"
              placeholder="Type (Rent, Utility, etc.)"
              value={form.type}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Amount */}
          <input
            name="amount"
            type="number"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Due Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Additional notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="md:col-span-2 w-full px-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Recurring Toggle */}
          <div className="md:col-span-2 flex items-center gap-3 bg-white/90 p-3 rounded-lg border">
            <Repeat className="text-blue-600" size={20} />
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                name="is_recurring"
                checked={form.is_recurring}
                onChange={handleChange}
                className="accent-blue-600"
              />
              Recurring Bill
            </label>
          </div>

          {/* Recurrence Interval */}
          {form.is_recurring && (
            <input
              name="recurrence_interval_days"
              type="number"
              placeholder="Recurrence Interval (Days)"
              value={form.recurrence_interval_days}
              onChange={handleChange}
              className="md:col-span-2 w-full px-3 py-2.5 rounded-lg bg-white/90 border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform shadow-lg"
          >
            Add Bill
          </button>
        </form>
      </div>
    </div>
  );
}
