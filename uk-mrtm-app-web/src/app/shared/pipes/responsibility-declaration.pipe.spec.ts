import { EmpMandate } from '@mrtm/api';

import { ResponsibilityDeclarationPipe } from '@shared/pipes/responsibility-declaration.pipe';

describe('ResponsibilityDeclarationPipe', () => {
  it('create an instance', () => {
    const pipe = new ResponsibilityDeclarationPipe();

    expect(pipe).toBeTruthy();
  });

  it('should return correct string when responsibilityDeclaration is true', () => {
    const pipe = new ResponsibilityDeclarationPipe();
    const details: EmpMandate = {
      exist: true,
      registeredOwners: [],
      responsibilityDeclaration: true,
    };

    expect(pipe.transform(details, 'testOperator')).toEqual(
      'I certify that I am authorised by testOperator to make this declaration on its behalf and believe that the information provided is true.',
    );
  });

  it('should return null when responsibilityDeclaration is false or null', () => {
    const pipe = new ResponsibilityDeclarationPipe();

    expect(pipe.transform(null)).toEqual(null);
  });
});
