import { TestBed } from '@angular/core/testing';

import { PasswordStrengthMeterService } from '@shared/components/password-strength-meter/password-strength-meter.service';

describe('PasswordStrengthMeterService', () => {
  let service: PasswordStrengthMeterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordStrengthMeterService],
    });
    service = TestBed.inject(PasswordStrengthMeterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 0 for a very weak password', () => {
    expect(service.score('123')).toBe(0);
  });

  it('should return a high score for a strong password', () => {
    expect(service.score('Correct-Horse-Battery-Staple-2024!')).toBe(4);
  });

  it('should return both score and feedback object', () => {
    const result = service.scoreWithFeedback('password');

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('feedback');
    expect(result.score).toBeLessThanOrEqual(4);
    expect(result.feedback).toBeDefined();
  });

  it('should provide suggestions for weak passwords', () => {
    const result = service.scoreWithFeedback('123456');

    expect(result.score).toBe(0);
    expect(result.feedback?.suggestions.length).toBeGreaterThan(0);
  });

  it('should return null or empty feedback for very strong passwords', () => {
    const result = service.scoreWithFeedback('Tr0ub4dor&3-9-Strong-Password!');

    expect(result.score).toBe(4);
    expect(result.feedback?.warning).toBeFalsy();
  });
});
