import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, delay, of } from "rxjs";

@Injectable({ providedIn:'root' })
export class EmailValidator implements AsyncValidator {

    public emailPattern: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;

    validate( control: AbstractControl ): Observable<ValidationErrors | null> {
        const email = control.value;
        const valid = this.emailPattern.test(email);
        
        if (valid) {
            return of(null); // Correo electrónico válido, no hay error
        } else {
            return of({ invalidEmail: true }); // Correo electrónico inválido, se genera el error
        }
    };

}