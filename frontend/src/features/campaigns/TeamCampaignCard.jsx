function TeamCampaignCard({
  card,
  client,
  onClick,
  getPriorityColor,
  formatRelativeDate,
}) {
  return (
  <div
    onClick={onClick}
    className="cursor-pointer bg-slate-700/40 hover:bg-slate-700/60 border border-purple-500/20 rounded-lg p-3 transition-all"
  >
    <div className="flex gap-2 items-start">
      <span className="text-xl">{card.imageUrl}</span>

      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-white text-sm">
          {card.title}
        </h4>

        <p className="text-xs text-purple-300 mt-1">
          Client: {client?.name || "Unassigned"}
        </p>
      </div>
    </div>

    <div className="flex gap-2 mt-3">
      <span
        className={`px-2 py-1 rounded border text-xs ${getPriorityColor(
          card.priority
        )}`}
      >
        {card.priority}
      </span>

      <span className="px-2 py-1 rounded bg-slate-600/30 text-slate-400 text-xs">
        {formatRelativeDate(card.dueDate)}
      </span>
    </div>
  </div>
);
}

export default TeamCampaignCard;