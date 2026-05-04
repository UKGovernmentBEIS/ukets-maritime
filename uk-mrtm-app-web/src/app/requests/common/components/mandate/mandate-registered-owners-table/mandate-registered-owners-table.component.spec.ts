import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MandateRegisteredOwnersTableComponent } from '@requests/common/components/mandate';

describe('MandateRegisteredOwnersTableComponent', () => {
  let component: MandateRegisteredOwnersTableComponent;
  let fixture: ComponentFixture<MandateRegisteredOwnersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateRegisteredOwnersTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateRegisteredOwnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
