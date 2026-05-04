import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryNoticeEventSubmittedComponent } from '@requests/timeline/registry-notice-event-submitted/registry-notice-event-submitted.component';

describe('RegistryNoticeEventSubmittedComponent', () => {
  let component: RegistryNoticeEventSubmittedComponent;
  let fixture: ComponentFixture<RegistryNoticeEventSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryNoticeEventSubmittedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryNoticeEventSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
