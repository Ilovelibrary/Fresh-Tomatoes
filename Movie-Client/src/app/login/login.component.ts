import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username: '', password: ''};
  errMess: string;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log("User: ", this.user);
    this.authService.logIn(this.user)
      .subscribe(res => {
        if (res.success) {
          this.dialogRef.close(res.success);          
        }
        else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
        this.errMess = error
      })
  }
  goSignup() {
    let loginRef = this.dialog.open(SignupComponent, {width: '500px', height: '450px'});

    loginRef.afterClosed()
      .subscribe(result => {
        console.log(result);
      });
  }

}