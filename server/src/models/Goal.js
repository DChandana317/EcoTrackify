import mongoose from 'mongoose';

const progressPointSchema = new mongoose.Schema(
  {
    value: Number,
    notedAt: {
      type: Date,
      default: Date.now
    },
    note: String
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    targetValue: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: '%'
    },
    baselineValue: Number,
    currentValue: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: Date,
    cadence: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'on_track', 'off_track', 'completed'],
      default: 'not_started'
    },
    remindersEnabled: {
      type: Boolean,
      default: true
    },
    progressHistory: {
      type: [progressPointSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Goal = mongoose.model('Goal', goalSchema);
