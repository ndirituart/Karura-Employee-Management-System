import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  CreateProjectEmployeeDto,
  ProjectEmployeeDto,
  ProjectEmployeeService
} from '../../services/project-employee.service';

@Component({
  selector: 'app-project-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-employee.html',
  styleUrls: ['./project-employee.css']
})
export class ProjectEmployee implements OnInit {
  peForm!: FormGroup;
  assignments: ProjectEmployeeDto[] = [];

  /** null = creating; number = editing that record */
  editingId: number | null = null;

  loading = false;
  saving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private peService: ProjectEmployeeService
  ) {}

  ngOnInit(): void {
    this.peForm = this.fb.group({
      projectId:           ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      empId:               ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      assignedDate:        [this.todayIso(), Validators.required],
      roleProjectEmployee: ['', [Validators.required, Validators.maxLength(80)]],
      isActive:            [true]
    });

    this.loadAssignments();
  }

  // ---------------------------------------------------------------
  // Submit (create or update)
  // ---------------------------------------------------------------

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.peForm.invalid) {
      this.peForm.markAllAsTouched();
      this.errorMessage = 'Please fix the highlighted fields.';
      return;
    }

    const raw = this.peForm.value;
    const payload: CreateProjectEmployeeDto = {
      projectId: Number(raw.projectId),
      empId: Number(raw.empId),
      assignedDate: raw.assignedDate,
      roleProjectEmployee: raw.roleProjectEmployee,
      isActive: raw.isActive
    };

    this.saving = true;

    if (this.editingId === null) {
      this.peService.create(payload).subscribe({
        next: (created) => {
          this.saving = false;
          this.assignments = [created, ...this.assignments];
          this.successMessage = 'Assignment created successfully.';
          this.resetForm();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = this.extractError(err);
        }
      });
    } else {
      const id = this.editingId;
      const full: ProjectEmployeeDto = { ...payload, empProjectId: id };
      this.peService.update(id, full).subscribe({
        next: (updated) => {
          this.saving = false;
          this.assignments = this.assignments.map(a =>
            a.empProjectId === id ? updated : a
          );
          this.successMessage = 'Assignment updated successfully.';
          this.resetForm();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = this.extractError(err);
        }
      });
    }
  }

  // ---------------------------------------------------------------
  // Edit / delete / reset
  // ---------------------------------------------------------------

  editAssignment(pe: ProjectEmployeeDto): void {
    this.editingId = pe.empProjectId ?? null;
    this.peForm.patchValue({
      projectId:           String(pe.projectId),
      empId:               String(pe.empId),
      assignedDate:        pe.assignedDate ? pe.assignedDate.substring(0, 10) : null,
      roleProjectEmployee: pe.roleProjectEmployee,
      isActive:            pe.isActive
    });
    this.errorMessage = null;
    this.successMessage = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteAssignment(id: number | undefined): void {
    if (id == null) return;
    if (!confirm('Delete this assignment?')) return;

    this.peService.delete(id).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => a.empProjectId !== id);
        this.successMessage = 'Assignment deleted.';
      },
      error: (err) => {
        this.errorMessage = this.extractError(err);
      }
    });
  }

  onReset(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingId = null;
    this.peForm.reset({
      projectId: '',
      empId: '',
      assignedDate: this.todayIso(),
      roleProjectEmployee: '',
      isActive: true
    });
  }

  // ---------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------

  loadAssignments(): void {
    this.loading = true;
    this.peService.getAll().subscribe({
      next: (data) => {
        this.assignments = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.extractError(err, 'Failed to load assignments.');
      }
    });
  }

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  get f() { return this.peForm.controls; }

  showError(name: string): boolean {
    const c = this.peForm.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  trackById(_index: number, item: ProjectEmployeeDto): number {
    return item.empProjectId ?? 0;
  }

  private todayIso(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private extractError(err: unknown, fallback = 'Something went wrong.'): string {
    const anyErr = err as {
      status?: number;
      error?: { message?: string } | string;
      message?: string;
    };
    if (anyErr?.status === 0)   return 'Network error — could not reach the API.';
    if (anyErr?.status === 404) return 'Project or employee does not exist.';
    if (anyErr?.status === 409) return 'This assignment already exists.';
    if (anyErr?.status === 400) {
      if (typeof anyErr.error === 'string') return anyErr.error;
      if (typeof anyErr.error?.message === 'string') return anyErr.error.message;
      return 'Invalid data. Please review the form.';
    }
    if (typeof anyErr?.error === 'string') return anyErr.error;
    if (typeof anyErr?.error?.message === 'string') return anyErr.error.message;
    return anyErr?.message ?? fallback;
  }
}