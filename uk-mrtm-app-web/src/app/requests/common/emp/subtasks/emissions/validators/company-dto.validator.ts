import { NatureEnum } from '@requests/common/types';
import { XmlValidator } from '@shared/validators';

export class CompanyDtoValidator {
  static isNatureValid(value?: NatureEnum) {
    return XmlValidator.isEnum(value, NatureEnum);
  }
}
