import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForInformationComponent } from '@requests/common/emp/request-for-information/request-for-information.component';

describe('RequestForInformationComponent', () => {
  let component: RequestForInformationComponent;
  let fixture: ComponentFixture<RequestForInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestForInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestForInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
