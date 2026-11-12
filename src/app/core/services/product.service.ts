import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Product,
  ProductSearchParams,
  ProductSearchResponse,
  RegisterProductRequest,
  UpdateProductRequest,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  registerProduct(data: RegisterProductRequest): Observable<Product> {
    return this.http.post<any>(`${this.apiUrl}`, data).pipe(
      map((p: any) => ({
        ...p,
        id: p.id || p.product_id,
      }))
    );
  }

  searchProducts(params: ProductSearchParams): Observable<ProductSearchResponse> {
    let httpParams = new HttpParams().set('space_id', params.space_id);

    if (params.term)             httpParams = httpParams.set('term', params.term);
    if (params.category)         httpParams = httpParams.set('category', params.category);
    if (params.warranty_status)  httpParams = httpParams.set('warranty_status', params.warranty_status);
    if (params.min_value != null) httpParams = httpParams.set('min_value', String(params.min_value));
    if (params.max_value != null) httpParams = httpParams.set('max_value', String(params.max_value));
    if (params.sort_by)          httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order)       httpParams = httpParams.set('sort_order', params.sort_order);

    httpParams = httpParams
      .set('limit', String(params.limit ?? 50))
      .set('offset', String(params.offset ?? 0));

    return this.http.get<any>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          const items: Product[] = res.map((item: any) => ({
            ...item,
            id: item.id || item.product_id,
          }));
          return {
            items,
            total: items.length,
            limit: params.limit ?? 50,
            offset: params.offset ?? 0,
          };
        }
        const rawItems = res?.items || [];
        const items: Product[] = rawItems.map((item: any) => ({
          ...item,
          id: item.id || item.product_id,
        }));
        return {
          items,
          total: res?.total ?? items.length,
          limit: res?.limit ?? 50,
          offset: res?.offset ?? 0,
        };
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p: any) => ({
        ...p,
        id: p.id || p.product_id,
      }))
    );
  }

  updateProduct(id: string, data: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deactivateProduct(id: string, reason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/deactivate`, { reason });
  }
}
