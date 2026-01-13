import { InitialDataSourcePipe } from '@shared/pipes/initial-data-source.pipe';

describe('InitialDataSourcePipe', () => {
  it('create an instance', () => {
    const pipe = new InitialDataSourcePipe();
    expect(pipe).toBeTruthy();
  });
});
