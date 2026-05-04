import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { ConfirmationComponent } from '@accounts/containers';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, ConfirmationComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('verificationAccount', 'Test account');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the appointed verification account', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.govuk-panel__body').textContent).toEqual('Test account');
  });
});
