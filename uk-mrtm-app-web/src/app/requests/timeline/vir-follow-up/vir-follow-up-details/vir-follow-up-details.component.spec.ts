import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirFollowUpDetailsComponent } from '@requests/timeline/vir-follow-up/vir-follow-up-details/vir-follow-up-details.component';

describe('VirFollowUpDetailsComponent', () => {
  let component: VirFollowUpDetailsComponent;
  let fixture: ComponentFixture<VirFollowUpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirFollowUpDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirFollowUpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
