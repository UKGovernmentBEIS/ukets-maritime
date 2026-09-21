import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Subject } from 'rxjs';

import { FileUuidDTO } from '@mrtm/api';

import { HttpStatuses } from '@netz/common/error';
import { BasePage } from '@netz/common/testing';

import { FileValidators, MAX_FILE_NAME_LENGTH, MultipleFileInputComponent } from '@shared/components';
import { FileUploadService } from '@shared/services';

describe('MultipleFileInputComponent', () => {
  let component: MultipleFileInputComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;
  let page: Page;
  let control: FormControl;

  @Component({
    imports: [ReactiveFormsModule, MultipleFileInputComponent],
    standalone: true,
    template: `
      <form [formGroup]="form">
        <mrtm-multiple-file-input formControlName="file" [baseDownloadUrl]="getDownloadUrl()" />
      </form>
    `,
  })
  class TestComponent {
    form = new FormGroup({ file: new FormControl(null) });
    getDownloadUrl() {
      return `/download/`;
    }
  }

  class Page extends BasePage<TestComponent> {
    get downloadLinks() {
      return this.queryAll<HTMLAnchorElement>('.govuk-link');
    }

    get deleteButtons() {
      return this.queryAll<HTMLButtonElement>('mrtm-file-upload-list button[name="delete"]');
    }

    get errors() {
      return this.queryAll<HTMLElement>('mrtm-file-upload-list .govuk-error-message').map((error) =>
        error.textContent.trim(),
      );
    }

    set files(file: File[]) {
      this.setInputValue('input', file);
    }

    get input() {
      return this.query<HTMLInputElement>('input');
    }

    get chooseFilesButton() {
      return this.query<HTMLButtonElement>('.moj-multi-file-upload__dropzone button');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(MultipleFileInputComponent)).componentInstance;
    hostComponent = fixture.componentInstance;
    page = new Page(fixture);
    control = hostComponent.form.get('file') as FormControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current value', () => {
    expect(page.filesText).toHaveLength(0);

    control.setValue([{ file: new File(['abc'], 'Uploaded file'), uuid: '1234' }]);
    fixture.detectChanges();

    expect(page.filesText).toEqual(['Uploaded file']);
    expect(page.downloadLinks.map((link) => link.href)).toEqual([expect.stringContaining('/download/1234')]);
  });

  it('should validate big files', () => {
    const uploadSubject = new Subject<HttpEvent<FileUuidDTO>>();

    expect(control.touched).toBeFalsy();

    control.setAsyncValidators(
      TestBed.inject(FileUploadService).uploadMany(() => uploadSubject, [FileValidators.maxFileSize(1)]),
    );
    const file = new File(['test content'], 'Big file');
    vi.spyOn(file, 'size', 'get').mockReturnValue(1024 * 1024 * 1024);
    page.files = [file];
    fixture.detectChanges();

    expect(control.touched).toBeTruthy();
    expect(page.filesText[0]).toEqual('Big file');
    expect(page.errors).toEqual(['Error: The selected file must be smaller than 1MB']);
    expect(control.invalid).toBeTruthy();
    expect(control.errors).toEqual({ 'maxFileSize-0-0': 'The selected file must be smaller than 1MB' });
  });

  it('should upload the valid files and flag the invalid one when several files are selected at once', () => {
    const uploadSubject = new Subject<HttpEvent<FileUuidDTO>>();
    const request = vi.fn(() => uploadSubject);
    control.setAsyncValidators(TestBed.inject(FileUploadService).uploadMany(request));

    const tooLong = new File(['test content'], 'a'.repeat(MAX_FILE_NAME_LENGTH + 1));
    const valid = new File(['test content'], 'Valid file');
    page.files = [tooLong, valid];
    fixture.detectChanges();

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(valid);
    expect(page.filesText).toEqual([tooLong.name, 'Valid file']);

    uploadSubject.next(new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }));
    uploadSubject.complete();
    fixture.detectChanges();

    expect(page.errors).toEqual([
      `Error: The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
    ]);
    expect(page.downloadLinks.map((link) => link.href)).toEqual([expect.stringContaining('/download/abcd')]);
    expect(control.invalid).toBeTruthy();
    expect(control.errors).toEqual({
      'maxFileNameLength-0-0': `The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
    });
  });

  it('should show progress when uploading new files', () => {
    const uploadSubject = new Subject<HttpEvent<FileUuidDTO>>();

    control.setAsyncValidators(TestBed.inject(FileUploadService).uploadMany(() => uploadSubject));

    control.setValue([{ file: new File(['test content'], 'Existing file'), uuid: 'abcdA' }]);
    page.files = [new File(['test content'], 'New file')];
    uploadSubject.next({ type: HttpEventType.UploadProgress, loaded: 5, total: 15 });
    fixture.detectChanges();

    expect(page.filesText).toEqual(['Existing file', 'New file']);

    uploadSubject.next({ type: HttpEventType.UploadProgress, loaded: 10, total: 15 });
    fixture.detectChanges();

    uploadSubject.next(new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }));
    fixture.detectChanges();

    expect(page.filesText).toEqual(['Existing file', 'New file']);
    expect(page.downloadLinks.map((link) => link.href)).toEqual([
      expect.stringContaining('/download/abcdA'),
      expect.stringContaining('/download/abcd'),
    ]);
  });

  it('should label the input once and describe it with its hints', () => {
    expect(page.input.tabIndex).toBe(-1);
    expect(page.input.hasAttribute('aria-labelledby')).toBeFalsy();
    expect(page.queryAll<HTMLLabelElement>(`label[for="${page.input.id}"]`)).toHaveLength(1);
    expect(page.input.getAttribute('aria-describedby')).toBe(`${page.input.id}-hint-file-size`);
  });

  it('should open the file picker from the choose files button and mark the control touched on blur', () => {
    const click = vi.spyOn(page.input, 'click');

    page.chooseFilesButton.click();
    expect(click).toHaveBeenCalledTimes(1);

    expect(control.touched).toBeFalsy();
    page.chooseFilesButton.dispatchEvent(new Event('blur'));
    expect(control.touched).toBeTruthy();
  });

  it('should delete existing files', () => {
    control.setValue([{ file: new File(['test content'], 'Existing file') }]);
    fixture.detectChanges();

    page.deleteButtons[0].click();
    fixture.detectChanges();

    expect(page.filesText).toHaveLength(0);
    expect(control.value).toHaveLength(0);
  });

  it('should delete in flight files', () => {
    const uploadSubject = new Subject<HttpEvent<FileUuidDTO>>();
    control.setAsyncValidators(TestBed.inject(FileUploadService).uploadMany(() => uploadSubject));

    control.setValue([{ file: new File(['test content'], 'Existing file'), uuid: 'abcA' }]);
    fixture.detectChanges();

    page.files = [new File(['test content'], 'New file')];
    fixture.detectChanges();

    uploadSubject.next({ type: HttpEventType.UploadProgress, loaded: 5, total: 15 });
    fixture.detectChanges();

    page.deleteButtons[1].click();
    fixture.detectChanges();

    expect(page.filesText).toHaveLength(1);
  });

  it('should disable the control', () => {
    control.disable();
    fixture.detectChanges();

    expect(page.input.disabled).toBeTruthy();
    expect(page.chooseFilesButton.disabled).toBeTruthy();
    expect(page.deleteButtons.every((button) => button.disabled)).toBeTruthy();
  });
});
