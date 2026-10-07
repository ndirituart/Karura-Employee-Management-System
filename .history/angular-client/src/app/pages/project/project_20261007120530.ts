import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ProjectService, ProjectDto } from '../../services/projectservice';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class Project implements OnInit {
  projectForm!: FormGroup;
  projects: ProjectDto[] = [];

  /** null = creating a new project; a number = editing the project with that id */
  editingId: number | null = null;

  loading = false;
  saving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProjects();
  }

  // ---------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------

  private buildForm(): void {
    this.projectForm = this.fb.group({
      projectName:     ['', [Validators.required, Validators.maxLength(150)]],
      clientName:      ['', [Validators.required, Validators.maxLength(150)]],
      startDate:       [null as string | null, [Validators.required]],
      leadByEmpId:     [null as number | null, [Validators.required, Validators.min(1)]],
      contactPerson:   ['', [Validators.maxLength(150)]],
      contactNoProject:['', [Validators.maxLength(30)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const payload = this.projectForm.value as Omit<ProjectDto, 'id'>;
    this.saving = true;

    if (this.editingId === null) {
      this.projectService.create(payload).subscribe({
        next: (created: ProjectDto) => {
          this.saving = false;
          this.projects = [created, ...this.projects];
          this.successMessage = `Project "${created.projectName}" created.`;
          this.resetForm();
        },
        error: (err: unknown) => {
          this.saving = false;
          this.errorMessage = this.extractError(err, 'Failed to create project.');
        }
      });
    } else {
      const id = this.editingId;
      this.projectService.update(id, { ...payload, projectId: id }).subscribe({
        next: (updated: ProjectDto) => {
          this.saving = false;
          this.projects = this.projects.map(p => p.projectId === id ? updated : p);
          this.successMessage = `Project "${updated.projectName}" updated.`;
          this.resetForm();
        },
        error: (err: unknown) => {
          this.saving = false;
          this.errorMessage = this.extractError(err, 'Failed to update project.');
        }
      });
    }
  }

  editProject(p: ProjectDto): void {
    this.editingId = p.projectId ?? null;
    this.projectForm.patchValue({
      projectName:      p.projectName,
      clientName:       p.clientName,
      startDate:        p.startDate ? p.startDate.substring(0, 10) : null,
      leadByEmpId:      p.leadByEmpId,
      contactPerson:    p.contactPerson ?? '',
      contactNoProject: p.contactNoProject ?? ''
    });
    this.errorMessage = null;
    this.successMessage = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteProject(id: number | undefined): void {
    if (id == null) return;
    if (!confirm('Delete this project?')) return;

    this.projectService.delete(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.projectId !== id);
        this.successMessage = 'Project deleted.';
      },
      error: (err: unknown) => {
        this.errorMessage = this.extractError(err, 'Failed to delete project.');
      }
    });
  }

  private resetForm(): void {
    this.editingId = null;
    this.projectForm.reset({
      projectName: '',
      clientName: '',
      startDate: null,
      leadByEmpId: null,
      contactPerson: '',
      contactNoProject: ''
    });
  }

  // ---------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (data: ProjectDto[]) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = this.extractError(err, 'Failed to load projects.');
      }
    });
  }

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  trackById(_index: number, item: ProjectDto): number {
  return item.projectId ?? 0; //not just ID because it is not a var but a varchar eg PR0-001
}

  private extractError(err: unknown, fallback: string): string {
    if (typeof err === 'string') return err;
    const anyErr = err as { error?: { message?: string } | string; message?: string };
    if (anyErr?.error) {
      if (typeof anyErr.error === 'string') return anyErr.error;
      if (typeof anyErr.error.message === 'string') return anyErr.error.message;
    }
    return anyErr?.message ?? fallback;
  }
}
