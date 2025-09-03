import { XmlValidationError } from '@shared/types/xml-validation-error.interface';

export interface XmlResult<T> {
  data?: T;
  errors?: XmlValidationError[];
}
