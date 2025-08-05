import { ChangeDetectorRef, Directive, inject, OnInit } from '@angular/core';

import { map } from 'rxjs';

import { SelectComponent } from '@netz/govuk-components';

import { County } from '@core/interfaces/county.interface';
import { CountyService } from '@core/services/county.service';

@Directive({
  selector: 'govuk-select[mrtmCounties],[govuk-select][mrtmCounties]',
  standalone: true,
})
export class CountiesDirective implements OnInit {
  private readonly apiService = inject(CountyService);
  private readonly selectComponent = inject(SelectComponent);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.apiService
      .getUkCounties()
      .pipe(
        map((counties: County[]) =>
          counties
            .sort((a: County, b: County) => (a.name > b.name ? 1 : -1))
            .map((county) => ({
              text: county.name,
              value: county.name,
            })),
        ),
      )
      .subscribe((res) => {
        this.selectComponent.options = res;
        this.changeDetectorRef.markForCheck();
      });
  }
}
