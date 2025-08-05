import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MaritimeAccountsService, MaritimeAccountUpdateService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { EditOperatorAccountComponent } from '@accounts/containers/edit-operator-account/edit-operator-account.component';
import { OperatorAccountsStore } from '@accounts/store';

describe('EditOperatorAccountComponent', () => {
  let component: EditOperatorAccountComponent;
  let fixture: ComponentFixture<EditOperatorAccountComponent>;
  const activatedRoute = new ActivatedRouteStub({ accountId: 1 });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOperatorAccountComponent],
      providers: [
        provideHttpClient(),
        OperatorAccountsStore,
        { provide: MaritimeAccountsService, useValue: mockClass(MaritimeAccountsService) },
        { provide: MaritimeAccountUpdateService, useValue: mockClass(MaritimeAccountUpdateService) },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOperatorAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
