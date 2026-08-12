export const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-500/20 text-red-600 border-red-300',
    medium: 'bg-yellow-500/20 text-yellow-600 border-yellow-300',
    low: 'bg-green-500/20 text-green-600 border-green-300'
  };

  return colors[priority] || colors.low;
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};