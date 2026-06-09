import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { TagComponent } from '@netz/govuk-components';

import { PasswordStrengthMeterService } from '@shared/components/password-strength-meter/password-strength-meter.service';
import { Feedback, FeedbackResult } from '@shared/components/password-strength-meter/password-strength-meter.types';
import { ProgressBarComponent } from '@shared/components/progress-bar';

@Component({
  selector: 'mrtm-password-strength-meter',
  imports: [ProgressBarComponent, TagComponent],
  templateUrl: './password-strength-meter.component.html',
  providers: [PasswordStrengthMeterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  private readonly passwordStrengthMeterService = inject(PasswordStrengthMeterService);

  readonly password = input<string | null>(null);
  readonly minPasswordLength = input(8);
  readonly enableFeedback = input(false);
  readonly showTags = input(true);

  protected readonly passwordStrength = computed<number | null>(() => {
    if (!this.password()) {
      return null;
    }

    if (this.password().length < this.minPasswordLength()) {
      return 0;
    }

    return this.calculateScore(this.password()).score;
  });

  protected readonly feedback = computed<Feedback | null>(() => {
    if (!this.password() || this.password().length < this.minPasswordLength()) {
      return null;
    }

    return this.calculateScore(this.password()).feedback;
  });

  private calculateScore(password: string): FeedbackResult {
    if (this.enableFeedback()) {
      return this.passwordStrengthMeterService.scoreWithFeedback(password);
    }

    return {
      score: this.passwordStrengthMeterService.score(password),
      feedback: null,
    };
  }
}
