import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GovukComponentsModule } from '@netz/govuk-components';

import { GroupedSummaryListDirective } from '@shared/directives';

describe('GroupedSummaryListDirective', () => {
  let directive: GroupedSummaryListDirective;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  @Component({ template: '<dl govuk-summary-list mrtmGroupedSummaryList [details]="[]"></dl>' })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, GroupedSummaryListDirective],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
    directive = fixture.debugElement.query(By.directive(GroupedSummaryListDirective)).componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply the edge borders class', () => {
    expect(element.querySelector('.summary-list--edge-border')).toBeTruthy();
  });

  it('should disable other borders', () => {
    expect(element.querySelector('.govuk-summary-list--no-border')).toBeTruthy();
  });
});
