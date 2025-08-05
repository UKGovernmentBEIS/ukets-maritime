import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { RecallQuestionComponent } from '@requests/common/components/recall/recall-question/recall-question.component';
import { taskProviders } from '@requests/common/task.providers';

describe('RecallQuestionComponent', () => {
  let component: RecallQuestionComponent;
  let fixture: ComponentFixture<RecallQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallQuestionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecallQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
