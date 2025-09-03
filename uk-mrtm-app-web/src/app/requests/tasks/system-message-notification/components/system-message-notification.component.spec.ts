import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMessageNotificationComponent } from '@requests/tasks/system-message-notification/components/system-message-notification.component';

describe('SystemMessageNotificationComponent', () => {
  let component: SystemMessageNotificationComponent;
  let fixture: ComponentFixture<SystemMessageNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMessageNotificationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemMessageNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
