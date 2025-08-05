import { ValidationErrors } from '@angular/forms';

export interface SubmissionError {
  control: string;
  validationErrors: ValidationErrors;
}
