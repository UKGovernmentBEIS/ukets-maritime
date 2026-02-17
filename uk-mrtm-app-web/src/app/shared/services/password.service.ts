import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { debounceTime, from, map, Observable, switchMap } from 'rxjs';
import { zxcvbn } from '@zxcvbn-ts/core';

import { MessageValidationErrors } from '@netz/govuk-components';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly http = inject(HttpClient);

  isBlacklistedPassword(password: string): Observable<boolean> {
    return from(this.generateSHA1String(password)).pipe(
      switchMap((hexString) => {
        const prefix = hexString.substring(0, 5);
        const suffix = hexString.substring(5).toUpperCase();

        return this.http
          .get(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
            responseType: 'text',
          })
          .pipe(map((response) => response.includes(suffix)));
      }),
    );
  }

  private async generateSHA1String(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  blacklisted(control: AbstractControl): Observable<MessageValidationErrors | null> {
    return this.isBlacklistedPassword(control.value).pipe(
      debounceTime(500),
      map((isBlacklisted: boolean) =>
        isBlacklisted ? { blacklisted: 'Password has been blacklisted. Select another password.' } : null,
      ),
    );
  }

  strong(control: AbstractControl): MessageValidationErrors | null {
    const strength = zxcvbn(control.value ?? '').score;

    return strength > 2 ? null : { weakPassword: 'Enter a strong password' };
  }
}
