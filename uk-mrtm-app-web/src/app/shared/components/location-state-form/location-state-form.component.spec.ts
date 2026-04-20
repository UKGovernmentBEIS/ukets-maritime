import { provideHttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MrtmAccountUpdateDTO } from '@mrtm/api';

import { LocationStateFormComponent } from '@shared/components';
import { render } from '@testing-library/angular';

describe('LocationStateFormComponent', () => {
  const renderComponent = async () => {
    const { fixture, detectChanges } = await render(
      `<form [formGroup]="form"><mrtm-location-state-form legendLabel="Test legend"></mrtm-location-state-form></form>`,
      {
        imports: [ReactiveFormsModule, LocationStateFormComponent],
        providers: [provideHttpClient()],
        componentProperties: {
          form: new FormGroup({
            line1: new FormControl<MrtmAccountUpdateDTO['line1'] | null>(null),
            line2: new FormControl<MrtmAccountUpdateDTO['line2'] | null>(null),
            city: new FormControl<MrtmAccountUpdateDTO['city'] | null>(null),
            state: new FormControl<MrtmAccountUpdateDTO['state'] | null>(null),
            postcode: new FormControl<MrtmAccountUpdateDTO['postcode'] | null>(null),
            country: new FormControl<MrtmAccountUpdateDTO['country'] | null>(null),
          }),
        },
      },
    );
    fixture.detectChanges();

    return { component: fixture.componentInstance, detectChanges };
  };

  it('should create', async () => {
    const { component } = await renderComponent();
    expect(component).toBeTruthy();
  });
});
