import { ChangeDetectorRef, Directive, inject, OnInit } from '@angular/core';

import { map } from 'rxjs';

import { SelectComponent } from '@netz/govuk-components';

import { Country } from '@core/interfaces/country.interface';
import { CountryService } from '@core/services/country.service';

@Directive({
  selector: 'govuk-select[mrtmCountries],[govuk-select][mrtmCountries]',
  standalone: true,
})
export class CountriesDirective implements OnInit {
  private readonly apiService = inject(CountryService);
  private readonly selectComponent = inject(SelectComponent);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.apiService
      .getUkCountries()
      .pipe(
        map((countries: Country[]) =>
          countries
            .sort((a: Country, b: Country) => (a.name > b.name ? 1 : -1))
            .map((country) => ({
              text: country.name,
              value: country.code,
            })),
        ),
      )
      .subscribe((res) => {
        this.selectComponent.options = res;
        this.changeDetectorRef.markForCheck();
      });
  }
}
