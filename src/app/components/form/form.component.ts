import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  flightForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      flightNumber: ['', Validators.required],
      numOfGuests: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    (document.getElementById('arrivalDate') as HTMLInputElement).setAttribute(
      'min',
      today
    );
  }

  onSubmit() {
    if (this.flightForm.valid) {
      const payload = {
        ...this.flightForm.value,
        numOfGuests: parseInt(this.flightForm.value.numOfGuests, 10),
      };

      console.log('Sending payload:', payload);

      this.apiService.submitFlightInfo(payload).subscribe({
        next: (response) => {
          console.log('Form submitted successfully', response);
          this.router.navigate(['/submission'], {
            queryParams: { status: 'success' },
          });
        },
        error: (error) => {
          console.error('Error submitting form', error);
          let errorMessage = 'An unknown error occurred';
          if (error.status === 0) {
            errorMessage = 'Unable to reach the server';
          } else if (error.status === 401) {
            errorMessage =
              'Authentication failed. Please check your credentials.';
          } else if (error.status === 404) {
            errorMessage =
              'The requested resource was not found. Please check the URL.';
          }
          this.router.navigate(['/submission'], {
            queryParams: { status: 'failure', message: errorMessage },
          });
        },
      });
    } else {
      alert('Please fill all the required fields');
      Object.values(this.flightForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}
