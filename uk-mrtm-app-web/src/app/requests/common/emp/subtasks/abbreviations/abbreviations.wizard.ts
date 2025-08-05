import { EmpAbbreviations } from '@mrtm/api';

export const isAbbreviationsCompleted = (abbreviations?: EmpAbbreviations) => {
  return (
    abbreviations?.exist === false ||
    (abbreviations?.exist === true && abbreviations?.abbreviationDefinitions?.length > 0)
  );
};
