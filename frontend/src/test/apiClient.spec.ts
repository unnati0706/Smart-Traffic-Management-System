import { describe, it, expect } from 'vitest';
import { APIError } from '../services/api/client';

describe('APIError Normalization', () => {
  it('normalizes error responses to message, code, and errors structure', () => {
    const error = new APIError('Invalid Intersection ID', 'INVALID_ID', 400, {
      id: ['Must be a valid UUID'],
    });

    expect(error.message).toBe('Invalid Intersection ID');
    expect(error.code).toBe('INVALID_ID');
    expect(error.status).toBe(400);
    expect(error.errors).toEqual({ id: ['Must be a valid UUID'] });
  });
});
