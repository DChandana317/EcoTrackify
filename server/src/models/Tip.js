import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    flagged: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

tipSchema.index({ title: 'text', body: 'text', tags: 'text' });

export const Tip = mongoose.model('Tip', tipSchema);
