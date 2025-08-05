import { ShipStepTitlePipe } from '@requests/common/components/emissions/pipes/ship-step-title.pipe';

describe('ShipStepTitlePipe', () => {
  it('create an instance', () => {
    const pipe = new ShipStepTitlePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value', () => {
    const pipe = new ShipStepTitlePipe();

    expect(pipe.transform('Test', 1)).toEqual('Test, question 1 of 7');
    expect(pipe.transform('Test', 3, '', 3)).toEqual('Test, question 3 of 3');
    expect(pipe.transform('Test', 2, 'ship name', 3)).toEqual('Test for ship name, question 2 of 3');
  });
});
