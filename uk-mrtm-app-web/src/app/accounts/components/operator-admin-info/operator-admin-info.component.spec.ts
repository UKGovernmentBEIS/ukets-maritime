import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorAdminInfoComponent } from '@accounts/components';

describe('OperatorAdminInfoComponent', () => {
  let component: OperatorAdminInfoComponent;
  let fixture: ComponentFixture<OperatorAdminInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorAdminInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorAdminInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
