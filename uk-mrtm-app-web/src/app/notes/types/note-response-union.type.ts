import { AccountNoteDto, RequestNoteDto } from '@mrtm/api';

export interface NoteResponseUnion {
  notes?: Array<RequestNoteDto> | Array<AccountNoteDto>;
  totalItems?: number;
}
