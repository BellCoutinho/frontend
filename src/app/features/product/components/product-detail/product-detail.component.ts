import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Product, PRODUCT_CATEGORIES, WARRANTY_TYPES } from '../../../../core/models/product.model';
import { PdBadgeStatus } from '../../../../shared/components/podman';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  saving = false;
  deactivating = false;
  editing = false;
  errorMessage = '';
  successMessage = '';
  showDeactivateModal = false;
  deactivateReason = '';

  editForm!: FormGroup;
  categories = PRODUCT_CATEGORIES;
  warrantyTypes = WARRANTY_TYPES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  get categoryOptions() {
    return this.categories.map((c) => ({ value: c, label: c }));
  }

  get warrantyTypeOptions() {
    return [
      { value: '', label: 'Sem garantia / Não informada' },
      ...this.warrantyTypes.map((w) => ({ value: w, label: w })),
    ];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct(id);
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (p: any) => {
        this.loading = false;
        const normalized: Product = {
          ...p,
          id: p.id || p.product_id,
        };
        this.product = normalized;
        this.buildForm(normalized);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Produto não encontrado.';
      },
    });
  }

  buildForm(p: Product): void {
    this.editForm = this.fb.group({
      name: [p.name, [Validators.required, Validators.minLength(2)]],
      category: [p.category, Validators.required],
      brand: [p.brand, Validators.required],
      model: [p.model, Validators.required],
      location: [p.location, Validators.required],
      purchase_value: [p.purchase_value, [Validators.required, Validators.min(0)]],
      purchase_date: [p.purchase_date ?? ''],
      serial_number: [p.serial_number ?? ''],
      warranty_type: [p.warranty_type ?? ''],
      warranty_expiry: [p.warranty_expiry ?? ''],
      extended_warranty_expiry: [p.extended_warranty_expiry ?? ''],
    });
  }

  f(name: string) {
    return this.editForm.get(name)!;
  }

  getError(name: string): string {
    const ctrl = this.f(name);
    if (!ctrl || !ctrl.touched || ctrl.valid) return '';
    if (ctrl.errors?.['required']) return 'Campo obrigatório.';
    if (ctrl.errors?.['minlength']) {
      return `Mínimo de ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    }
    if (ctrl.errors?.['min']) return 'Valor não pode ser negativo.';
    return '';
  }

  startEdit(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    if (this.product) this.buildForm(this.product);
  }

  saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.errorMessage = '';

    const raw = { ...this.editForm.value };
    const payload: any = {};
    for (const key of Object.keys(raw)) {
      if (raw[key] !== '' && raw[key] !== null) payload[key] = raw[key];
    }

    this.productService.updateProduct(this.product!.id, payload).subscribe({
      next: (updated) => {
        this.saving = false;
        this.editing = false;
        this.product = updated;
        this.buildForm(updated);
        this.successMessage = 'Item atualizado com sucesso!';
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.detail ?? 'Erro ao atualizar.';
      },
    });
  }

  openDeactivate(): void {
    this.showDeactivateModal = true;
    this.deactivateReason = '';
  }

  closeDeactivate(): void {
    this.showDeactivateModal = false;
  }

  confirmDeactivate(): void {
    if (!this.deactivateReason.trim()) return;
    this.deactivating = true;
    this.productService.deactivateProduct(this.product!.id, this.deactivateReason).subscribe({
      next: () => {
        this.deactivating = false;
        this.showDeactivateModal = false;
        this.successMessage = 'Item desativado.';
        setTimeout(() => this.router.navigate(['/products']), 1200);
      },
      error: (err) => {
        this.deactivating = false;
        this.errorMessage = err?.error?.detail ?? 'Erro ao desativar.';
        this.showDeactivateModal = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getBadgeStatus(status?: string): PdBadgeStatus {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('ativa') || s === 'active' || s.includes('estendida')) return 'active';
    if (s.includes('expirando') || s === 'expiring_soon') return 'warning';
    if (s.includes('expirada') || s === 'expired') return 'expired';
    return 'neutral';
  }

  warrantyLabel(status?: string): string {
    const map: Record<string, string> = {
      active: 'Garantia Ativa',
      expiring_soon: 'Expirando em Breve',
      expired: 'Garantia Expirada',
      no_warranty: 'Sem Garantia',
    };
    return map[status ?? ''] ?? status ?? '—';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
