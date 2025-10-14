import { Pipe, PipeTransform } from '@angular/core';

import { ManageGuidanceDTO } from '@guidance/guidance.types';

@Pipe({
  name: 'manageGuidanceSectionType',
  standalone: true,
})
export class ManageGuidanceSectionTypePipe implements PipeTransform {
  transform(value: ManageGuidanceDTO['type']): unknown {
    switch (value) {
      case 'CREATE':
        return 'Add new section';
      case 'UPDATE':
        return 'Update section details';
      case 'DELETE':
        return 'Delete section';
    }
  }
}
