import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { ReturnForAmendsSuccessComponent } from '@requests/common/emp/return-for-amends/return-for-amends-success/return-for-amends-success.component';

describe('ReturnForAmendsSuccessComponent', () => {
  let component: ReturnForAmendsSuccessComponent;
  let fixture: ComponentFixture<ReturnForAmendsSuccessComponent>;
  let store: RequestTaskStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnForAmendsSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setRequestTaskItem({
      requestTask: {
        type: 'EMP_ISSUANCE_APPLICATION_REVIEW',
      },
    });
    fixture = TestBed.createComponent(ReturnForAmendsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default informative text', () => {
    const texts = fixture.debugElement.queryAll(By.css('.govuk-body')).map((el) => el.nativeElement.textContent);
    expect(texts).toEqual(['The operator will return the application to you when the amendments have been made.']);
  });

  it('should display specific texts for emp-variation', () => {
    store.setRequestTaskItem({
      requestTask: {
        type: 'EMP_VARIATION_APPLICATION_REVIEW',
      },
    });
    fixture.detectChanges();
    const texts = fixture.debugElement.queryAll(By.css('.govuk-body')).map((el) => el.nativeElement.textContent);
    expect(texts).toEqual([
      'The application has been returned to the operator so they can make necessary changes.',
      'They will return the application to you when the changes have been made.',
    ]);
  });
});
