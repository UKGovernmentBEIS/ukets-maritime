import { GovukSelectOption } from '@netz/govuk-components';

import { SelectOptionToTitlePipe } from '@shared/pipes/select-option-to-title.pipe';

describe('SelectOptionToTitlePipe', () => {
  it('create an instance', () => {
    const pipe = new SelectOptionToTitlePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct text from array of select options', () => {
    const data: GovukSelectOption<boolean>[] = [
      { value: false, text: 'Boolean value false' },
      { value: true, text: 'Boolean value true' },
    ];
    const pipe = new SelectOptionToTitlePipe();

    expect(pipe.transform(false, data)).toEqual('Boolean value false');
    expect(pipe.transform(true, data)).toEqual('Boolean value true');
  });
});
