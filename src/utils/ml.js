import * as tf from '@tensorflow/tfjs';

export const MAX_VALS = {
    revenue: 500000,
    txn_count: 200,
    consistency: 10,
    has_website: 1,
    social_score: 10,
    years_in_business: 20,
    expense_ratio: 1,
    loan_history: 2,
    business_type: 3
};

export function calculateScore(data) {
    const {
        revenue, txn_count, consistency, has_website,
        social_score, years_in_business, expense_ratio,
        loan_history
    } = data;

    let score = (
        (revenue / 500000) * 25 +
        (txn_count / 200) * 15 +
        (consistency / 10) * 20 +
        (has_website ? 5 : 0) +
        (social_score / 10) * 10 +
        (years_in_business / 20) * 10 +
        (1 - expense_ratio) * 10 +
        (loan_history === 1 ? 5 : loan_history === 2 ? -10 : 0)
    );
    
    return Math.min(100, Math.max(0, score));
}

export function generateSyntheticData(count) {
    const inputs = [];
    const labels = [];

    for (let i = 0; i < count; i++) {
        const sample = {
            revenue: 10000 + Math.random() * 490000,
            txn_count: 5 + Math.floor(Math.random() * 196),
            consistency: 1 + Math.random() * 9,
            has_website: Math.random() > 0.4 ? 1 : 0,
            social_score: 1 + Math.random() * 9,
            years_in_business: Math.random() * 20,
            expense_ratio: 0.2 + Math.random() * 0.75,
            loan_history: Math.floor(Math.random() * 3),
            business_type: Math.floor(Math.random() * 4)
        };

        const normalized = [
            sample.revenue / MAX_VALS.revenue,
            sample.txn_count / MAX_VALS.txn_count,
            sample.consistency / MAX_VALS.consistency,
            sample.has_website,
            sample.social_score / MAX_VALS.social_score,
            sample.years_in_business / MAX_VALS.years_in_business,
            sample.expense_ratio,
            sample.loan_history / MAX_VALS.loan_history,
            sample.business_type / MAX_VALS.business_type
        ];

        const score = calculateScore(sample);
        
        inputs.push(normalized);
        labels.push([score / 100]);
    }

    return { inputs, labels };
}

export async function trainModel(onEpochEnd) {
    const m = tf.sequential();
    m.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [9] }));
    m.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    m.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    m.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError'
    });

    const { inputs, labels } = generateSyntheticData(500);
    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(labels);

    await m.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        callbacks: {
            onEpochEnd: (epoch) => {
                onEpochEnd(epoch + 1);
            }
        }
    });

    return m;
}
