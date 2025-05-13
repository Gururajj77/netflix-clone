declare var google: any;
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private googleScriptLoaded = false;

  ngOnInit(): void {
    // Check if Google API is loaded, otherwise load it
    if (window.hasOwnProperty('google')) {
      this.googleScriptLoaded = true;
      this.initializeGoogleSignIn();
    } else {
      this.loadGoogleScript();
    }
  }

  ngAfterViewInit(): void {
    // Additional safety to ensure the button is rendered after view init
    if (this.googleScriptLoaded) {
      this.initializeGoogleSignIn();
    }
  }

  loadGoogleScript(): void {
    // Create script element if needed
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.googleScriptLoaded = true;
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id:
          '731703224798-o6e8rptg7oav6pv96nfimtp9seodv5ml.apps.googleusercontent.com',
        ux_mode: 'popup',
        callback: (resp: any) => this.handleLogin(resp),
      });

      // Make sure the DOM element exists before rendering
      const buttonElement = document.getElementById('google-sign-in-button');
      if (buttonElement) {
        google.accounts.id.renderButton(buttonElement, {
          theme: 'filled_blue',
          size: 'medium',
          shape: 'rectangle',
          width: 200,
        });
      } else {
        console.error('Google sign-in button element not found');
      }
    } else {
      console.error('Google API not loaded properly');
    }
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleLogin(response: any) {
    if (response) {
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));
      this.router.navigate(['/browse']);
    }
  }
}
