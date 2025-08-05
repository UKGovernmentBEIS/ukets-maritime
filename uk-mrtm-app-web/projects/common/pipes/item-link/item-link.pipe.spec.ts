import { TestBed } from '@angular/core/testing';

import { ItemDTO } from '@mrtm/api';

import { ItemLinkPipe } from './item-link.pipe';
import { ITEM_LINK_REQUEST_TYPES_WHITELIST } from './item-link.provider';

type DatasetDTO = Pick<ItemDTO, 'requestType' | 'taskType'> & { expectedPath: (string | number)[] };

describe('ItemLinkPipe', () => {
  let pipe: ItemLinkPipe;

  const taskId = 1;

  const dataSet: DatasetDTO[] = [
    {
      requestType: null,
      taskType: null,
      expectedPath: ['.'],
    },
    {
      requestType: 'ACCOUNT_CLOSURE',
      taskType: null,
      expectedPath: ['/tasks', 1],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: ['ACCOUNT_CLOSURE'] }],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new ItemLinkPipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it.each<DatasetDTO>(dataSet)(
    'should map $requestType . $taskType => $expectedPath',
    ({ requestType, taskType, expectedPath }) => {
      expect(
        pipe.transform({
          requestType: requestType,
          taskType: taskType,
          taskId: taskId,
        }),
      ).toEqual(expectedPath);
    },
  );
});
