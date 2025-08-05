import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerFilterByShipComponent } from '@requests/common/aer/components/aer-filter-by-ship/aer-filter-by-ship.component';

describe('AerFilterByShipComponent', () => {
  let component: AerFilterByShipComponent;
  let fixture: ComponentFixture<AerFilterByShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerFilterByShipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerFilterByShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
