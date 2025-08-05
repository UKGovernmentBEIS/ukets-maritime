import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentUserInfoComponent } from '@accounts/components';

describe('AgentUserInfoComponent', () => {
  let component: AgentUserInfoComponent;
  let fixture: ComponentFixture<AgentUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentUserInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
