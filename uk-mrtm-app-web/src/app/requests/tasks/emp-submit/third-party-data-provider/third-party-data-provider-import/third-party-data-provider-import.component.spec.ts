import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { ThirdPartyDataProviderImportComponent } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider-import';

describe('ThirdPartyDataProviderImportComponent', () => {
  let component: ThirdPartyDataProviderImportComponent;
  let fixture: ComponentFixture<ThirdPartyDataProviderImportComponent>;
  const mockTaskService: MockType<TaskService<unknown>> = {
    submitSubtask: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyDataProviderImportComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdPartyDataProviderImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
