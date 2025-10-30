export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  app_name: process.env.APP_NAME || 'backend-service',
  database_url:
    process.env.DATABASE_URL ||
    'mysql://default:secret@127.0.0.1:3306/default_db?connection_limit=10',
  grafana_url: process.env.GRAFANA_URL || 'http://localhost:3100',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || '',
  AWS_S3_PUBLIC_URL: process.env.AWS_S3_PUBLIC_URL || '',

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Application Settings
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
  },

  // Webhook Settings
  webhook: {
    maxBodySizeMb: parseInt(process.env.MAX_BODY_SIZE_MB, 10) || 10,
    retentionDays: parseInt(process.env.REQUEST_RETENTION_DAYS, 10) || 30,
  },

  // Rate Limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
});
