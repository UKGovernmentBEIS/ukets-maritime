## Header

The GOV.UK header component tells users they’re using a service on GOV.UK and lets them use GOV.UK-wide tools.
Also known as the GOV.UK masthead.

The blue brand-coloured bar carries the GOV.UK logo only — service names and navigation belong in the
`govuk-service-navigation` component rendered below it. The host element carries the `govuk-header`
class; the page template is responsible for wrapping the header area in the `<header>` landmark
element.

Projected content is rendered in the actions area (`govuk-header__actions`) on the right-hand side
of the bar, expected to hold the "Change service" and "Sign out" links. A vertical divider is drawn
between adjacent links automatically, outside the links' own boxes so the focus state highlights
only the link itself.

Design details can be found at [GOV.UK Design System](https://design-system.service.gov.uk/components/header/).

### Inputs

- `homepage` — where the GOV.UK logo links to (`GovukLinkTarget`): `routerLink` for in-app
  navigation, `href` for anything that leaves the app. Defaults to `//gov.uk`.
- `productName` — the name of the product, shown next to the logo.
- `containerClasses` — classes for the inner container. Defaults to `govuk-width-container`.

### Examples

```html
<header>
  <govuk-header [homepage]="{ href: 'https://www.gov.uk' }" productName="Service Name">
    <a govukLink class="govuk-link--inverse" [href]="serviceGatewayUrl">Change service</a>
    <a govukLink class="govuk-link--inverse" routerLink (click)="logout($event)">Sign out</a>
  </govuk-header>
  <govuk-service-navigation serviceName="Service Name" [navigation]="navigationItems()" />
</header>
```
