import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpBatchReissueComponent } from '@requests/timeline/emp-batch-reissue/emp-batch-reissue.component';

describe('EmpBatchReissueComponent', () => {
  let component: EmpBatchReissueComponent;
  let fixture: ComponentFixture<EmpBatchReissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpBatchReissueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpBatchReissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
