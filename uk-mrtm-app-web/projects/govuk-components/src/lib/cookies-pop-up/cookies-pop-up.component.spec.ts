import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { CookiesPopUpComponent } from './cookies-pop-up.component';

describe('CookiesPopUpComponent', () => {
  let component: CookiesPopUpComponent;
  let fixture: ComponentFixture<CookiesPopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CookiesPopUpComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
