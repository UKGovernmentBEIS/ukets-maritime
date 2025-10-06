import { Directive, effect, ElementRef, inject, input, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { HTML_DIFF } from '@shared/directives';
import { HtmlDiffService } from '@shared/directives/html-diff/html-diff.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[htmlDiff]',
  standalone: true,
})
export class HtmlDiffDirective {
  private readonly diffService = inject(HtmlDiffService);
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly htmlDiffProvider: boolean = inject(HTML_DIFF, { optional: true });

  previous = input<string | null>(null);
  current = input.required<string>();
  isFiles = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isNullOrEmpty(this.previous()) && this.isNullOrEmpty(this.current())) {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '<span class="govuk-hint">Not provided</span>');
      } else {
        const previousSanitized = this.sanitize(this.previous());
        const currentSanitized = this.sanitize(this.current());
        const diff = this.htmlDiffProvider
          ? this.isFiles()
            ? this.diffService.fileNameDiff(previousSanitized, currentSanitized)
            : this.diffService.diff(previousSanitized, currentSanitized)
          : currentSanitized;

        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', diff);
      }
    });
  }

  private isNullOrEmpty(value: any) {
    return value === null || value === undefined || value === '';
  }

  private sanitize(value?: unknown) {
    const strippedElement = value?.toString().replace(/<[^<>]*>/g, '');
    return this.sanitizer.sanitize(SecurityContext.NONE, strippedElement);
  }
}
