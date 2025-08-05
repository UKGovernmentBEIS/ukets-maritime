import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userTypeWithArticle',
  standalone: true,
})
export class UserTypePipeWithArticle implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'operator_admin':
        return 'an operator admin user';
      case 'operator':
        return 'an operator user';
      case 'consultant_agent':
        return 'a consultant/agent';
      case 'emitter_contact':
        return 'an emitter contact user';
      default:
        return value;
    }
  }
}
