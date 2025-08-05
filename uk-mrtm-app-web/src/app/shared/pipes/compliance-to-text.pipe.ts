import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'complianceToText', standalone: true, pure: true })
export class ComplianceToTextPipe implements PipeTransform {
  transform(value: boolean | undefined | null): string {
    return value === true ? 'Compliant' : value === false ? 'Not compliant' : null;
  }
}
