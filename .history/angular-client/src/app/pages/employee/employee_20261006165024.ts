import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CreateEmployeeDto, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [EmployeeService],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class Employee implements OnInit {
  employeeForm!: FormGroup;
  saving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  readonly roles = ['Admin', 'Manager', 'Supervisor', 'Employee', 'Intern'];
  readonly departments = [
    'Forestry', 'Conservation', 'Finance',
    'Human Resources', 'ICT', 'Operations'
  ];
  readonly genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  readonly employmentTypes = ['Permanent', 'Contract', 'Casual', 'Internship'];
  readonly statuses = ['Active', 'On Leave', 'Suspended', 'Terminated'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      userId: [null, [Validators.required, Validators.min(1)]],
      role: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(80)]],
      lastName:  ['', [Validators.required, Validators.maxLength(80)]],
      email:     ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      dateOfBirth: [null as string | null],
      gender:      [null as string | null],
      department:     ['', Validators.required],
      jobTitle:       ['', [Validators.required, Validators.maxLength(120)]],
      hireDate:       [this.todayIso(), Validators.required],
      employmentType: [null as string | null],
      salary:         [null as number | null, [Validators.min(0)]],
      status:         ['Active', Validators.required],
      county:        ['', [Validators.maxLength(60)]],
      town:          ['', [Validators.maxLength(60)]],
      postalAddress: ['', [Validators.maxLength(120)]]
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.errorMessage = 'Please fix the highlighted fields.';
      return;
    }

    const payload: CreateEmployeeDto = this.employeeForm.value;
    this.saving = true;

    this.employeeService.createEmployee(payload).subscribe({
      next: (created) => {
        this.saving = false;
        this.successMessage =
          `Employee "${created.firstName} ${created.lastName}" created successfully.`;
        this.resetForm();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = this.extractError(err);
      }
    });
  }

  onReset(): void { this.resetForm(); }

  private resetForm(): void {
    this.employeeForm.reset({
      userId: null,
      role: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
      gender: null,
      department: '',
      jobTitle: '',
      hireDate: this.todayIso(),
      employmentType: null,
      salary: null,
      status: 'Active',
      county: '',
      town: '',
      postalAddress: ''
    });
  }

  get f() { return this.employeeForm.controls; }

  showError(name: string): boolean {
    const c = this.employeeForm.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  private todayIso(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private extractError(err: unknown): string {
    const anyErr = err as {
      status?: number;
      error?: { message?: string } | string;
      message?: string;
    };
    if (anyErr?.status === 0)   return 'Network error — could not reach the API. Is the server running?';
    if (anyErr?.status === 404) return 'The linked user does not exist. Check the User ID and try again.';
    if (anyErr?.status === 409) return 'An employee with this User ID or email already exists.';
    if (anyErr?.status === 400) {
      if (typeof anyErr.error === 'string') return anyErr.error;
      if (typeof anyErr.error?.message === 'string') return anyErr.error.message;
      return 'Invalid data. Please review the form.';
    }
    if (typeof anyErr?.error === 'string') return anyErr.error;
    if (typeof anyErr?.error?.message === 'string') return anyErr.error.message;
    return anyErr?.message ?? 'Something went wrong. Please try again.';
  }
}