import React, { useEffect, useRef, useMemo } from 'react';
import { BUSINESS_TYPES, THEME_COLORS } from '../utils/constants';

// Assuming Chart is available globally or imported
// In a real Vite app, we'd import Chart from 'chart.js/auto';
const Chart = window.Chart;

const Analytics = ({ history }) => {
    const chartRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const summary = useMemo(() => {
        if (!history || history.length === 0) return { bestType: 'N/A', mostCommonRisk: 'N/A', highest: 0, lowest: 0 };
        const typeScores = BUSINESS_TYPES.map((_, i) => {
            const group = history.filter(h => h.business_type === i);
            return group.length ? group.reduce((a, b) => a + b.score, 0) / group.length : 0;
        });
        const bestType = BUSINESS_TYPES[typeScores.indexOf(Math.max(...typeScores))];

        const allReasons = history.flatMap(h => h.reasons || []);
        const reasonCounts = {};
        allReasons.forEach(r => reasonCounts[r] = (reasonCounts[r] || 0) + 1);
        const mostCommonRisk = Object.keys(reasonCounts).length ? Object.keys(reasonCounts).reduce((a, b) => reasonCounts[a] > reasonCounts[b] ? a : b) : 'None';

        const scores = history.map(h => h.score);
        return { bestType, mostCommonRisk, highest: Math.max(...scores), lowest: Math.min(...scores) };
    }, [history]);

    useEffect(() => {
        if (!chartRefs[0].current || !Chart || !history.length) return;

        const ctxs = chartRefs.map(ref => ref.current.getContext('2d'));

        // 1. Avg Score by Type
        const typeScores = BUSINESS_TYPES.map((_, i) => {
            const group = history.filter(h => h.business_type === i);
            return group.length ? Math.round(group.reduce((a, b) => a + b.score, 0) / group.length) : 0;
        });
        const c1 = new Chart(ctxs[0], {
            type: 'bar',
            data: { labels: BUSINESS_TYPES.map(t => t.split(' ')[0]), datasets: [{ data: typeScores, backgroundColor: THEME_COLORS.primary, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // 2. Score Trend
        const c2 = new Chart(ctxs[1], {
            type: 'line',
            data: { labels: history.map((_, i) => i + 1).reverse(), datasets: [{ data: history.map(h => h.score).reverse(), borderColor: THEME_COLORS.primary, tension: 0.2 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // 3. Grade Distribution
        const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        history.forEach(h => { if(grades[h.grade] !== undefined) grades[h.grade]++; });
        const c3 = new Chart(ctxs[2], {
            type: 'doughnut',
            data: { labels: Object.keys(grades), datasets: [{ data: Object.values(grades), backgroundColor: [THEME_COLORS.success, THEME_COLORS.warning, '#f97316', THEME_COLORS.danger, '#333'] }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '65%' }
        });

        // 4. Risk Factors
        const factors = {};
        history.flatMap(h => h.reasons || []).forEach(r => factors[r] = (factors[r] || 0) + 1);
        const topFactors = Object.entries(factors).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const c4 = new Chart(ctxs[3], {
            type: 'bar',
            indexAxis: 'y',
            data: { labels: topFactors.map(f => f[0].substring(0, 20) + '...'), datasets: [{ data: topFactors.map(f => f[1]), backgroundColor: THEME_COLORS.danger, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        return () => { c1.destroy(); c2.destroy(); c3.destroy(); c4.destroy(); };
    }, [history]);

    if (!history.length) {
        return (
            <div className="flex justify-center items-center" style={{height: '400px', opacity: 0.5}}>
                <p>No assessment data available for analytics.</p>
            </div>
        );
    }

    return (
        <div className="flex-col gap-6" style={{padding: '32px'}}>
            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="card">
                    <span className="section-label">Avg Score by Business Sector</span>
                    <div className="chart-container" style={{height: '240px'}}><canvas ref={chartRefs[0]}></canvas></div>
                </div>
                <div className="card">
                    <span className="section-label">Scale of Assessments</span>
                    <div className="chart-container" style={{height: '240px'}}><canvas ref={chartRefs[1]}></canvas></div>
                </div>
                <div className="card">
                    <span className="section-label">Grade Portfolio</span>
                    <div className="chart-container" style={{height: '240px'}}><canvas ref={chartRefs[2]}></canvas></div>
                </div>
                <div className="card">
                    <span className="section-label">Frequent Risk Drivers</span>
                    <div className="chart-container" style={{height: '240px'}}><canvas ref={chartRefs[3]}></canvas></div>
                </div>
            </div>

            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card stat-card">
                    <span className="stat-label">TOP PERFORMANCE</span>
                    <span className="stat-value" style={{ fontSize: '16px', fontWeight: 700 }}>{summary.bestType}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">PRIMARY RISK DRIVER</span>
                    <span className="stat-value" style={{ fontSize: '13px', lineHeight: 1.2, fontWeight: 700 }}>{summary.mostCommonRisk}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">MAX RECORDED SCORE</span>
                    <span className="stat-value" style={{ color: THEME_COLORS.success, fontSize: '24px', fontWeight: 700 }}>{summary.highest}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">MIN RECORDED SCORE</span>
                    <span className="stat-value" style={{ color: THEME_COLORS.danger, fontSize: '24px', fontWeight: 700 }}>{summary.lowest}</span>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
