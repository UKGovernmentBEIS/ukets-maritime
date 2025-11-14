import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { MaterialityLevelReferenceDocumentsComponent } from '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-reference-documents/materiality-level-reference-documents.component';

describe('MaterialityLevelReferenceDocumentsComponent', () => {
  let component: MaterialityLevelReferenceDocumentsComponent;
  let fixture: ComponentFixture<MaterialityLevelReferenceDocumentsComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialityLevelReferenceDocumentsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialityLevelReferenceDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
