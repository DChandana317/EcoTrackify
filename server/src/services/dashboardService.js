import mongoose from 'mongoose';
import { EmissionEntry } from '../models/EmissionEntry.js';
import { Goal } from '../models/Goal.js';
import { Tip } from '../models/Tip.js';

export const DashboardService = {
  async getUserDashboard(userId) {
    const [recentEntries, goals, tips, breakdown] = await Promise.all([
      EmissionEntry.find({ userId }).sort({ entryDate: -1 }).limit(10),
      Goal.find({ userId }).sort({ createdAt: -1 }),
      Tip.find({ isApproved: true }).sort({ createdAt: -1 }).limit(5),
      EmissionEntry.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$category', totalCO2e: { $sum: '$calculatedCO2e' } } }
      ])
    ]);

    const totalCO2e = recentEntries.reduce((sum, entry) => sum + entry.calculatedCO2e, 0);
    const goalProgress = goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      progress: Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    }));

    const breakdownMap = breakdown.reduce((acc, item) => {
      acc[item._id] = item.totalCO2e;
      return acc;
    }, {});

    return {
      totals: {
        totalCO2e,
        entries: recentEntries.length
      },
      breakdown: breakdownMap,
      recentEntries,
      goalProgress,
      featuredTips: tips
    };
  }
};
