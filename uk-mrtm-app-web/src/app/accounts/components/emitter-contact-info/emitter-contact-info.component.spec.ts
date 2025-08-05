import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitterContactInfoComponent } from '@accounts/components/emitter-contact-info/emitter-contact-info.component';

describe('EmitterContactInfoComponent', () => {
  let component: EmitterContactInfoComponent;
  let fixture: ComponentFixture<EmitterContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmitterContactInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmitterContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
