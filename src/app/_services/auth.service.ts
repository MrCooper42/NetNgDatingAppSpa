import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/internal/operators';

@Injectable()

export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;

  constructor(private http: HttpClient) {
  }

  register(model: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', model)
      .pipe(
        catchError(this.handleError('addHero', {})
        )
      );
  }

  login(model: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login', model)
      .pipe(
        map(res => {
          const user = res;
          if (user) {
            localStorage.setItem('token', user.tokenString);
            this.userToken = user.tokenString;
          }
        })
      )
      .pipe(
        catchError(this.handleError('addHero', {})
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      console.log('Result tried: ', result);

      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  }
}
