import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { InvitationComponent } from '@registration/invitation/invitation.component';

describe('InvitationComponent', () => {
  let component: InvitationComponent;
  let fixture: ComponentFixture<InvitationComponent>;
  let element: HTMLElement;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the installation name for advanced and restricted users', () => {
    const operatorInvitationResultData = {
      accountName: 'Operator Faculty',
      roleCode: 'operator',
    };

    activatedRoute.setResolveMap({ operatorInvitationResultData });
    fixture.detectChanges();

    expect(element.querySelector('.govuk-panel__title').textContent).toEqual(
      `You have been added as an operator user to the account of Operator Faculty`,
    );
  });

  it('should have a link towards dashboard', () => {
    expect(element.querySelector('a').href).toMatch(/\/dashboard$/);
  });
});
