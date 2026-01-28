import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScrollablePaneDirective } from '@shared/directives';

describe('ScrollablePaneDirective', () => {
  @Component({
    template: '<div id="test" mrtmScrollablePane ariaLabel="Test pane"><h1>Test header</h1></div>',
    standalone: true,
    imports: [ScrollablePaneDirective],
  })
  class TestComponent {}

  let directive: ScrollablePaneDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(ScrollablePaneDirective)).injector.get(ScrollablePaneDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should focus to skip link after navigation', async () => {
    const el = fixture.nativeElement.querySelector('.moj-scrollable-pane');
    expect(el.getAttribute('aria-label')).toEqual('Test pane');
    expect(el.getAttribute('tabIndex')).toEqual('0');
  });
});
