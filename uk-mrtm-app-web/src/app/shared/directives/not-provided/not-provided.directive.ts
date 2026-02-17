import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[notProvided]',
  standalone: true,
})
export class NotProvidedDirective {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  readonly notProvided = input<any>();

  constructor() {
    effect(() => {
      const value = this.notProvided();
      if (value === null || value === undefined || value === '') {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '<span class="govuk-hint">Not provided</span>');
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'textContent', value);
      }
    });
  }
}
