import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { TaskListComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { getEmpSubtaskSections } from '@requests/common';
import { empReviewedQuery } from '@requests/timeline/emp-reviewed/+state';
import { EmpReviewedSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-emp-reviewed',
  imports: [EmpReviewedSummaryTemplateComponent, TaskListComponent],
  standalone: true,
  template: `
    @if (isDetailsView()) {
      <netz-task-list [sections]="sections" />
    } @else {
      <mrtm-emp-reviewed-summary-template [data]="vm()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewedComponent {
  private readonly actionsStore: RequestActionStore = inject(RequestActionStore);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly isDetailsView: Signal<boolean> = toSignal<boolean>(
    this.activatedRoute.data.pipe(map((params) => JSON.parse(params?.details ?? false) === true)),
  );
  public readonly sections = getEmpSubtaskSections('details');
  public readonly vm = this.actionsStore.select(empReviewedQuery.selectReviewDTO);
}
