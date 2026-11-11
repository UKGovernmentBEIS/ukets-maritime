import { inject, Injectable, InjectionToken } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  CaSiteContactsService,
  RegulatorAuthoritiesService,
  VBSiteContactsService,
  VerifierAuthoritiesService,
} from '@mrtm/api';

import { ErrorCodes } from '@netz/common/error';
import { GovukTableColumn } from '@netz/govuk-components';

import { initialState } from '@service-access/site-contacts/+store';

export interface SiteContactsContact {
  accountId?: number;
  accountName?: string;
  userId?: string;
  type?: string;
}

export interface SiteContactsPage {
  contacts?: SiteContactsContact[];
  editable?: boolean;
  totalItems?: number;
}

export interface SiteContactsAssignee {
  userId?: string;
  firstName?: string;
  lastName?: string;
  authorityStatus?: string;
}

/**
 * The site contacts tab is shared between the regulator and the verifier
 * views of the service access page; everything role-specific — backend
 * services, columns, filtering, error codes and success messaging — comes
 * from the adapter the active route provides.
 */
export interface SiteContactsAdapter {
  readonly columns: GovukTableColumn[];
  readonly pageSize: number;
  readonly showFilter: boolean;
  /** Overrides the contact's own account type when set. */
  readonly accountType?: string;
  readonly saveErrorCodes: ErrorCodes[];
  loadContacts(page: number, pageSize: number, businessId: string | null): Observable<SiteContactsPage>;
  loadAssignees(): Observable<SiteContactsAssignee[]>;
  saveContacts(siteContacts: { accountId: number; userId: string }[]): Observable<unknown>;
  successMessages(updatedAccountNames: string[]): string[];
}

export const SITE_CONTACTS_ADAPTER = new InjectionToken<SiteContactsAdapter>('Site contacts adapter');

@Injectable()
export class RegulatorSiteContactsAdapter implements SiteContactsAdapter {
  private readonly siteContactsService = inject(CaSiteContactsService);
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);

  readonly columns: GovukTableColumn[] = [
    { field: 'accountName', header: 'Permit holding account', isHeader: true },
    { field: 'type', header: 'Type' },
    { field: 'user', header: 'Assigned to' },
  ];
  readonly pageSize = initialState.paging.pageSize;
  readonly showFilter = true;
  readonly accountType = 'Maritime';
  readonly saveErrorCodes = [ErrorCodes.AUTHORITY1003, ErrorCodes.ACCOUNT1004];

  loadContacts(page: number, pageSize: number, businessId: string | null): Observable<SiteContactsPage> {
    return this.siteContactsService.getCaSiteContacts(page, pageSize, businessId ? { businessId } : {});
  }

  loadAssignees(): Observable<SiteContactsAssignee[]> {
    return this.regulatorAuthoritiesService.getCaRegulators().pipe(map((state) => state.caUsers));
  }

  saveContacts(siteContacts: { accountId: number; userId: string }[]): Observable<unknown> {
    return this.siteContactsService.updateCaSiteContacts(siteContacts);
  }

  successMessages(updatedAccountNames: string[]): string[] {
    return updatedAccountNames.length ? ['Assigned to updated'] : [];
  }
}

@Injectable()
export class VerifierSiteContactsAdapter implements SiteContactsAdapter {
  private readonly siteContactsService = inject(VBSiteContactsService);
  private readonly verifierAuthoritiesService = inject(VerifierAuthoritiesService);

  readonly columns: GovukTableColumn[] = [
    { field: 'accountName', header: 'Operator name', isHeader: true },
    { field: 'type', header: 'Type' },
    { field: 'user', header: 'Assigned to' },
  ];
  readonly pageSize = 50;
  readonly showFilter = false;
  readonly saveErrorCodes = [
    ErrorCodes.AUTHORITY1003,
    ErrorCodes.ACCOUNT1004,
    ErrorCodes.ACCOUNT1005,
    ErrorCodes.AUTHORITY1006,
  ];

  loadContacts(page: number, pageSize: number): Observable<SiteContactsPage> {
    return this.siteContactsService.getVbSiteContacts(page, pageSize);
  }

  loadAssignees(): Observable<SiteContactsAssignee[]> {
    return this.verifierAuthoritiesService.getVerifierAuthorities().pipe(map((state) => state.authorities));
  }

  saveContacts(siteContacts: { accountId: number; userId: string }[]): Observable<unknown> {
    return this.siteContactsService.updateVbSiteContacts(siteContacts);
  }

  successMessages(updatedAccountNames: string[]): string[] {
    return updatedAccountNames.map((accountName) => `${accountName} updated`);
  }
}
