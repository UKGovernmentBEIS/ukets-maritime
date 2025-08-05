import { AerRecommendedImprovements } from '@mrtm/api';

export const isWizardCompleted = (recommendedImprovements: AerRecommendedImprovements): boolean => {
  return (
    recommendedImprovements?.exist === false ||
    (recommendedImprovements?.exist === true && recommendedImprovements?.recommendedImprovements?.length > 0)
  );
};
