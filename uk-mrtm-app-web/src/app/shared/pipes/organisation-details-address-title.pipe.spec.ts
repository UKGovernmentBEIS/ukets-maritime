import { OrganisationDetailsAddressTitlePipe } from '@shared/pipes';

describe('OrganisationDetailsAddressTitlePipe', () => {
  const pipe: OrganisationDetailsAddressTitlePipe = new OrganisationDetailsAddressTitlePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform organisation details address title', () => {
    expect(pipe.transform('INDIVIDUAL')).toEqual('Address');
    expect(pipe.transform('LIMITED_COMPANY')).toEqual('Registered address');
    expect(pipe.transform('PARTNERSHIP')).toEqual('Main office address');
  });
});
