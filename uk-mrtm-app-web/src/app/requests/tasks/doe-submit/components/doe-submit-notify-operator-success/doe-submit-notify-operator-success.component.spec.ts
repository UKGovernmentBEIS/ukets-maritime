import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DoeSubmitNotifyOperatorSuccessComponent } from '@requests/tasks/doe-submit/components';

describe('DoeSubmitNotifyOperatorSuccessComponent', () => {
  let component: DoeSubmitNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<DoeSubmitNotifyOperatorSuccessComponent>;
  let page: Page;

  const activatedRouteStub = new ActivatedRouteStub();

  class Page extends BasePage<DoeSubmitNotifyOperatorSuccessComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoeSubmitNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoeSubmitNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(page.heading1.textContent).toEqual('Emissions approved');
    expect(page.paragraph.textContent).toEqual(
      'The selected users will receive an email notification of your decision.',
    );
    expect(page.link.textContent).toEqual('Return to: Dashboard');
  });
});
