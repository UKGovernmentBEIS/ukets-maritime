import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountSummaryInfoComponent } from '@accounts/components';

describe('UserAccountSummaryInfoComponent', () => {
  let component: UserAccountSummaryInfoComponent;
  let fixture: ComponentFixture<UserAccountSummaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountSummaryInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountSummaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
