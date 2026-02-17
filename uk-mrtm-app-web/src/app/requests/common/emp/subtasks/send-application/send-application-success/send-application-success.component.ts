import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';

@Component({
  selector: 'mrtm-send-application-confirmation',
  imports: [RouterLink, PanelComponent, LinkDirective],
  standalone: true,
  templateUrl: './send-application-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendApplicationSuccessComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);

  readonly isTaskSubmitted: WritableSignal<boolean> = signal(false);

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.isTaskSubmitted.set(true);
    });
  }
}
