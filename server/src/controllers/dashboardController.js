import { DashboardService } from '../services/dashboardService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await DashboardService.getUserDashboard(req.user.id);
  res.json({ status: 'success', data });
});
