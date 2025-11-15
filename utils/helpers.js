export const getStatusColor = (value, goodThreshold = 85, criticalThreshold = 75) => {
  if (value >= goodThreshold) return 'text-orange-500';
  if (value >= criticalThreshold) return 'text-amber-500';
  return 'text-red-500';
};

export const getTeamScheduleStyle = (type) => {
  return type === 'T' 
    ? 'bg-blue-900/50 text-blue-300 border-blue-600' 
    : 'bg-emerald-900/50 text-emerald-300 border-emerald-600';
};
