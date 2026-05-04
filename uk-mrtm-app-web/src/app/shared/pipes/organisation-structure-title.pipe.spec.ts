import { OrganisationStructureTitlePipe } from '@shared/pipes';

describe('OrganisationStructureTitlePipe', () => {
  const pipe: OrganisationStructureTitlePipe = new OrganisationStructureTitlePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform organisation details address title', () => {
    expect(pipe.transform('INDIVIDUAL')).toEqual('Full name');
    expect(pipe.transform('LIMITED_COMPANY')).toEqual('Company registration number');
    expect(pipe.transform('PARTNERSHIP')).toEqual('Name of the partnership');
  });
});
