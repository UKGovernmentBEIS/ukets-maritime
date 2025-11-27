import { AccountNoteResponse, RequestNoteResponse } from '@mrtm/api';

export const mockAccountNotesResults: AccountNoteResponse = {
  accountNotes: [
    {
      lastUpdatedOn: '2022-11-24T14:00:12.723Z',
      payload: { note: 'The note 1', files: { '11111111-1111-4111-a111-111111111111': 'file 1' } },
      submitter: 'Submitter 1',
    },
    {
      lastUpdatedOn: '2022-11-25T15:00:12.723Z',
      payload: { note: 'The note 2' },
      submitter: 'Submitter 2',
    },
  ],
  totalItems: 2,
};

export const mockRequestNotesResults: RequestNoteResponse = {
  requestNotes: [
    {
      lastUpdatedOn: '2022-11-24T14:00:12.723Z',
      payload: { note: 'The note 1', files: { '11111111-1111-4111-a111-111111111111': 'file 1' } },
      submitter: 'Submitter Workflow 1',
    },
    {
      lastUpdatedOn: '2022-11-25T15:00:12.723Z',
      payload: { note: 'The note 2' },
      submitter: 'Submitter Workflow 2',
    },
  ],
  totalItems: 2,
};
