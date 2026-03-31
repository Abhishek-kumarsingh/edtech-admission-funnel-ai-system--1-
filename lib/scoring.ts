export interface LeadScore {
  score: number;
  category: 'Cold' | 'Warm' | 'Hot';
}

export const calculateLeadScore = (interest: string, budget: number, timeline: string): LeadScore => {
  let score = 0;

  // Interest selected
  if (interest && interest !== 'null') {
    score += 30;
  }

  // Budget
  if (budget > 100000) {
    score += 30;
  } else if (budget > 50000) {
    score += 20;
  }

  // Timeline
  if (timeline.toLowerCase().includes('immediate')) {
    score += 40;
  } else if (timeline.toLowerCase().includes('3 months')) {
    score += 20;
  }

  let category: 'Cold' | 'Warm' | 'Hot' = 'Cold';
  if (score >= 70) {
    category = 'Hot';
  } else if (score >= 40) {
    category = 'Warm';
  }

  return { score, category };
};

export const calculateScholarship = (marks: number): number => {
  if (marks > 90) return 50;
  if (marks > 75) return 30;
  if (marks > 60) return 10;
  return 0;
};
