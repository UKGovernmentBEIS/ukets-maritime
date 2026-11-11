## Skip link

Use the skip link component to help keyboard-only users skip to the main content on a page.
All GOV.UK pages must include a skip link in the header.
Design details can be found at [GOV.UK Design System](https://design-system.service.gov.uk/components/skip-link/).

The component renders a plain same-page fragment link (`href="#main-content"`) and reproduces the
behaviour of the GOV.UK Frontend skip link script: following the link moves focus to the target,
so keyboard and screen reader users continue from the main content rather than the top of the
page. A target that is not focusable, such as a `<main>` element, is given `tabindex="-1"` and the
`govuk-skip-link-focused-element` class while it holds focus; both are removed again on blur so the
target does not stay in the tab order or show a focus outline on a later mouse click. A `tabindex`
the author has already set is left alone.

The target is looked up by id, not by selector, so pass the bare id without a leading `#`. If no
element with that id exists, the click is left to the browser.

### Inputs

- `targetId` — the id of the element to skip to. Defaults to `main-content`, the GOV.UK page
  template's `main`.
- `text` — the link text. Defaults to `Skip to main content`.

### Examples

```html
<govuk-skip-link />
<govuk-skip-link targetId="search-results" text="Skip to results" />
```
