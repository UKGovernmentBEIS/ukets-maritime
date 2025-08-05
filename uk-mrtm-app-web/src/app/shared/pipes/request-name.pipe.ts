import { Pipe, PipeTransform } from '@angular/core';

import { RequestInfoDTO } from '@mrtm/api';

import { getYearFromRequestId } from '@netz/common/utils';

import { empHistoryTypesMap } from '@shared/types';
import { isAer, taskActionTypeToTitleTransformer } from '@shared/utils';

@Pipe({
  name: 'requestName',
  standalone: true,
})
export class RequestNamePipe implements PipeTransform {
  transform({ id, type }: Pick<RequestInfoDTO, 'id' | 'type'>): string {
    const typeText = isAer(type)
      ? taskActionTypeToTitleTransformer(type, getYearFromRequestId(id))
      : (empHistoryTypesMap[type] ?? taskActionTypeToTitleTransformer(type));

    return `${id} ${typeText}`;
  }
}
