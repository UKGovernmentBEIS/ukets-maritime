import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerDerogationsSummaryTemplateComponent } from '@shared/components';

describe('AerDerogationsSummaryTemplateComponent', () => {
  let component: AerDerogationsSummaryTemplateComponent;
  let fixture: ComponentFixture<AerDerogationsSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerDerogationsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerDerogationsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
