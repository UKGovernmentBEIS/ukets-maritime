import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, first, map, Observable, of, switchMap, takeUntil } from 'rxjs';

import { DocumentTemplateDTO, DocumentTemplatesService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective, ErrorSummaryComponent } from '@netz/govuk-components';

import { FileInputComponent } from '@shared/components';
import { DocumentTemplateDetailsTemplateComponent } from '@templates/document/document-template-details-template.component';
import {
  DOCUMENT_TEMPLATE_FORM,
  DocumentTemplateFormProvider,
} from '@templates/document/edit/document-template.form-provider';

@Component({
  selector: 'mrtm-document-template',
  imports: [
    AsyncPipe,
    ButtonDirective,
    ErrorSummaryComponent,
    PageHeadingComponent,
    PendingButtonDirective,
    ReactiveFormsModule,
    DocumentTemplateDetailsTemplateComponent,
    FileInputComponent,
  ],
  standalone: true,
  templateUrl: './document-template.component.html',
  providers: [DocumentTemplateFormProvider, DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateComponent implements OnInit {
  readonly form = inject<UntypedFormGroup>(DOCUMENT_TEMPLATE_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly documentTemplatesService = inject(DocumentTemplatesService);
  private readonly destroy$ = inject(DestroySubject);

  documentTemplate$: Observable<DocumentTemplateDTO> = this.route.data.pipe(map((data) => data?.documentTemplate));
  displayErrorSummary$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.form.controls.documentFile.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.displayErrorSummary$.next(false));
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.displayErrorSummary$.next(true);
    } else {
      this.documentTemplate$
        .pipe(
          first(),
          switchMap((documentTemplate) =>
            this.form.dirty
              ? this.documentTemplatesService.updateDocumentTemplate(
                  documentTemplate.id,
                  this.form.controls.documentFile.value.file,
                )
              : of(null),
          ),
        )
        .subscribe(() => this.router.navigate(['..'], { relativeTo: this.route, state: { notification: true } }));
    }
  }

  getDownloadUrl(uuid: string): string | string[] {
    return ['..', 'file-download', uuid];
  }
}
