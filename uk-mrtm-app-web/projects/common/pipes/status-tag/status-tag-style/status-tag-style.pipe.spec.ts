import { TestBed } from '@angular/core/testing';

import { TASK_STATUS_TAG_MAP } from '../status-tag.providers';
import { StatusTagStylePipe } from './status-tag-style.pipe';

describe('StatusTagStylePipe', () => {
  let pipe: StatusTagStylePipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TASK_STATUS_TAG_MAP, useValue: { COMPLETED: { text: 'Completed', color: 'blue', style: 'fill' } } },
      ],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      pipe = new StatusTagStylePipe();
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform style', () => {
    expect(pipe.transform('COMPLETED')).toEqual('fill');
  });
});
