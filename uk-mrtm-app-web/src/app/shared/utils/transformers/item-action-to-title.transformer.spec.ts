import { itemActionsMap } from '@requests/common/item-actions.map';
import { itemActionToTitleTransformer } from '@shared/utils/transformers/item-action-to-title.transformer';

describe('itemActionToTitleTransformer', () => {
  it('should return mapped title for valid action type', () => {
    Object.keys(itemActionsMap).forEach((actionType) => {
      const result = itemActionToTitleTransformer(actionType);
      expect(result).toBe(`${itemActionsMap[actionType].text} ${itemActionsMap[actionType].suffix ?? ''}`.trim());
    });
  });

  it('should return mapped title for valid action type with "transformed: true" and submitter string', () => {
    Object.keys(itemActionsMap).forEach((actionType) => {
      const result = itemActionToTitleTransformer(actionType, undefined, 'John Doe');
      if (itemActionsMap[actionType].transformed) {
        expect(result).toBe(
          `${itemActionsMap[actionType].text} by John Doe ${itemActionsMap[actionType].suffix ?? ''}`.trim(),
        );
      } else {
        expect(result).toBe(`${itemActionsMap[actionType].text} ${itemActionsMap[actionType].suffix ?? ''}`.trim());
      }
    });
  });

  it('should replace "annual" with year for DOE action types', () => {
    expect(itemActionToTitleTransformer('DOE_PEER_REVIEW_REQUESTED', '2023')).toBe(
      'Peer review 2023 emissions determination requested',
    );
    expect(itemActionToTitleTransformer('DOE_PEER_REVIEWER_ACCEPTED', '2023')).toBe(
      'Peer review 2023 emissions determination agreement submitted',
    );
    expect(itemActionToTitleTransformer('DOE_PEER_REVIEWER_REJECTED', '2023')).toBe(
      'Peer review 2023 emissions determination disagreement submitted',
    );
    expect(itemActionToTitleTransformer('DOE_APPLICATION_SUBMITTED', '2023')).toBe(
      'Determine 2023 emissions submitted',
    );
  });

  it('should handle numeric year for DOE action types', () => {
    const result = itemActionToTitleTransformer('DOE_PEER_REVIEW_REQUESTED', 2023);
    expect(result).toBe('Peer review 2023 emissions determination requested');
  });

  it('should add submitter for DOE action types when provided', () => {
    const result = itemActionToTitleTransformer('DOE_PEER_REVIEW_REQUESTED', '2023', 'John Doe');
    expect(result).toBe('Peer review 2023 emissions determination requested by John Doe');
  });

  it('should return null for unknown task type', () => {
    const actionType = 'UNKNOWN_TASK';
    const result = itemActionToTitleTransformer(actionType);
    expect(result).toBeNull();
  });
});
