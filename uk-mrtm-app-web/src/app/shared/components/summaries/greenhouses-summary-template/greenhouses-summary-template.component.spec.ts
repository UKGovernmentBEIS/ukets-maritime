import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { GreenhousesSummaryTemplateComponent } from '@shared/components';

describe('GreenhousesSummaryTemplateComponent', () => {
  let component: GreenhousesSummaryTemplateComponent;
  let fixture: ComponentFixture<GreenhousesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<GreenhousesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenhousesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GreenhousesSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.greenhouseGas = {
      fuel: {
        reference: 'ref1',
        description: 'asdf',
        responsiblePersonOrPosition: 'asdf',
        recordsLocation: 'sadf',
        itSystemUsed: 'asdf',
      },
      crossChecks: {
        reference: 'asdf',
        version: 'ewr',
        description: 'asdf',
        responsiblePersonOrPosition: 'asdf',
        recordsLocation: 'asdf',
        itSystemUsed: 'asdf',
      },
      information: {
        reference: 'qwer',
        version: 'qwer',
        description: 'asdf',
        responsiblePersonOrPosition: '45',
        recordsLocation: 'loc info',
        itSystemUsed: 'info it',
      },
      qaEquipment: {
        reference: 'equip ref',
        version: 'equip version',
        description: 'equip description',
        responsiblePersonOrPosition: 'equip person',
        recordsLocation: 'equip loc',
        itSystemUsed: 'equip it',
      },
      voyages: {
        reference: 'voyage ref',
        version: 'voyage version',
        description: 'voyage description',
        responsiblePersonOrPosition: 'person',
        recordsLocation: 'voyage location',
      },
    };
    component.greenhouseGasMap = {
      title: 'Procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
      fuel: {
        title: 'Determining fuel bunkered and fuel in tanks',
      },
      crossChecks: {
        title: 'Bunkering cross-checks',
      },
      voyages: {
        title: 'Recording and safeguarding completeness of voyages',
      },
      information: {
        title: 'Recording, retrieving, transmitting and storing information',
      },
      qaEquipment: {
        title: 'Ensuring quality assurance of measuring equipment',
      },
    };
    component.wizardStep = {
      FUEL: 'fuel',
      CROSS_CHECK: 'cross-check',
      INFORMATION: 'information',
      QA_EQUIPMENT: 'qa-equipment',
      VOYAGES: 'voyages',
    };
    component.isEditable = true;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Procedure reference',
      'ref1',
      'Change',
      'Procedure version',
      'Not provided',
      'Change',
      'Description of procedure',
      'asdf',
      'Change',
      'Name of person or position responsible for this procedure',
      'asdf',
      'Change',
      'Location where records are kept',
      'sadf',
      'Change',
      'Name of IT system used',
      'asdf',
      'Change',
      'Procedure reference',
      'asdf',
      'Change',
      'Procedure version',
      'ewr',
      'Change',
      'Description of procedure',
      'asdf',
      'Change',
      'Name of person or position responsible for this procedure',
      'asdf',
      'Change',
      'Location where records are kept',
      'asdf',
      'Change',
      'Name of IT system used',
      'asdf',
      'Change',
      'Procedure reference',
      'qwer',
      'Change',
      'Procedure version',
      'qwer',
      'Change',
      'Description of procedure',
      'asdf',
      'Change',
      'Name of person or position responsible for this procedure',
      '45',
      'Change',
      'Location where records are kept',
      'loc info',
      'Change',
      'Name of IT system used',
      'info it',
      'Change',
      'Procedure reference',
      'equip ref',
      'Change',
      'Procedure version',
      'equip version',
      'Change',
      'Description of procedure',
      'equip description',
      'Change',
      'Name of person or position responsible for this procedure',
      'equip person',
      'Change',
      'Location where records are kept',
      'equip loc',
      'Change',
      'Name of IT system used',
      'equip it',
      'Change',
      'Procedure reference',
      'voyage ref',
      'Change',
      'Procedure version',
      'voyage version',
      'Change',
      'Description of procedure',
      'voyage description',
      'Change',
      'Name of person or position responsible for this procedure',
      'person',
      'Change',
      'Location where records are kept',
      'voyage location',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
    ]);
  });
});
