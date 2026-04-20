import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { MaterialityLevelSummaryTemplateComponent } from '@shared/components';

describe('MaterialityLevelSummaryTemplateComponent', () => {
  let component: MaterialityLevelSummaryTemplateComponent;
  let fixture: ComponentFixture<MaterialityLevelSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MaterialityLevelSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialityLevelSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialityLevelSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      materialityDetails: 'Lorem ipsum',
      accreditationReferenceDocumentTypes: [
        'SI_2020_1265',
        'EN_ISO_14065_2020',
        'EN_ISO_14064_3_2019',
        'IAF_MD_6_2023',
        'AUTHORITY_GUIDANCE',
        'OTHER',
      ],
      otherReference: 'Dolor sit',
    });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Materiality level',
      'Lorem ipsum',
      'Change',
      'Accreditation reference documents',
      'The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)EN ISO 14065:2020 Requirements for greenhouse gas validation and verification bodies for use in accreditation or other forms of recognitionEN ISO 14064-3:2019 Specification with guidance for the validation and verification of GHG assertionsIAF MD 6:2023 International Accreditation Forum (IAF) Mandatory Document for the Application of ISO 14065:2020 (Issue 3, November 2023)Any guidance developed by the UK ETS Authority on verification and accreditation in relation to Maritime',
      'Change',
      'Reference details',
      'Dolor sit',
      'Change',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Materiality level',
      'Lorem ipsum',
      'Accreditation reference documents',
      'The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)EN ISO 14065:2020 Requirements for greenhouse gas validation and verification bodies for use in accreditation or other forms of recognitionEN ISO 14064-3:2019 Specification with guidance for the validation and verification of GHG assertionsIAF MD 6:2023 International Accreditation Forum (IAF) Mandatory Document for the Application of ISO 14065:2020 (Issue 3, November 2023)Any guidance developed by the UK ETS Authority on verification and accreditation in relation to Maritime',
      'Reference details',
      'Dolor sit',
    ]);
  });

  it('should not show Reference details when accreditationReferenceDocumentTypes: OTHER is not selected', () => {
    fixture.componentRef.setInput('data', {
      materialityDetails: 'Lorem ipsum',
      accreditationReferenceDocumentTypes: ['SI_2020_1265'],
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Materiality level',
      'Lorem ipsum',
      'Change',
      'Accreditation reference documents',
      'The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)',
      'Change',
    ]);
  });
});
