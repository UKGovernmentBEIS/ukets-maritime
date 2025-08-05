import { AerSiteVisitTypeToLabelPipe } from '@shared/pipes';

describe('AerSiteVisitTypeToLabelPipe', () => {
  const pipe: AerSiteVisitTypeToLabelPipe = new AerSiteVisitTypeToLabelPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform site visit type', () => {
    expect(pipe.transform('IN_PERSON')).toEqual('In-person site visit');
    expect(pipe.transform('VIRTUAL')).toEqual('Virtual site visit');
    expect(pipe.transform(null)).toEqual(null);
  });
});
