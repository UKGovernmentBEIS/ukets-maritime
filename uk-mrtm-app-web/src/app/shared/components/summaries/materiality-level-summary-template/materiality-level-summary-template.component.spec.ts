import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { MaterialityLevelSummaryTemplateComponent } from '@shared/components';

describe('MaterialityLevelSummaryTemplateComponent', () => {
  let component: MaterialityLevelSummaryTemplateComponent;
  let fixture: ComponentFixture<MaterialityLevelSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MaterialityLevelSummaryTemplateComponent> {
    get summariesKeys(): string[] {
      return this.queryAll<HTMLDListElement>('dl dt').map((item) => item.textContent.trim());
    }

    get summariesValues(): string[] {
      return this.queryAll<HTMLDListElement>('dl dd:first-of-type').map((item) => item.textContent.trim());
    }

    get referenceDocumentTypes(): string[] {
      return this.queryAll<HTMLDListElement>('dl:nth-child(2) .govuk-summary-list__row:nth-child(2) ul > li').map(
        (item) => item.textContent.trim(),
      );
    }

    get summariesActions(): string[] {
      return this.queryAll<HTMLDListElement>('dl dd:nth-of-type(2)').map((item) => item.textContent.trim());
    }
  }

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
    expect(page.summariesKeys).toEqual([
      'Objectives and scope of the Verification',
      'Responsibilities',
      'Work performed & basis of the opinion',
      'Materiality level',
      'Accreditation reference documents',
      'Reference details',
    ]);
    expect(page.summariesValues).toHaveLength(6);
    expect(page.summariesActions).toHaveLength(3);
  });

  it('should contain UKAS additional declaration for materiality level', () => {
    expect(page.summariesValues[3]).toContain('GHG quantification');
  });

  it('should contain proper types for accreditationReferenceDocumentTypes', () => {
    expect(page.referenceDocumentTypes).toHaveLength(5);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesKeys).toEqual([
      'Objectives and scope of the Verification',
      'Responsibilities',
      'Work performed & basis of the opinion',
      'Materiality level',
      'Accreditation reference documents',
      'Reference details',
    ]);
    expect(page.summariesValues).toHaveLength(6);
    expect(page.summariesActions).toHaveLength(0);
  });

  it('should not show Reference details when accreditationReferenceDocumentTypes: OTHER is not selected', () => {
    fixture.componentRef.setInput('data', {
      materialityDetails: 'Lorem ipsum',
      accreditationReferenceDocumentTypes: ['SI_2020_1265'],
    });
    fixture.detectChanges();

    expect(page.summariesKeys).toEqual([
      'Objectives and scope of the Verification',
      'Responsibilities',
      'Work performed & basis of the opinion',
      'Materiality level',
      'Accreditation reference documents',
    ]);
  });
});
