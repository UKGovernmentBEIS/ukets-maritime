import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AerInPersonSiteVisit, AerInPersonSiteVisitDates } from '@mrtm/api';

export interface AerInPersonSiteVisitDatesFormGroupModel {
  startDate: FormControl<Date>;
  numberOfDays: FormControl<AerInPersonSiteVisitDates['numberOfDays']>;
}

export interface AerInPersonSiteVisitFormGroupModel {
  visitDates: FormArray<FormGroup<AerInPersonSiteVisitDatesFormGroupModel>>;
  teamMembers: FormControl<AerInPersonSiteVisit['teamMembers']>;
}

export interface AerInPersonSiteVisitFormModel {
  visitDates: { startDate: Date; numberOfDays: AerInPersonSiteVisitDates['numberOfDays'] }[];
  teamMembers: AerInPersonSiteVisit['teamMembers'];
}
