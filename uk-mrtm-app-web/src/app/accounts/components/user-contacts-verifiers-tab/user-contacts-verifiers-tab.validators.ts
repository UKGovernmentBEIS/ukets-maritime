import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { AccountOperatorAuthorityUpdateDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

export const activeOperatorAdminValidator = (message: string): ValidatorFn => {
  return GovukValidators.builder(message, (group: UntypedFormGroup) =>
    (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
      (item) => item?.roleCode === 'operator_admin' && item.authorityStatus === 'ACTIVE',
    )
      ? null
      : { noActiveOperatorAdmin: true },
  );
};

export const activeContactValidator = (contactType: string): ValidatorFn => {
  return GovukValidators.builder(
    `You must have a ${contactType.toLowerCase()} contact on your account on a user with ACTIVE status`,
    (group: UntypedFormGroup) => {
      // Check if the contactType is not selected at all or if it is selected but corresponding user is inactive.
      const contactTypeValue = group.get('contactTypes').get(contactType).value;
      const validContact = contactTypeValue || contactType === 'SECONDARY';
      return !validContact ||
        (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
          (item) => item.authorityStatus !== 'ACTIVE' && item.userId === contactTypeValue,
        )
        ? { [`${contactType.toLowerCase()}NotActive`]: true }
        : null;
    },
  );
};

export const primarySecondaryValidator = (message: string): ValidatorFn => {
  return GovukValidators.builder(message, (group: UntypedFormGroup) => {
    const primaryContactId = group.get('contactTypes').get('PRIMARY').value;
    // Check if primary and secondary contacts are selected and assigned to the same active user.
    return primaryContactId === group.get('contactTypes').get('SECONDARY').value &&
      primaryContactId &&
      (group.value['usersArray'] as Array<AccountOperatorAuthorityUpdateDTO>).find(
        (user) => user.userId === primaryContactId,
      ).authorityStatus === 'ACTIVE'
      ? { samePrimarySecondary: true }
      : null;
  });
};
