import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from '@batch-variations/submit/summary/summary.component';
import { MOCK_PROVIDERS } from '@batch-variations/tests';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [...MOCK_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
