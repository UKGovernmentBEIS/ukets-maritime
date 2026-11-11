import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GovukSkipLinkComponent } from './skip-link.component';

describe('GovukSkipLinkComponent', () => {
  let component: GovukSkipLinkComponent;
  let fixture: ComponentFixture<TestComponent>;
  let host: TestComponent;

  @Component({
    selector: 'govuk-skip-link-test',
    imports: [GovukSkipLinkComponent],
    template: `
      <govuk-skip-link [targetId]="targetId()" [text]="text()" />
      <main id="main-content">Main content</main>
      <div id="custom-content">Custom content</div>
      <div id="already-focusable" tabindex="0">Already focusable</div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    readonly targetId = signal('main-content');
    readonly text = signal('Skip to main content');
  }

  @Component({
    selector: 'govuk-skip-link-defaults-test',
    imports: [GovukSkipLinkComponent],
    template: `
      <govuk-skip-link />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class DefaultsTestComponent {}

  const link = (): HTMLAnchorElement => fixture.nativeElement.querySelector('a');
  const byId = (id: string): HTMLElement => fixture.nativeElement.querySelector(`#${id}`);
  const main = (): HTMLElement => byId('main-content');

  const follow = (): MouseEvent => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    fixture.detectChanges();
    return event;
  };

  const setTarget = (id: string) => {
    host.targetId.set(id);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    host = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(GovukSkipLinkComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('markup', () => {
    it('should render a single anchor with the skip link class', () => {
      expect(fixture.nativeElement.querySelectorAll('a')).toHaveLength(1);
      expect(link().className.trim()).toBe('govuk-skip-link');
    });

    it('should display the given text', () => {
      host.text.set('Skip to results');
      fixture.detectChanges();

      expect(link().textContent?.trim()).toBe('Skip to results');
    });

    it('should link to the given target id', () => {
      expect(link().getAttribute('href')).toBe('#main-content');
    });

    it('should link to a custom target id', () => {
      setTarget('custom-content');

      expect(link().getAttribute('href')).toBe('#custom-content');
    });

    it('should not render a data-module attribute, as Angular drives the behaviour', () => {
      expect(link().hasAttribute('data-module')).toBe(false);
    });
  });

  describe('defaults', () => {
    let bareLink: HTMLAnchorElement;

    beforeEach(() => {
      const bare = TestBed.createComponent(DefaultsTestComponent);
      bare.detectChanges();
      bareLink = bare.nativeElement.querySelector('a');
    });

    it('should read "Skip to main content" by default', () => {
      expect(bareLink.textContent?.trim()).toBe('Skip to main content');
    });

    it('should link to the page template main content by default', () => {
      expect(bareLink.getAttribute('href')).toBe('#main-content');
    });
  });

  // Mirrors the GOV.UK Frontend skip link script, which moves focus to the
  // target so keyboard users continue from the main content.
  describe('following the link', () => {
    it('should move focus to the target instead of letting the browser jump to the hash', () => {
      const event = follow();

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(main());
    });

    it('should make a non-focusable target programmatically focusable', () => {
      expect(main().hasAttribute('tabindex')).toBe(false);

      follow();

      expect(main().getAttribute('tabindex')).toBe('-1');
    });

    it('should mark the target so its focus outline is suppressed', () => {
      follow();

      expect(main().classList.contains('govuk-skip-link-focused-element')).toBe(true);
    });

    it('should scroll the target into view', () => {
      const scrollIntoView = vi.fn();
      main().scrollIntoView = scrollIntoView;

      follow();

      expect(scrollIntoView).toHaveBeenCalledOnce();
    });

    it('should survive an environment without scrollIntoView', () => {
      // jsdom leaves it undefined, so this is the default here — make it explicit
      main().scrollIntoView = undefined as unknown as HTMLElement['scrollIntoView'];

      expect(() => follow()).not.toThrow();
      expect(document.activeElement).toBe(main());
    });

    it('should restore the target once it loses focus', () => {
      follow();
      main().blur();

      expect(main().hasAttribute('tabindex')).toBe(false);
      expect(main().classList.contains('govuk-skip-link-focused-element')).toBe(false);
    });

    it('should take over the target again on a later click', () => {
      follow();
      main().blur();

      follow();

      expect(document.activeElement).toBe(main());
      expect(main().getAttribute('tabindex')).toBe('-1');
      expect(main().classList.contains('govuk-skip-link-focused-element')).toBe(true);
    });

    it('should leave a tabindex the author already set alone', () => {
      setTarget('already-focusable');
      const target = byId('already-focusable');

      follow();
      expect(document.activeElement).toBe(target);
      expect(target.getAttribute('tabindex')).toBe('0');

      target.blur();
      expect(target.getAttribute('tabindex')).toBe('0');
    });

    it('should follow a target changed after the first render', () => {
      setTarget('custom-content');

      follow();

      expect(document.activeElement).toBe(byId('custom-content'));
      expect(main().hasAttribute('tabindex')).toBe(false);
    });

    it('should leave the click to the browser when the target does not exist', () => {
      setTarget('nowhere');

      const event = follow();

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).not.toBe(main());
    });

    it('should look the target up by id, so a leading hash is not stripped', () => {
      setTarget('#main-content');

      const event = follow();

      expect(link().getAttribute('href')).toBe('##main-content');
      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).not.toBe(main());
    });
  });

  describe('accessibility', () => {
    it('should render a native link with no role or tabindex override', () => {
      expect(link().hasAttribute('role')).toBe(false);
      expect(link().hasAttribute('tabindex')).toBe(false);
    });

    it('should not leave the target in the tab order after it is skipped to', () => {
      follow();
      main().blur();

      expect(main().hasAttribute('tabindex')).toBe(false);
    });
  });

  describe('security', () => {
    it('should always render a same-page fragment, whatever the target id', () => {
      setTarget('javascript:alert(1)');

      expect(link().getAttribute('href')).toBe('#javascript:alert(1)');
    });

    it('should not treat the target id as a selector', () => {
      setTarget('main-content, #custom-content');

      const event = follow();

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).not.toBe(main());
      expect(document.activeElement).not.toBe(byId('custom-content'));
    });

    it('should not render the text as raw HTML', () => {
      host.text.set('<img src=x onerror="alert(1)">');
      fixture.detectChanges();

      expect(link().querySelector('img')).toBeNull();
      expect(link().textContent).toContain('<img');
    });
  });
});
