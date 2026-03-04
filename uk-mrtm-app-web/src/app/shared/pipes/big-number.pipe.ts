import { Pipe, PipeTransform } from '@angular/core';

import { bigNumberUtils, isNil } from '@shared/utils';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'bigNumber',
  standalone: true,
})
export class BigNumberPipe implements PipeTransform {
  transform(value: string | number, maxDecimals = 2): string | null {
    return isNil(value) ? (value as null) : bigNumberUtils.format(new BigNumber(value), maxDecimals);
  }
}
