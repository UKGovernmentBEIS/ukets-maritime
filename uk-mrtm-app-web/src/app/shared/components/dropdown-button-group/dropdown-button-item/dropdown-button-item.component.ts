import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DROPDOWN_BUTTON_GROUP_COMPONENT } from '@shared/components/dropdown-button-group/dropdown-button-group.token';

@Component({
  selector: 'mrtm-dropdown-button-item',
  standalone: true,
  templateUrl: './dropdown-button-item.component.html',
  styleUrl: './dropdown-button-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.tabindex]': 'tabindex' },
})
export class DropdownButtonItemComponent {
  private parent = inject(DROPDOWN_BUTTON_GROUP_COMPONENT);

  get tabindex(): string {
    return '-1';
  }

  onClick() {
    this.parent.hidePopover();
  }
}
