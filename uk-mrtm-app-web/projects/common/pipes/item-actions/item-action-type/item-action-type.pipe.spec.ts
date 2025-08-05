import { TestBed } from '@angular/core/testing';

import { ITEM_ACTION_TRANSFORMER, ItemActionsMap, ItemActionTransformer } from '../item-actions.providers';
import { ItemActionTypePipe } from './item-action-type.pipe';

describe('ItemActionTypePipe', () => {
  let pipe: ItemActionTypePipe;
  const map: ItemActionsMap = { ISSUANCE: { text: 'Submitted', transformed: true, linkable: false } };
  const transformer: ItemActionTransformer = (actionType, _year, submitter) => {
    if (map[actionType].transformed && submitter) {
      return map[actionType].text + ' by ' + submitter;
    }
    return map[actionType].text ?? null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ITEM_ACTION_TRANSFORMER, useValue: transformer }],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new ItemActionTypePipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform item action type', () => {
    expect(pipe.transform('ISSUANCE')).toEqual('Submitted');
  });
});
