import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { GenericServiceErrorCode } from '../service-errors';
import { InternalServerErrorComponent } from './internal-server-error.component';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalServerErrorComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });
  describe('for default error', () => {
    beforeEach(() => {
      router = TestBed.inject(Router);
      router.getCurrentNavigation = jest.fn().mockReturnValue({ extras: {} });

      fixture = TestBed.createComponent(InternalServerErrorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTML elements', () => {
      const element: HTMLElement = fixture.nativeElement;
      const paragraphContents = Array.from(element.querySelectorAll<HTMLParagraphElement>('p')).map((el) =>
        el.textContent.trim(),
      );

      expect(element.querySelector('h1').textContent).toEqual('Sorry, there is a problem with the service');
      expect(paragraphContents).toEqual(['Try again later.', 'Contact the DESNZ helpdesk if you have any questions.']);
      expect(element.querySelector('a').href).toEqual('http://localhost/contact-us');
    });
  });

  describe('for custom errors', () => {
    const errorCode = GenericServiceErrorCode.INTREGACCOUNTCREATIONMRTM1007;

    beforeEach(() => {
      router = TestBed.inject(Router);
      router.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: { errorCode } } });

      fixture = TestBed.createComponent(InternalServerErrorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTML elements', () => {
      const element: HTMLElement = fixture.nativeElement;
      const paragraphContents = Array.from(element.querySelectorAll<HTMLParagraphElement>('p')).map((el) =>
        el.textContent.trim(),
      );

      expect(element.querySelector('h1').textContent).toEqual(
        'Sorry, the service could not send information to the registry',
      );
      expect(paragraphContents).toEqual([
        "We're experiencing temporary difficulties in syncing data.",
        'Try again later.',
        'Contact UK ETS reporting helpdesk for assistance.',
      ]);
      expect(element.querySelector('a').href).toEqual('mailto:METS@energysecurity.gov.uk');
    });
  });
});
