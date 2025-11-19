import { Routes } from '@angular/router';

import {
  canActivateAggregatedDataEdit,
  canActivateAggregatedDataListSummary,
  canActivateAggregatedDataSummary,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.guard';
import {
  AER_AGGREGATED_DATA_PARAM,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataBacklinkResolver } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-backlink.resolver';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';

export const AER_AGGREGATED_DATA_ROUTES: Routes = [
  {
    path: '',
    title: aerAggregatedDataSubtasksListMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateAggregatedDataListSummary],
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-list-summary').then(
        (c) => c.AerAggregatedDataListSummaryComponent,
      ),
  },
  {
    path: AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA,
    children: [
      {
        path: '',
        title: aerAggregatedDataSubtasksListMap.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA),
        },
        loadComponent: () =>
          import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-list').then(
            (c) => c.AerAggregatedDataListComponent,
          ),
      },
      {
        path: AerAggregatedDataWizardStep.SELECT_SHIP,
        data: { breadcrumb: false },
        title: aerAggregatedDataSubtasksListMap.imoNumber.title,
        resolve: {
          backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.SELECT_SHIP),
        },
        loadComponent: () =>
          import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
      },
      {
        path: `:${AER_AGGREGATED_DATA_PARAM}`,
        children: [
          {
            path: '',
            title: aerAggregatedDataSubtasksListMap.title,
            data: { breadcrumb: false, backlink: '../../' },
            canActivate: [canActivateAggregatedDataSummary],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-ship-summary').then(
                (c) => c.AerAggregatedDataShipSummaryComponent,
              ),
          },
          {
            path: AerAggregatedDataWizardStep.SELECT_SHIP,
            data: { breadcrumb: false },
            title: aerPortsMap.imoNumber.title,
            resolve: {
              backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.SELECT_SHIP),
            },
            canActivate: [canActivateAggregatedDataEdit],
            loadComponent: () =>
              import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
          },
          {
            path: AerAggregatedDataWizardStep.FUEL_CONSUMPTION,
            data: { breadcrumb: false },
            resolve: {
              backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.FUEL_CONSUMPTION),
            },
            canActivate: [canActivateAggregatedDataEdit],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-fuel-consumption').then(
                (c) => c.AerAggregatedDataFuelConsumptionComponent,
              ),
          },
          {
            path: AerAggregatedDataWizardStep.ANNUAL_EMISSIONS,
            data: { breadcrumb: false },
            title: aerAggregatedDataSubtasksListMap.annualAggregatedEmissions.title,
            resolve: {
              backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.ANNUAL_EMISSIONS),
            },
            canActivate: [canActivateAggregatedDataEdit],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-annual-emissions').then(
                (c) => c.AerAggregatedDataAnnualEmissionsComponent,
              ),
          },
          {
            path: AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS,
            data: { breadcrumb: false },
            title: aerAggregatedDataSubtasksListMap.smallIslandSurrenderReduction.title,
            resolve: {
              backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS),
            },
            canActivate: [canActivateAggregatedDataEdit],
            loadComponent: () =>
              import(
                '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-emissions-for-small-island'
              ).then((c) => c.AerAggregatedDataEmissionsForSmallIslandComponent),
          },
          {
            path: AerAggregatedDataWizardStep.SHIP_EMISSIONS,
            data: { breadcrumb: false },
            title: aerAggregatedDataSubtasksListMap.totalShipEmissions.title,
            resolve: {
              backlink: aerAggregatedDataBacklinkResolver(AerAggregatedDataWizardStep.SHIP_EMISSIONS),
            },
            canActivate: [canActivateAggregatedDataEdit],
            loadComponent: () =>
              import(
                '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-ship-emissions-calculated'
              ).then((c) => c.AerAggregatedDataShipEmissionsCalculatedComponent),
          },
        ],
      },
    ],
  },
  {
    path: AerAggregatedDataWizardStep.UPLOAD_AGGREGATED_DATA,
    title: aerAggregatedDataSubtasksListMap.uploadAggregatedData.title,
    data: { backlink: `../${AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA}`, breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-upload').then(
        (c) => c.AerAggregatedDataUploadComponent,
      ),
  },
  {
    path: AerAggregatedDataWizardStep.FETCH_FROM_VOYAGES_AND_PORTS,
    data: { breadcrumb: false, backlink: `../${AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA}` },
    title: aerAggregatedDataSubtasksListMap.fromFetch.title,
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-aggregated-data/aer-fetch-from-voyages-and-ports').then(
        (c) => c.AerFetchFromVoyagesAndPortsComponent,
      ),
  },
];
