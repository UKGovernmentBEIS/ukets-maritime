import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { SendVariationSuccessComponent } from '@requests/common/emp/subtasks/send-variation/send-variation-success/send-variation-success.component';
import { mockStateBuild } from '@requests/common/emp/testing/emp-data.mock';
import { TaskItemStatus } from '@requests/common/task-item-status';

describe('SendVariationSuccessComponent', () => {
  let component: SendVariationSuccessComponent;
  let fixture: ComponentFixture<SendVariationSuccessComponent>;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendVariationSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();
    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ emissions: TaskItemStatus.IN_PROGRESS }));

    fixture = TestBed.createComponent(SendVariationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
