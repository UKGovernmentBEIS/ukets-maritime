import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'competentAuthority',
  standalone: true,
})
export class CompetentAuthorityPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ENGLAND':
        return 'Environment Agency';
      case 'SCOTLAND':
        return 'Scottish Environment Protection Agency';
      case 'NORTHERN_IRELAND':
        return 'Northern Ireland Environment Agency';
      case 'WALES':
        return 'Natural Resources Wales';
      case 'OPRED':
        return 'Offshore Petroleum Regulator for Environment and Decommissioning';
      default:
        return '';
    }
  }
}
