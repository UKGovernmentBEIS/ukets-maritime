import { Routes } from '@angular/router';

import {
  canActivateAerVoyagesSummary,
  canActivateListOfVoyages,
  canActivateVoyageDetails,
  canActivateVoyageEmissions,
  canActivateVoyageEmissionSummary,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.guard';
import { AER_VOYAGE_PARAM, AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesBacklinkResolver } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-backlink.resolver';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';

export const AER_VOYAGES_ROUTES: Routes = [
  {
    path: '',
    title: aerVoyagesMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateAerVoyagesSummary],
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-voyages/aer-voyages-summary').then((c) => c.AerVoyagesSummaryComponent),
  },
  {
    path: AerVoyagesWizardStep.LIST_OF_VOYAGES,
    children: [
      {
        path: '',
        title: aerVoyagesMap.title,
        data: { breadcrumb: false, backlink: '../', backlinkFragment: AerVoyagesWizardStep.LIST_OF_VOYAGES },
        canActivate: [canActivateListOfVoyages],
        loadComponent: () =>
          import('@requests/common/aer/subtasks/aer-voyages/aer-voyages-list').then((c) => c.AerVoyagesListComponent),
      },
      {
        path: AerVoyagesWizardStep.SELECT_SHIP,
        data: { breadcrumb: false },
        title: aerVoyagesMap.imoNumber.title,
        resolve: {
          backlink: aerVoyagesBacklinkResolver(AerVoyagesWizardStep.SELECT_SHIP),
        },
        loadComponent: () =>
          import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
      },
      {
        path: `:${AER_VOYAGE_PARAM}`,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            title: aerVoyagesMap.totalEmissions.title,
            canActivate: [canActivateVoyageEmissionSummary],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-voyages/aer-voyage-emission-summary').then(
                (c) => c.AerVoyageEmissionSummaryComponent,
              ),
          },
          {
            path: AerVoyagesWizardStep.SELECT_SHIP,
            data: { breadcrumb: false },
            title: aerVoyagesMap.imoNumber.title,
            resolve: {
              backlink: aerVoyagesBacklinkResolver(AerVoyagesWizardStep.SELECT_SHIP),
            },
            loadComponent: () =>
              import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
          },
          {
            path: AerVoyagesWizardStep.VOYAGE_DETAILS,
            data: { breadcrumb: false },
            resolve: {
              backlink: aerVoyagesBacklinkResolver(AerVoyagesWizardStep.VOYAGE_DETAILS),
            },
            canActivate: [canActivateVoyageDetails],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-voyages/aer-voyage-details').then(
                (c) => c.AerVoyageDetailsComponent,
              ),
          },
          {
            path: AerVoyagesWizardStep.FUEL_EMISSIONS,
            children: [
              {
                path: '',
                data: { breadcrumb: false, backlink: `../${AerVoyagesWizardStep.VOYAGE_DETAILS}` },
                title: aerVoyagesMap.totalEmissions.title,
                canActivate: [canActivateVoyageEmissions],
                loadComponent: () =>
                  import('@requests/common/aer/components/aer-emissions-calculations').then(
                    (c) => c.AerEmissionsCalculationsComponent,
                  ),
              },
              {
                path: AerVoyagesWizardStep.DIRECT_EMISSIONS,
                data: { breadcrumb: false, backlink: '../', backlinkFragment: 'directEmissions' },
                title: aerVoyagesMap.directEmissions.title,
                loadComponent: () =>
                  import('@requests/common/aer/components/aer-direct-emission').then(
                    (c) => c.AerDirectEmissionComponent,
                  ),
              },
              {
                path: AerVoyagesWizardStep.FUEL_CONSUMPTION,
                children: [
                  {
                    path: '',
                    data: { breadcrumb: false, backlink: '../' },
                    title: aerVoyagesMap.fuelConsumptions.title,
                    loadComponent: () =>
                      import('@requests/common/aer/components/aer-fuel-consumption').then(
                        (c) => c.AerFuelConsumptionComponent,
                      ),
                  },
                  {
                    path: `:fuelConsumptionId`,
                    data: { breadcrumb: false, backlink: '../../' },
                    title: aerVoyagesMap.fuelConsumptions.title,
                    loadComponent: () =>
                      import('@requests/common/aer/components/aer-fuel-consumption').then(
                        (c) => c.AerFuelConsumptionComponent,
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: AerVoyagesWizardStep.UPLOAD_VOYAGES,
    title: aerVoyagesMap.uploadVoyages.title,
    data: { backlink: `../${AerVoyagesWizardStep.LIST_OF_VOYAGES}`, breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-voyages/aer-voyage-upload').then((c) => c.AerVoyageUploadComponent),
  },
];
