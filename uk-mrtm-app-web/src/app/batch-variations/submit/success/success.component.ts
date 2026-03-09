import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { BatchVariationService } from '@batch-variations/services/batch-variation.service';

@Component({
  selector: 'mrtm-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent implements OnInit {
  private readonly service: BatchVariationService = inject(BatchVariationService);

  public ngOnInit() {
    this.service.resetCurrentItem();
    this.service.loadBatchVariations().pipe(take(1)).subscribe();
  }
}
