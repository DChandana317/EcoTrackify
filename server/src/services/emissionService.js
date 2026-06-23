import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import { EmissionEntry } from '../models/EmissionEntry.js';
import { AppError } from '../utils/AppError.js';

export const EmissionService = {
  async createEntry(userId, payload) {
    if (payload.entryDate && dayjs(payload.entryDate).isAfter(dayjs())) {
      throw new AppError('Entry date cannot be in the future', StatusCodes.BAD_REQUEST);
    }
    const calculatedCO2e = Number(payload.quantity) * Number(payload.emissionFactor);
    const entry = await EmissionEntry.create({
      ...payload,
      userId,
      calculatedCO2e
    });
    return entry;
  },

  async listEntries(userId, query) {
    const criteria = { userId };
    if (query.category) criteria.category = query.category;
    if (query.startDate || query.endDate) {
      criteria.entryDate = {};
      if (query.startDate) criteria.entryDate.$gte = query.startDate;
      if (query.endDate) criteria.entryDate.$lte = query.endDate;
    }
    const entries = await EmissionEntry.find(criteria)
      .sort({ entryDate: -1 })
      .limit(query.limit || 50);

    const totalCO2e = entries.reduce((sum, item) => sum + item.calculatedCO2e, 0);
    const breakdown = entries.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.calculatedCO2e;
      return acc;
    }, {});
    return { entries, totalCO2e, breakdown };
  },

  async updateEntry(userId, entryId, payload) {
    const entry = await EmissionEntry.findOne({ _id: entryId, userId });
    if (!entry) {
      throw new AppError('Emission entry not found', StatusCodes.NOT_FOUND);
    }
    if (payload.entryDate && dayjs(payload.entryDate).isAfter(dayjs())) {
      throw new AppError('Entry date cannot be in the future', StatusCodes.BAD_REQUEST);
    }
    Object.assign(entry, payload);
    entry.calculatedCO2e = entry.quantity * entry.emissionFactor;
    await entry.save();
    return entry;
  },

  async deleteEntry(userId, entryId) {
    const deleted = await EmissionEntry.findOneAndDelete({ _id: entryId, userId });
    if (!deleted) {
      throw new AppError('Emission entry not found', StatusCodes.NOT_FOUND);
    }
  }
};
