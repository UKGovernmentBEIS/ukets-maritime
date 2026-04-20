import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@netz/govuk-components';

import { PhoneInputComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-user-input',
  templateUrl: './user-input.component.html',
  viewProviders: [existingControlContainer],
  standalone: true,
  imports: [TextInputComponent, FormsModule, ReactiveFormsModule, PhoneInputComponent],
  styles: `
    .break-line {
      white-space: pre-line;
    }
  `,
})
export class UserInputComponent {
  @Input() hasJobTitle = true;
  @Input() phoneType: 'full' | 'national';
  @Input() isNotification = false;
  readonly emailHint = `All system alerts, notices, and official communications will be sent by email
  Contact your regulator if you require a specific notice to be sent by post.`;
}
