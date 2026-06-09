import { UncertaintyLevelValuePipe } from '@shared/pipes';

describe('UncertaintyLevelValuePipe', () => {
  const pipe: UncertaintyLevelValuePipe = new UncertaintyLevelValuePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should map values according to methodApproach', () => {
    expect(pipe.transform({ monitoringMethod: 'DIRECT', methodApproach: 'DEFAULT', value: '7.5' })).toEqual('± 7.5');
    expect(pipe.transform({ monitoringMethod: 'DIRECT', methodApproach: 'SHIP_SPECIFIC', value: '5' })).toEqual('5');
    expect(pipe.transform(null)).toEqual(undefined);
  });
});
