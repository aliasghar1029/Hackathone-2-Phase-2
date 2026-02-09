/**
 * Common error utilities for the Hackathon Todo Application
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Authorization failed') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new ValidationError(data.message || 'Bad request');
      case 401:
        return new AuthenticationError(data.message || 'Unauthorized');
      case 403:
        return new AuthorizationError(data.message || 'Forbidden');
      case 404:
        return new NotFoundError(data.message || 'Not found');
      case 409:
        return new ConflictError(data.message || 'Conflict');
      case 429:
        return new RateLimitError(data.message || 'Rate limit exceeded');
      default:
        return new InternalServerError(data.message || 'Internal server error');
    }
  } else if (error.request) {
    // Request was made but no response received
    return new InternalServerError('Network error - no response received');
  } else {
    // Something else happened while setting up the request
    return new InternalServerError(error.message || 'Unknown error occurred');
  }
};

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

export const isErrorOfType = <T extends ApiError>(
  error: any,
  errorType: new (...args: any[]) => T
): error is T => {
  return error instanceof errorType;
};

// Error handler for logging
export const logError = (error: Error, context?: string): void => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context: context || 'General',
    timestamp: new Date().toISOString(),
  };

  console.error('Error occurred:', JSON.stringify(errorInfo, null, 2));
};

// Format error for client response
export const formatErrorForClient = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, return full error details
    return {
      error: {
        message: error.message,
        stack: error.stack,
        ...(error.statusCode && { statusCode: error.statusCode }),
      }
    };
  } else {
    // In production, return generic error message
    if (error.statusCode) {
      return {
        error: {
          message: error.message,
          statusCode: error.statusCode,
        }
      };
    } else {
      return {
        error: {
          message: 'An unexpected error occurred',
        }
      };
    }
  }
};