import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { DocumentTemplateGuard } from '@templates/document/document-template.guard';
import { DocumentTemplateOverviewComponent } from '@templates/document/document-template-overview.component';
import { DocumentTemplateComponent } from '@templates/document/edit/document-template.component';
import { EmailTemplateComponent } from '@templates/email/edit/email-template.component';
import { EmailTemplateGuard } from '@templates/email/email-template.guard';
import { EmailTemplateOverviewComponent } from '@templates/email/email-template-overview.component';
import { TemplateFileDownloadComponent } from '@templates/file-download/template-file-download.component';
import { TemplatesComponent } from '@templates/templates.component';

export const TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: TemplatesComponent,
  },
  {
    path: 'email/:templateId',
    children: [
      {
        path: '',
        title: 'Email template',
        component: EmailTemplateOverviewComponent,
        canActivate: [EmailTemplateGuard],
        resolve: { emailTemplate: EmailTemplateGuard },
      },
      {
        path: 'edit',
        title: 'Edit email template',
        component: EmailTemplateComponent,
        canActivate: [EmailTemplateGuard],
        canDeactivate: [PendingRequestGuard],
        resolve: { emailTemplate: EmailTemplateGuard },
      },
    ],
  },
  {
    path: 'document/:templateId',
    children: [
      {
        path: '',
        title: 'Document template',
        component: DocumentTemplateOverviewComponent,
        canActivate: [DocumentTemplateGuard],
        resolve: { documentTemplate: DocumentTemplateGuard },
      },
      {
        path: 'edit',
        title: 'Edit document template',
        component: DocumentTemplateComponent,
        canActivate: [DocumentTemplateGuard],
        canDeactivate: [PendingRequestGuard],
        resolve: { documentTemplate: DocumentTemplateGuard },
      },
      {
        path: 'file-download/:uuid',
        component: TemplateFileDownloadComponent,
      },
    ],
  },
];
