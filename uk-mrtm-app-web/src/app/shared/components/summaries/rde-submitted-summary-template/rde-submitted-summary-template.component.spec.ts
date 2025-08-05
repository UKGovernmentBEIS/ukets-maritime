import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { RdeSubmittedSummaryTemplateComponent } from '@shared/components';
import { RdeSubmitted } from '@shared/types';

describe('RdeSubmittedSummaryTemplateComponent', () => {
  let component: RdeSubmittedSummaryTemplateComponent;
  let fixture: ComponentFixture<RdeSubmittedSummaryTemplateComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeSubmittedSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RdeSubmittedSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      deadline: '2025-06-27',
      extensionDate: '2025-06-28',
      officialNotice: {
        fileName: 'file name',
        downloadUrl: '',
      },
      signatory: 'Regulator England',
      operators: ['Operator 1 - Primary contact, Service contact, Financial contact'],
    } as unknown as RdeSubmitted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
