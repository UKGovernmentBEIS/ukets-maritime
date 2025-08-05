import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { OperatorUsersInvitationService, OperatorUsersService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { UserAuthorityDetailsComponent } from '@accounts/containers';

describe('UserAuthorityDetailsComponent', () => {
  let component: UserAuthorityDetailsComponent;
  let fixture: ComponentFixture<UserAuthorityDetailsComponent>;

  const route = new ActivatedRouteStub({
    accountId: 1,
    userId: 'afbedc50-5418-4f68-ad0f-885189911281',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuthorityDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: OperatorUsersInvitationService, useValue: mockClass(OperatorUsersInvitationService) },
        { provide: OperatorUsersService, useValue: mockClass(OperatorUsersService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAuthorityDetailsComponent);
    component = fixture.componentInstance;
    route.setQueryParamMap({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
