import { Pipe, PipeTransform } from '@angular/core';

import { ManageGuidanceDTO } from '@guidance/guidance.types';

@Pipe({
  name: 'manageGuidanceDocumentType',
  standalone: true,
})
export class ManageGuidanceDocumentTypePipe implements PipeTransform {
  transform(value: ManageGuidanceDTO['type']): unknown {
    switch (value) {
      case 'CREATE':
        return 'Add new file';
      case 'UPDATE':
        return 'Update file';
      case 'DELETE':
        return 'Delete file';
    }
  }
}
