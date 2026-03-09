import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, of, switchMap } from 'rxjs';

import { UsersSecuritySetupService } from '@mrtm/api';

import { catchBadRequest, ErrorCodes } from '@netz/common/error';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'mrtm-delete-2fa',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Delete2faComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly usersSecuritySetupService = inject(UsersSecuritySetupService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('token')),
        first(),
        switchMap((change2FaToken) => this.usersSecuritySetupService.deleteOtpCredentials({ token: change2FaToken })),
        map(() => ({ url: 'success' })),
        catchBadRequest([ErrorCodes.EMAIL1001, ErrorCodes.TOKEN1001, ErrorCodes.USER1005], (res) =>
          of({ url: 'invalid-link', queryParams: { code: res.error.code } }),
        ),
      )
      .subscribe(({ queryParams, url }: { url: string; queryParams?: any }) => {
        if (url === 'success') {
          this.authService.logout();
        } else {
          this.router.navigate(['2fa', url], { queryParams });
        }
      });
  }
}
