import { first, from, Observable, of } from 'rxjs';

import { Country } from '@core/interfaces/country.interface';
import { CountryService } from '@core/services/country.service';

export class CountryServiceStub implements Partial<CountryService> {
  private countries: Country[] = [
    {
      code: 'CY',
      name: 'Cyprus',
      officialName: 'Cyprus',
    },
    {
      code: 'GR',
      name: 'Greece',
      officialName: 'Greece',
    },
    {
      code: 'AF',
      name: 'Afghanistan',
      officialName: 'Afghanistan',
    },
  ];

  getUkCountries(): Observable<Country[]> {
    return of(this.countries);
  }

  getCountry(code: string): Observable<Country> {
    return from(this.countries).pipe(first((country) => country.code === code));
  }
}
