import { Pipe, PipeTransform } from '@angular/core';

import { AerDataInitialSourceType } from '@shared/types';

@Pipe({
  name: 'initialDataSource',
  standalone: true,
})
export class InitialDataSourcePipe implements PipeTransform {
  transform(value: AerDataInitialSourceType, dataSupplierName?: string): string {
    switch (value) {
      case AerDataInitialSourceType.EXTERNAL_PROVIDER:
        return dataSupplierName
          ? `External system <br /> <strong>Data supplier:</strong> ${dataSupplierName}`
          : 'External system';
      case AerDataInitialSourceType.MANUAL:
        return 'Manual entry or file upload';
      case AerDataInitialSourceType.FROM_FETCH_PORTS_OR_VOYAGES:
        return `Internal system <br /> (Voyages/ports)`;
      case AerDataInitialSourceType.FETCH_FROM_EMP:
        return 'Internal system (EMP)';
    }
  }
}
