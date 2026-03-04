import { GuidanceDocumentDTO, GuidanceSectionDTO } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { GuidanceState, ManageGuidanceDocumentDTO, ManageGuidanceDTO } from '@guidance/guidance.types';
import { isNil } from '@shared/utils';

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

const selectManageGuidanceDocumentById = (
  sectionId: GuidanceSectionDTO['id'],
  documentId: GuidanceDocumentDTO['id'],
): StateSelector<GuidanceState, ManageGuidanceDocumentDTO> =>
  createDescendingSelector(selectGuidanceSectionById(sectionId), (payload) => {
    const document = payload?.guidanceDocuments?.find((document) => document.id === documentId);

    return !isNil(document)
      ? ({
          ...document,
          sectionId,
          file: {
            uuid: document?.fileNameAndUuid?.uuid,
            file: {
              name: document?.fileNameAndUuid?.fileName,
            },
          },
        } as ManageGuidanceDocumentDTO)
      : undefined;
  });

export const guidanceQuery = {
  selectIsEditable,
  selectSectionsForCompetentAuthority,
  selectAvailableCompetentAuthorities,
  selectGuidanceSectionById,
  selectManageGuidance,
  selectManageGuidanceType,
  selectManageGuidanceDocumentById,
};
