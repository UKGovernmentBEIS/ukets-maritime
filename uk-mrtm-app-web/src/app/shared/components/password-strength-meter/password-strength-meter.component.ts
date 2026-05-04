import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';

import { PasswordStrengthMeterService } from '@shared/components/password-strength-meter/password-strength-meter.service';
import { Feedback, FeedbackResult } from '@shared/components/password-strength-meter/password-strength-meter.types';
import { ProgressBarComponent } from '@shared/components/progress-bar';

@Component({
  selector: 'mrtm-password-strength-meter',
  imports: [ProgressBarComponent],
  templateUrl: './password-strength-meter.component.html',
  providers: [PasswordStrengthMeterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  private readonly passwordStrengthMeterService = inject(PasswordStrengthMeterService);

  readonly password = input<string | null>(null);
  readonly minPasswordLength = input(8);
  readonly enableFeedback = input(false);

  readonly strengthChange = output<number | null>();

  private readonly prevPasswordStrength = signal<number | null>(null);

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

  constructor() {
    effect(() => {
      if (this.prevPasswordStrength() !== this.passwordStrength()) {
        this.strengthChange.emit(this.passwordStrength());
        this.prevPasswordStrength.set(this.passwordStrength());
      }
    });
  }

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
