import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorUserInfoComponent } from '@accounts/components';

describe('OperatorUserInfoComponent', () => {
  let component: OperatorUserInfoComponent;
  let fixture: ComponentFixture<OperatorUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorUserInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
