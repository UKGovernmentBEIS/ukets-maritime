import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import {
  AccountReportingStatusHistoryComponent,
  AccountsPageComponent,
  AppointComponent,
  CreateOperatorAccountComponent,
  CreateOperatorAccountSuccessComponent,
  CreateOperatorAccountSummaryComponent,
  CreateUserAuthorityComponent,
  CreateUserAuthoritySuccessComponent,
  CreateUserAuthoritySummaryComponent,
  DeleteUserAuthorityComponent,
  EditOperatorAccountComponent,
  EditReportingStatusComponent,
  EditUserAuthorityComponent,
  UserAuthorityDetailsComponent,
  ViewOperatorAccountComponent,
} from '@accounts/containers';
import { EditReportingStatusSummaryComponent } from '@accounts/containers/edit-reporting-status-summary/edit-reporting-status-summary.component';
import { ProcessActionsComponent } from '@accounts/containers/process-actions';
import {
  AccountReportingStatusHistoryGuard,
  AppointVerifierGuard,
  canActivateEditReportingStatus,
  canActivateEditReportingStatusSummary,
  canActivateOperatorAccount,
  canDeactivateEditReportingStatus,
  canDeactivateOperatorAccount,
  CreateOperatorAccountGuard,
  CreateOperatorAccountSuccessGuard,
  CreateOperatorAccountSummaryGuard,
  createOperatorUserGuard,
  createOperatorUserSuccessGuard,
  createOperatorUserSummaryGuard,
  deleteUserAuthorityGuard,
  operatorUserGuard,
  ReplaceVerifierGuard,
} from '@accounts/guards';
import { userAuthorityResolver } from '@accounts/resolvers';
import { OperatorAccountsStore } from '@accounts/store';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { NoteFileDownloadComponent } from '@notes/components';
import { FileDownloadComponent } from '@shared/components';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: AccountsPageComponent,
  },
  {
    path: 'create',
    title: 'Add an operator account',
    data: { breadcrumb: false },
    canActivate: [CreateOperatorAccountGuard],
    canDeactivate: [CreateOperatorAccountGuard],
    children: [
      {
        path: '',
        title: 'Operator account',
        data: { breadcrumb: false, backlink: '../' },
        component: CreateOperatorAccountComponent,
      },
      {
        path: 'summary',
        title: 'Operator account summary',
        data: { breadcrumb: false, backlink: '../' },
        canActivate: [CreateOperatorAccountSummaryGuard],
        canDeactivate: [PendingRequestGuard],
        component: CreateOperatorAccountSummaryComponent,
      },
      {
        path: 'success',
        title: 'You have successfully created an operator account',
        data: { breadcrumb: 'Dashboard' },
        component: CreateOperatorAccountSuccessComponent,
        canActivate: [CreateOperatorAccountSuccessGuard],
      },
    ],
  },
  {
    path: ':accountId',
    canActivate: [canActivateOperatorAccount],
    canDeactivate: [canDeactivateOperatorAccount],
    title: 'Account',
    data: { breadcrumb: (data) => data.accountName },
    resolve: {
      accountName: () => inject(OperatorAccountsStore).getState().currentAccount.account.name,
    },
    children: [
      {
        path: '',
        component: ViewOperatorAccountComponent,
      },
      {
        path: 'edit',
        title: 'Account',
        data: { breadcrumb: false, backlink: '../' },
        component: EditOperatorAccountComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'edit-reporting-status/:reportingYear',
        title: 'Edit reporting status',
        data: { breadcrumb: false, backlink: '../../' },
        canActivate: [canActivateEditReportingStatus],
        canDeactivate: [canDeactivateEditReportingStatus],
        children: [
          { path: '', component: EditReportingStatusComponent },
          {
            path: 'summary',
            data: { breadcrumb: false, backlink: '../' },
            canActivate: [canActivateEditReportingStatusSummary],
            component: EditReportingStatusSummaryComponent,
          },
        ],
      },
      {
        path: 'reporting-status-history',
        title: 'Reporting status history',
        data: { breadcrumb: true },
        component: AccountReportingStatusHistoryComponent,
        canActivate: [AccountReportingStatusHistoryGuard],
      },
      {
        path: 'verification-body',
        children: [
          {
            path: 'appoint',
            title: 'Appoint a verifier',
            data: { breadcrumb: true },
            component: AppointComponent,
            canActivate: [AppointVerifierGuard],
            canDeactivate: [PendingRequestGuard],
          },
          {
            path: 'replace',
            title: 'Replace a verifier',
            data: { breadcrumb: true },
            component: AppointComponent,
            canActivate: [ReplaceVerifierGuard],
            canDeactivate: [PendingRequestGuard],
            resolve: { verificationBody: ReplaceVerifierGuard },
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: ':userId',
            title: 'User account summary',
            canActivate: [operatorUserGuard],
            children: [
              {
                path: '',
                component: UserAuthorityDetailsComponent,
              },
              {
                path: 'edit',
                title: 'Edit account',
                data: { breadcrumb: false, backlink: '../', backlinkFragment: 'users' },
                component: EditUserAuthorityComponent,
              },
              {
                path: 'delete',
                title: 'Confirm that this user account will be deleted',
                data: {
                  breadcrumb: ({ userAuthority }) => `Delete ${userAuthority.firstName} ${userAuthority.lastName}`,
                },
                component: DeleteUserAuthorityComponent,
                canActivate: [deleteUserAuthorityGuard],
                canDeactivate: [PendingRequestGuard],
                resolve: { userAuthority: userAuthorityResolver },
              },
            ],
          },
          {
            path: 'add/:userType',
            canDeactivate: [createOperatorUserGuard],
            children: [
              {
                path: '',
                data: { breadcrumb: false, backlink: '../../../', backlinkFragment: 'users' },
                title: 'User account',
                component: CreateUserAuthorityComponent,
              },
              {
                path: 'summary',
                data: { breadcrumb: false, backlink: '../' },
                title: 'User account summary',
                canActivate: [createOperatorUserSummaryGuard],
                component: CreateUserAuthoritySummaryComponent,
              },
              {
                path: 'success',
                title: 'You have successfully created an user account',
                data: { breadcrumb: 'Dashboard' },
                canActivate: [createOperatorUserSuccessGuard],
                component: CreateUserAuthoritySuccessComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'process-actions',
        title: 'Account process actions',
        data: { breadcrumb: true },
        component: ProcessActionsComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'notes',
        loadChildren: () => import('@notes/notes.routes').then((r) => r.NOTES_ROUTES),
      },
      {
        path: 'workflows',
        loadChildren: () => import('@requests/workflows').then((r) => r.WORKFLOWS_ROUTES),
      },
      {
        path: 'file-download/:uuid',
        component: NoteFileDownloadComponent,
      },
      {
        path: 'file-download/:fileType/:empId/:uuid',
        component: FileDownloadComponent,
      },
    ],
  },
];
