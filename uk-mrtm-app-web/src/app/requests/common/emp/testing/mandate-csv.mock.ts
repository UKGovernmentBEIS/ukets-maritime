import { mandateCsvMap } from '@requests/common/emp/subtasks/mandate/mandate-upload/mandate-upload.map';

export const mockMandateCsvSuccessPapaResult = {
  data: [
    {
      'Registered owner name': 'RegisteredOwner1',
      'IMO unique company and registered owner identification number': '1000000',
      'Contact Name': 'RegisteredOwner1',
      'Contact Email': 'RegisteredOwner1@o.com',
      'Date of written agreement': '4/3/2025',
      'Associated ship IMO number': '1111111',
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(mandateCsvMap),
  },
} as Papa.ParseResult<any>;

export const mockMandateCsvErrorPapaResult = {
  data: [
    {
      'Registered owner name': null,
      'IMO unique company and registered owner identification number': null,
      'Contact Name': null,
      'Contact Email': null,
      'Date of written agreement': null,
      'Associated ship IMO number': null,
    },
  ],
  errors: [],
  meta: {
    fields: Object.values(mandateCsvMap),
  },
} as Papa.ParseResult<any>;
