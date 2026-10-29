import { DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ServiceFeedbackLinkService } from '@shared/services';

describe('ServiceFeedbackLinkService', () => {
  let service: ServiceFeedbackLinkService;

  const createDestroyRef = () => {
    const callbacks: Array<() => void> = [];
    const destroyRef = { onDestroy: (callback: () => void) => callbacks.push(callback) } as unknown as DestroyRef;

    return { destroyRef, destroy: () => callbacks.forEach((callback) => callback()) };
  };

  beforeEach(() => {
    service = TestBed.inject(ServiceFeedbackLinkService);
  });

  it('should be visible by default', () => {
    expect(service.isVisible()).toBe(true);
  });

  it('should stay hidden until every hiding consumer is destroyed', () => {
    const first = createDestroyRef();
    const second = createDestroyRef();

    service.hideUntilDestroyed(first.destroyRef);
    service.hideUntilDestroyed(second.destroyRef);
    expect(service.isVisible()).toBe(false);

    first.destroy();
    expect(service.isVisible()).toBe(false);

    second.destroy();
    expect(service.isVisible()).toBe(true);
  });
});
