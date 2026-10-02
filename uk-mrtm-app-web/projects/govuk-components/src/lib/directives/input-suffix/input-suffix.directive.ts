import { Directive } from '@angular/core';

/**
 * Marks projected content (e.g. an icon) to be rendered as the input suffix, instead of the plain text `suffix` input.
 */
@Directive({
  selector: '[govukInputSuffix]',
  standalone: true,
  host: {
    class: 'govuk-input__suffix',
    'aria-hidden': 'true',
  },
})
export class InputSuffixDirective {}
