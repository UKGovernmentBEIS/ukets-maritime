import { ActivatedRoute } from '@angular/router';

import { concatMap, from, map, Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';

/** Steps that return to their list with `change=true` kept, when they were opened as a change from the ship summary */
const STEPS_KEEPING_CHANGE_QUERY_PARAM: string[] = [
  EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM,
  EmissionsWizardStep.EMISSION_SOURCES_FORM,
];

/**
 * Navigation shared by the emissions subtask in every EMP task.
 * Task specific steps (e.g. review decisions) are resolved by overriding `taskStepPath`.
 */
export abstract class EmissionsBaseFlowManager extends WizardFlowManager {
  subtask: keyof EmissionsMonitoringPlan = EMISSIONS_SUB_TASK;

  override nextStep(currentStep: string, route: ActivatedRoute): Observable<string> {
    const keepChange =
      STEPS_KEEPING_CHANGE_QUERY_PARAM.includes(currentStep) && route.snapshot.queryParamMap.get('change') === 'true';

    return this.nextStepPath(currentStep).pipe(
      concatMap((path) =>
        from(
          this.router.navigate([path], {
            relativeTo: route,
            queryParams: keepChange ? { change: true } : undefined,
          }),
        ).pipe(map(() => path)),
      ),
    );
  }

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case EmissionsWizardStep.BASIC_DETAILS:
        return of(`../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM:
        return of(`../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST:
        return of('./');
      case EmissionsWizardStep.EMISSION_SOURCES_FORM:
        return of(`../../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`);
      case EmissionsWizardStep.EMISSION_SOURCES_LIST:
        return of('./');
      case EmissionsWizardStep.UNCERTAINTY_LEVEL:
        return of(`../${EmissionsWizardStep.MEASUREMENTS}`);
      case EmissionsWizardStep.MEASUREMENTS:
        return of(`../${EmissionsWizardStep.CARBON_CAPTURE}`);
      case EmissionsWizardStep.CARBON_CAPTURE:
        return of(`../${EmissionsWizardStep.EXEMPTION_CONDITIONS}`);
      case EmissionsWizardStep.EXEMPTION_CONDITIONS:
        return of(`../`);
      case EmissionsWizardStep.UPLOAD_SHIPS:
      case EmissionsWizardStep.DELETE_SHIPS:
        return of(`../${EmissionsWizardStep.LIST_OF_SHIPS}`);
      case EmissionsWizardStep.SHIP_SUMMARY:
        return of(`../../${EmissionsWizardStep.LIST_OF_SHIPS}`);
      default:
        return this.taskStepPath(currentStep);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected taskStepPath(currentStep: string): Observable<string> {
    return of('../../');
  }
}
