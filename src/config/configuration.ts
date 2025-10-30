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
});
