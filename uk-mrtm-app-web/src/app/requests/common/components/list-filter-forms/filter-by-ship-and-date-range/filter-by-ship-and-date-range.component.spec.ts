import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { FilterByShipAndDateRangeComponent } from '@requests/common/components/list-filter-forms/filter-by-ship-and-date-range/filter-by-ship-and-date-range.component';

describe('FilterByShipAndDateRangeComponent', () => {
  let component: FilterByShipAndDateRangeComponent;
  let fixture: ComponentFixture<FilterByShipAndDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterByShipAndDateRangeComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterByShipAndDateRangeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ships', []);
    fixture.componentRef.setInput('filterByShipLabel', 'Filter by ship');
    fixture.componentRef.setInput('type', 'voyages');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
