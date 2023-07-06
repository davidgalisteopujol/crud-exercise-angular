import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../services/validators/email-validator.service';
import { ValidatorsService } from '../../services/validators/validators.service';
import { CrudService } from '../../services/crud.service';
import { User } from '../../interfaces/user.interface';
import { Country } from '../../interfaces/country.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit, OnDestroy {

  public countries: Country[] = [];
  public newUser!: User;
  public selectedUser: User | null = null;
  private unsubscribe$ = new Subject<void>();

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.validatorsService.firstNameAndLastnamePattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]],
    email: ['', [Validators.required], [this.emailValidator]],
    subscribed: [false],
    country: ['', [Validators.required]],
    city: ['', Validators.required]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'password2')
    ]
  });

  

  constructor(
    private fb: FormBuilder,
    private emailValidator: EmailValidator,
    private validatorsService: ValidatorsService,
    private crudService: CrudService
  ) { };



  ngOnInit(): void {
    this.getCountryData();
  }


  isFieldValid(field: string) {
    return this.validatorsService.isFieldValid(this.myForm, field);
  };


  getCountryData() {
    if (this.countries.length === 0) {
      console.log("get countries")
      this.crudService.getCountries().subscribe((response => {
        this.countries = response;
      }))
    };
  };


  createUser() {
    this.newUser = this.myForm.value as User;
  };


  getEditUser(user: User) {
    this.selectedUser = user;
    this.myForm.patchValue(user);
  };


  setEditUser() {
    this.selectedUser = { ...this.selectedUser, ...this.myForm.value, id: this.selectedUser?.id };

  };


  onSave(): void {
    if (this.myForm.invalid) return;

    if (this.selectedUser) {
      this.setEditUser();

      this.crudService.updateUser(this.selectedUser)
        .pipe(
          switchMap((_) => this.crudService.getUsers()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((users) => {
          console.log(users);
        });

      this.myForm.reset();
      this.selectedUser = null;

    } else {

      this.createUser();
      this.crudService.addUser(this.newUser)
        .pipe(
          switchMap((_) => this.crudService.getUsers()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((users) => {
          console.log(users);
        });

      this.myForm.reset();
    };

  };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}



