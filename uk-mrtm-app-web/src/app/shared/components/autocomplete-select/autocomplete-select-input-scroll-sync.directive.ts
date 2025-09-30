import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fromEvent } from 'rxjs';

/**
 * Tracks 'master' input field's scrollLeft position in case the text is longer than the width
 * of the input. Necessary for syncing the position of the typeaheadSuggestion <input /> and
 * preventing text offset.
 */
@Directive({
  selector: 'input[mrtmInputScrollSync]',
  standalone: true,
})
export class AutocompleteSelectInputScrollSyncDirective implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly host: ElementRef<HTMLInputElement> = inject(ElementRef<HTMLInputElement>);

  readonly masterElement = input.required<HTMLInputElement>({ alias: 'mrtmInputScrollSync' });

  ngAfterViewInit(): void {
    fromEvent(this.masterElement(), 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.setScrollLeft());

    this.setScrollLeft();
  }

  private setScrollLeft() {
    this.host.nativeElement.scrollLeft = this.masterElement()?.scrollLeft;
  }
}
