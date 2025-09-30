import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { FilterByShipComponent } from '@requests/common/components/list-filter-forms/filter-by-ship/filter-by-ship.component';

describe('FilterByShipComponent', () => {
  let component: FilterByShipComponent;
  let fixture: ComponentFixture<FilterByShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterByShipComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterByShipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ships', []);
    fixture.componentRef.setInput('filterByShipLabel', 'Filter by ship');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
