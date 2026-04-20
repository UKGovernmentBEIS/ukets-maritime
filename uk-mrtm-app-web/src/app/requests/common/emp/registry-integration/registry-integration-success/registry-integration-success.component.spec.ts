import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RegistryIntegrationSuccessComponent } from '@requests/common/emp/registry-integration/registry-integration-success';
import { taskProviders } from '@requests/common/task.providers';

describe('RegistryIntegrationSuccessComponent', () => {
  let component: RegistryIntegrationSuccessComponent;
  let fixture: ComponentFixture<RegistryIntegrationSuccessComponent>;
  let page: Page;

  class Page extends BasePage<RegistryIntegrationSuccessComponent> {
    get paragraph(): HTMLParagraphElement {
      return this.query<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryIntegrationSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryIntegrationSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and submit task', () => {
    expect(page.heading1.textContent.trim()).toEqual('Information sent to the registry');
    expect(page.heading3.textContent.trim()).toEqual('What happens next');
    expect(page.paragraph.textContent.trim()).toEqual(
      'You have requested that part of the EMP information can be communicated to the Registry service to create a Registry account.',
    );
  });
});
