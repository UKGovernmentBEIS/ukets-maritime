import { Pipe, PipeTransform } from '@angular/core';

import { RegisteredOwnerShipDetails } from '@mrtm/api';

@Pipe({
  name: 'registeredOwnerShipDetails',
  standalone: true,
})
export class RegisteredOwnerShipDetailsPipe implements PipeTransform {
  transform(value?: RegisteredOwnerShipDetails): string | null {
    return value?.name ? `${value.name} (IMO: ${value?.imoNumber})` : null;
  }
}
