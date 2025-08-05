import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdeRejectedComponent } from '@requests/timeline/rde-rejected/rde-rejected.component';

describe('RdeRejectedComponent', () => {
  let component: RdeRejectedComponent;
  let fixture: ComponentFixture<RdeRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeRejectedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdeRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
