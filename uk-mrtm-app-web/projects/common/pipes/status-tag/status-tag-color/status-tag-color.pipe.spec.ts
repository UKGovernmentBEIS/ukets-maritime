import { TestBed } from '@angular/core/testing';

import { TASK_STATUS_TAG_MAP } from '../status-tag.providers';
import { StatusTagColorPipe } from './status-tag-color.pipe';

describe('StatusTagColorPipe', () => {
  let pipe: StatusTagColorPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: TASK_STATUS_TAG_MAP, useValue: { COMPLETED: { text: 'COMPLETED', color: 'blue' } } }],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new StatusTagColorPipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform status', () => {
    expect(pipe.transform('COMPLETED')).toEqual('blue');
  });
});
