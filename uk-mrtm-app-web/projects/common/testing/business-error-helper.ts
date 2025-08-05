import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { BusinessError, BusinessErrorService } from '@netz/common/error';

export const expectBusinessErrorToBe = async (error: BusinessError) => {
  return expect(firstValueFrom(TestBed.inject(BusinessErrorService).error$)).resolves.toEqual(error);
};

@Component({
  selector: 'netz-business-error',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BusinessErrorStubComponent {}
