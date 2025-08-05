import { AccreditationReferenceDocumentTypesPipe } from '@shared/pipes';

describe('AccreditationReferenceDocumentTypesPipe', () => {
  const pipe: AccreditationReferenceDocumentTypesPipe = new AccreditationReferenceDocumentTypesPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform overall verification decision type', () => {
    expect(pipe.transform('SI_2020_1265')).toEqual(
      'The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)',
    );
    expect(pipe.transform('EN_ISO_14065_2020')).toEqual(
      'EN ISO 14065:2020 Requirements for greenhouse gas validation and verification bodies for use in accreditation or other forms of recognition',
    );
    expect(pipe.transform('EN_ISO_14064_3_2019')).toEqual(
      'EN ISO 14064-3:2019 Specification with guidance for the validation and verification of GHG assertions',
    );
    expect(pipe.transform('IAF_MD_6_2023')).toEqual(
      'IAF MD 6:2023 International Accreditation Forum (IAF) Mandatory Document for the Application of ISO 14065:2020 (Issue 3, November 2023)',
    );
    expect(pipe.transform('AUTHORITY_GUIDANCE')).toEqual(
      'Any guidance developed by the UK ETS Authority on verification and accreditation in relation to Maritime',
    );
    expect(pipe.transform('OTHER')).toEqual('Add your own reference');
    expect(pipe.transform(null)).toEqual(null);
  });
});
