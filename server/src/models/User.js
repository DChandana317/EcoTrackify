import mongoose from 'mongoose';

const notificationPrefsSchema = new mongoose.Schema(
  {
    reminders: { type: Boolean, default: true },
    tipsDigest: { type: Boolean, default: true },
    quietHoursStart: { type: Number, default: 22 },
    quietHoursEnd: { type: Number, default: 7 }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    location: String,
    avatarUrl: String,
    bio: String,
    householdSize: { type: Number, min: 1 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    roles: {
      type: [String],
      enum: ['user', 'business_admin', 'business_member', 'moderator'],
      default: ['user']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profile: profileSchema,
    notificationPrefs: {
      type: notificationPrefsSchema,
      default: () => ({})
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    }
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

export const User = mongoose.model('User', userSchema);
