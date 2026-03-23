import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { DoePeerReviewActionButtonsComponent } from '@requests/tasks/doe-peer-review/components';
import { screen } from '@testing-library/angular';

describe('DoePeerReviewActionButtonsComponent', () => {
  let component: DoePeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<DoePeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoePeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoePeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button with correct label', () => {
    const button = screen.getByRole('link');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual('Peer review decision');
  });
});
