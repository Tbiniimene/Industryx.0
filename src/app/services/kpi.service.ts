
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Company } from '../Models/Company';
import { User } from '../Models/User';
import { Formula } from '../Models/Formula';
import { Kpi } from '../Models/Kpi';



@Injectable({
  providedIn: 'root'
})
export class KpiService {
  // Define API
  apiURL = 'http://localhost:8086/';


  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

constructor(private http: HttpClient) { }

/*========================================
  CRUD Methods for consuming RESTful API
=========================================*/


// HttpClient API get() method => Fetch kpi list
getAllKpis(): Observable<Object> {

    return this.http.get<Object>(this.apiURL + 'kpi')
        .pipe(
            retry(1),
            catchError(this.handleError)
        );
}

// HttpClient API get() method => Fetch Parameters list
getAllParams(): Observable<Object> {
    return this.http.get<Object>(this.apiURL + 'Parameters')
        .pipe(
            retry(1),
            catchError(this.handleError)
        );
}

// HttpClient API get() method => Fetch Unites list
getAllUnites(): Observable<Object> {
  return this.http.get<Object>(this.apiURL + 'Unites')
      .pipe(
          retry(1),
          catchError(this.handleError)
      );
}

// hey I changed this ?
// HttpClient API get() method => Fetch Operations list
getAllOps(): Observable<Object> {
  return this.http.get<Object>(this.apiURL + 'op')
      .pipe(
          retry(1),
          catchError(this.handleError)
      );
}

addCompany(name: string,
           fieldofwork: string,
           country: string,
           region: string,
           users: string,
           sensors: string): Observable<Company> {
    const cat = new Company();
    cat.name = name;
    cat.fieldofwork = fieldofwork;
    cat.country = country;
    cat.region = region;
    cat.users = users;
    cat.sensors = sensors;
    return this.http.post<Company>(this.apiURL + 'Company/addcompany', cat)
        .pipe(
            retry(1),
            catchError(this.handleError)
        );

}


addUser(username: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string): Observable<User> {
        const u = new User();
        u.userMinimalInformations = {firstName: '', lastName: ''};
        u.userPersonalInformations = {email: '', phone: ''};
        u.username = username;
        u.userMinimalInformations.firstName = firstName;
        u.userMinimalInformations.lastName = lastName;
        u.userPersonalInformations.email = email;
        u.userPersonalInformations.phone = phone;
        return this.http.post<User>(this.apiURL + 'user/createUser', u)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );

    }

    addUserToCompany(idu: string,
                     idc: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'user/affectUserToCompany/' + idu + '/' + idc, idu)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }

       addkpiToCompany(idk: string,
                       idc: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'kpi/affectkpitocompany/' + idk + '/' + idc, idk)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }


       addKpi(name: string
        ): Observable<Kpi> {
             const kpi = new Kpi();
             kpi.name = name;

             return this.http.post<Kpi>(this.apiURL + 'kpi/addkpi', kpi)
                 .pipe(
                     retry(1),
                     catchError(this.handleError)
                 );

         }

       addFormula(name: string
       ): Observable<Formula> {
            const formula = new Formula();
            formula.name = name;

            return this.http.post<Formula>(this.apiURL + 'formula/addformula', formula)
                .pipe(
                    retry(1),
                    catchError(this.handleError)
                );

        }

       addFormulaToKpi(idf: string,
                       idk: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'kpi/affectformulatokpi/' + idf + '/' + idk, idk)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }

       addParameterToFormula(idp: string,
                             idf: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'formula/addparamtoformula/' + idf + '/' + idp, idp)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }

       addUniteToFormula(idu: string,
                         idf: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'formula/addunitetoformula/' + idf + '/' + idu, idu)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }

       addOperationToFormula(ido: string,
                             idf: string,
       ): Observable<any> {

        return this.http.post<any>(this.apiURL + 'formula/addopstoformula/' + idf + '/' + ido, ido)
               .pipe(
                   retry(1),
                   catchError(this.handleError)
               );

       }







// Error handling
handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
    } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
}



}
