import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ErrorCodes } from '@netz/common/error';
import { ActivatedRouteStub } from '@netz/common/testing';

import { InvalidInvitationLinkComponent } from '@registration/invalid-invitation-link/invalid-invitation-link.component';

describe('InvalidInvitationLinkComponent', () => {
  let component: InvalidInvitationLinkComponent;
  let fixture: ComponentFixture<InvalidInvitationLinkComponent>;
  let activatedRoute: ActivatedRouteStub;
  let element: HTMLElement;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [InvalidInvitationLinkComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidInvitationLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display expired link message if code is EMAIL1001', () => {
    activatedRoute.setQueryParamMap({ code: ErrorCodes.EMAIL1001 });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link has expired');
  });

  it('should display invalid link message on any non expired code', () => {
    activatedRoute.setQueryParamMap({ code: ErrorCodes.TOKEN1001 });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link is invalid');
  });
});
