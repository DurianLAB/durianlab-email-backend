const nodemailer = require('nodemailer');

// Mock nodemailer before requiring the controller
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn()
}));

const { sendContactEmail } = require('../controllers/emailController');

describe('Email Controller', () => {
  let mockTransporter;
  let mockSendMail;

  beforeEach(() => {
    mockSendMail = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail
    };
    nodemailer.createTransporter.mockReturnValue(mockTransporter);

    // Set required env vars for tests
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'testpass';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email successfully', async () => {
    mockSendMail.mockResolvedValue({ messageId: '123' });

    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    };

    await expect(sendContactEmail(contactData)).resolves.toBeUndefined();

    expect(nodemailer.createTransporter).toHaveBeenCalledWith({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: 'test@example.com',
        pass: process.env.EMAIL_PASS || ''
      }
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'admin@durianlab.tech',
      subject: 'New Contact Form Submission from John Doe',
      html: expect.stringContaining('John Doe')
    });
  });

  it('should throw error if email sending fails', async () => {
    const error = new Error('SMTP error');
    mockSendMail.mockRejectedValue(error);

    const contactData = {
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Error test'
    };

    await expect(sendContactEmail(contactData)).rejects.toThrow('SMTP error');
  });
});