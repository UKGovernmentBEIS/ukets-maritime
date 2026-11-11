import { Pipe, PipeTransform } from '@angular/core';

const VERIFICATION_BODY_STATUS_MAP = {
  ACTIVE: 'Active',
  DISABLED: 'Disabled',
  PENDING: 'Awaiting confirmation',
};

@Pipe({
  name: 'verificationBodyStatus',
  standalone: true,
})
export class VerificationBodyStatusPipe implements PipeTransform {
  transform(value: string): string | null {
    if (!value) {
      return null;
    }
    return VERIFICATION_BODY_STATUS_MAP[value] ?? null;
  }
}
