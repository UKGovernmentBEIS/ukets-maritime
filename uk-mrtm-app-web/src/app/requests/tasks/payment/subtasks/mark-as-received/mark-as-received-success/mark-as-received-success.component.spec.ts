import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { MarkAsReceivedSuccessComponent } from '@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-success';

describe('MarkAsReceivedSuccessComponent', () => {
  let component: MarkAsReceivedSuccessComponent;
  let fixture: ComponentFixture<MarkAsReceivedSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAsReceivedSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAsReceivedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
