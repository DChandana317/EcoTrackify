import mongoose from 'mongoose';

const categories = ['transportation', 'energy', 'waste', 'food', 'other'];

const emissionEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: categories,
      required: true
    },
    subCategory: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['km', 'miles', 'kwh', 'kg', 'lbs', 'liters', 'gallons', 'items'],
      required: true
    },
    emissionFactor: {
      type: Number,
      required: true,
      min: 0
    },
    calculatedCO2e: {
      type: Number,
      required: true,
      min: 0
    },
    entryDate: {
      type: Date,
      required: true
    },
    notes: String,
    dataSource: {
      type: String,
      enum: ['manual', 'import', 'sensor'],
      default: 'manual'
    }
  },
  { timestamps: true }
);

export const EmissionEntry = mongoose.model('EmissionEntry', emissionEntrySchema);
export const EMISSION_CATEGORIES = categories;
