import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/authService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

const attachRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.register(req.body);
  attachRefreshCookie(res, refreshToken);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Account created. Check your inbox to verify your email.',
    data: { user, accessToken }
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await AuthService.verify(req.query.token);
  res.json({ status: 'success', message: 'Email verified. You can now log in.' });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);
  attachRefreshCookie(res, refreshToken);
  res.json({
    status: 'success',
    message: 'Welcome back!',
    data: { user, accessToken }
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  const refreshTokenFromBody = req.body.refreshToken;
  const token = refreshTokenFromBody || refreshTokenFromCookie;
  const { user, accessToken, refreshToken: newRefresh } = await AuthService.refresh(token);
  attachRefreshCookie(res, newRefresh);
  res.json({ status: 'success', data: { user, accessToken } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  res.json({
    status: 'success',
    message: 'If an account exists for that email, a reset link was sent.'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await AuthService.resetPassword(req.body);
  res.json({ status: 'success', message: 'Password updated. You can log in now.' });
});
