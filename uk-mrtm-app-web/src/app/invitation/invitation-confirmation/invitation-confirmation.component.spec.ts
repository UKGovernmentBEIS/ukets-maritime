import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { mockClass } from '@netz/common/testing';
import { GovukComponentsModule } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { InvitationConfirmationComponent } from '@invitation/invitation-confirmation/invitation-confirmation.component';

describe('InvitationConfirmationComponent', () => {
  let component: InvitationConfirmationComponent;
  let fixture: ComponentFixture<InvitationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationConfirmationComponent, GovukComponentsModule],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockClass(AuthService) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
