import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** User record returned by GET /api/User/{id} — used to verify the UserID exists. */
export interface UserDto {
  id: number;
  username?: string;
  fullName?: string;
  email?: string;
}

/** Payload posted to POST /api/Employee. */
export interface CreateEmployeeDto {
  userId: number;
  role: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;   // ISO date "1990-05-14"
  gender?: string | null;

  department: string;
  jobTitle: string;
  hireDate: string;              // ISO date
  employmentType?: string | null;
  salary?: number | null;
  status: string;

  county?: string | null;
  town?: string | null;
  postalAddress?: string | null;
}

/** Response returned by the API after a successful create. */
export interface EmployeeDto extends CreateEmployeeDto {
  id: number;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  /** Adjust this if your .NET API runs on a different port. */
  private readonly baseUrl = 'http://localhost:5251/api';

  constructor(private http: HttpClient) {}

  /** Verify a user account exists before creating an employee for it. */
  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/User/${id}`);
  }

  /** Create a new employee linked to an existing user. */
  createEmployee(payload: CreateEmployeeDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(`${this.baseUrl}/Employee`, payload);
  }
}
