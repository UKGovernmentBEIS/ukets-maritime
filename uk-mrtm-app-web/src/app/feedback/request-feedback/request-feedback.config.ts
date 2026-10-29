import {
  AerSubmitRequestFeedbackPayload,
  AerVerificationSubmitRequestFeedbackPayload,
  EmpIssuanceSubmitRequestFeedbackPayload,
  EmpVariationSubmitRequestFeedbackPayload,
} from '@mrtm/api';

import { BusinessError, dashboardLink } from '@netz/common/error';

export type RequestFeedbackType =
  'AER_SUBMIT' | 'AER_VERIFICATION_SUBMIT' | 'EMP_ISSUANCE_SUBMIT' | 'EMP_VARIATION_SUBMIT';

export type RequestFeedbackFormPayload =
  | AerSubmitRequestFeedbackPayload
  | AerVerificationSubmitRequestFeedbackPayload
  | EmpIssuanceSubmitRequestFeedbackPayload
  | EmpVariationSubmitRequestFeedbackPayload;

export type FeedbackEaseRating = EmpIssuanceSubmitRequestFeedbackPayload['reportCompletionEaseRating'];
export type FeedbackCompletionMethod = EmpIssuanceSubmitRequestFeedbackPayload['reportCompletionMethods'][number];
export type FeedbackReviewGroup = RequestFeedbackFormPayload['feedbackReviewGroups'][number];

export const NO_FEEDBACK_REVIEW_GROUP = 'NO_FEEDBACK';
export const OTHER_COMPLETION_METHOD = 'OTHER';

export interface FeedbackOption<T extends string> {
  value: T;
  label: string;
  heading?: string;
}

export interface RequestFeedbackConfig {
  payloadType: string;
  easeRatingField: 'reportCompletionEaseRating' | 'opinionStatementEaseRating';
  invitation: {
    heading: string;
    description: string;
  };
  pageTitle: string;
  easeRatingLegend: string;
  completionMethodsLegend: string;
  completionMethodsHint: string;
  completionMethods: FeedbackOption<FeedbackCompletionMethod>[];
  otherCompletionMethodsLabel: string;
  reviewGroupsLegend: string;
  reviewGroupsHint: string;
  reviewGroups: FeedbackOption<FeedbackReviewGroup>[];
  reviewGroupsCommentLabel: string;
  reviewGroupsCommentHint?: string;
  additionalCommentsLabel: string;
  alreadySubmittedMessage: string;
  errorMessages: {
    easeRating: string;
    completionMethods: string;
    otherCompletionMethods: string;
  };
}

export const EASE_RATING_OPTIONS: FeedbackOption<FeedbackEaseRating>[] = [
  { value: 'VERY_EASY', label: 'Very easy' },
  { value: 'EASY', label: 'Easy' },
  { value: 'NEITHER_EASY_NOR_DIFFICULT', label: 'Neither easy or difficult' },
  { value: 'DIFFICULT', label: 'Difficult' },
  { value: 'VERY_DIFFICULT', label: 'Very difficult' },
];

const NO_FEEDBACK_OPTION_LABEL = 'No, I do not want to give feedback on any of these sections';

