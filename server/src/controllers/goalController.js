import { StatusCodes } from 'http-status-codes';
import { GoalService } from '../services/goalService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await GoalService.create(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Goal created',
    data: goal
  });
});

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await GoalService.list(req.user.id);
  res.json({ status: 'success', data: goals });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await GoalService.update(req.user.id, req.params.id, req.body);
  res.json({ status: 'success', message: 'Goal updated', data: goal });
});
