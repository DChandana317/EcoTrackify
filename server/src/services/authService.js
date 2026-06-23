import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import {
  sendMail,
  registrationTemplate,
  resetPasswordTemplate
} from '../utils/mailer.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/token.js';

const hashPassword = async (rawPassword) =>
  bcrypt.hash(rawPassword, env.saltingRounds);

export const AuthService = {
  async register(payload) {
    const existing = await User.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email already in use', StatusCodes.CONFLICT);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await hashPassword(payload.password);

    const user = await User.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashedPassword,
      verificationToken,
      isVerified: true,
      roles: ['user']
    });

    // const verificationLink = `${env.clientUrl}/verify?token=${verificationToken}`;
    // await sendMail({
    //   to: user.email,
    //   subject: 'Verify your Ecotrackify account',
    //   html: registrationTemplate(user.name, verificationLink)
    // });

    const tokens = this.createTokenPair(user.id);
    return { user, ...tokens };
  },

  async verify(token) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new AppError('Invalid verification token', StatusCodes.BAD_REQUEST);
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  },

  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }
    // if (!user.isVerified) {
    //   throw new AppError(
    //     'Please verify your email before logging in',
    //     StatusCodes.FORBIDDEN
    //   );
    // }
    const tokens = this.createTokenPair(user.id);
    return { user, ...tokens };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Missing refresh token', StatusCodes.BAD_REQUEST);
    }
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new AppError('Account not found', StatusCodes.UNAUTHORIZED);
    }
    return { user, ...this.createTokenPair(user.id) };
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return; // avoid user enumeration
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();
    const resetLink = `${env.clientUrl}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your Ecotrackify password',
      html: resetPasswordTemplate(user.name, resetLink)
    });
  },

  async resetPassword({ token, password }) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      throw new AppError('Reset token invalid or expired', StatusCodes.BAD_REQUEST);
    }
    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return { user };
  },

  createTokenPair(userId) {
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);
    return { accessToken, refreshToken };
  }
};
