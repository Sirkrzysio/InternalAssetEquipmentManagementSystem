
// HAS ROLE DIRECTIVE - Conditional Rendering Based on User Role


import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly destroy$ = new Subject<void>();

  @Input() set appHasRole(roles: UserRole | UserRole[] | string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  @Input() appHasRoleElse?: TemplateRef<any>;

  private requiredRoles: (UserRole | string)[] = [];
  private hasView = false;

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const currentUser = this.authService.currentUser;
    let hasPermission = false;

    if (currentUser && this.requiredRoles.length > 0) {
      hasPermission = this.requiredRoles.some(role => {
        if (typeof role === 'string') {
          return currentUser.roleName === role || currentUser.role.toString() === role;
        }
        return currentUser.role === role;
      });
    }

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;

      if (this.appHasRoleElse) {
        this.viewContainer.createEmbeddedView(this.appHasRoleElse);
      }
    }
  }
}
