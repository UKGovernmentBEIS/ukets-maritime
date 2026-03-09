import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AdminVerifierUserInvitationDTO } from '@mrtm/api';

import { ActivatedRouteStub } from '@netz/common/testing';

import { VerificationBodyAdminUserSummaryComponent } from '@verification-bodies/components';
import { mockedVerificationBodyCreationDTO } from '@verification-bodies/testing/verification-bodies-data.mock';

@Component({
  selector: 'mrtm-test-parent',
  template: `
    <mrtm-verification-body-admin-user-summary [summaryInfo]="summaryInfo"></mrtm-verification-body-admin-user-summary>
  `,
})
class TestParentComponent {
  summaryInfo: AdminVerifierUserInvitationDTO = mockedVerificationBodyCreationDTO.adminVerifierUserInvitation;
}

describe('VerificationBodyAdminUserSummaryComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestParentComponent],
      imports: [VerificationBodyAdminUserSummaryComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
