import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { DataGapsMethodologiesSummaryTemplateComponent } from '@shared/components';

describe('DataGapsMethodologiesSummaryTemplateComponent', () => {
  let component: DataGapsMethodologiesSummaryTemplateComponent;
  let fixture: ComponentFixture<DataGapsMethodologiesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<DataGapsMethodologiesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGapsMethodologiesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGapsMethodologiesSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      methodRequired: true,
      methodApproved: false,
      methodConservative: false,
      noConservativeMethodDetails: 'Lorem ipsum',
      materialMisstatementExist: true,
      materialMisstatementDetails: 'Dolor sit',
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
      'Was a data gap method required during the reporting year?',
      'Yes',
      'Change whether a data gap method is required during the reporting year',
      'Has the data gap method already been approved by the regulator?',
      'No',
      'Change  whether the data gap method has already been approved by the regulator',
      'Was the method used conservative?',
      'No',
      'Change whether the method used was conservative',
      'Provide more detail',
      'Lorem ipsum',
      'Change details on the method used',
      'Did the method lead to a material misstatement?',
      'Yes',
      'Change whether the method lead to a material misstatement',
      'Provide more detail',
      'Dolor sit',
      'Change details on the method leading to a material misstatement',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Was a data gap method required during the reporting year?',
      'Yes',
      'Has the data gap method already been approved by the regulator?',
      'No',
      'Was the method used conservative?',
      'No',
      'Provide more detail',
      'Lorem ipsum',
      'Did the method lead to a material misstatement?',
      'Yes',
      'Provide more detail',
      'Dolor sit',
    ]);
  });

  it('should show summary contents when methodRequired: false', () => {
    fixture.componentRef.setInput('data', {
      methodRequired: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Was a data gap method required during the reporting year?',
      'No',
      'Change whether a data gap method is required during the reporting year',
    ]);
  });

  it('should show summary contents when methodApproved: true', () => {
    fixture.componentRef.setInput('data', {
      methodRequired: true,
      methodApproved: true,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Was a data gap method required during the reporting year?',
      'Yes',
      'Change whether a data gap method is required during the reporting year',
      'Has the data gap method already been approved by the regulator?',
      'Yes',
      'Change  whether the data gap method has already been approved by the regulator',
    ]);
  });

  it('should show summary contents when methodConservative: true and materialMisstatementExist: false', () => {
    fixture.componentRef.setInput('data', {
      methodRequired: true,
      methodApproved: false,
      methodConservative: true,
      materialMisstatementExist: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Was a data gap method required during the reporting year?',
      'Yes',
      'Change whether a data gap method is required during the reporting year',
      'Has the data gap method already been approved by the regulator?',
      'No',
      'Change  whether the data gap method has already been approved by the regulator',
      'Was the method used conservative?',
      'Yes',
      'Change whether the method used was conservative',
      'Did the method lead to a material misstatement?',
      'No',
      'Change whether the method lead to a material misstatement',
    ]);
  });
});
