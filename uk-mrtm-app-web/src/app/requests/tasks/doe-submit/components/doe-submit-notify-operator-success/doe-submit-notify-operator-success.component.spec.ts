import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { DoeSubmitNotifyOperatorSuccessComponent } from '@requests/tasks/doe-submit/components';
import { screen } from '@testing-library/dom';

describe('DoeSubmitNotifyOperatorSuccessComponent', () => {
  let component: DoeSubmitNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<DoeSubmitNotifyOperatorSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoeSubmitNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoeSubmitNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(screen.getByRole('heading').textContent).toEqual('Emissions approved');
    expect(screen.getByRole('paragraph').textContent).toEqual(
      'The selected users will receive an email notification of your decision.',
    );
    expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
  });
});
