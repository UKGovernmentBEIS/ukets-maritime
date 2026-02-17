import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { SendReportSuccessComponent } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report/send-report-success';

describe('SendReportSuccessComponent', () => {
  class Page extends BasePage<SendReportSuccessComponent> {}

  let component: SendReportSuccessComponent;
  let fixture: ComponentFixture<SendReportSuccessComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendReportSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendReportSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toEqual('Your improvement response has been sent to the regulator');
    expect(page.query('a').textContent.trim()).toEqual('Return to: Dashboard');
  });
});
