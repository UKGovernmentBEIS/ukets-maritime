export interface XmlValidationError {
  row: number | string;
  column: 'NO_FIELD' | string;
  message: string;
}
