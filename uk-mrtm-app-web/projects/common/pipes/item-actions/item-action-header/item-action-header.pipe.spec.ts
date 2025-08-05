import { TestBed } from '@angular/core/testing';

import { RequestActionDTO } from '@mrtm/api';

import { ITEM_ACTION_TRANSFORMER, ItemActionsMap, ItemActionTransformer } from '../item-actions.providers';
import { ItemActionHeaderPipe } from './item-action-header.pipe';

describe('ItemActionHeaderPipe', () => {
  let pipe: ItemActionHeaderPipe;
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
      pipe = new ItemActionHeaderPipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform item action header without submitter', () => {
    expect(pipe.transform({ id: 1, type: 'ISSUANCE' })).toEqual('Submitted');
  });

  it('should correctly transform item action header', () => {
    const mockRequestActionDTO: RequestActionDTO = {
      id: 1,
      type: 'ISSUANCE',
      submitter: 'John Doe',
    } as RequestActionDTO;
    expect(pipe.transform(mockRequestActionDTO)).toEqual('Submitted by John Doe');
  });
});
