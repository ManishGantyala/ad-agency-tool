import { Search, Users, Grid3x3 } from "lucide-react";

function Header({
  view,
  setView,
  searchTerm,
  setSearchTerm,
  filterPriority,
  setFilterPriority,
}) {

return (
   
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-purple-500/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ad Agency Tool v3
              </h1>
              <p className="text-purple-300/70 text-sm mt-1">Client and team work management</p>
            </div>
            <div className="flex gap-2">
              {['clients', 'team'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${view === v
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-purple-300 hover:bg-purple-900/50'
                    }`}
                >
                  {v === 'clients' ? <Grid3x3 size={20} /> : <Users size={20} />}
                  <span className="capitalize">{v}</span>
                </button>
              ))}
            </div>
          </div>

          {(
            <>
              {/* Search & Filter */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-3 text-purple-400/50" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  />
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

        );
}

export default Header;