import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //default imports for this component
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginObj: any =
  {
  email: '', //instead of username for security and authentication
  password: ''
  }
}
