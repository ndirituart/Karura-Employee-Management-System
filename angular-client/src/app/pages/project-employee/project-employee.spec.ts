import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmployee } from './project-employee';

describe('ProjectEmployee', () => {
  let component: ProjectEmployee;
  let fixture: ComponentFixture<ProjectEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
