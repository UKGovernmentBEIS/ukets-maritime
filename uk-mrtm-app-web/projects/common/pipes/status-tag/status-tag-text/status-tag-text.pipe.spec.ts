import { TestBed } from '@angular/core/testing';

import { TASK_STATUS_TAG_MAP } from '../status-tag.providers';
import { StatusTagTextPipe } from './status-tag-text.pipe';

describe('StatusTagTextPipe', () => {
  let pipe: StatusTagTextPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: TASK_STATUS_TAG_MAP, useValue: { COMPLETED: { text: 'Completed', color: 'blue' } } }],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new StatusTagTextPipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform status', () => {
    expect(pipe.transform('COMPLETED')).toEqual('Completed');
  });
});
