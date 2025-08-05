import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpLogComponent } from '@batch-variations/submit/emp-log/emp-log.component';
import { MOCK_PROVIDERS } from '@batch-variations/tests';

describe('EmpLogComponent', () => {
  let component: EmpLogComponent;
  let fixture: ComponentFixture<EmpLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpLogComponent],
      providers: [...MOCK_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
