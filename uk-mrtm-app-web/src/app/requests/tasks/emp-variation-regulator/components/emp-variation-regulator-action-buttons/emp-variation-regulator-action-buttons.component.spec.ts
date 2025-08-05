import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpVariationRegulatorActionButtonsComponent } from '@requests/tasks/emp-variation-regulator/components';

describe('EmpVariationRegulatorActionButtonsComponent', () => {
  let component: EmpVariationRegulatorActionButtonsComponent;
  let fixture: ComponentFixture<EmpVariationRegulatorActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationRegulatorActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationRegulatorActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
