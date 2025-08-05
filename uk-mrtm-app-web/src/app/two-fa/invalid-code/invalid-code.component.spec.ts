import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidCodeComponent } from '@two-fa/invalid-code/invalid-code.component';

describe('InvalidCodeComponent', () => {
  let component: InvalidCodeComponent;
  let fixture: ComponentFixture<InvalidCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
