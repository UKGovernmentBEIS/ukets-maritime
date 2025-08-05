import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { PeerReviewActionButtonsComponent } from '@requests/tasks/notification-peer-review/components/peer-review-action-buttons';

describe('PeerReviewActionButtonsComponent', () => {
  let component: PeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<PeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: ActivatedRouteStub }],
      imports: [PeerReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
