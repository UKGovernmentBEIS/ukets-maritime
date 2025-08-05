import {
  AccountOperatorsUsersAuthoritiesInfoDTO,
  AccountReportingStatusHistoryListResponse,
  AccountSearchResults,
  MrtmAccountEmpDTO,
  OperatorUserDTO,
  OperatorUserInvitationDTO,
  RoleDTO,
  UserAuthorityInfoDTO,
  UserStateDTO,
} from '@mrtm/api';

export const mockedAccount: MrtmAccountEmpDTO = {
  account: {
    id: 1,
    name: 'TEST',
    state: 'TEST_STATE',
    city: 'TEST_CITY',
    firstMaritimeActivityDate: new Date('2022-02-02').toISOString(),
    imoNumber: '1231231',
    line1: 'TEST_LINE1',
    line2: 'TEST_LINE2',
    country: 'TEST_COUNTRY',
    postcode: 'TEST_POSTCODE',
    status: 'NEW',
  },
};

export const mockedClosedAccount: MrtmAccountEmpDTO = {
  account: {
    id: 1,
    name: 'TEST',
    city: 'TEST_CITY',
    firstMaritimeActivityDate: new Date('2022-02-02').toISOString(),
    imoNumber: '1231231',
    line1: 'TEST_LINE1',
    country: 'TEST_COUNTRY',
    status: 'CLOSED',
  },
};

export const mockMrtmAccountResults: AccountSearchResults = {
  accounts: [
    { id: 1, name: 'account1', businessId: 'EM00001', status: 'NEW', imoNumber: '1234567' },
    { id: 2, name: 'account2', businessId: 'EM00002', status: 'NEW', imoNumber: '1234568' },
    { id: 3, name: 'account3', businessId: 'EM00003', status: 'NEW', imoNumber: '1234569' },
  ],
  total: 3,
};

export const operatorUserRole: UserStateDTO = {
  roleType: 'OPERATOR',
  userId: '1',
  status: 'ENABLED',
};

export const regulatorUserRole: UserStateDTO = {
  roleType: 'REGULATOR',
  userId: '1',
  status: 'ENABLED',
};

export const mockOperatorListData: AccountOperatorsUsersAuthoritiesInfoDTO = {
  authorities: [
    {
      authorityStatus: 'ACTIVE',
      firstName: 'First',
      lastName: 'User',
      roleCode: 'operator_admin',
      roleName: 'Operator admin',
      userId: 'userTest1',
      authorityCreationDate: '2019-12-21T13:42:43.050682Z',
    },
    {
      authorityStatus: 'ACTIVE',
      firstName: 'John',
      lastName: 'Doe',
      roleCode: 'operator',
      roleName: 'Operator',
      userId: 'userTest2',
      authorityCreationDate: '2020-12-21T13:42:43.050682Z',
    },
    {
      authorityStatus: 'DISABLED',
      firstName: 'Darth',
      lastName: 'Vader',
      roleCode: 'operator',
      roleName: 'Operator',
      userId: 'userTest3',
      authorityCreationDate: '2020-10-13T13:42:43.050682Z',
    },
    {
      authorityStatus: 'ACTIVE',
      firstName: 'anakin',
      lastName: 'skywalker',
      roleCode: 'operator',
      roleName: 'Operator',
      userId: 'userTest4',
      authorityCreationDate: '2021-01-13T13:42:43.050682Z',
    },
  ] as UserAuthorityInfoDTO[],
  contactTypes: {
    PRIMARY: 'userTest1',
    SECONDARY: 'userTest3',
    SERVICE: 'userTest2',
    FINANCIAL: 'userTest4',
  },
  editable: true,
};

export const mockOperatorRoleCodes: RoleDTO[] = [
  {
    name: 'Operator admin',
    code: 'operator_admin',
  },
  {
    name: 'Operator',
    code: 'operator',
  },
  {
    name: 'Consultant / Agent',
    code: 'consultant_agent',
  },
  {
    name: 'Emitter Contact',
    code: 'emitter_contact',
  },
];

export const mockOperatorUser: OperatorUserInvitationDTO = {
  email: 'test@email.com',
  firstName: 'testFirstName',
  lastName: 'testLastName',
};

export const mockOperatorDTO: OperatorUserDTO = {
  email: 'test@host.com',
  firstName: 'Mary',
  lastName: 'Za',
  mobileNumber: { countryCode: '30', number: '1234567890' },
  phoneNumber: { countryCode: '30', number: '123456780' },
};

export const mockReportingStatusHistoryResults: AccountReportingStatusHistoryListResponse = {
  reportingStatusHistoryList: {
    '2025': [
      {
        status: 'REQUIRED_TO_REPORT',
        reason: 'some reason',
        submissionDate: new Date('2022-12-12').toISOString(),
        submitterName: 'Name 1',
      },
      {
        status: 'EXEMPT',
        reason: 'another reason',
        submissionDate: new Date('2022-11-12').toISOString(),
        submitterName: 'Name 2',
      },
    ],
  },
};

export const mockReportingStatusesResults = {
  reportingStatusList: [
    {
      status: 'REQUIRED_TO_REPORT',
      year: '2025',
      lastUpdate: '2025-02-13T10:50:19.842947Z',
      reported: false,
    },
    {
      status: 'REQUIRED_TO_REPORT',
      year: '2024',
      lastUpdate: '2025-02-13T10:50:19.782699Z',
      reported: false,
    },
    {
      status: 'REQUIRED_TO_REPORT',
      year: '2023',
      lastUpdate: '2025-02-13T10:50:19.736111Z',
      reported: false,
    },
    {
      status: 'REQUIRED_TO_REPORT',
      year: '2022',
      lastUpdate: '2025-02-13T10:50:19.694057Z',
      reported: false,
    },
    {
      status: 'REQUIRED_TO_REPORT',
      year: '2021',
      lastUpdate: '2025-02-13T10:50:19.658343Z',
      reported: false,
    },
  ],
  total: 20,
};
