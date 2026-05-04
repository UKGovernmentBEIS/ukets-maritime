import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemDTO, RequestActionDTO, RequestDetailsDTO, UserStateDTO } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import {
  PageHeadingComponent,
  RelatedActionsComponent,
  RelatedTasksComponent,
  TimelineComponent,
  TimelineItemComponent,
} from '@netz/common/components';
import { StatusTagColorPipe, StatusTagTextPipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';
import { TabLazyDirective, TabsComponent, TagComponent } from '@netz/govuk-components';

import { NotesListComponent } from '@notes/components';
import { workflowsQuery, WorkflowStore } from '@requests/workflows/+state';
import { MrtmRequestType } from '@shared/types';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

interface ViewModel {
  workflowId?: string;
  workflowDetails?: RequestDetailsDTO;
  workflowActions?: Array<RequestActionDTO>;
  workflowTasks?: Array<ItemDTO>;
  aerRelatedTasks?: Array<MrtmRequestType>;
  userRoleType: UserStateDTO['roleType'];
  year?: string;
}

@Component({
  selector: 'mrtm-workflow-details',
  imports: [
    PageHeadingComponent,
    TagComponent,
    StatusTagTextPipe,
    StatusTagColorPipe,
    TabsComponent,
    TimelineComponent,
    TimelineItemComponent,
    TabLazyDirective,
    RelatedTasksComponent,
    NotesListComponent,
    RelatedActionsComponent,
  ],
  standalone: true,
  templateUrl: './workflow-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowDetailsComponent {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: WorkflowStore = inject(WorkflowStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  readonly taskActionTypeToTitleTransformer = taskActionTypeToTitleTransformer;
  readonly currentTab: WritableSignal<string> = signal(null);
  readonly vm: Signal<ViewModel> = computed<ViewModel>(() => ({
    workflowId: this.store.select(workflowsQuery.selectWorkflowId)(),
    workflowDetails: this.store.select(workflowsQuery.selectDetails)(),
    workflowActions: this.store.select(workflowsQuery.selectActions)(),
    workflowTasks: this.store.select(workflowsQuery.selectTasks)(),
    aerRelatedTasks: this.store.select(workflowsQuery.selectAerRelatedTasks)(),
    userRoleType: this.authStore.select(selectUserRoleType)(),
    year: getYearFromRequestId(this.store.select(workflowsQuery.selectWorkflowId)()),
  }));

  handleSelectedTab(tab: string): void {
    this.router.navigate([], { relativeTo: this.route, preserveFragment: true });
    this.currentTab.set(tab);
  }
}
