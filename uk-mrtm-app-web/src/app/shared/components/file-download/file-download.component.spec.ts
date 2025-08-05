import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { FileAttachmentsService, RequestTaskAttachmentsHandlingService, TasksService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { FileDownloadComponent } from '@shared/components/file-download/file-download.component';

describe('FileDownloadComponent', () => {
  let component: FileDownloadComponent;
  let fixture: ComponentFixture<FileDownloadComponent>;
  let requestTaskAttachmentsHandlingService: jest.Mocked<RequestTaskAttachmentsHandlingService>;

  beforeEach(async () => {
    Object.defineProperty(window, 'onfocus', { set: jest.fn() });
    requestTaskAttachmentsHandlingService = mockClass(RequestTaskAttachmentsHandlingService);
    requestTaskAttachmentsHandlingService.generateRequestTaskGetFileAttachmentToken.mockReturnValue(
      of({ token: 'abce', tokenExpirationMinutes: 1 } as any),
    );
    const activatedRoute = new ActivatedRouteStub({ uuid: 'xyz', taskId: 11 });

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: RequestTaskAttachmentsHandlingService, useValue: requestTaskAttachmentsHandlingService },
        { provide: TasksService, useValue: mockClass(TasksService) },
        { provide: FileAttachmentsService, useValue: { configuration: { basePath: '' } } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fixture = TestBed.createComponent(FileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the download link', () => {
    expect(component.url()).toEqual('/v1.0/file-attachments/abce');
  });
});
