import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseBannerComponent } from './phase-banner.component';

describe('PhaseBannerComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    imports: [PhaseBannerComponent],
    standalone: true,
    template: `
      <govuk-phase-banner [phase]="phase">Test content</govuk-phase-banner>
    `,
  })
  class TestComponent {
    phase = 'alpha';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseBannerComponent, TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an alpha tag', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.govuk-tag').textContent.trim()).toEqual('alpha');
  });

  it('should contain a text', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector<HTMLSpanElement>('.govuk-phase-banner__text').textContent).toEqual('Test content');
  });

  it('should move the border to the top edge only when borderTop is set', () => {
    expect(fixture.nativeElement.querySelector('.govuk-phase-banner').classList).not.toContain(
      'govuk-phase-banner--border-top',
    );

    const bannerFixture = TestBed.createComponent(PhaseBannerComponent);
    bannerFixture.componentRef.setInput('borderTop', true);
    bannerFixture.detectChanges();

    expect(bannerFixture.nativeElement.querySelector('.govuk-phase-banner').classList).toContain(
      'govuk-phase-banner--border-top',
    );
  });
});
