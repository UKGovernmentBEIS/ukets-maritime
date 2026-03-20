import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { MandateResponsibilityDeclarationComponent } from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration';
import { taskProviders } from '@requests/common/task.providers';

describe('MandateResponsibilityDeclarationComponent', () => {
  let component: MandateResponsibilityDeclarationComponent;
  let fixture: ComponentFixture<MandateResponsibilityDeclarationComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilityDeclarationComponent],
      providers: [provideRouter([]), { provide: TaskService, useValue: taskServiceMock }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilityDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
