import { Pipe, PipeTransform } from '@angular/core';

import { userContactTransformer } from '@shared/utils/transformers';

@Pipe({
  name: 'userContact',
  standalone: true,
})
export class UserContactPipe implements PipeTransform {
  transform(contact: string): string {
    return userContactTransformer(contact);
  }
}