const EMP_CONFIG: Omit<RequestFeedbackConfig, 'payloadType'> = {
  easeRatingField: 'reportCompletionEaseRating',
  invitation: {
    heading: 'Give feedback on the emissions monitoring plan application process',
    description:
      'Complete a short survey about your experience applying for an emissions monitoring plan. Your feedback will help us to improve the service.',
  },
  pageTitle: 'Give feedback on your emissions monitoring plan application experience',
  easeRatingLegend: 'Overall, how did you find the process of completing your application?',
  completionMethodsLegend: 'How did you complete the application?',
  completionMethodsHint: 'Select all that apply.',
  completionMethods: [
    { value: 'TYPED_INTO_FORM_SECTIONS', label: 'Typed answers into the form sections' },
    { value: 'UPLOADED_SINGLE_SHIP_EU_XML_FILE', label: 'Uploaded an EU XML for a single ship' },
    { value: 'UPLOADED_XML_FILE', label: 'Uploaded an XML file to add ships' },
    { value: 'IMPORTED_FROM_DATA_SUPPLIER', label: 'Imported data from an appointed data supplier' },
    { value: 'OTHER', label: 'Other' },
  ],
  otherCompletionMethodsLabel: 'What other methods did you use to complete the application?',
  reviewGroupsLegend: 'Do you want to give feedback on any specific sections of the application?',
  reviewGroupsHint: 'Select all that apply.',
  reviewGroups: [
    { value: 'OPERATOR_DETAILS', label: 'Operator details' },
    { value: 'SHIPS_CALCULATION_EMISSIONS', label: 'List of ships and calculation of maritime emissions' },
    { value: 'EMISSION_SOURCES', label: 'Procedures related to emission sources and emissions factors' },
    {
      value: 'MONITORING_APPROACH',
      label: 'Procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
    },
    { value: 'DATA_GAPS', label: 'Data gaps' },
    { value: 'MANDATE', label: 'Delegated responsibility' },
    { value: 'MANAGEMENT_PROCEDURES', label: 'Management procedures' },
    { value: 'CONTROL_ACTIVITIES', label: 'Control activities' },
    { value: 'ABBREVIATIONS_AND_DEFINITIONS', label: 'List of definitions and abbreviations' },
    { value: 'ADDITIONAL_DOCUMENTS', label: 'Additional information' },
    { value: 'NO_FEEDBACK', label: NO_FEEDBACK_OPTION_LABEL },
  ],
  reviewGroupsCommentLabel: 'What is your feedback on the application sections you selected?',
  reviewGroupsCommentHint: 'Think about what happened when you filled in these sections.',
  additionalCommentsLabel:
    'Is there anything else you want to tell us about your experience with the emissions monitoring plan application? (optional)',
  alreadySubmittedMessage: 'You have already submitted feedback for this application',
  errorMessages: {
    easeRating: 'Select a rating for the process of completing your application',
    completionMethods: 'Select the methods you used to complete the application',
    otherCompletionMethods: 'Enter the methods you used to complete the application',
  },
};

