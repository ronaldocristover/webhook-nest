<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">🪝 Webhook Receiver Service</h1>

<p align="center">A robust <a href="http://nodejs.org" target="_blank">Node.js</a> webhook receiver service built with <a href="https://nestjs.com/" target="_blank">NestJS</a> for capturing, storing, and analyzing webhook requests.</p>

## Description

This is a comprehensive webhook receiver service that allows you to:
- **Receive webhooks** from external services via unique token-based endpoints
- **Store and analyze** all incoming webhook data including headers, payload, and metadata
- **Monitor requests** with detailed logging and statistics
- **Secure authentication** using JWT tokens and API keys
- **Real-time tracking** of webhook requests with processing times and analytics

### Key Features

- 🔐 **JWT Authentication** with user registration and API key management
- 🪝 **Unique Webhook Endpoints** with token-based routing (`/oh-my-hook/:token`)
- 📊 **Request Analytics** with detailed statistics and processing metrics
- 🗄️ **Persistent Storage** using MySQL and Prisma ORM
- 📝 **Comprehensive Logging** with Winston and Loki integration
- 🛡️ **Security Features** including rate limiting and CORS protection
- 📈 **Request History** with full payload and header capture
- ⚡ **High Performance** with configurable body size limits and async processing

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** database
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd webhook-nest
```

2. **Install dependencies**
```bash
$ npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/webhook_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Application
PORT=3000
NODE_ENV=development

# Webhook Configuration
WEBHOOK_MAX_BODY_SIZE_MB=10
```

4. **Database Setup**
```bash
# Generate Prisma client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate dev

# (Optional) Seed the database
$ npm run db:seed
```

## Running the Application

```bash
# Development with hot reload
$ npm run start:dev

# Development with SWC (faster compilation)
$ npm run dev

# Production build
$ npm run build
$ npm run start:prod

# Debug mode
$ npm run start:debug
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

### Webhook Management
- `GET /api/v1/webhooks` - List user webhooks
- `POST /api/v1/webhooks` - Create new webhook
- `GET /api/v1/webhooks/:id` - Get webhook details
- `PUT /api/v1/webhooks/:id` - Update webhook
- `DELETE /api/v1/webhooks/:id` - Delete webhook

### Webhook Receiver
- `POST /oh-my-hook/:token` - **Receive webhook requests**

### Request Analytics
- `GET /api/v1/webhook-requests` - List webhook requests
- `GET /api/v1/webhook-requests/:id` - Get request details

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Watch mode
$ npm run test:watch
```

## Usage Example

### 1. Register and Create a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### 2. Login and Get JWT Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### 3. Create a Webhook
```bash
curl -X POST http://localhost:3000/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My Test Webhook",
    "description": " webhook for testing purposes"
  }'
```

### 4. Send Webhook Data
```bash
curl -X POST http://localhost:3000/oh-my-hook/WEBHOOK_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "event": "user.created",
    "data": {
      "id": 123,
      "name": "John Doe"
    }
  }'
```

## Database Schema

The application uses the following main entities:

- **Users**: Authentication and API key management
- **Webhooks**: Unique endpoints with tokens for receiving requests
- **WebhookRequests**: Detailed log of all incoming webhook data
- **WebhookStatistics**: Aggregated analytics and metrics

## Configuration

### Environment Variables
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `WEBHOOK_MAX_BODY_SIZE_MB`: Maximum webhook payload size (default: 10MB)

## Development

### Code Quality
```bash
# Linting
$ npm run lint

# Formatting
$ npm run format
```

### Database Management
```bash
# View database
$ npx prisma studio

# Reset database
$ npx prisma migrate reset

# Deploy migrations
$ npx prisma migrate deploy
```

## Security Features

- **Rate Limiting**: Built-in throttling to prevent abuse
- **Input Validation**: Comprehensive DTO validation with class-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Integration**: Security headers and protections
- **JWT Authentication**: Secure token-based authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Built With

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [MySQL](https://www.mysql.com/) - Relational database
- [Winston](https://github.com/winstonjs/winston) - Logging library
