import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { SystemMessageNotificationService } from '@requests/tasks/system-message-notification/system-message-notification.service';
import { SystemMessageNotificationRequestTaskPayload } from '@requests/tasks/system-message-notification/system-message-notification.types';

@Component({
  selector: 'mrtm-system-message-notification',
  imports: [ButtonDirective, LinkDirective, WarningTextComponent, RouterLink],
  standalone: true,
  template: `
    <div class="govuk-!-margin-top-4">
      <govuk-warning-text [assistiveText]="warningText" />
    </div>
    <button govukSecondaryButton type="button" (click)="dismissTask()">Close this task</button>
    <div class="govuk-body pre-line">
      @for (part of textParts(); track part.text) {
        @if (part.route) {
          <a [href]="part.route" [routerLink]="part.route" [fragment]="part.fragment" govukLink>{{ part.text }}</a>
        } @else {
          {{ part.text }}
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemMessageNotificationComponent {
  private readonly systemMessageNotificationService = inject(SystemMessageNotificationService);
  private readonly store = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly payload = this.store.select(
    requestTaskQuery.selectRequestTaskPayload,
  ) as Signal<SystemMessageNotificationRequestTaskPayload>;

  readonly warningText = 'No actions are currently required.\nYou can close this task.';
  readonly textParts = computed(() => this.systemMessageNotificationService.parseMessage(this.payload()?.text));

  dismissTask() {
    this.systemMessageNotificationService.submit().subscribe(() => this.router.navigate(['dashboard']));
  }
}
