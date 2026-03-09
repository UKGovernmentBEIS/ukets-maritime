import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'govuk-cookies-pop-up',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookies-pop-up.component.html',
  styleUrl: './cookies-pop-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesPopUpComponent {
  private readonly baseHref = inject<string>(APP_BASE_HREF, { optional: true });
  @Input() cookiesExpirationTime: string;
  @Input() cookiesAccepted: boolean;
  @Input() areBrowserCookiesEnabled: boolean;
  @Output() readonly cookiesAcceptedEmitter = new EventEmitter<string>();

  show = false;

  cookiesNotAccepted() {
    return this.cookiesAccepted === false;
  }

  acceptCookies() {
    this.show = true;
    this.cookiesAcceptedEmitter.emit(this.cookiesExpirationTime);
  }

  hideCookieMessage() {
    this.show = false;
  }

  goToSetPreferences() {
    location.href = new URL(
      'cookies',
      this.baseHref ? new URL(this.baseHref, location.origin) : location.origin,
    ).toString();
  }
}
