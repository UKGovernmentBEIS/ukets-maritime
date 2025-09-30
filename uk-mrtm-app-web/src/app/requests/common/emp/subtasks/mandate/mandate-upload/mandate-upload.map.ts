import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { EmpRegisteredOwner, RegisteredOwnerShipDetails } from '@mrtm/api';

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const mandateCsvMap: Record<keyof FlattenedRegisteredOwner, string> = {
  name: 'Registered owner name',
  imoNumber: 'IMO unique company and registered owner identification number',
  contactName: 'Contact Name',
  email: 'Contact Email',
  effectiveDate: 'Date of written agreement',
  shipImoNumber: 'Associated ship IMO number',
};

type MandateCsvHeaders = (typeof mandateCsvMap)[keyof typeof mandateCsvMap];

type MandateCsvRecord = {
  [K in MandateCsvHeaders]: any;
};

export const mandateCSVMapper = (data: MandateCsvRecord[]): FlattenedRegisteredOwner[] =>
  data.map((item: { [x: string]: any }) => ({
    name: item?.[mandateCsvMap.name],
    imoNumber: item?.[mandateCsvMap.imoNumber],
    contactName: item?.[mandateCsvMap.contactName],
    email: item?.[mandateCsvMap.email],
    effectiveDate: item?.[mandateCsvMap.effectiveDate],
    shipImoNumber: item?.[mandateCsvMap.shipImoNumber],
  }));

/**
 * Form based on FlattenedMandate.
 * Since CSV cannot pass as object, we flatten it then transform it to EmpRegisteredOwner
 */
export type MandateUploadFormModel = Record<keyof FlattenedRegisteredOwner, FormControl>;

export type MandateUploadFormArray = FormArray<FormGroup<MandateUploadFormModel>>;

export interface MandateUploadCSVFormModel {
  owners: MandateUploadFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

export interface FlattenedRegisteredOwner {
  name: EmpRegisteredOwner['name'];
  imoNumber: EmpRegisteredOwner['imoNumber'];
  contactName: EmpRegisteredOwner['contactName'];
  email: EmpRegisteredOwner['email'];
  effectiveDate: EmpRegisteredOwner['effectiveDate'];
  shipImoNumber: RegisteredOwnerShipDetails['imoNumber'];
}
