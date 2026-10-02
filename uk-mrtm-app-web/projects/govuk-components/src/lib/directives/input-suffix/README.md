Input suffix directive marks content projected into a `govuk-text-input` to be rendered as the
[GDS Text input suffix](https://design-system.service.gov.uk/components/text-input/input-suffix/).

Use it when the suffix is not plain text, for example an icon. For plain text use the `suffix` input
of `govuk-text-input` instead. When both are provided, the projected content takes precedence.

The element gets the `govuk-input__suffix` class and `aria-hidden="true"`, so the suffix must be
decorative - anything a user needs to know should be in the input's label or hint.

Below you can find an example on how to use this directive:

```angular2html
<div govuk-text-input formControlName="term" label="Search">
  <span govukInputSuffix class="search-suffix">
    <svg aria-hidden="true" focusable="false">...</svg>
  </span>
</div>
```
