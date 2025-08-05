import { RequestNamePipe } from '@shared/pipes';

describe('RequestNamePipe', () => {
  let pipe: RequestNamePipe;

  beforeEach(() => (pipe = new RequestNamePipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform values', () => {
    expect(pipe.transform({ id: 'MAMP00010', type: 'EMP_ISSUANCE' })).toEqual('MAMP00010 Application');
    expect(pipe.transform({ id: 'MAR00010-2025', type: 'AER' })).toEqual('MAR00010-2025 2025 emissions report');
    expect(pipe.transform({ id: 'MAV00010-1', type: 'EMP_VARIATION' })).toEqual('MAV00010-1 Variation');
    expect(pipe.transform({ id: 'MAN00010-1', type: 'EMP_NOTIFICATION' })).toEqual('MAN00010-1 Notification');
  });
});
