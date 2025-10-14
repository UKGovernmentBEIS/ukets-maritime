import { GuidanceSectionDTO } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { GuidanceState, ManageGuidanceDTO } from '@guidance/guidance.types';

const selectIsEditable: StateSelector<GuidanceState, boolean> = createSelector(
  (state: GuidanceState) => state.editable,
);

const selectSectionsForCompetentAuthority = (
  competentAuthority: string,
): StateSelector<GuidanceState, Array<GuidanceSectionDTO>> =>
  createSelector((state) => state?.guidanceSections?.[competentAuthority] ?? []);

const selectAvailableCompetentAuthorities: StateSelector<
  GuidanceState,
  Array<GuidanceSectionDTO['competentAuthority']>
> = createSelector<GuidanceState, Array<GuidanceSectionDTO['competentAuthority']>>(
  (state) => Object.keys(state.guidanceSections ?? []) as Array<GuidanceSectionDTO['competentAuthority']>,
);

const selectGuidanceSectionById = (
  sectionId: GuidanceSectionDTO['id'],
): StateSelector<GuidanceState, GuidanceSectionDTO> =>
  createSelector((state) =>
    Object.values(state?.guidanceSections ?? {})
      .flat()
      .find((section) => section.id === sectionId),
  );

const selectManageGuidance: StateSelector<GuidanceState, ManageGuidanceDTO> = createSelector((state) => state.manage);

const selectManageGuidanceType: StateSelector<GuidanceState, ManageGuidanceDTO['type']> = createDescendingSelector(
  selectManageGuidance,
  (payload) => payload?.type,
);

export const guidanceQuery = {
  selectIsEditable,
  selectSectionsForCompetentAuthority,
  selectAvailableCompetentAuthorities,
  selectGuidanceSectionById,
  selectManageGuidance,
  selectManageGuidanceType,
};
