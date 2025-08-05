import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirSubmittedRecommendationsComponent } from '@requests/timeline/vir-submitted/vir-submitted-recommendations/vir-submitted-recommendations.component';

describe('VirSubmittedRecommendationsComponent', () => {
  let component: VirSubmittedRecommendationsComponent;
  let fixture: ComponentFixture<VirSubmittedRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirSubmittedRecommendationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirSubmittedRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
