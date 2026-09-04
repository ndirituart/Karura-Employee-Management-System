import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //default imports for this component
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //1. Create an object that handles the form values for email and password.
  // This object will be used to bind the form inputs to the component's properties.
  loginObj: any =
  {
  email: '', //instead of username for security and authentication
  password: ''
    }
  //2. Create a function that handles the form submission when the user clicks the login button.
  router = inject(Router);

  onLogin() {
    //3. Temporary credentials for testing purposes. In a real application, you would validate the credentials against a backend service.
    if (this.loginObj.email === 'ndiritupatience002@gmail.com' && this.loginObj.password === '123456abj') {
      //4. Navigate to the dashboard page upon successful login.
      this.router.navigate(['/dashboard']);
    }
    else {
      //5. Display an error message if the credentials are invalid.
      alert('Invalid email or password. Please try again.');
    }
  }
}
