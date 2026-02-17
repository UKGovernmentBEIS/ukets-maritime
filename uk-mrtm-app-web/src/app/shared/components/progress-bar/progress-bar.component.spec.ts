import { ComponentRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProgressBarComponent } from '@shared/components';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let componentRef: ComponentRef<ProgressBarComponent>;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let overlay: DebugElement;
  let progressBar: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('ariaLabel', 'Progress bar');
    componentRef.setInput('progressValue', null);

    fixture.detectChanges();

    overlay = fixture.debugElement.query(By.css('.progress-bar__overlay'));
    progressBar = fixture.debugElement.query(By.css('.progress-bar'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of items', () => {
    componentRef.setInput('progressItems', 5);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.progress-bar__item'));
    expect(items.length).toBe(5);
    expect(items[0].styles['width']).toBe('20%');
  });

  it('should have 0% width when progressValue is null', () => {
    componentRef.setInput('progressValue', null);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('0%');
  });

  it('should calculate the fill width correctly based on progressValue', () => {
    componentRef.setInput('progressValue', 0);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('20%');

    componentRef.setInput('progressValue', 1);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('40%');

    componentRef.setInput('progressValue', 2);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('60%');

    componentRef.setInput('progressValue', 3);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('80%');

    componentRef.setInput('progressValue', 4);
    fixture.detectChanges();

    expect(overlay.styles['width']).toBe('100%');
  });

  it('should apply the correct color based on progressLevel', () => {
    componentRef.setInput('colors', ['red', 'orange', 'yellow', 'green', 'blue']);
    componentRef.setInput('progressValue', 0);
    fixture.detectChanges();

    expect(overlay.styles['background-color']).toBe('red');

    componentRef.setInput('progressValue', 1);
    fixture.detectChanges();

    expect(overlay.styles['background-color']).toBe('orange');

    componentRef.setInput('progressValue', 2);
    fixture.detectChanges();

    expect(overlay.styles['background-color']).toBe('yellow');

    componentRef.setInput('progressValue', 3);
    fixture.detectChanges();

    expect(overlay.styles['background-color']).toBe('green');

    componentRef.setInput('progressValue', 4);
    fixture.detectChanges();

    expect(overlay.styles['background-color']).toBe('blue');
  });

  it('should update accessibility attributes', () => {
    componentRef.setInput('ariaLabel', 'Password Strength');
    componentRef.setInput('progressValue', 3);
    fixture.detectChanges();

    expect(progressBar.attributes['aria-label']).toBe('Password Strength');
    expect(progressBar.attributes['aria-valuenow']).toBe('80');
  });
});
