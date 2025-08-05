import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationCancelSuccessComponent } from '@requests/common/components';

describe('EmpVariationCancelSuccessComponent', () => {
  let component: EmpVariationCancelSuccessComponent;
  let fixture: ComponentFixture<EmpVariationCancelSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationCancelSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationCancelSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation message', () => {
    const panelEl = fixture.debugElement.query(By.css('govuk-panel')).nativeElement;
    expect(panelEl.textContent).toEqual('Task cancelled');
  });

  it('should show informative text', () => {
    const textEl = fixture.debugElement.query(By.css('p.govuk-body')).nativeElement;
    expect(textEl.textContent).toEqual('It has been removed from your task dashboard.');
  });
});
