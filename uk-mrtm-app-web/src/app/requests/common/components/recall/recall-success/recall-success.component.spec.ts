import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { RecallSuccessComponent } from '@requests/common/components/recall/recall-success/recall-success.component';
import { taskProviders } from '@requests/common/task.providers';

describe('RecallSuccessComponent', () => {
  let component: RecallSuccessComponent;
  let fixture: ComponentFixture<RecallSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(RecallSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
