import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import { Goal } from '../models/Goal.js';
import { AppError } from '../utils/AppError.js';

const determineStatus = (goal) => {
  if (goal.currentValue >= goal.targetValue) return 'completed';
  const progress = goal.currentValue / goal.targetValue;
  if (progress >= 0.75) return 'on_track';
  if (progress >= 0.25) return 'in_progress';
  return 'off_track';
};

export const GoalService = {
  async create(userId, payload) {
    if (dayjs(payload.targetDate).diff(dayjs(), 'day') < 7) {
      throw new AppError('Goals must be at least 7 days out', StatusCodes.BAD_REQUEST);
    }
    const goal = await Goal.create({
      ...payload,
      userId,
      currentValue: payload.baselineValue || 0,
      status: 'not_started',
      progressHistory: [
        {
          value: payload.baselineValue || 0,
          note: 'Goal created'
        }
      ]
    });
    return goal;
  },

  async list(userId) {
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    return goals;
  },

  async update(userId, goalId, payload) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new AppError('Goal not found', StatusCodes.NOT_FOUND);
    }
    if (payload.currentValue !== undefined) {
      goal.currentValue = payload.currentValue;
      goal.progressHistory.push({ value: payload.currentValue, note: 'Progress update' });
      goal.status = determineStatus(goal);
    }
    if (payload.status) {
      goal.status = payload.status;
    }
    if (payload.remindersEnabled !== undefined) {
      goal.remindersEnabled = payload.remindersEnabled;
    }
    await goal.save();
    return goal;
  }
};
