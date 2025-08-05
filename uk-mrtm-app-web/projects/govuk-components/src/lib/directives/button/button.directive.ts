import { booleanAttribute, Directive, ElementRef, HostBinding, HostListener, inject, Input } from '@angular/core';

@Directive({
  selector:
    'a[govukButton], a[govukSecondaryButton], a[govukWarnButton], a[govukInverseButton], button[govukButton], button[govukWarnButton], button[govukSecondaryButton], button[govukInverseButton]',
  standalone: true,
})
export class ButtonDirective {
  private readonly elementRef = inject(ElementRef);

  @Input({ transform: booleanAttribute }) disabled = false;

  @HostBinding('attr.aria-disabled')
  @HostBinding('attr.disabled')
  @HostBinding('class.govuk-button--disabled')
  get ariaDisabled(): boolean | null {
    return (ButtonDirective.isAnchor(this.nativeElement) || ButtonDirective.isButton(this.nativeElement)) &&
      this.disabled
      ? true
      : null;
  }

  @HostBinding('attr.role')
  get roleLink(): string | null {
    return ButtonDirective.isAnchor(this.nativeElement) && this.disabled ? 'link' : null;
  }

  @HostBinding('class.govuk-button')
  get elementClass(): boolean {
    return true;
  }

  @HostBinding('class.govuk-button--secondary')
  get secondaryButton(): boolean {
    return this.nativeElement.hasAttribute('govuksecondarybutton');
  }

  @HostBinding('class.govuk-button--warning')
  get warningButton(): boolean {
    return this.nativeElement.hasAttribute('govukwarnbutton');
  }

  private get nativeElement(): HTMLButtonElement | HTMLAnchorElement {
    return this.elementRef.nativeElement;
  }

  private static isButton(nativeElement: HTMLButtonElement | HTMLAnchorElement): nativeElement is HTMLButtonElement {
    return nativeElement.tagName === 'BUTTON';
  }

  private static isAnchor(nativeElement: HTMLButtonElement | HTMLAnchorElement): nativeElement is HTMLAnchorElement {
    return nativeElement.tagName === 'A';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.target.dispatchEvent(new MouseEvent('click'));
    }
  }
}
