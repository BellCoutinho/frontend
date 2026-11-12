import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Product, PRODUCT_CATEGORIES } from '../../../../core/models/product.model';
import { PdBadgeStatus } from '../../../../shared/components/podman';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  total = 0;
  loading = false;
  errorMessage = '';

  categories = PRODUCT_CATEGORIES;
  warrantyStatuses = [
    { value: '', label: 'Todas garantias' },
    { value: 'active', label: 'Ativa' },
    { value: 'expiring_soon', label: 'Expirando em breve' },
    { value: 'expired', label: 'Expirada' },
    { value: 'no_warranty', label: 'Sem garantia' },
  ];

  filters = new FormGroup({
    term: new FormControl(''),
    category: new FormControl(''),
    warranty_status: new FormControl(''),
  });

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  get categoryOptions() {
    return [
      { value: '', label: 'Todas categorias' },
      ...this.categories.map((c) => ({ value: c, label: c })),
    ];
  }

  ngOnInit(): void {
    this.loadProducts();

    this.filters.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    const spaceId = this.authService.getSpaceId();
    if (!spaceId) {
      this.loading = true;
      this.authService.fetchProfile().subscribe((user) => {
        if (user?.space_id) {
          this.loadProducts();
        } else {
          this.loading = false;
        }
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { term, category, warranty_status } = this.filters.value;

    this.productService.searchProducts({
      space_id: spaceId,
      term: term || undefined,
      category: category || undefined,
      warranty_status: warranty_status || undefined,
      limit: 50,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.products = res?.items ?? [];
        this.total = res?.total ?? this.products.length;
      },
      error: (err) => {
        this.loading = false;
        this.products = [];
        this.errorMessage = err?.error?.detail ?? 'Erro ao carregar itens.';
      },
    });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/products', id]);
  }

  goToNew(): void {
    this.router.navigate(['/products/new']);
  }

  clearFilters(): void {
    this.filters.reset({ term: '', category: '', warranty_status: '' });
  }

  getBadgeStatus(status?: string): PdBadgeStatus {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('ativa') || s === 'active') return 'active';
    if (s.includes('estendida')) return 'active';
    if (s.includes('expirando') || s === 'expiring_soon') return 'warning';
    if (s.includes('expirada') || s === 'expired') return 'expired';
    return 'neutral';
  }

  warrantyLabel(status?: string): string {
    const map: Record<string, string> = {
      active: 'Ativa',
      expiring_soon: 'Expirando',
      expired: 'Expirada',
      no_warranty: 'Sem garantia',
    };
    return map[status ?? ''] ?? status ?? '—';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}
