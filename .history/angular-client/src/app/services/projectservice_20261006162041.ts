import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectDto {
  id?: number;
  projectName: string;
  clientName: string;
  startDate: string;        // ISO date string "2026-01-15"
  leadByEmpId: number;
  contactPerson?: string;
  contactNoProject?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  /** Change this if your API runs on a different port. */
  private readonly baseUrl = 'http://localhost:5215/api/Project';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: Omit<ProjectDto, 'id'>): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.baseUrl, payload);
  }

  update(id: number, payload: ProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
