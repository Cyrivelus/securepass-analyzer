import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({ ... })
export class AppComponent {
  analysis: any = null;
  loading = false;

  constructor(private http: HttpClient) {}

  onVerify(password: string) {
    if (!password) return;
    this.loading = true;

    this.http.post('/api/analyze', { pass: password })
      .subscribe({
        next: (data) => {
          this.analysis = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }
}
