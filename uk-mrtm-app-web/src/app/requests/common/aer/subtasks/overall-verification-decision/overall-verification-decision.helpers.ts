export const OVERALL_VERIFICATION_DECISION_SUB_TASK = 'overallVerificationDecision';

export const OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH = 'overall-verification-decision';

export enum OverallVerificationDecisionStep {
  SUMMARY = '../',
  ASSESSMENT = 'assessment',
  VERIFIED_WITH_COMMENTS_LIST = 'reasons-list',
  VERIFIED_WITH_COMMENTS_FORM_ADD = 'add-reason',
  VERIFIED_WITH_COMMENTS_FORM_EDIT = 'edit-reason',
  VERIFIED_WITH_COMMENTS_DELETE = 'remove-reason',
  NOT_VERIFIED_REASONS = 'not-verified-reasons',
}
