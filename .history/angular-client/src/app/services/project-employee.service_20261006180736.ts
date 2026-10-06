import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectEmployeeDto {
  empProjectId?: number;         // server-assigned primary key
  projectId: number;
  empId: number;
  assignedDate: string;          // ISO "2026-01-15"
  roleProjectEmployee: string;
  isActive: boolean;
}

export interface CreateProjectEmployeeDto {
  projectId: number;
  empId: number;
  assignedDate: string;
  roleProjectEmployee: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectEmployeeService {
  private readonly baseUrl = 'http://localhost:5215/api/ProjectEmployee';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectEmployeeDto[]> {
    return this.http.get<ProjectEmployeeDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<ProjectEmployeeDto> {
    return this.http.get<ProjectEmployeeDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateProjectEmployeeDto): Observable<ProjectEmployeeDto> {
    return this.http.post<ProjectEmployeeDto>(this.baseUrl, payload);
  }

  update(id: number, payload: ProjectEmployeeDto): Observable<ProjectEmployeeDto> {
    return this.http.put<ProjectEmployeeDto>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}