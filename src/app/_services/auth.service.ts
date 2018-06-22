import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/internal/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {tokenGetter} from '../app.module';

@Injectable()

export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
  }

  register(model: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', model);
  }

  login(model: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login', model)
      .pipe(
        map(res => {
          const user = res;
          if (user) {
            localStorage.setItem('token', user.tokenString);
            this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
            this.userToken = user.tokenString;
          }
        })
      )
      .pipe(
        catchError(this.handleError('login user failed', {})
        )
      );
  }

  isLoggedIn() {
    const refreshToken = tokenGetter();
    return !this.jwtHelper.isTokenExpired(refreshToken);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error('error logged', error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // console.log(`${operation} failed: ${error.message}`);
      // console.log('Result tried: ', result);

      // Let the app keep running by returning an empty result.
      return throwError(error);
    };
  }
}
