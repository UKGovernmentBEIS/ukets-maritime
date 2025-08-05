import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { ActiveEmissionsPlanComponent } from '@accounts/components/active-emissions-plan/active-emissions-plan.component';
import { OperatorAccountsStore } from '@accounts/store';
import { mockedAccount } from '@accounts/testing/mock-data';

describe('ActiveEmissionsPlanComponent', () => {
  let component: ActiveEmissionsPlanComponent;
  let fixture: ComponentFixture<ActiveEmissionsPlanComponent>;
  let store: OperatorAccountsStore;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveEmissionsPlanComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    store = TestBed.inject(OperatorAccountsStore);
    store.setCurrentAccount({
      ...mockedAccount,
      emp: {
        id: 'id',
        empAttachments: {
          '00000000-0000-0000-0000-000000000001': 'file1.pdf',
          '00000000-0000-0000-0000-000000000002': 'file2.pdf',
        },
        fileDocument: {
          name: 'file.pdf',
          uuid: '00000000-0000-0000-0000-000000000000',
        },
      },
    });
    fixture = TestBed.createComponent(ActiveEmissionsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
