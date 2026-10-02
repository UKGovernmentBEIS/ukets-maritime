import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputSuffixDirective } from './input-suffix.directive';

describe('InputSuffixDirective', () => {
  let directive: InputSuffixDirective;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    imports: [InputSuffixDirective],
    standalone: true,
    template: `
      <span #suffix govukInputSuffix class="custom-suffix">icon</span>
    `,
  })
  class TestComponent {
    readonly suffix = viewChild<ElementRef<HTMLSpanElement>>('suffix');
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(InputSuffixDirective)).injector.get(InputSuffixDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have input suffix class', () => {
    expect(fixture.componentInstance.suffix().nativeElement.classList).toContain('govuk-input__suffix');
  });

  it('should keep classes set on the element', () => {
    expect(fixture.componentInstance.suffix().nativeElement.classList).toContain('custom-suffix');
  });

  it('should hide the suffix from assistive technologies', () => {
    expect(fixture.componentInstance.suffix().nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should keep the projected content', () => {
    expect(fixture.componentInstance.suffix().nativeElement.textContent).toBe('icon');
  });
});
