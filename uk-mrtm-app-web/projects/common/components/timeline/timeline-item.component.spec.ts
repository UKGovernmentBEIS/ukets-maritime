import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ITEM_ACTION_TRANSFORMER, ITEM_ACTIONS_MAP, ItemActionTransformer } from '@netz/common/pipes';

import { TimelineItemComponent } from './timeline-item.component';

describe('TimelineItemComponent', () => {
  let component: TimelineItemComponent;
  let fixture: ComponentFixture<TimelineItemComponent>;

  const itemActionMap = {
    RFI_SUBMITTED: {
      text: 'Submitted',
      transformed: true,
      linkable: true,
    },
  };

  const transformer: ItemActionTransformer = (actionType, _year, submitter) => {
    if (itemActionMap[actionType].transformed && submitter) {
      return itemActionMap[actionType].text + ' by ' + submitter;
    }
    return itemActionMap[actionType].text ?? null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ITEM_ACTIONS_MAP,
          useValue: itemActionMap,
        },
        {
          provide: ITEM_ACTION_TRANSFORMER,
          useValue: transformer,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('action', {
      type: 'RFI_SUBMITTED',
      creationDate: '2020-08-25 10:36:15.189643',
      submitter: 'asd',
    });
    fixture.componentRef.setInput('link', ['.']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
