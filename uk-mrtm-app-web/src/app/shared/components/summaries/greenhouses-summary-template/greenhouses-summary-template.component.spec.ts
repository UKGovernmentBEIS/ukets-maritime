import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { GreenhousesSummaryTemplateComponent } from '@shared/components';

const mockGreenhouseGas = {
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

const mockGreenhouseGasMap = {
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

const mockWizardStep = {
  FUEL: 'fuel',
  CROSS_CHECK: 'cross-check',
  INFORMATION: 'information',
  QA_EQUIPMENT: 'qa-equipment',
  VOYAGES: 'voyages',
};

const mockIsEditable = true;

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
    fixture.componentRef.setInput('greenhouseGas', mockGreenhouseGas);
    fixture.componentRef.setInput('greenhouseGasMap', mockGreenhouseGasMap);
    fixture.componentRef.setInput('wizardStep', mockWizardStep);
    fixture.componentRef.setInput('isEditable', mockIsEditable);
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
      'Change procedure reference (Determining fuel bunkered and fuel in tanks)',
      'Procedure version',
      'Not provided',
      'Change procedure version (Determining fuel bunkered and fuel in tanks)',
      'Description of procedure',
      'asdf',
      'Change description of procedure (Determining fuel bunkered and fuel in tanks)',
      'Name of person or position responsible for this procedure',
      'asdf',
      'Change  name of person or position responsible for this procedure (Determining fuel bunkered and fuel in tanks)',
      'Location where records are kept',
      'sadf',
      'Change location where records are kept (Determining fuel bunkered and fuel in tanks)',
      'Name of IT system used',
      'asdf',
      'Change name of IT system used (Determining fuel bunkered and fuel in tanks)',
      'Procedure reference',
      'asdf',
      'Change procedure reference (Bunkering cross-checks)',
      'Procedure version',
      'ewr',
      'Change procedure version (Bunkering cross-checks)',
      'Description of procedure',
      'asdf',
      'Change description of procedure (Bunkering cross-checks)',
      'Name of person or position responsible for this procedure',
      'asdf',
      'Change  name of person or position responsible for this procedure (Bunkering cross-checks)',
      'Location where records are kept',
      'asdf',
      'Change location where records are kept (Bunkering cross-checks)',
      'Name of IT system used',
      'asdf',
      'Change name of IT system used (Bunkering cross-checks)',
      'Procedure reference',
      'qwer',
      'Change procedure reference (Recording, retrieving, transmitting and storing information)',
      'Procedure version',
      'qwer',
      'Change procedure version (Recording, retrieving, transmitting and storing information)',
      'Description of procedure',
      'asdf',
      'Change description of procedure (Recording, retrieving, transmitting and storing information)',
      'Name of person or position responsible for this procedure',
      '45',
      'Change  name of person or position responsible for this procedure (Recording, retrieving, transmitting and storing information)',
      'Location where records are kept',
      'loc info',
      'Change location where records are kept (Recording, retrieving, transmitting and storing information)',
      'Name of IT system used',
      'info it',
      'Change name of IT system used (Recording, retrieving, transmitting and storing information)',
      'Procedure reference',
      'equip ref',
      'Change procedure reference (Ensuring quality assurance of measuring equipment)',
      'Procedure version',
      'equip version',
      'Change procedure version (Ensuring quality assurance of measuring equipment)',
      'Description of procedure',
      'equip description',
      'Change description of procedure (Ensuring quality assurance of measuring equipment)',
      'Name of person or position responsible for this procedure',
      'equip person',
      'Change  name of person or position responsible for this procedure (Ensuring quality assurance of measuring equipment)',
      'Location where records are kept',
      'equip loc',
      'Change location where records are kept (Ensuring quality assurance of measuring equipment)',
      'Name of IT system used',
      'equip it',
      'Change name of IT system used (Ensuring quality assurance of measuring equipment)',
      'Procedure reference',
      'voyage ref',
      'Change procedure reference (Recording and safeguarding completeness of voyages)',
      'Procedure version',
      'voyage version',
      'Change procedure version (Recording and safeguarding completeness of voyages)',
      'Description of procedure',
      'voyage description',
      'Change description of procedure (Recording and safeguarding completeness of voyages)',
      'Name of person or position responsible for this procedure',
      'person',
      'Change  name of person or position responsible for this procedure (Recording and safeguarding completeness of voyages)',
      'Location where records are kept',
      'voyage location',
      'Change location where records are kept (Recording and safeguarding completeness of voyages)',
      'Name of IT system used',
      'Not provided',
      'Change name of IT system used (Recording and safeguarding completeness of voyages)',
    ]);
  });
});
