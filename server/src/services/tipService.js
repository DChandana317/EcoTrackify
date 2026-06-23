import { StatusCodes } from 'http-status-codes';
import { Tip } from '../models/Tip.js';
import { AppError } from '../utils/AppError.js';

export const TipService = {
  async create(authorId, payload) {
    const tip = await Tip.create({
      ...payload,
      authorId,
      isApproved: true
    });
    return tip;
  },

  async list(query = {}) {
    const findCriteria = { isApproved: true };
    if (query.search) {
      findCriteria.$text = { $search: query.search };
    }
    if (query.tag) {
      findCriteria.tags = query.tag;
    }
    const tips = await Tip.find(findCriteria).sort({ createdAt: -1 });
    return tips;
  },

  async toggleLike(tipId, userId) {
    const tip = await Tip.findById(tipId);
    if (!tip) {
      throw new AppError('Tip not found', StatusCodes.NOT_FOUND);
    }
    const hasLiked = tip.likes.some((id) => id.toString() === userId);
    if (hasLiked) {
      tip.likes = tip.likes.filter((id) => id.toString() !== userId);
    } else {
      tip.likes.push(userId);
    }
    await tip.save();
    return tip;
  }
};
