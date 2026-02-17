import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukComponentsModule } from '@netz/govuk-components';

import { RelatedContentComponent } from '@shared/components';

describe('RelatedContentComponent', () => {
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  @Component({
    imports: [RelatedContentComponent, GovukComponentsModule],
    standalone: true,
    template: `
      <mrtm-related-content header="Related content header">
        <li>
          <a govukLink href="#">Related link</a>
        </li>
        <li>
          <a govukLink href="#">Related link</a>
        </li>
      </mrtm-related-content>
    `,
  })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should project a list of links', () => {
    expect(element.querySelectorAll('a')).toHaveLength(2);
  });

  it('should display the title', () => {
    expect(element.querySelector('h2').textContent.trim()).toEqual('Related content header');
  });
});
