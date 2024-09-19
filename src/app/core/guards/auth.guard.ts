import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
