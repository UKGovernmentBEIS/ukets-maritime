export class XmlValidator {
  static isRequired(value: any) {
    return value !== null && value !== undefined && value !== '';
  }

  static isBoolean(value: any) {
    return value === true || value === false;
  }

  static isEnum(value: any, enumType: any) {
    return Object.values(enumType).includes(value);
  }

  static isDate(value: any) {
    const date = new Date(value);

    return !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
  }

  static minLength(value: any, length: number) {
    return value?.length >= length;
  }

  static maxLength(value: any, length: number) {
    return value?.length <= length;
  }

  static min(value: any, minimum: number) {
    return XmlValidator.isEmpty(value) ? false : value >= minimum;
  }

  static max(value: any, maximum: number) {
    return XmlValidator.isEmpty(value) ? false : value <= maximum;
  }

  static gt(value: any, minimum: number) {
    return XmlValidator.isEmpty(value) ? false : value > minimum;
  }

  static maxDecimalValidator(value: any, isPositive: boolean, integerDigits: number, decimalDigits?: number) {
    if (value === null || value === undefined) {
      return false;
    }

    const decimalRegexFragment = decimalDigits ? `{0,${decimalDigits}}` : '+';
    const positiveRegexFragment = isPositive ? '' : '-?';
    const regex = new RegExp(`^${positiveRegexFragment}[0-9]{1,${integerDigits}}(\\.[0-9]${decimalRegexFragment})?$`);

    return regex.test(value?.toString());
  }

  static isEmpty(value: any) {
    return value === null || value === undefined || value === '';
  }
}
