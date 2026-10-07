import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectDto {
  projectId?: number;
  projectName: string;
  clientName: string;
  startDate: string;             // ISO date
  leadByEmpId?: number | null;
  contactPerson?: string | null;
  contactNoProject?: string | null;
  status?: string;               // "Active" | "Completed" | "Suspended"
  budget?: number | null;
  createdDate?: string;
  updatedDate?: string | null;
  deletedDate?: string | null;
  isDeleted?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  /** Change this if your API runs on a different port. */
  private readonly baseUrl = 'http://localhost:5251/api/Project';

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
