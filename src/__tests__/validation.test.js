const { validateContact } = require('../middleware/validation');

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should call next for valid input', () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    };

    validateContact(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 for missing name', () => {
    mockReq.body = {
      email: 'john@example.com',
      message: 'Hello'
    };

    validateContact(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.any(String)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid email', () => {
    mockReq.body = {
      name: 'John',
      email: 'invalid-email',
      message: 'Hello'
    };

    validateContact(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.any(String)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 for short message', () => {
    mockReq.body = {
      name: 'John',
      email: 'john@example.com',
      message: 'Hi'
    };

    validateContact(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.any(String)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});