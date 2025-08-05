import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType',
  standalone: true,
})
export class UserTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'operator_admin':
        return 'operator admin user';
      case 'operator':
        return 'operator user';
      case 'consultant_agent':
        return 'consultant/agent';
      case 'emitter_contact':
        return 'emitter contact user';
      default:
        return value;
    }
  }
}
