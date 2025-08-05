## Date Picker component

Use the date picker component:

- For a relative date or one they need to look up, for example last Thursday or next Wednesday
- To enter today’s date more quickly
- For available dates only, such as for prison visits

This component was created as a custom form control to be integrated with Angular's reactive forms.

Design details can be found at [Ministry of Justice Design System](https://design-patterns.service.justice.gov.uk/components/date-picker/)

### Inputs

- `label` - A label for the input.
- `hint` - A hint displayed beneath the label.
- `widthClass` - The width of the input.
- `datePickerConfig` - A configuration containing the following properties.
  - `leadingZeros` - `boolean` Whether there will be a leading zero for single digit days and months. Defaults to `true`.
  - `weekStartDay` - `'Monday' | 'Sunday'` Day of the week the calendar starts on. Either `Monday` or `Sunday`. Defaults to `Monday`.
  - `minDate` - `string` Earliest date that can be selected (format dd/mm/yyyy).
  - `maxDate` - `string` Latest date that can be selected (format dd/mm/yyyy).
  - `excludedDays` - `'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' []` Array of days of the week that cannot be selected.
  - `excludedDates` - `string` String of space-separated dates or dash-separated date range that cannot be selected (format dd/mm/yyyy), for example `05/02/2025-10/02/2025`.


### Examples

```html
<div
  formControlName="datePickerDate"
  govuk-date-picker
  label="Enter a date"
  labelSize="normal"
  hint="exampleHint"
  widthClass="govuk-!-width-one-half"
  [datePickerConfig]="{
    leadingZeros: false,
    weekStartDay: 'Monday',
    minDate: '02/02/2025',
    maxDate: '25/02/2025',
    excludedDates: '05/02/2025-10/02/2025'
    excludedDays: ['Wednesday']
  }"></div>
```
