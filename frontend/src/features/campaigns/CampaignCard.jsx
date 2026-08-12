function CampaignCard({
  card,
  onClick,
  getPriorityColor,
  isOverdue,
  formatRelativeDate,
}) {
  return (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all"
  >
    <div className="p-3 space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-2xl">{card.imageUrl}</span>

        <div className="min-w-0">
          <h3 className="font-bold text-white text-sm">
            {card.title}
          </h3>

          <p className="text-xs text-purple-300 mt-1">
            Assigned to: {card.assignee}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span
          className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(
            card.priority
          )}`}
        >
          {card.priority}
        </span>

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isOverdue(card.dueDate)
              ? "bg-red-500/20 text-red-400"
              : "bg-slate-600/30 text-slate-400"
          }`}
        >
          {formatRelativeDate(card.dueDate)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full bg-slate-600/30 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
            style={{
              width: `${
                card.checklist.total
                  ? (card.checklist.completed / card.checklist.total) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <span className="text-slate-400 text-xs">
          {card.checklist.completed}/{card.checklist.total}
        </span>
      </div>
    </div>
  </div>
);
}

export default CampaignCard;