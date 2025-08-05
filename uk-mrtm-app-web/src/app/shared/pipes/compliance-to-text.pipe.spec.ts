import { ComplianceToTextPipe } from '@shared/pipes';

describe('ComplianceToTextPipe', () => {
  let pipe: ComplianceToTextPipe;

  beforeEach(() => (pipe = new ComplianceToTextPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account types', () => {
    expect(pipe.transform(true)).toEqual('Compliant');
    expect(pipe.transform(false)).toEqual('Not compliant');
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
