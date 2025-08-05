import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchVariationsListComponent } from '@batch-variations/batch-variations-list/batch-variations-list.component';
import { MOCK_PROVIDERS } from '@batch-variations/tests';

describe('BatchVariationsListComponent', () => {
  let component: BatchVariationsListComponent;
  let fixture: ComponentFixture<BatchVariationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchVariationsListComponent],
      providers: [...MOCK_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchVariationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
