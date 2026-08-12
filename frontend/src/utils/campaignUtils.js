export const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-500/20 text-red-600 border-red-300',
    medium: 'bg-yellow-500/20 text-yellow-600 border-yellow-300',
    low: 'bg-green-500/20 text-green-600 border-green-300'
  };

  return colors[priority] || colors.low;
};