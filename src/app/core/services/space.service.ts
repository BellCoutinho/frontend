import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpaceInfo, UpdateSpaceRequest } from '../models/space.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  private readonly apiUrl = `${environment.apiUrl}/space`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSpace(): Observable<SpaceInfo> {
    return this.http.get<SpaceInfo>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateSpace(data: UpdateSpaceRequest): Observable<SpaceInfo> {
    return this.http.put<SpaceInfo>(this.apiUrl, data, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
