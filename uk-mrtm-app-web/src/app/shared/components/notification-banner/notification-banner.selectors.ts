import { createSelector, StateSelector } from '@netz/common/store';

import { NotificationBannerState } from '@shared/components/notification-banner';

export const selectType: StateSelector<NotificationBannerState, NotificationBannerState['type']> = createSelector(
  (state) => state.type,
);

export const selectSuccessMessages: StateSelector<NotificationBannerState, NotificationBannerState['successMessages']> =
  createSelector((state) => state.successMessages);

export const selectInvalidForm: StateSelector<NotificationBannerState, NotificationBannerState['invalidForm']> =
  createSelector((state) => state.invalidForm);
