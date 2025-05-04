declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '731703224798-o6e8rptg7oav6pv96nfimtp9seodv5ml.apps.googleusercontent.com',
      ux_mode: 'popup',
      callback:(resp: any)=>{
        console.log(resp);
      }
      // callback: (resp: any) => this.handleLogin(resp)
    });
    google.accounts.id.renderButton(document.getElementById("google-sign-in-button"), {
      theme: 'filled_blue',
      size: 'medium',
      shape: 'rectangle',
      width: 200
    })
  }

  private decodeToken(token:string){
    return JSON.parse(atob(token.split(".")[1]))
  }
  handleLogin(response:any){
    if(response){
      
      const payLoad = this.decodeToken(response.credential);
      
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));

      
    }
  }

}
