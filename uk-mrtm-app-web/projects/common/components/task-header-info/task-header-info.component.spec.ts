import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '../../testing';
import { TaskHeaderInfoComponent } from './task-header-info.component';

describe('TaskHeaderInfoComponent', () => {
  let component: TaskHeaderInfoComponent;
  let fixture: ComponentFixture<TaskHeaderInfoComponent>;
  let page: Page;

  class Page extends BasePage<TaskHeaderInfoComponent> {
    get info() {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(TaskHeaderInfoComponent, {
      set: { host: { 'test-id': 'component-spec' } },
    });

    fixture = TestBed.createComponent(TaskHeaderInfoComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the content', () => {
    fixture.componentRef.setInput('assignee', 'Adam Smith');
    fixture.componentRef.setInput('daysRemaining', 13);
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to: Adam Smith', 'Days Remaining: 13']);
  });

  it('should display the content with no deadline', () => {
    fixture.componentRef.setInput('assignee', 'Adam Smith');
    fixture.componentRef.setInput('daysRemaining', null);
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to: Adam Smith']);
  });

  it('should display the content with no assignee', () => {
    fixture.componentRef.setInput('assignee', null);
    fixture.componentRef.setInput('daysRemaining', 13);
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to:', 'Days Remaining: 13']);
  });

  it('should display overdue task', () => {
    fixture.componentRef.setInput('assignee', 'Adam Smith');
    fixture.componentRef.setInput('daysRemaining', -1);
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual([
      'Assigned to: Adam Smith',
      'Days Remaining: Overdue',
    ]);
  });
});
