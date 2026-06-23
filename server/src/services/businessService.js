import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { Business } from '../models/Business.js';
import { User } from '../models/User.js';
import { EmissionEntry } from '../models/EmissionEntry.js';
import { Goal } from '../models/Goal.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const BusinessService = {
  async createBusiness(adminId, payload) {
    const domain = payload.domain.toLowerCase();
    if (
      env.businessDomainWhitelist.length &&
      !env.businessDomainWhitelist.includes(domain)
    ) {
      throw new AppError('Domain is not allowed for business accounts', StatusCodes.FORBIDDEN);
    }
    const existing = await Business.findOne({ domain });
    if (existing) {
      throw new AppError('Business domain already registered', StatusCodes.CONFLICT);
    }
    const business = await Business.create({
      name: payload.name,
      domain,
      admins: [adminId]
    });
    await User.findByIdAndUpdate(
      adminId,
      {
        businessId: business.id,
        $addToSet: { roles: 'business_admin' }
      },
      { new: true }
    );
    return business;
  },

  async getDashboard(businessId) {
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', StatusCodes.NOT_FOUND);
    }
    const employeeIds = business.employees.length
      ? business.employees
      : business.admins;
    const normalizedIds = employeeIds.map((id) => new mongoose.Types.ObjectId(id));
    const emissionStats = normalizedIds.length
      ? await EmissionEntry.aggregate([
          { $match: { userId: { $in: normalizedIds } } },
          {
            $group: {
              _id: '$category',
              totalCO2e: { $sum: '$calculatedCO2e' }
            }
          }
        ])
      : [];

    const goals = await Goal.find({ businessId: business.id });
    const completedGoals = goals.filter((goal) => goal.status === 'completed');

    return {
      business,
      totalsByCategory: emissionStats.reduce((acc, item) => {
        acc[item._id] = item.totalCO2e;
        return acc;
      }, {}),
      goals: {
        total: goals.length,
        completed: completedGoals.length
      }
    };
  }
};
