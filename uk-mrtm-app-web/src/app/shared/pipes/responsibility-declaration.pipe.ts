import { Pipe, PipeTransform } from '@angular/core';

import { EmpMandate, EmpOperatorDetails } from '@mrtm/api';

@Pipe({
  name: 'responsibilityDeclaration',
  standalone: true,
})
export class ResponsibilityDeclarationPipe implements PipeTransform {
  transform(value?: EmpMandate, operatorName?: EmpOperatorDetails['operatorName']): string | null {
    return value?.responsibilityDeclaration
      ? `I certify that I am authorised by ${operatorName ?? ''} to make this declaration on its behalf and believe that the information provided is true.`
      : null;
  }
}
