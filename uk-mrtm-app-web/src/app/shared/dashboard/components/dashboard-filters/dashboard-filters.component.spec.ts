import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFiltersComponent } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.component';

describe('DashboardFiltersComponent', () => {
  let component: DashboardFiltersComponent;
  let fixture: ComponentFixture<DashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFiltersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
