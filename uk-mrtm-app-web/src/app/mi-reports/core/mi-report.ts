import { ExtendedMiReportResult } from '@mi-reports/core/mi-interfaces';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { utils, writeFileXLSX } from 'xlsx';

export const pageSize = 20;

export const miReportTypeDescriptionMap: Record<keyof typeof MiReportType, string> = {
  LIST_OF_ACCOUNTS_USERS_CONTACTS: 'List of Accounts, Users and Contacts',
  CUSTOM: 'Custom sql report',
  LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS: 'List of Accounts, Assigned Regulators and Site Contacts',
  COMPLETED_WORK: 'Completed work',
  REGULATOR_OUTSTANDING_REQUEST_TASKS: 'Regulator outstanding request tasks',
  LIST_OF_VERIFICATION_BODY_USERS: 'List of Verification bodies and Users',
};

export const miReportTypeLinkMap: Partial<Record<keyof typeof MiReportType, string[]>> = {
  LIST_OF_ACCOUNTS_USERS_CONTACTS: ['./', 'accounts-users-contacts'],
  CUSTOM: ['./', 'custom'],
  LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS: ['./', 'assigned-regulator-site-contacts'],
  COMPLETED_WORK: ['./', 'completed-work'],
  REGULATOR_OUTSTANDING_REQUEST_TASKS: ['./', 'outstanding-request-tasks'],
  LIST_OF_VERIFICATION_BODY_USERS: ['./', 'verification-body-users'],
};

export const createTablePage = (currentPage: number, pageSize: number, data: any[]): any[] => {
  const firstIndex = (currentPage - 1) * pageSize;
  const lastIndex = Math.min(firstIndex + pageSize, data?.length);

  return data?.length > firstIndex ? data.slice(firstIndex, lastIndex) : [];
};

export const manipulateResultsAndExportToExcel = (
  miReportResult: ExtendedMiReportResult,
  filename: string,
  manipulateResultsFn?: (
    parameter: {
      [x: string]: any;
    }[],
  ) => {
    [x: string]: any;
  }[],
) => {
  const removedColumnsResults =
    miReportResult.results.length > 0
      ? miReportResult.results.map((result) =>
          miReportResult.columnNames
            .map((columnName) => ({ [columnName]: result[columnName] }))
            .reduce((prev, cur) => ({ ...prev, ...cur }), {}),
        )
      : [miReportResult.columnNames.reduce((acc, col) => ({ ...acc, [col]: '' }), {})];

  const results = manipulateResultsFn ? manipulateResultsFn(removedColumnsResults) : removedColumnsResults;
  const ws = utils.json_to_sheet(results);
  const wb = utils.book_new();

  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, `${filename}.xlsx`);
};
