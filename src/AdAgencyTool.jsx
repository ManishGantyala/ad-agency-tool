import React, { useState } from 'react';
import {
  Trash2, Plus, X, MessageSquare, Paperclip, Clock, Search, Users,
  Grid3x3, Copy, Archive, Edit2, Type, ImageIcon, AlignLeft, Tag, Save
} from 'lucide-react';

export default function AdAgencyTool() {
  const [view, setView] = useState('clients'); // clients, team
  const [editingCardId, setEditingCardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [newWorkClientId, setNewWorkClientId] = useState(null);
  const [newWork, setNewWork] = useState({
    title: '',
    description: '',
    imageUrl: '📝',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    labels: '',
    checklistTotal: 1
  });

  // Teams State
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Lead Designer',
      avatar: '👨‍🎨',
      email: 'rajesh@agency.com',
      assignedTasks: 4
    },
    {
      id: 2,
      name: 'Uttam Patel',
      role: 'Video Producer',
      avatar: '🎬',
      email: 'uttam@agency.com',
      assignedTasks: 3
    },
    {
      id: 3,
      name: 'Pandu Singh',
      role: 'Strategist',
      avatar: '🧠',
      email: 'pandu@agency.com',
      assignedTasks: 2
    },
  ]);

  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', avatar: '' });

  // Clients State
  const [clients] = useState([
    { id: 1, name: 'Japasya', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Samaya', icon: '✨', color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Dorpo', icon: '🚀', color: 'from-orange-500 to-red-500' },
  ]);


  // Cards State
  const [cards, setCards] = useState([
    {
      id: 1,
      clientId: 1,
      columnId: 'todo',
      title: 'Logo Redesign',
      description: 'Create modern logo variations with minimalist approach',
      imageUrl: '🎨',
      priority: 'high',
      assignee: 'Rajesh Kumar',
      dueDate: '2025-02-15',
      comments: 2,
      attachments: 1,
      checklist: { total: 3, completed: 1 },
      labels: ['design', 'branding'],
      activity: [
        { user: 'Rajesh', action: 'created this card', time: '2 hours ago' }
      ]
    },
    {
      id: 2,
      clientId: 1,
      columnId: 'designing',
      title: 'Instagram Reel - Product Launch',
      description: 'Create 30-60 second reel showcasing new product features with transitions',
      imageUrl: '🎬',
      priority: 'high',
      assignee: 'Uttam Patel',
      dueDate: '2025-02-12',
      comments: 5,
      attachments: 3,
      checklist: { total: 5, completed: 3 },
      labels: ['video', 'social', 'urgent'],
      activity: [
        { user: 'Uttam', action: 'moved this card to Designing', time: '1 hour ago' },
        { user: 'Rajesh', action: 'commented', time: '3 hours ago' }
      ]
    },
    {
      id: 3,
      clientId: 1,
      columnId: 'review',
      title: 'Email Campaign Graphics',
      description: 'Design header and footer graphics for email series',
      imageUrl: '📧',
      priority: 'medium',
      assignee: 'Rajesh Kumar',
      dueDate: '2025-02-18',
      comments: 3,
      attachments: 2,
      checklist: { total: 4, completed: 4 },
      labels: ['email', 'design'],
      activity: []
    },
    {
      id: 4,
      clientId: 1,
      columnId: 'done',
      title: 'Website Banner Animation',
      description: 'Build interactive CSS animation for hero section',
      imageUrl: '✨',
      priority: 'medium',
      assignee: 'Pandu Singh',
      dueDate: '2025-02-08',
      comments: 1,
      attachments: 0,
      checklist: { total: 2, completed: 2 },
      labels: ['web', 'animation'],
      activity: []
    },
    {
      id: 5,
      clientId: 1,
      columnId: 'todo',
      title: 'Social Media Kit',
      description: 'Complete brand guidelines for social platforms',
      imageUrl: '📱',
      priority: 'low',
      assignee: 'Rajesh Kumar',
      dueDate: '2025-02-25',
      comments: 0,
      attachments: 0,
      checklist: { total: 6, completed: 2 },
      labels: ['branding', 'social'],
      activity: []
    },
    {
      id: 6,
      clientId: 2,
      columnId: 'backlog',
      title: 'Website Redesign Proposal',
      description: 'Pitch new design direction to client',
      imageUrl: '🌐',
      priority: 'high',
      assignee: 'Pandu Singh',
      dueDate: '2025-02-20',
      comments: 7,
      attachments: 5,
      checklist: { total: 3, completed: 0 },
      labels: ['web', 'proposal'],
      activity: []
    },
  ]);

  const [selectedCard, setSelectedCard] = useState(null);

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || card.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500/20 text-red-600 border-red-300',
      medium: 'bg-yellow-500/20 text-yellow-600 border-yellow-300',
      low: 'bg-green-500/20 text-green-600 border-green-300'
    };
    return colors[priority] || colors.low;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };


  const updateCard = (cardId, updates) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, ...updates } : c));
    setEditingCardId(null);
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter(c => c.id !== cardId));
    setSelectedCard(null);
  };

  const duplicateCard = (card) => {
    const newCard = {
      ...card,
      id: Math.max(...cards.map(c => c.id), 0) + 1,
      title: card.title + ' (Copy)'
    };
    setCards([...cards, newCard]);
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.role) {
      setTeams([...teams, {
        id: Math.max(...teams.map(t => t.id), 0) + 1,
        ...newTeamMember,
        email: newTeamMember.name.toLowerCase().replace(' ', '.') + '@agency.com',
        assignedTasks: 0
      }]);
      setNewTeamMember({ name: '', role: '', avatar: '' });
    }
  };

  const openNewWorkForm = (clientId) => {
    setNewWorkClientId(clientId);
    setNewWork({
      title: '',
      description: '',
      imageUrl: '📝',
      assignee: teams[0]?.name || '',
      priority: 'medium',
      dueDate: '',
      labels: '',
      checklistTotal: 1
    });
  };

  const closeNewWorkForm = () => {
    setNewWorkClientId(null);
  };

  const addWork = () => {
    if (!newWork.title.trim() || !newWork.assignee || !newWork.dueDate || !newWorkClientId) return;

    const total = Math.max(Number(newWork.checklistTotal) || 0, 0);
    const labels = newWork.labels
      .split(',')
      .map(label => label.trim())
      .filter(Boolean);

    const card = {
      id: Math.max(...cards.map(c => c.id), 0) + 1,
      clientId: newWorkClientId,
      columnId: 'todo',
      title: newWork.title.trim(),
      description: newWork.description.trim(),
      imageUrl: newWork.imageUrl.trim() || '📝',
      priority: newWork.priority,
      assignee: newWork.assignee,
      dueDate: newWork.dueDate,
      comments: 0,
      attachments: 0,
      checklist: { total, completed: 0 },
      labels,
      activity: []
    };

    setCards([...cards, card]);
    closeNewWorkForm();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Header */}
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

      {/* Main Content */}
      <div className="p-6">
        {/* CLIENTS VIEW */}
        {view === 'clients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map(client => {
              const clientCards = filteredCards.filter(card => card.clientId === client.id);
              return (
                <div key={client.id} className="flex flex-col">
                  <div className={`bg-gradient-to-r ${client.color} p-4 rounded-t-xl text-white font-bold flex items-center justify-between`}>
                    <span><span className="mr-2">{client.icon}</span>{client.name}</span>
                    <span className="bg-white/20 px-2 py-1 rounded text-xs">{clientCards.length}</span>
                  </div>
                  <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-b-xl p-3 min-h-96 space-y-3">
                    {clientCards.map(card => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="group cursor-pointer bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all"
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">{card.imageUrl}</span>
                            <div className="min-w-0">
                              <h3 className="font-bold text-white text-sm">{card.title}</h3>
                              <p className="text-xs text-purple-300 mt-1">Assigned to: {card.assignee}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(card.priority)}`}>{card.priority}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${isOverdue(card.dueDate) ? 'bg-red-500/20 text-red-400' : 'bg-slate-600/30 text-slate-400'}`}>
                              <Clock size={10} className="inline mr-1" />{formatDate(card.dueDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-600/30 rounded-full h-1">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                                style={{ width: `${card.checklist.total ? (card.checklist.completed / card.checklist.total) * 100 : 0}%` }} />
                            </div>
                            <span className="text-slate-400 text-xs">{card.checklist.completed}/{card.checklist.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {clientCards.length === 0 && (
                      <div className="flex items-center justify-center h-24 text-slate-500 text-sm">No work assigned</div>
                    )}
                    <button
                      onClick={() => openNewWorkForm(client.id)}
                      className="w-full py-2.5 rounded-lg border border-dashed border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Add Work
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TEAMS VIEW */}
        {view === 'team' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Team Management</h2>

              {/* Add Team Member Form */}
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Add Team Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Role</label>
                    <input
                      type="text"
                      placeholder="Designer, Developer..."
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Avatar Emoji</label>
                    <input
                      type="text"
                      placeholder="🎨"
                      maxLength="2"
                      value={newTeamMember.avatar}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, avatar: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addTeamMember}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add Member
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Workload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map(member => {
                const memberCards = filteredCards.filter(card => card.assignee === member.name);
                return (
                  <div key={member.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{member.avatar}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{member.name}</h3>
                          <p className="text-sm text-purple-300">{member.role}</p>
                          <p className="text-xs text-slate-400 mt-1">{memberCards.length} assigned tasks</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-3 min-h-64">
                      {memberCards.map(card => {
                        const client = clients.find(c => c.id === card.clientId);
                        return (
                          <div key={card.id} onClick={() => setSelectedCard(card)}
                            className="cursor-pointer bg-slate-700/40 hover:bg-slate-700/60 border border-purple-500/20 rounded-lg p-3 transition-all">
                            <div className="flex gap-2 items-start">
                              <span className="text-xl">{card.imageUrl}</span>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-white text-sm">{card.title}</h4>
                                <p className="text-xs text-purple-300 mt-1">Client: {client?.name || 'Unassigned'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className={`px-2 py-1 rounded border text-xs ${getPriorityColor(card.priority)}`}>{card.priority}</span>
                              <span className="px-2 py-1 rounded bg-slate-600/30 text-slate-400 text-xs">{formatDate(card.dueDate)}</span>
                            </div>
                          </div>
                        );
                      })}
                      {memberCards.length === 0 && <div className="text-center text-slate-500 text-sm py-8">No assigned work</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Work Modal */}
      {newWorkClientId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Add Work</h2>
                <p className="text-sm text-purple-300 mt-1">
                  Client: {clients.find(client => client.id === newWorkClientId)?.name}
                </p>
              </div>
              <button onClick={closeNewWorkForm} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <X className="text-slate-400" size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Work / Task Name *</label>
                <input
                  type="text"
                  value={newWork.title}
                  onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                  placeholder="Enter work name"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Description</label>
                <textarea
                  value={newWork.description}
                  onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                  placeholder="Describe the work"
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Assign To *</label>
                  <select
                    value={newWork.assignee}
                    onChange={(e) => setNewWork({ ...newWork, assignee: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Priority</label>
                  <select
                    value={newWork.priority}
                    onChange={(e) => setNewWork({ ...newWork, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={newWork.dueDate}
                    onChange={(e) => setNewWork({ ...newWork, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Icon / Emoji</label>
                  <input
                    type="text"
                    value={newWork.imageUrl}
                    onChange={(e) => setNewWork({ ...newWork, imageUrl: e.target.value })}
                    maxLength="2"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Labels</label>
                <input
                  type="text"
                  value={newWork.labels}
                  onChange={(e) => setNewWork({ ...newWork, labels: e.target.value })}
                  placeholder="design, social, urgent"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-slate-400 mt-2">Separate labels with commas</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Checklist Total</label>
                <input
                  type="number"
                  min="0"
                  value={newWork.checklistTotal}
                  onChange={(e) => setNewWork({ ...newWork, checklistTotal: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <button
                  onClick={addWork}
                  disabled={!newWork.title.trim() || !newWork.assignee || !newWork.dueDate}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Create Work
                </button>
                <button
                  onClick={closeNewWorkForm}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && !editingCardId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-3xl w-full max-h-96 overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCard.imageUrl}</span>
                <h2 className="text-xl font-bold text-white">{selectedCard.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCardId(selectedCard.id)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-purple-400"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => duplicateCard(selectedCard)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="text-slate-400" size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-purple-300 mb-2">Description</h4>
                <p className="text-slate-300 text-sm">{selectedCard.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Client</h4>
                  <p className="text-white font-medium">{clients.find(c => c.id === selectedCard.clientId)?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Assignee</h4>
                  <p className="text-white font-medium">{selectedCard.assignee}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Due Date</h4>
                  <p className={`font-medium ${isOverdue(selectedCard.dueDate) ? 'text-red-400' : 'text-slate-300'}`}>
                    {formatDate(selectedCard.dueDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Priority</h4>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(selectedCard.priority)}`}>
                    {selectedCard.priority}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Progress</h4>
                  <p className="text-white font-medium">{selectedCard.checklist.completed}/{selectedCard.checklist.total}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-purple-300 mb-2">Labels</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedCard.labels.map(label => (
                    <span key={label} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare size={16} className="text-blue-400" />
                  {selectedCard.comments} Comments
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Paperclip size={16} className="text-green-400" />
                  {selectedCard.attachments} Attachments
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <button onClick={() => setEditingCardId(selectedCard.id)} className="flex-1 px-3 py-2 bg-purple-600/50 hover:bg-purple-600 text-purple-100 rounded-lg font-medium text-sm transition-colors">
                  <Edit2 size={14} className="inline mr-2" /> Edit Card
                </button>
                <button className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-colors">
                  <Archive size={14} className="inline mr-2" /> Archive
                </button>
                <button onClick={() => { deleteCard(selectedCard.id); setSelectedCard(null); }} className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-medium text-sm transition-colors">
                  <Trash2 size={14} className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Edit Modal */}
      {editingCardId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Card</h2>
              <button
                onClick={() => setEditingCardId(null)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <Type size={16} /> Card Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedCard.title}
                  onChange={(e) => setSelectedCard({ ...selectedCard, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} /> Card Image/Icon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={selectedCard.imageUrl}
                    onChange={(e) => setSelectedCard({ ...selectedCard, imageUrl: e.target.value })}
                    maxLength="2"
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-2xl text-center placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    placeholder="🎨"
                  />
                  <div className="text-4xl">{selectedCard.imageUrl}</div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Enter emoji or single character</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <AlignLeft size={16} /> Description
                </label>
                <textarea
                  defaultValue={selectedCard.description}
                  onChange={(e) => setSelectedCard({ ...selectedCard, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Client</label>
                  <select
                    value={selectedCard.clientId}
                    onChange={(e) => setSelectedCard({ ...selectedCard, clientId: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Assignee</label>
                  <select
                    defaultValue={selectedCard.assignee}
                    onChange={(e) => setSelectedCard({ ...selectedCard, assignee: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Priority</label>
                  <select
                    defaultValue={selectedCard.priority}
                    onChange={(e) => setSelectedCard({ ...selectedCard, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    defaultValue={selectedCard.dueDate}
                    onChange={(e) => setSelectedCard({ ...selectedCard, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>


              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <Tag size={16} /> Labels
                </label>
                <input
                  type="text"
                  defaultValue={selectedCard.labels.join(', ')}
                  onChange={(e) => setSelectedCard({ ...selectedCard, labels: e.target.value.split(',').map(l => l.trim()) })}
                  placeholder="design, urgent, social"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-slate-400 mt-2">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Checklist Progress</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400">Completed</label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={selectedCard.checklist.completed}
                      onChange={(e) => setSelectedCard({ ...selectedCard, checklist: { ...selectedCard.checklist, completed: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400">Total</label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={selectedCard.checklist.total}
                      onChange={(e) => setSelectedCard({ ...selectedCard, checklist: { ...selectedCard.checklist, total: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    updateCard(selectedCard.id, selectedCard);
                    setSelectedCard(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  onClick={() => setEditingCardId(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
