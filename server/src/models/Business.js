import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    description: String
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resources: {
      type: [resourceSchema],
      default: []
    },
    stats: {
      totalCO2e: { type: Number, default: 0 },
      averageGoalCompletion: { type: Number, default: 0 },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export const Business = mongoose.model('Business', businessSchema);
