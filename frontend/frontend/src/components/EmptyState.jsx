import { CheckCircle } from "lucide-react";

export default function EmptyState({
  title = "No bills to pay 🎉",
  description = "You're all caught up. No pending bills at the moment.",
  icon,
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-10 shadow-lg text-center">
      
      {/* Icon */}
      <div className="flex justify-center mb-4">
        {icon ? (
          icon
        ) : (
          <CheckCircle className="text-emerald-400" size={48} />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
