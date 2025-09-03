import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMessageNotificationDateComponent } from '@requests/tasks/system-message-notification/components/system-message-notification-date.component';

describe('SystemMessageNotificationDateComponent', () => {
  let component: SystemMessageNotificationDateComponent;
  let fixture: ComponentFixture<SystemMessageNotificationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMessageNotificationDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemMessageNotificationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
