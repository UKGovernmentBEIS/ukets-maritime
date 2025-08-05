import { NonComplianceReasonPipe } from '@shared/pipes';

describe('NonComplianceReasonPipe', () => {
  let pipe: NonComplianceReasonPipe;

  beforeEach(() => (pipe = new NonComplianceReasonPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform values', () => {
    expect(pipe.transform('FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN')).toEqual(
      'Failure to apply for an emissions monitoring plan',
    );
    expect(pipe.transform('FAILURE_TO_COMPLY_WITH_A_CONDITION_OF_AN_EMISSIONS_MONITORING_PLAN')).toEqual(
      'Failure to comply with a condition of an emissions monitoring plan',
    );
    expect(pipe.transform('FAILURE_TO_MONITOR_EMISSIONS')).toEqual('Failure to monitor emissions');
    expect(pipe.transform('FAILURE_TO_REPORT_EMISSIONS')).toEqual('Failure to report emissions');
    expect(pipe.transform('FAILURE_TO_COMPLY_WITH_DEFICIT_NOTICE')).toEqual('Failure to comply with deficit notice');
    expect(pipe.transform('FAILURE_TO_COMPLY_WITH_AN_ENFORCEMENT_NOTICE')).toEqual(
      'Failure to comply with an enforcement notice',
    );
    expect(pipe.transform('FAILURE_TO_COMPLY_WITH_AN_INFORMATION_NOTICE')).toEqual(
      'Failure to comply with an information notice',
    );
    expect(pipe.transform('PROVIDING_FALSE_OR_MISLEADING_INFORMATION')).toEqual(
      'Providing false or misleading information',
    );
    expect(pipe.transform('REFUSAL_TO_ALLOW_ACCESS_TO_PREMISES')).toEqual('Refusal to allow access to premises');
    expect(pipe.transform('FAILURE_TO_SURRENDER_ALLOWANCE_100')).toEqual(
      'Failure to surrender allowance (£100/allowance)',
    );
    expect(pipe.transform('FAILURE_TO_SURRENDER_ALLOWANCE_20')).toEqual(
      'Failure to surrender allowance (£20/allowance)',
    );
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
