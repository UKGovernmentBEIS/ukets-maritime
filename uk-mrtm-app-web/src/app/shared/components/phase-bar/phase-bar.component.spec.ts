import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthStore } from '@netz/common/auth';

import { PhaseBarComponent } from '@shared/components';
import { ServiceFeedbackLinkService } from '@shared/services';

describe('PhaseBarComponent', () => {
  let component: PhaseBarComponent;
  let fixture: ComponentFixture<PhaseBarComponent>;
  let authStore: AuthStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserProfile({ firstName: 'Gimli', lastName: 'Gloin' });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the service feedback link', () => {
    const banner: HTMLElement = fixture.nativeElement.querySelector('govuk-phase-banner');

    expect(banner.querySelector('a[href="/feedback"]')).not.toBeNull();
    expect(banner.textContent.replace(/\s+/g, ' ')).toContain('your feedback will help us to improve it.');
  });

  it('should hide the service feedback message when hidden', () => {
    const destroyCallbacks: Array<() => void> = [];
    TestBed.inject(ServiceFeedbackLinkService).hideUntilDestroyed({
      onDestroy: (callback: () => void) => destroyCallbacks.push(callback),
    } as any);
    fixture.detectChanges();

    const banner: HTMLElement = fixture.nativeElement.querySelector('govuk-phase-banner');
    expect(banner.querySelector('a[href="/feedback"]')).toBeNull();
    expect(banner.textContent).not.toContain('will help us to improve it.');
    expect(banner.textContent.replace(/\s+/g, ' ')).toContain('You are logged in as: Gimli Gloin');
  });
});
