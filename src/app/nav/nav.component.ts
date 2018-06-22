import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {AlertifyService} from '../_services/alertify.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  username: String;

  constructor(protected authService: AuthService,
              private alertify: AlertifyService,
              private jwtHelpersService: JwtHelperService,
              private router: Router
  ) {
  }

  ngOnInit() {
    if (this.jwtHelpersService.decodeToken() != null) {
      this.username = this.jwtHelpersService.decodeToken(this.authService.userToken).unique_name;
    }
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      this.alertify.success('logged in successfully: ');
    }, err => {
      if (!err.error) {
        this.alertify.error(err.statusText);
      }
      if (err.error) {
        this.alertify.error(err.error);
      }
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
