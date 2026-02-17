import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TagColor } from './tag-color.type';

@Component({
  selector: 'govuk-tag',
  imports: [NgClass],
  standalone: true,
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly color = input<TagColor>();
}
