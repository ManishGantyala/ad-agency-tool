export const clients = [
  { id: 1, name: 'Japasya', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Samaya', icon: '✨', color: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'Dorpo', icon: '🚀', color: 'from-orange-500 to-red-500' },
];

export const initialCampaigns = [
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
];
