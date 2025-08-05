export interface XmlValidationError {
  row: number;
  column: 'NO_FIELD' | string;
  message: string;
}
