import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mrtm-dropdown-button-item',
  standalone: true,
  templateUrl: './dropdown-button-item.component.html',
  styleUrl: './dropdown-button-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownButtonItemComponent {}
