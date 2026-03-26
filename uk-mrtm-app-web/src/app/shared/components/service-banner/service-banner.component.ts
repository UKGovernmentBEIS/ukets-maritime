import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { map } from 'rxjs';

import { UIConfigurationService } from '@mrtm/api';

@Component({
  selector: 'mrtm-service-banner',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './service-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceBannerComponent {
  private readonly configurationService = inject(UIConfigurationService);

  notifications$ = this.configurationService.getUIFlags().pipe(map((res) => res.notificationAlerts));
}
