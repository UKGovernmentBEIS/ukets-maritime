import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, signal, viewChild } from '@angular/core';

import { DROPDOWN_BUTTON_GROUP_COMPONENT } from '@shared/components/dropdown-button-group/dropdown-button-group.token';

@Component({
  selector: 'mrtm-dropdown-button-group',
  standalone: true,
  templateUrl: './dropdown-button-group.component.html',
  styleUrl: './dropdown-button-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DROPDOWN_BUTTON_GROUP_COMPONENT, useExisting: DropdownButtonGroupComponent }],
})
export class DropdownButtonGroupComponent {
  private static instanceCounter = 0;

  private readonly triggerRef = viewChild<ElementRef>('trigger');
  private readonly popoverRef = viewChild<ElementRef>('popover');

  readonly uniqueId = `dropdown-button-group-popover-${DropdownButtonGroupComponent.instanceCounter++}`;
  readonly label = input.required<string>();
  readonly isPopoverOpen = signal(false);

  @HostListener('window:resize')
  onResize() {
    this.hidePopover();
  }

  onToggle(event: Event) {
    if ((event as ToggleEvent).newState === 'open') {
      this.positionPopover();
      this.isPopoverOpen.set(true);
    } else {
      this.isPopoverOpen.set(false);
    }
  }

  hidePopover() {
    this.popoverRef()?.nativeElement?.hidePopover();
  }

  private positionPopover() {
    const trigger = this.triggerRef().nativeElement;
    const popover = this.popoverRef().nativeElement;
    const top = trigger.offsetTop + trigger.offsetHeight;
    const left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth;

    Object.assign(popover.style, { top: `${top}px`, left: `${left}px` });
  }
}
