The footer component adds the GOV.UK footer to a full screen app: the crown logo, optional
navigation columns, support ("meta") links, the Open Government Licence notice and the Crown
copyright link.

The component renders the `govuk-footer` block itself (its host element carries the class),
matching the upstream govuk-frontend template; the page template is responsible for wrapping it in
the `<footer>` landmark element.

### Inputs

- `navigation` — columns of links shown above the meta row (`GovukFooterNavigation[]`). Each
  section has a `title`, its `items`, an optional grid `width` (defaults to `full`) and an optional
  `columns` count for splitting the list.
- `meta` — support links shown in the meta row (`GovukLinkItem[]`).
- `metaVisuallyHiddenTitle` — accessible heading for the meta links. Defaults to `Support links`.
- `showContentLicence` — set to `false` for content not covered by the Open Government Licence.
- `copyright` — the copyright link text. Defaults to `© Crown copyright`.
- `containerClasses` — extra classes for the inner width container.

Links use the `GovukLinkTarget` shape: `routerLink` for in-app navigation, `href` for anything that
leaves the app. Projected content is rendered as custom meta content above the licence notice.

### Example

```html
<footer>
  <govuk-footer
    [navigation]="[{ title: 'Services', items: [{ text: 'Service one', routerLink: '/one' }] }]"
    [meta]="[
      { text: 'Cookies', routerLink: '/cookies' },
      { text: 'Contact us', href: '/contact-us' },
    ]" />
</footer>
```
