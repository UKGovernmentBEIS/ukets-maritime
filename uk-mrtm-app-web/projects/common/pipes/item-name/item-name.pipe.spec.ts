import { TestBed } from '@angular/core/testing';

import { ItemNamePipe } from './item-name.pipe';
import { ITEM_NAME_TRANSFORMER } from './item-name.providers';
import { ItemNameTransformer } from './item-name.types';

describe('ItemNamePipe', () => {
  let pipe: ItemNamePipe;
  const map = { ACCOUNT_CLOSURE_SUBMIT: 'Close account' };
  const transformer: ItemNameTransformer = (taskType) => map[taskType] ?? null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ITEM_NAME_TRANSFORMER, useValue: transformer }],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new ItemNamePipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should map task types to item names', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform('ACCOUNT_CLOSURE_SUBMIT')).toEqual('Close account');
  });
});