export const REQUEST_FEEDBACK_CONFIG: Record<RequestFeedbackType, RequestFeedbackConfig> = {
  EMP_ISSUANCE_SUBMIT: { ...EMP_CONFIG, payloadType: 'EMP_ISSUANCE_SUBMIT_PAYLOAD' },
  EMP_VARIATION_SUBMIT: { ...EMP_CONFIG, payloadType: 'EMP_VARIATION_SUBMIT_PAYLOAD' },
  AER_SUBMIT: {
    payloadType: 'AER_SUBMIT_PAYLOAD',
    easeRatingField: 'reportCompletionEaseRating',
    invitation: {
      heading: 'Give feedback on the annual emissions report process',
      description:
        'Complete a short survey about your experience completing the annual emissions report. Your feedback will help us to improve the service.',
    },
    pageTitle: 'Give feedback on your annual emissions report experience',
    easeRatingLegend: 'Overall, how did you find the process of completing your report?',
    completionMethodsLegend: 'How did you complete the report?',
    completionMethodsHint: 'Select all that apply.',
    completionMethods: [
      { value: 'TYPED_INTO_FORM_SECTIONS', label: 'Typed answers into the form sections' },
      { value: 'UPLOADED_XML_FILE', label: 'Uploaded an XML file to add ships' },
      { value: 'IMPORTED_FROM_DATA_SUPPLIER', label: 'Imported data from an appointed data supplier' },
      { value: 'OTHER', label: 'Other' },
    ],
    otherCompletionMethodsLabel: 'What other methods did you use to complete the report?',
    reviewGroupsLegend: 'Do you want to give feedback on any specific sections of the report?',
    reviewGroupsHint: 'Select all that apply.',
    reviewGroups: [
      { value: 'OPERATOR_DETAILS', label: 'Operator details' },
      { value: 'MONITORING_PLAN_CHANGES', label: 'Monitoring plan changes' },
      { value: 'LIST_OF_SHIPS', label: 'Ships and emission details list' },
      { value: 'VOYAGES', label: 'Voyages' },
      { value: 'PORTS', label: 'Ports' },
      { value: 'AGGREGATED_EMISSIONS_DATA', label: 'Aggregated data' },
      { value: 'EMISSIONS_REDUCTION_CLAIM', label: 'Reduction claim' },
      { value: 'ADDITIONAL_DOCUMENTS', label: 'Additional documents and information' },
      { value: 'TOTAL_EMISSIONS', label: 'Emissions summary for all ships' },
      { value: 'NO_FEEDBACK', label: NO_FEEDBACK_OPTION_LABEL },
    ],
    reviewGroupsCommentLabel: 'What is your feedback on the report sections you selected?',
    reviewGroupsCommentHint: 'Think about what happened when you filled in these sections.',
    additionalCommentsLabel:
      'Is there anything else you want to tell us about your experience with the annual emissions report? (optional)',
    alreadySubmittedMessage: 'You have already submitted feedback for this report',
    errorMessages: {
      easeRating: 'Select a rating for the process of completing your report',
      completionMethods: 'Select the methods you used to complete the report',
      otherCompletionMethods: 'Enter the methods you used to complete the report',
    },
  },
  AER_VERIFICATION_SUBMIT: {
    payloadType: 'AER_VERIFICATION_SUBMIT_PAYLOAD',
    easeRatingField: 'opinionStatementEaseRating',
    invitation: {
      heading: 'Give feedback on the verification opinion statement process',
      description:
        'Complete a short survey about your experience with the verification opinion statement process. Your feedback will help us to improve the service.',
    },
    pageTitle: 'Give feedback on your verification opinion statement experience',
    easeRatingLegend: 'Overall, how did you find the verification opinion statement process?',
    completionMethodsLegend: 'How did you complete the verification opinion statement?',
    completionMethodsHint: 'Select all that apply.',
    completionMethods: [
      { value: 'TYPED_INTO_FORM_SECTIONS', label: 'Typed answers into the form sections' },
      { value: 'IMPORTED_FROM_DATA_SUPPLIER', label: 'Imported data from an appointed data supplier' },
      { value: 'OTHER', label: 'Other' },
    ],
    otherCompletionMethodsLabel: 'What other methods did you use to complete the verification opinion statement?',
    reviewGroupsLegend:
      'Do you want to give feedback on any specific sections of the verification opinion statement process?',
    reviewGroupsHint: 'Select all that apply.',
    reviewGroups: [
      { value: 'VERIFIER_DETAILS', label: 'Verifier details', heading: 'Verifier assessment' },
      { value: 'OPINION_STATEMENT', label: 'Opinion statement' },
      { value: 'ETS_COMPLIANCE_RULES', label: 'Compliance with ETS rules' },
      { value: 'COMPLIANCE_MONITORING_REPORTING', label: 'Compliance with monitoring and reporting principles' },
      { value: 'EMISSIONS_REDUCTION_CLAIM_VERIFICATION', label: 'Verify the emission reduction claim' },
      { value: 'OVERALL_DECISION', label: 'Overall decision' },
      { value: 'UNCORRECTED_MISSTATEMENTS', label: 'Uncorrected misstatements', heading: 'Verifier findings' },
      { value: 'UNCORRECTED_NON_CONFORMITIES', label: 'Uncorrected non-conformities' },
      { value: 'UNCORRECTED_NON_COMPLIANCES', label: 'Uncorrected non-compliances' },
      { value: 'RECOMMENDED_IMPROVEMENTS', label: 'Recommended improvements' },
      { value: 'CLOSE_DATA_GAPS_METHODOLOGIES', label: 'Methodologies to close data gaps' },
      { value: 'MATERIALITY_LEVEL', label: 'Further information of relevance to the opinion' },
      { value: 'NO_FEEDBACK', label: NO_FEEDBACK_OPTION_LABEL },
    ],
    reviewGroupsCommentLabel: 'What is your feedback on the report sections you selected?',
    additionalCommentsLabel:
      'Is there anything else you want to tell us about your experience with the verification opinion statement process? (optional)',
    alreadySubmittedMessage: 'You have already submitted feedback for this report',
    errorMessages: {
      easeRating: 'Select a rating for the verification opinion statement process',
      completionMethods: 'Select the methods you used to complete the verification opinion statement',
      otherCompletionMethods: 'Enter the methods you used to complete the verification opinion statement',
    },
  },
};

export const REQUEST_FEEDBACK_TASK_TYPES: Record<RequestFeedbackType, string> = {
  EMP_ISSUANCE_SUBMIT: 'EMP_ISSUANCE_APPLICATION_SUBMIT',
  EMP_VARIATION_SUBMIT: 'EMP_VARIATION_APPLICATION_SUBMIT',
  AER_SUBMIT: 'AER_APPLICATION_SUBMIT',
  AER_VERIFICATION_SUBMIT: 'AER_APPLICATION_VERIFICATION_SUBMIT',
};

export const isRequestFeedbackType = (type: unknown): type is RequestFeedbackType =>
  typeof type === 'string' && type in REQUEST_FEEDBACK_CONFIG;

export const feedbackNotAvailableError = () =>
  new BusinessError('This feedback form is not available').withLink(dashboardLink);
