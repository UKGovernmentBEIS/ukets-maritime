import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedListOfShipsComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-list-of-ships';

describe('EmpVarSubmittedListOfShipsComponent', () => {
  let component: EmpVarSubmittedListOfShipsComponent;
  let fixture: ComponentFixture<EmpVarSubmittedListOfShipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedListOfShipsComponent],
      providers: [provideRouter([]), ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVarSubmittedListOfShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
