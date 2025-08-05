import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { DoeSubmitActionButtonsComponent } from '@requests/tasks/doe-submit/components';

describe('DoeSubmitActionButtonsComponent', () => {
  let component: DoeSubmitActionButtonsComponent;
  let fixture: ComponentFixture<DoeSubmitActionButtonsComponent>;
  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoeSubmitActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoeSubmitActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
