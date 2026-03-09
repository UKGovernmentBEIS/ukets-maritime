import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { map } from 'rxjs';

import { UIConfigurationService } from '@mrtm/api';

@Component({
  selector: 'mrtm-service-banner',
  standalone: true,
  templateUrl: './service-banner.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceBannerComponent {
  private readonly configurationService = inject(UIConfigurationService);

  notifications$ = this.configurationService.getUIFlags().pipe(map((res) => res.notificationAlerts));
}
