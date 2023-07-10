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
  public users: User[] = [];
  public newUser!: User;
  public userToEdit: User | null = null;
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

  get isEmailValid():boolean  {
    return (this.myForm.get('email')?.hasError('emailExists') || this.myForm.get('email')?.valid) as boolean;
  }

  constructor(
    private fb: FormBuilder,
    private emailValidator: EmailValidator,
    private validatorsService: ValidatorsService,
    private crudService: CrudService
  ) { };


  ngOnInit(): void {
    this.getCountryData();
    this.getUsers();
  };

  
  getCountryData() {
    if (this.countries.length === 0) {
      console.log("get countries")   //PONER DESUSCRIPCION
      this.crudService.getCountries().subscribe((countries => {
        this.countries = countries;
      }))
    };
  };


  getUsers(): void {
    this.crudService.getUsers()
      .subscribe(users => {
        this.users = users;
      }
      );
  };


  createUser() {
    this.newUser = this.myForm.value as User;
  };


  getEditedUser(user: User) {  
    this.userToEdit = user;
    this.myForm.patchValue(user);
  };


  setEditUser() {
    this.userToEdit = { ...this.userToEdit, ...this.myForm.value, id: this.userToEdit?.id };
  };


  onSave(): void {
    if (this.myForm.invalid) return;  //poner en el html con el ngif

    if (this.userToEdit) {
      this.setEditUser();

      this.crudService.updateUser(this.userToEdit)
        .pipe(
          switchMap((_) => this.crudService.getUsers()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((users) => {
          this.users = users;
        });

      this.myForm.reset();
      this.userToEdit = null;

    } else {

      this.createUser();
      this.crudService.addUser(this.newUser)
        .pipe(
          switchMap((_) => this.crudService.getUsers()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((users) => {
          this.users = users
          this.myForm.reset();

        });

    };
  };


  isFieldValid(field: string) {
    return this.validatorsService.isFieldValid(this.myForm, field);
  };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}







