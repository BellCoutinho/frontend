import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { SpaceService } from '../../../../core/services/space.service';
import { User } from '../../../../core/models/auth.model';
import { SpaceInfo } from '../../../../core/models/space.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPass = control.get('new_password')?.value;
  const confirm = control.get('confirm_password')?.value;
  return newPass && confirm && newPass !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  spaceInfo: SpaceInfo | null = null;
  isAdmin = false;

  // Password change form
  passwordForm!: FormGroup;
  passwordLoading = false;
  passwordSuccess = '';
  passwordError = '';

  // Space edit form
  spaceForm!: FormGroup;
  spaceLoading = false;
  spaceSuccess = '';
  spaceError = '';
  spaceEditing = false;
  spaceLoadError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spaceService: SpaceService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';

    this.passwordForm = this.fb.group(
      {
        current_password: ['', [Validators.required, Validators.minLength(6)]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

    this.spaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      utility_unit_number: [''],
      storage_quota: [null, [Validators.min(0)]],
    });

    this.loadSpace();
  }

  loadSpace(): void {
    this.spaceService.getSpace().subscribe({
      next: (space) => {
        this.spaceInfo = space;
        this.spaceForm.patchValue({
          name: space.name,
          address: space.address,
          utility_unit_number: space.utility_unit_number,
          storage_quota: space.storage_quota,
        });
      },
      error: (err) => {
        this.spaceLoadError = 'Não foi possível carregar os dados do espaço.';
      },
    });
  }

  get userInitials(): string {
    const f = this.currentUser?.first_name?.[0] ?? '';
    const l = this.currentUser?.last_name?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  }

  get fullName(): string {
    const f = this.currentUser?.first_name ?? '';
    const l = this.currentUser?.last_name ?? '';
    return [f, l].filter(Boolean).join(' ') || 'Usuário';
  }

  get roleLabel(): string {
    const role = this.currentUser?.role ?? '';
    const map: Record<string, string> = {
      admin: 'Administrador',
      user: 'Usuário',
      manager: 'Gerente',
    };
    return map[role] || role;
  }

  // ── Password ──────────────────────────────────────────────
  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { current_password, new_password } = this.passwordForm.value;
    this.passwordLoading = true;
    this.passwordSuccess = '';
    this.passwordError = '';

    this.authService.changePassword(current_password, new_password).subscribe({
      next: () => {
        this.passwordLoading = false;
        this.passwordSuccess = 'Senha alterada com sucesso!';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordLoading = false;
        this.passwordError =
          err?.error?.detail || 'Erro ao alterar senha. Verifique a senha atual.';
      },
    });
  }

  // ── Space ─────────────────────────────────────────────────
  enableSpaceEdit(): void {
    this.spaceEditing = true;
    this.spaceSuccess = '';
    this.spaceError = '';
  }

  cancelSpaceEdit(): void {
    this.spaceEditing = false;
    if (this.spaceInfo) {
      this.spaceForm.patchValue({
        name: this.spaceInfo.name,
        address: this.spaceInfo.address,
        utility_unit_number: this.spaceInfo.utility_unit_number,
        storage_quota: this.spaceInfo.storage_quota,
      });
    }
  }

  onSaveSpace(): void {
    if (this.spaceForm.invalid) {
      this.spaceForm.markAllAsTouched();
      return;
    }
    this.spaceLoading = true;
    this.spaceSuccess = '';
    this.spaceError = '';

    this.spaceService.updateSpace(this.spaceForm.value).subscribe({
      next: (updated) => {
        this.spaceLoading = false;
        this.spaceInfo = updated;
        this.spaceEditing = false;
        this.spaceSuccess = 'Dados do espaço atualizados com sucesso!';
      },
      error: (err) => {
        this.spaceLoading = false;
        this.spaceError =
          err?.error?.detail || 'Erro ao atualizar dados do espaço.';
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  fieldError(form: FormGroup, field: string): string {
    const ctrl = form.get(field);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return '';
    if (ctrl.errors?.['required']) return 'Campo obrigatório.';
    if (ctrl.errors?.['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength;
      return `Mínimo de ${min} caracteres.`;
    }
    if (ctrl.errors?.['min']) return 'Valor deve ser maior ou igual a 0.';
    return 'Campo inválido.';
  }

  get passwordMismatch(): boolean {
    return (
      this.passwordForm.hasError('passwordMismatch') &&
      !!this.passwordForm.get('confirm_password')?.touched
    );
  }
}
