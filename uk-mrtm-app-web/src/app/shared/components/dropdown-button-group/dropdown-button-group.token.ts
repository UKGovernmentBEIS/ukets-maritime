import { InjectionToken } from '@angular/core';

import { DropdownButtonGroupComponent } from '@shared/components/dropdown-button-group/dropdown-button-group.component';

export const DROPDOWN_BUTTON_GROUP_COMPONENT = new InjectionToken<DropdownButtonGroupComponent>(
  'Parent DropdownButtonGroupComponent',
);
