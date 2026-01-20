# Agents.md - Component Testing and Verification Guide

This document outlines how to test and verify all components and functions in the DurianLab Email Backend.

## Components Overview

### 1. App Server (`src/app.js`)
**Purpose**: Main Express application setup with middleware and routes.

**Testable Functions/Features**:
- Server startup
- CORS configuration
- Rate limiting
- Error handling
- Health check endpoint

**Verification Steps**:
```bash
# Start server
npm run dev

# Test health endpoint
curl http://localhost:3000/health
# Expected: {"status":"OK","timestamp":"2024-..."}
```

### 2. Contact Routes (`src/routes/contact.js`)
**Purpose**: API routes for contact form submissions.

**Testable Functions**:
- POST /api/contact endpoint
- Request validation
- Error handling

**Verification Steps**:
```bash
# Test with valid data
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
# Expected: {"success":true,"message":"Email sent successfully"}

# Test with invalid data
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid","message":""}'
# Expected: 400 status with validation error
```

### 3. Email Controller (`src/controllers/emailController.js`)
**Purpose**: Handles email sending logic using Nodemailer.

**Testable Functions**:
- `sendContactEmail()` function
- Email transporter configuration
- Email formatting

**Verification Steps**:
```bash
# Unit tests implemented in src/__tests__/emailController.test.js
npm test -- --testNamePattern="Email Controller"

# Integration test via API (see Contact Routes)
```

### 4. Validation Middleware (`src/middleware/validation.js`)
**Purpose**: Input validation using Joi schemas.

**Testable Functions**:
- `validateContact` middleware
- Joi schema validation

**Verification Steps**:
```bash
# Unit tests implemented in src/__tests__/validation.test.js
npm test -- --testNamePattern="Validation Middleware"

# API test with invalid inputs (see Contact Routes)
```

## Testing Commands

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Start server for manual testing
npm run dev

# Docker testing
npm run docker-compose-up
```

## Environment Setup for Testing

1. Copy `.env.example` to `.env`
2. Fill in required environment variables:
   - `EMAIL_USER`: admin@durianlab.tech
   - `EMAIL_PASS`: Zoho password/app password
   - `FRONTEND_URL`: http://localhost:3000

## Mock Testing

For unit tests that don't require actual email sending:
- Mock Nodemailer transporter
- Use Jest to spy on `sendMail` method
- Verify email content and recipient

## Coverage Requirements

All components should have:
- Unit tests for pure functions
- Integration tests for API endpoints
- Error handling verification
- Input validation testing

## Continuous Integration

Run tests on every commit:
```bash
npm run lint
npm test
```