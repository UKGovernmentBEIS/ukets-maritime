import { NotVerifiedReasonTypePipe } from '@shared/pipes';

describe('NotVerifiedReasonTypePipe', () => {
  const pipe = new NotVerifiedReasonTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform value', () => {
    expect(pipe.transform('UNCORRECTED_MATERIAL_MISSTATEMENT')).toEqual(
      'An uncorrected material misstatement (individual or in aggregate)',
    );
    expect(pipe.transform('UNCORRECTED_MATERIAL_NON_CONFORMITY')).toEqual(
      'An uncorrected material non-conformity (individual or in aggregate)',
    );
    expect(pipe.transform('VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS')).toEqual(
      'Limitations in the data or information made available for verification',
    );
    expect(pipe.transform('SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY')).toEqual(
      'Limitations of scope due to lack of clarity',
    );
    expect(pipe.transform('SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN')).toEqual(
      'Limitations of scope of the approved emissions monitoring plan',
    );
    expect(pipe.transform('NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR')).toEqual(
      'The emissions monitoring plan is not approved by the regulator',
    );
    expect(pipe.transform('ANOTHER_REASON')).toEqual('Another reason');
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
