import Header from "./components/layout/Header";
import React, { useState } from 'react';
import {
  Trash2, Plus, X, MessageSquare, Paperclip, Clock, Search, Users,
  Grid3x3, Copy, Archive, Edit2, Type, ImageIcon, AlignLeft, Tag, Save
} from 'lucide-react';
import CampaignCard from "./features/campaigns/CampaignCard";
import TeamCampaignCard from "./features/campaigns/TeamCampaignCard";
import {
  clients as initialClients,
  initialCampaigns,
} from "./features/campaigns/campaignData";
import { initialTeams } from "./features/teams/teamData";

export default function AdAgencyTool() {
  const [view, setView] = useState('clients'); // clients, team
  const [editingCampaignId, setEditingCampaignId] = useState(null);
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
  const [teams, setTeams] = useState(initialTeams);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', avatar: '' });

  // Clients State
  const [clients] = useState(initialClients);

  // Cards State
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const filteredCards = campaigns.filter(card => {
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


  const updateCampaign = (cardId, updates) => {
    setCampaigns(campaigns.map(c => c.id === cardId ? { ...c, ...updates } : c));
    setEditingCampaignId(null);
  };

  const deleteCampaign = (cardId) => {
    setCampaigns(campaigns.filter(c => c.id !== cardId));
    setSelectedCampaign(null);
  };

  const duplicateCampaign = (card) => {
    const newCard = {
      ...card,
      id: Math.max(...campaigns.map(c => c.id), 0) + 1,
      title: card.title + ' (Copy)'
    };
    setCampaigns([...campaigns, newCard]);
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
      id: Math.max(...campaigns.map(c => c.id), 0) + 1,
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

    setCampaigns([...campaigns, card]);
    closeNewWorkForm();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      <Header
        view={view}
        setView={setView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

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
                      <CampaignCard
                        key={card.id}
                        card={card}
                        onClick={() => setSelectedCampaign(card)}
                        getPriorityColor={getPriorityColor}
                        isOverdue={isOverdue}
                        formatDate={formatDate}
                      />
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
                          <TeamCampaignCard
                          key={card.id}
                          card={card}
                          client={client}
                          onClick={() => setSelectedCampaign(card)}
                          getPriorityColor={getPriorityColor}
                          formatDate={formatDate}
                        />
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
      {selectedCampaign && !editingCampaignId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-3xl w-full max-h-96 overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCampaign.imageUrl}</span>
                <h2 className="text-xl font-bold text-white">{selectedCampaign.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCampaignId(selectedCampaign.id)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-purple-400"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => duplicateCampaign(selectedCampaign)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="text-slate-400" size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-purple-300 mb-2">Description</h4>
                <p className="text-slate-300 text-sm">{selectedCampaign.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Client</h4>
                  <p className="text-white font-medium">{clients.find(c => c.id === selectedCampaign.clientId)?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Assignee</h4>
                  <p className="text-white font-medium">{selectedCampaign.assignee}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Due Date</h4>
                  <p className={`font-medium ${isOverdue(selectedCampaign.dueDate) ? 'text-red-400' : 'text-slate-300'}`}>
                    {formatDate(selectedCampaign.dueDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Priority</h4>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(selectedCampaign.priority)}`}>
                    {selectedCampaign.priority}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Progress</h4>
                  <p className="text-white font-medium">{selectedCampaign.checklist.completed}/{selectedCampaign.checklist.total}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-purple-300 mb-2">Labels</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedCampaign.labels.map(label => (
                    <span key={label} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare size={16} className="text-blue-400" />
                  {selectedCampaign.comments} Comments
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Paperclip size={16} className="text-green-400" />
                  {selectedCampaign.attachments} Attachments
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <button onClick={() => setEditingCampaignId(selectedCampaign.id)} className="flex-1 px-3 py-2 bg-purple-600/50 hover:bg-purple-600 text-purple-100 rounded-lg font-medium text-sm transition-colors">
                  <Edit2 size={14} className="inline mr-2" /> Edit Card
                </button>
                <button className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-colors">
                  <Archive size={14} className="inline mr-2" /> Archive
                </button>
                <button onClick={() => { deleteCampaign(selectedCampaign.id); setSelectedCampaign(null); }} className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-medium text-sm transition-colors">
                  <Trash2 size={14} className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Edit Modal */}
      {editingCampaignId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Card</h2>
              <button
                onClick={() => setEditingCampaignId(null)}
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
                  defaultValue={selectedCampaign.title}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, title: e.target.value })}
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
                    defaultValue={selectedCampaign.imageUrl}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, imageUrl: e.target.value })}
                    maxLength="2"
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-2xl text-center placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    placeholder="🎨"
                  />
                  <div className="text-4xl">{selectedCampaign.imageUrl}</div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Enter emoji or single character</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <AlignLeft size={16} /> Description
                </label>
                <textarea
                  defaultValue={selectedCampaign.description}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">Client</label>
                  <select
                    value={selectedCampaign.clientId}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, clientId: Number(e.target.value) })}
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
                    defaultValue={selectedCampaign.assignee}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, assignee: e.target.value })}
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
                    defaultValue={selectedCampaign.priority}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, priority: e.target.value })}
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
                    defaultValue={selectedCampaign.dueDate}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, dueDate: e.target.value })}
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
                  defaultValue={selectedCampaign.labels.join(', ')}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, labels: e.target.value.split(',').map(l => l.trim()) })}
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
                      defaultValue={selectedCampaign.checklist.completed}
                      onChange={(e) => setSelectedCampaign({ ...selectedCampaign, checklist: { ...selectedCampaign.checklist, completed: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400">Total</label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={selectedCampaign.checklist.total}
                      onChange={(e) => setSelectedCampaign({ ...selectedCampaign, checklist: { ...selectedCampaign.checklist, total: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    updateCampaign(selectedCampaign.id, selectedCampaign);
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  onClick={() => setEditingCampaignId(null)}
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
