import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {UsersService} from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UsersService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];

    if (this.userService.hasRole(expectedRole)) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
