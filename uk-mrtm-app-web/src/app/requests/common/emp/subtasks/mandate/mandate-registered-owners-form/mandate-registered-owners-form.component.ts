import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PaginationComponent, TextInputComponent } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANDATE_REGISTERED_OWNER_FORM_MODE,
  MANDATE_SUB_TASK,
  MandateWizardStep,
} from '@requests/common/emp/subtasks/mandate';
import { mandateRegisteredOwnersFormProvider } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-form/mandate-registered-owners.form-provider';
import { MANDATE_AVAILABLE_SHIPS_COLUMNS } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-form/mandate-registered-owners-form.constans';
import { MandateShipSelectItem } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-form/mandate-registered-owners-form.types';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { DatePickerComponent, MultiSelectTableComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-registered-owners-form',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DatePickerComponent,
    MultiSelectTableComponent,
    PaginationComponent,
    LinkDirective,
    RouterLink,
  ],
  providers: [mandateRegisteredOwnersFormProvider],
  templateUrl: './mandate-registered-owners-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateRegisteredOwnersFormComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly step: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD | MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT =
    inject(MANDATE_REGISTERED_OWNER_FORM_MODE);

  public readonly form = inject(TASK_FORM);
  public readonly wizardMap: SubTaskListMap<unknown> =
    this.step === MandateWizardStep.REGISTERED_OWNERS_FORM_ADD
      ? mandateMap.registeredOwnersAddForm
      : mandateMap.registeredOwnersEditForm;

  public readonly columns = MANDATE_AVAILABLE_SHIPS_COLUMNS;

  public get shipsCtrl(): AbstractControl {
    return this.form.get('ships');
  }

  public readonly registeredOwnerId = input<string>();

  public readonly availableShips: Signal<Array<MandateShipSelectItem>> = computed(() =>
    this.store.select(empCommonQuery.selectMandateRegisteredOwnerAvailableShips(this.registeredOwnerId()))(),
  );
  public readonly pageSize: number = 10;
  public readonly totalItems: Signal<number> = computed(() => this.availableShips().length ?? 0);
  public readonly currentPage: WritableSignal<number> = signal<number>(1);
  public readonly page: Signal<Array<MandateShipSelectItem>> = computed(() => {
    const ships = this.availableShips();
    const currentPage = this.currentPage();

    const firstIndex = (currentPage - 1) * this.pageSize;
    const lastIndex = Math.min(firstIndex + this.pageSize, ships?.length);
    return ships?.length > firstIndex ? ships.slice(firstIndex, lastIndex) : [];
  });

  public onShipsSelectionChanged() {
    const selectedShips = this.availableShips()
      .filter((ship) => ship.isSelected)
      .map((ship) => ({
        imoNumber: ship.imoNumber,
        name: ship.name,
      }));
    this.shipsCtrl.setValue(selectedShips?.length ? selectedShips : null);
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public onSubmit(): void {
    this.service
      .saveSubtask(MANDATE_SUB_TASK, this.step, this.activatedRoute, {
        ...this.form.value,
        ships: this.availableShips()
          .filter((ship) => ship.isSelected)
          .map((ship) => ({
            imoNumber: ship.imoNumber,
            name: ship.name,
          })),
      })
      .pipe(take(1))
      .subscribe();
  }

  readonly returnToLabel = mandateMap.registeredOwners.title;

  readonly isEdit = this.step === 'edit';
}
