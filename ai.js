function predictTaskScore(task) {
    const now = new Date();
    const deadline = task.deadline ? new Date(task.deadline) : now;
  
    const daysLeft = Math.max((deadline - now) / (1000 * 60 * 60 * 24), 0.1);
  
    // Feature engineering (THIS is ML thinking)
    const urgency = 1 / daysLeft;
    const priority = task.priority || 1;
    const effort = task.estimated_time || 1;
  
    // Weighted scoring model (simple regression-style logic)
    const score =
      (priority * 12) +
      (urgency * 8) +
      (10 / effort);
  
    return score;
  }
  
  module.exports = { predictTaskScore };