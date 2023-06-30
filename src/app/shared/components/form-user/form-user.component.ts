import { Component, OnInit } from '@angular/core';
import { countries } from './countries/countries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../services/validators/email-validator.service';
import { ValidatorsService } from '../../services/validators/validators.service';
import { FormService } from '../../services/form.service';
import { User } from '../../interfaces/user.interface';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit{

  public countries = countries;

  public selectedUser: User | null = null;  //borrar
 
  constructor( 
    private fb:FormBuilder,
    private emailValidator: EmailValidator,
    private validatorsService: ValidatorsService,
    private formService: FormService
  ){}
  
    ngOnInit(): void {

      this.selectedUser = this.formService.getSelectedUser();
      
      this.formService.getSelectedUserUpdated().subscribe((user) => {
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

  isValidField( field:string) {
    return this.validatorsService.isValidField(this.myForm, field)
  }

  //Crear datos del usuario 
  get currentUser():User{
    const currentUser = this.myForm.value as User;
    return currentUser;
  }

  //Añadir usuario
  onSave():void {
    if (this.myForm.invalid) return;

    if(this.selectedUser) {
      this.formService.updateUser(this.selectedUser)
        .subscribe(response =>console.log("usuario actualizado", response))

        this.myForm.reset()

       
    } else {
      this.formService.addUser(this.currentUser)
      .subscribe(response => console.log(response))
  
      this.myForm.reset()
    }

    
    }



  }


  
