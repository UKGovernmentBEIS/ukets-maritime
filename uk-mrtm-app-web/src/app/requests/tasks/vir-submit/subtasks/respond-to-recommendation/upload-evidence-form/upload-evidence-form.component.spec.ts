import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskAttachmentsHandlingService } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { UploadEvidenceFormComponent } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';

describe('UploadEvidenceFormComponent', () => {
  let component: UploadEvidenceFormComponent;
  let fixture: ComponentFixture<UploadEvidenceFormComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};
  const attachmentService: MockType<RequestTaskAttachmentsHandlingService> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadEvidenceFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RequestTaskAttachmentsHandlingService, useValue: attachmentService },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadEvidenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
