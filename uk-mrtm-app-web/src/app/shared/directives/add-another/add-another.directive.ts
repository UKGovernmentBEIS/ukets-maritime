import { AfterViewInit, Directive, ElementRef, inject, input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[mrtmAddAnother]',
  standalone: true,
  host: { '[class.moj-add-another__remove-button]': 'addAnotherRemoveButtonClass', '(click)': 'onRemoveButtonClick()' },
})
export class AddAnotherDirective implements AfterViewInit, OnChanges {
  private readonly element = inject(ElementRef);

  readonly heading = input<HTMLElement>(undefined);

  readonly addAnotherRemoveButtonClass = true;

  private get nativeElement(): HTMLElement {
    return this.element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.heading) {
      this.heading().tabIndex = -1;
      this.heading().classList.add('moj-add-another__heading');
    }
  }

  ngAfterViewInit(): void {
    this.nativeElement.parentElement.classList.add('moj-add-another__item');
    this.nativeElement.parentElement.querySelector('legend')?.classList?.add('moj-add-another__title');
  }

  onRemoveButtonClick(): void {
    this.focusHeading();
  }

  focusHeading(): void {
    this.heading()?.focus();
  }
}
