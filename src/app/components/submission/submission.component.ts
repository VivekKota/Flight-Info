// submission.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  status: 'success' | 'failure' = 'success';
  successMessage: string = 'Your submission has been received.';
  failureMessage: string = 'An error occurred while submitting the form.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.status = params['status'] as 'success' | 'failure';
      if (params['message']) {
        this.failureMessage = params['message'];
      }
      console.log('status', this.status, 'Message', this.failureMessage);
      this.showMessage();
    });
  }

  showMessage(): void {
    const successMessage = document.getElementById('success-message');
    const failureMessage = document.getElementById('failure-message');
    if (successMessage && failureMessage) {
      // Hide both messages first
      successMessage.style.display = 'none';
      failureMessage.style.display = 'none';

      // Show the relevant message based on status
      if (this.status === 'success') {
        successMessage.style.display = 'block';
      } else if (this.status === 'failure') {
        failureMessage.style.display = 'block';
      }
    }
  }
}
