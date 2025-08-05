import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { AerVerifierDetails } from '@requests/common/aer/aer.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { phoneInputValidators } from '@shared/validators';

export const verifierDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const verifierDetails = store.select(aerVerificationSubmitQuery.selectVerifierDetails)();

    return formBuilder.group({
      name: formBuilder.control<AerVerifierDetails['verifierContact']['name']>(
        verifierDetails?.verifierContact?.name ?? null,
        [
          GovukValidators.required("Enter the verifer's name"),
          GovukValidators.maxLength(500, 'Enter up to 500 characters'),
        ],
      ),
      email: formBuilder.control<AerVerifierDetails['verifierContact']['email']>(
        verifierDetails?.verifierContact?.email ?? null,
        [
          GovukValidators.required("Enter the verifer's email address"),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
          GovukValidators.maxLength(256, 'Enter up to 256 characters'),
        ],
      ),
      phoneNumber: formBuilder.control<AerVerifierDetails['verifierContact']['phoneNumber']>(
        verifierDetails?.verifierContact?.phoneNumber ?? null,
        [
          GovukValidators.required("Enter the verifer's telephone number"),
          ...phoneInputValidators,
          GovukValidators.maxLength(256, 'Enter up to 256 characters'),
        ],
      ),
      leadEtsAuditor: formBuilder.control<AerVerifierDetails['verificationTeamDetails']['leadEtsAuditor']>(
        verifierDetails?.verificationTeamDetails?.leadEtsAuditor ?? null,
        [
          GovukValidators.required('Enter the name of the lead ETS auditor'),
          GovukValidators.maxLength(500, 'Enter up to 500 characters'),
        ],
      ),
      etsAuditors: formBuilder.control<AerVerifierDetails['verificationTeamDetails']['etsAuditors']>(
        verifierDetails?.verificationTeamDetails?.etsAuditors ?? null,
        [
          GovukValidators.required('Enter the names of the ETS auditors'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      etsTechnicalExperts: formBuilder.control<AerVerifierDetails['verificationTeamDetails']['etsTechnicalExperts']>(
        verifierDetails?.verificationTeamDetails?.etsTechnicalExperts ?? null,
        [
          GovukValidators.required('Enter the names of the technical experts (ETS auditor)'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      independentReviewer: formBuilder.control<AerVerifierDetails['verificationTeamDetails']['independentReviewer']>(
        verifierDetails?.verificationTeamDetails?.independentReviewer ?? null,
        [
          GovukValidators.required('Enter the name of the Independent reviewer'),
          GovukValidators.maxLength(500, 'Enter up to 500 characters'),
        ],
      ),
      technicalExperts: formBuilder.control<AerVerifierDetails['verificationTeamDetails']['technicalExperts']>(
        verifierDetails?.verificationTeamDetails?.technicalExperts ?? null,
        [
          GovukValidators.required('Enter the names of the technical experts (Independent Review)'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      authorisedSignatoryName: formBuilder.control<
        AerVerifierDetails['verificationTeamDetails']['authorisedSignatoryName']
      >(verifierDetails?.verificationTeamDetails?.authorisedSignatoryName ?? null, [
        GovukValidators.required('Enter the name of authorised signatory'),
        GovukValidators.maxLength(500, 'Enter up to 500 characters'),
      ]),
    });
  },
};
