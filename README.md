# DurianLab Email Backend

A container-first Node.js microservice for handling contact form submissions and sending emails for durianlab.tech frontpage.

## Features

- RESTful API for contact form submissions
- Email sending via Nodemailer
- Input validation and rate limiting
- CORS support
- Docker containerization
- Health check endpoint

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Gmail account (or SendGrid account)

### Setup

1. Clone this repository
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Fill in your email credentials in `.env`
4. Install dependencies:
   ```bash
   make install
   ```
5. Start development server:
   ```bash
   make dev
   ```

### Docker Setup

```bash
# Start with Docker Compose
make docker-compose-up

# Or build and run manually
make docker-build
make docker-run
```

## API Endpoints

### POST /api/contact
Send a contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I need help with..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### GET /health
Health check endpoint.

## Configuration

### Email Providers

#### Gmail (Default)
- Set `EMAIL_USER` and `EMAIL_PASS` (use app password)
- Enable 2FA on Gmail account

#### SendGrid
- Uncomment SendGrid config in `emailController.js`
- Set `SENDGRID_API_KEY`

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Allowed CORS origin
- `EMAIL_USER`: Email username
- `EMAIL_PASS`: Email password
- `ADMIN_EMAIL`: Recipient email address

## Development

```bash
# Install dependencies
make install

# Start development server
make dev

# Run tests
make test

# Run linting
make lint

# Clean dependencies
make clean
```

## Deployment

### Docker Deployment

1. Build image:
   ```bash
   make docker-build
   ```

2. Push to registry:
   ```bash
   make docker-push
   ```

3. Deploy to your hosting platform (Vercel, Railway, etc.)

### Environment Setup
- Set environment variables in your deployment platform
- Ensure email credentials are securely stored

## Testing

### Unit Tests
```bash
# Run unit tests
make test
```

### Manual API Testing

1. **Setup environment**:
   ```bash
   cp .env.example .env
   # Fill in EMAIL_USER and EMAIL_PASS in .env
   ```

2. **Start the server**:
   ```bash
   make dev
   ```

3. **Test contact endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}'
   ```

4. **Expected response**:
   ```json
   {
     "success": true,
     "message": "Email sent successfully"
   }
   ```

5. **Verify email delivery**: Check the admin email inbox for the test message.

### Docker Testing
```bash
# Run with Docker Compose
make docker-compose-up
```

## Security

- Rate limiting: 10 requests per 15 minutes per IP
- Input validation with Joi
- CORS configured for frontend domain
- Helmet for security headers

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use container-first development

## License

ISC