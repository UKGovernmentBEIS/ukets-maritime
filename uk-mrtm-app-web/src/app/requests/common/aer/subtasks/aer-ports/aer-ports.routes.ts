import { Routes } from '@angular/router';

import {
  canActivateListOfPorts,
  canActivatePortCallSummary,
  canActivatePortDetails,
  canActivatePortEmissions,
  canActivatePortsSummary,
} from '@requests/common/aer/subtasks/aer-ports/aer-ports.guard';
import { AER_PORT_PARAM, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsBacklinkResolver } from '@requests/common/aer/subtasks/aer-ports/aer-ports-backlink.resolver';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';

export const AER_PORTS_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../' },
    title: aerPortsMap.title,
    canActivate: [canActivatePortsSummary],
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-ports/aer-ports-summary').then((c) => c.AerPortsSummaryComponent),
  },
  {
    path: AerPortsWizardStep.LIST_OF_PORTS,
    children: [
      {
        path: '',
        data: { breadcrumb: false },
        resolve: {
          backlink: aerPortsBacklinkResolver(AerPortsWizardStep.LIST_OF_PORTS),
        },
        title: aerPortsMap.title,
        canActivate: [canActivateListOfPorts],
        loadComponent: () =>
          import('@requests/common/aer/subtasks/aer-ports/aer-ports-list').then((c) => c.AerPortsListComponent),
      },
      {
        path: AerPortsWizardStep.SELECT_SHIP,
        data: { breadcrumb: false },
        title: aerPortsMap.imoNumber.title,
        resolve: {
          backlink: aerPortsBacklinkResolver(AerPortsWizardStep.SELECT_SHIP),
        },
        loadComponent: () =>
          import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
      },
      {
        path: `:${AER_PORT_PARAM}`,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            title: aerPortsMap.totalEmissions.title,
            canActivate: [canActivatePortCallSummary],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-ports/aer-port-call-summary').then(
                (c) => c.AerPortCallSummaryComponent,
              ),
          },
          {
            path: AerPortsWizardStep.SELECT_SHIP,
            data: { breadcrumb: false },
            title: aerPortsMap.imoNumber.title,
            resolve: {
              backlink: aerPortsBacklinkResolver(AerPortsWizardStep.SELECT_SHIP),
            },
            loadComponent: () =>
              import('@requests/common/aer/components/aer-select-ship').then((c) => c.AerSelectShipComponent),
          },
          {
            path: AerPortsWizardStep.PORT_DETAILS,
            data: { breadcrumb: false, backlink: `../${AerPortsWizardStep.SELECT_SHIP}` },
            title: aerPortsMap.portDetails.title,
            canActivate: [canActivatePortDetails],
            loadComponent: () =>
              import('@requests/common/aer/subtasks/aer-ports/aer-port-details').then((c) => c.AerPortDetailsComponent),
          },
          {
            path: AerPortsWizardStep.IN_PORT_EMISSIONS,
            children: [
              {
                path: '',
                data: { breadcrumb: false, backlink: `../${AerPortsWizardStep.PORT_DETAILS}` },
                title: aerPortsMap.totalEmissions.title,
                canActivate: [canActivatePortEmissions],
                loadComponent: () =>
                  import('@requests/common/aer/components/aer-emissions-calculations').then(
                    (c) => c.AerEmissionsCalculationsComponent,
                  ),
              },
              {
                path: AerPortsWizardStep.DIRECT_EMISSIONS,
                data: { breadcrumb: false, backlink: '../', backlinkFragment: 'directEmissions' },
                title: aerPortsMap.directEmissions.title,
                loadComponent: () =>
                  import('@requests/common/aer/components/aer-direct-emission').then(
                    (c) => c.AerDirectEmissionComponent,
                  ),
              },
              {
                path: AerPortsWizardStep.FUEL_CONSUMPTION,
                children: [
                  {
                    path: '',
                    data: { breadcrumb: false, backlink: '../' },
                    title: aerPortsMap.fuelConsumptions.title,
                    loadComponent: () =>
                      import('@requests/common/aer/components/aer-fuel-consumption').then(
                        (c) => c.AerFuelConsumptionComponent,
                      ),
                  },
                  {
                    path: `:fuelConsumptionId`,
                    data: { breadcrumb: false, backlink: '../../' },
                    title: aerPortsMap.fuelConsumptions.title,
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
    path: AerPortsWizardStep.UPLOAD_PORTS,
    title: aerPortsMap.uploadPorts.title,
    data: { backlink: `../${AerPortsWizardStep.LIST_OF_PORTS}`, breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-ports/aer-ports-upload').then((c) => c.AerPortsUploadComponent),
  },
];
