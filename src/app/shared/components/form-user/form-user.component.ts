import { Component, OnDestroy, OnInit, Output } from '@angular/core';
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
  public currentUser: User | null = null;
  public isEditMode = false;
  private unsubscribe$ = new Subject<void>();

  public myForm: FormGroup = this.fb.group({
    id: [""],
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


  get isEmailValid(): boolean {
    return this.myForm.get('email')?.valid as boolean;
  };


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
    this.crudService.getCountries()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((countries => {
        this.countries = countries;
      }))
  };


  getUsers(): void {
    this.crudService.getUsers()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users) => {
        this.users = users;
      });
  };


  getUserToEdit(user: User): void {
    this.isEditMode = true;
    this.currentUser = user;
    this.myForm.patchValue(user);
  };


  onSave(): void {
    if (this.isEditMode) {
      this.updateUser(this.myForm.value as User);

    } else {
      this.addUser(this.myForm.value as User);
    };
  };


  updateUser(user: User): void {
    this.crudService.updateUser(user)
      .pipe(
        switchMap((_) => this.crudService.getUsers()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users) => {
        this.users = users;
        this.myForm.reset();
        this.currentUser = null;
        this.isEditMode = false;
      });
  };


  addUser(user: User): void {
    this.crudService.addUser(user)
      .pipe(
        switchMap((_) => this.crudService.getUsers()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users) => {
        this.users = users;
        this.myForm.reset();
      });
  };


  isFieldValid(field: string) {
    return this.validatorsService.isFieldValid(this.myForm, field);
  };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}