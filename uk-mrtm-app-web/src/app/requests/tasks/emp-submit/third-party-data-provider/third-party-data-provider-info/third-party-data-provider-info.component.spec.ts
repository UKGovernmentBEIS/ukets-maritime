import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ThirdPartyDataProviderInfoComponent } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider-info';

describe('ThirdPartyDataProviderInfoComponent', () => {
  let component: ThirdPartyDataProviderInfoComponent;
  let fixture: ComponentFixture<ThirdPartyDataProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyDataProviderInfoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdPartyDataProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
