import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../services/validators/email-validator.service';
import { ValidatorsService } from '../../services/validators/validators.service';
import { FormService } from '../../services/form.service';
import { User } from '../../interfaces/user.interface';
import { Country } from '../../interfaces/country.interface';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})


export class FormUserComponent implements OnInit {

  public countries: Country[] = [];
  public currentUser!: User ;
  public selectedUser: User | null = null;  

  getCountryData() {
    if(this.countries.length === 0 ) {
      console.log("get countries")
      this.formService.getCountries().subscribe((response => {
        this.countries = response
      }))
    };
  };
  
 
  constructor( 
    private fb:FormBuilder,
    private emailValidator: EmailValidator,
    private validatorsService: ValidatorsService,
    private formService: FormService
  ){}
  
  
  ngOnInit(): void {
    this.getCountryData()
    
    this.formService.getSelectedUserObservable().subscribe((user) => {
      this.selectedUser = user;
        
      this.myForm.reset(this.selectedUser)
    });
  }


  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.validatorsService.firstNameAndLastnamePattern)]],
    password:['', [Validators.required, Validators.minLength(6)]],
    password2:['', [Validators.required]],
    email:['',[Validators.required], [this.emailValidator]],
    subscribed: [false],
    country:['',Validators.required],
    city:['', Validators.required]
  },{
    validators:[
      this.validatorsService.isFieldOneEqualFieldTwo('password','password2')
    ]
  });


  isValidField( field: string ) {
    return this.validatorsService.isValidField(this.myForm, field)
  };
  

  updateCurrentUser(): void {
    this.currentUser = this.myForm.value as User;

    if(this.selectedUser) {
      this.currentUser.id = this.selectedUser.id
    }
  };


  onSave(): void {
    if (this.myForm.invalid) return;
    
    this.updateCurrentUser()

    if(this.selectedUser) {
      
      this.formService.updateUser(this.currentUser)
        .subscribe(response =>console.log("updated user", response))

      this.myForm.reset()
      this.selectedUser = null;

    } else {
      this.formService.addUser(this.currentUser)
        .subscribe(response => console.log(response))
  
      this.myForm.reset()
    }
  };

}


  
