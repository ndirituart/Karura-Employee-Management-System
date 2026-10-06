import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';


export interface CreateEmployeeDto {
  userId: number;
  role: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;

  department: string;
  jobTitle: string;
  hireDate: string;
  employmentType?: string | null;
  salary?: number | null;
  status: string;

  county?: string | null;
  town?: string | null;
  postalAddress?: string | null;
}

export interface EmployeeDto extends CreateEmployeeDto {
  id: number;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class Employee {
  private readonly baseUrl = 'http://localhost:5215/api';

  constructor(private http: HttpClient) {}

  createEmployee(payload: CreateEmployeeDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(`${this.baseUrl}/Employee`, payload);
  }
}
