import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'div[mrtm-loading-spinner]',
  imports: [],
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
