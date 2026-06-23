import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecotrackify',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  mail: {
    from: process.env.EMAIL_FROM || 'Ecotrackify <noreply@ecotrackify.com>',
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: toNumber(process.env.SMTP_PORT, 587),
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'password'
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: toNumber(process.env.RATE_LIMIT_MAX, 100)
  },
  saltingRounds: toNumber(process.env.SALT_ROUNDS, 12),
  businessDomainWhitelist: (process.env.BUSINESS_DOMAIN_WHITELIST || '')
    .split(',')
    .map((domain) => domain.trim())
    .filter(Boolean)
};
