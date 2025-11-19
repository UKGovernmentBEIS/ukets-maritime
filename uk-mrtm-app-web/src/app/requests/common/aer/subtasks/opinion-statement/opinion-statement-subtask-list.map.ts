import { SubTaskListMap } from '@shared/types';

export const opinionStatementMap: SubTaskListMap<{
  emissionsCorrect: string;
  manuallyProvidedTotalEmissions: string;
  manuallyProvidedSurrenderEmissions: string;
  manuallyProvidedLessIslandFerryDeduction: string;
  manuallyProvidedLess5PercentIceClassDeduction: string;
  additionalChangesNotCovered: string;
  additionalChangesNotCoveredDetails: string;
  siteVisitType: string;
  siteVisitDetailsInPerson: string;
  siteVisitDetailsInPersonTeamMembers: string;
  siteVisitDetailsVirtual: string;
}> = {
  title: 'Opinion statement',
  emissionsCorrect: {
    title: 'Review the Maritime Operator’s emissions details',
    caption: 'Are the reporting and surrender obligation emissions correct?',
  },
  manuallyProvidedTotalEmissions: { title: 'Total verified maritime emissions for the scheme year' },
  manuallyProvidedLessIslandFerryDeduction: { title: 'Less verified small island ferry deduction' },
  manuallyProvidedLess5PercentIceClassDeduction: { title: 'Less verified 5% ice class deduction' },
  manuallyProvidedSurrenderEmissions: { title: 'Emissions figure for surrender for the scheme year' },
  additionalChangesNotCovered: {
    title: 'Other changes not covered in the approved emissions monitoring plan',
    caption: 'Were there any changes to the emissions monitoring plan during the scheme year?',
  },
  additionalChangesNotCoveredDetails: {
    title: 'List the agreed changes, including the date and type of communication',
  },
  siteVisitType: {
    title: 'What kind of site visit did your team make?',
  },
  siteVisitDetailsInPerson: {
    title: 'In-person site visit details',
  },
  siteVisitDetailsInPersonTeamMembers: {
    title: 'Which team members made the site visit?',
  },
  siteVisitDetailsVirtual: {
    title: 'Virtual site visit details',
    caption: 'Reasons for making a virtual visit',
  },
};
