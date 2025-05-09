import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from './component/custom-input/custom-input.component';

@Component({
  selector: 'app-root',
  imports: [
    CustomInputComponent,
    CustomInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private fb = inject(NonNullableFormBuilder);

  title = 'customInputv2';

  option: string[] = ['option1', 'option2', 'option3'];

  form = this.fb.group({
    helmet: ['', Validators.required]
  });  

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('submitted', this.form.value);
    }
  }
}
