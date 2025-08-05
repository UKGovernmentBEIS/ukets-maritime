## Form group

Use the form group component as a wrapper to provide consistent error handling for grouped form controls with validators on FormGroup level.
Form group component internally wraps the controls with `govukFieldset`, uses `govukLegend` component for label and `govukErrorSummary` component for displaying errors.

Make sure to use `formGroupName` or `[formGroup]` with `govuk-form-group` to properly provide the form group container.

### Inputs

- `legend` - If legend text provided `govukLegend` component is displayed.
- `legendSize` - Adjusts the legend size. Defaults to medium.

### Example

```html
<div govuk-form-group formGroupName="fooBar" legend="Foo bar" legendSize="medium">
  <div formControlName="foo" govuk-text-input label="When did foo begin?" legendSize="normal"></div>
  <div formControlName="bar" govuk-text-input label="How many bar?" labelSize="normal"></div>
</div>
```

```html
<div govuk-form-group [formGroup]="fooBarFormGroup" legend="Foo bar" legendSize="medium">
  <div formControlName="foo" govuk-text-input label="When did foo begin?" legendSize="normal"></div>
  <div formControlName="bar" govuk-text-input label="How many bar?" labelSize="normal"></div>
</div>
```
