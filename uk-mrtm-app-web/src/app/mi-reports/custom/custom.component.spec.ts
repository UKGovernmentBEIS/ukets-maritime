import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { MiReportResult, MiReportsService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { DestroySubject } from '@netz/common/services';
import { BasePage, mockClass } from '@netz/common/testing';

import { CustomReportComponent } from '@mi-reports/custom/custom.component';
import { mockCustomMiReportResult } from '@mi-reports/testing/mi-reports-data.mock';
import * as fs from 'fs';

describe('CustomComponent', () => {
  let component: CustomReportComponent;
  let fixture: ComponentFixture<CustomReportComponent>;
  let page: Page;

  const miReportsService = mockClass(MiReportsService);

  class Page extends BasePage<CustomReportComponent> {
    set queryValue(value: string) {
      this.setInputValue('#query', value);
    }

    get queryErrorMessage() {
      return this.query<HTMLParagraphElement>('p.govuk-error-message');
    }

    get formErrorMessage() {
      return this.query<HTMLElement>('div[formcontrolname="query"] span.govuk-error-message');
    }

    get executeButton() {
      return this.query<HTMLButtonElement>('button');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomReportComponent, PageHeadingComponent],
      providers: [{ provide: MiReportsService, useValue: miReportsService }, DestroySubject],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomReportComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fs.existsSync('./Custom sql report.xlsx')) {
      console.log('Deleting custom sql report file...');
      fs.unlinkSync('./Custom sql report.xlsx');
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit a valid sql', () => {
    page.executeButton.click();
    fixture.detectChanges();

    miReportsService.generateCustomReport.mockReturnValueOnce(
      of(mockCustomMiReportResult as unknown as HttpResponse<MiReportResult>),
    );

    expect(page.formErrorMessage).toBeTruthy();

    page.queryValue = 'select * from account';
    page.executeButton.click();
    fixture.detectChanges();

    expect(page.queryErrorMessage).toBeFalsy();
    expect(page.formErrorMessage).toBeFalsy();
    expect(miReportsService.generateCustomReport).toHaveBeenCalledTimes(1);
    expect(miReportsService.generateCustomReport).toHaveBeenCalledWith({
      reportType: 'CUSTOM',
      sqlQuery: 'select * from account',
    });

    expect(page.queryErrorMessage).toBeFalsy();
  });

  it('should display error message when submitting an invalid sql', () => {
    jest.spyOn(miReportsService, 'generateCustomReport').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: {
              code: 'REPORT1001',
              data: ['StatementCallback; bad SQL grammar [select * from (select * from accounts) t where 1=0];'],
              message: 'Custom query could not be executed',
            },
            status: 400,
          }),
      ),
    );

    page.queryValue = 'select * from accounts';
    page.executeButton.click();
    fixture.detectChanges();

    expect(page.formErrorMessage).toBeFalsy();
    expect(miReportsService.generateCustomReport).toHaveBeenCalledTimes(1);
    expect(miReportsService.generateCustomReport).toHaveBeenCalledWith({
      reportType: 'CUSTOM',
      sqlQuery: 'select * from accounts',
    });

    expect(page.queryErrorMessage).toBeTruthy();
    expect(page.queryErrorMessage.textContent.trim()).toEqual('Custom query could not be executed');
  });
});
