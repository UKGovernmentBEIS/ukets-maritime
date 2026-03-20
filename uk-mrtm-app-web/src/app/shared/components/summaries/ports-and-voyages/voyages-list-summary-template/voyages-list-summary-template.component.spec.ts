import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VoyagesListSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyages-list-summary-template';

describe('VoyagesListSummaryTemplateComponent', () => {
  let component: VoyagesListSummaryTemplateComponent;
  let fixture: ComponentFixture<VoyagesListSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyagesListSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VoyagesListSummaryTemplateComponent);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
