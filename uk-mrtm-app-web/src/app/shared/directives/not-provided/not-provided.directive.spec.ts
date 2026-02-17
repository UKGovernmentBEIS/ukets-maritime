import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotProvidedDirective } from '@shared/directives';

describe('NotProvidedDirective', () => {
  @Component({
    imports: [NotProvidedDirective],
    standalone: true,
    template: '<div id="test" [notProvided]="null"></div>',
  })
  class TestComponent {}

  let directive: NotProvidedDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(NotProvidedDirective)).injector.get(NotProvidedDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should focus to skip link after navigation', async () => {
    expect(fixture.nativeElement.querySelector('#test').textContent).toEqual('Not provided');
  });
});
