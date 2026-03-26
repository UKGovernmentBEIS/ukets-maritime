import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'govuk-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = input<string>();
  readonly header = viewChild<ElementRef>('header');
}
