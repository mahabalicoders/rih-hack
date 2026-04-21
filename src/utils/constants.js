export const BUSINESS_TYPES = [
    "Agriculture / Agri-processing",
    "Retail / Kirana / General Store",
    "Small Scale Manufacturing",
    "Handicrafts / Artisans",
    "Food Processing / Bakery",
    "Healthcare / Clinic",
    "Education / Coaching",
    "Repair / General Services"
];

export const THEME_COLORS = {
    primary: '#0f172a',
    accent: '#0f172a',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    textMain: '#0f172a',
    textMuted: '#64748b'
};

export const getMetaFromScore = (score) => {
    if (score >= 90) return { grade: 'A', risk: 'Elite', color: '#10b981' };
    if (score >= 80) return { grade: 'A', risk: 'Prime', color: '#22c55e' };
    if (score >= 70) return { grade: 'B', risk: 'Standard', color: '#3b82f6' };
    if (score >= 60) return { grade: 'C', risk: 'Moderate', color: '#f59e0b' };
    if (score >= 50) return { grade: 'D', risk: 'Opportunity', color: '#f97316' };
    if (score >= 40) return { grade: 'E', risk: 'Recovery', color: '#ef4444' };
    return { grade: 'F', risk: 'Critical', color: '#7f1d1d' };
};
