import { Pipe, PipeTransform } from '@angular/core';

import { isNil } from 'lodash-es';

import { bigNumberUtils } from '@shared/utils/bignumber.utils';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'bigNumber',
  standalone: true,
})
export class BigNumberPipe implements PipeTransform {
  transform(value: string | number, maxDecimals = 2): string {
    return isNil(value) ? value : bigNumberUtils.format(new BigNumber(value), maxDecimals);
  }
}
