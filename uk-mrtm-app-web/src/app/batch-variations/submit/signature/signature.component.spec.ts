import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureComponent } from '@batch-variations/submit/signature/signature.component';
import { MOCK_PROVIDERS } from '@batch-variations/tests';

describe('SignatureComponent', () => {
  let component: SignatureComponent;
  let fixture: ComponentFixture<SignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureComponent],
      providers: [...MOCK_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(SignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
