import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

export class FormUtils {
  /**
   * Detects and returns the keys (no duplicates) of all dirty form controls inside a form.
   *
   * @static
   * @param {FormGroup} form the form
   * @return {*}  {string[]} the keys of the dirty form controls
   */
  static findDirtyControlsKeys(form: FormGroup): string[] {
    const dirtyControlsKeys: Set<string> = new Set();

    const findRecursively = (control: AbstractControl, controlKey?: string) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        Object.keys(control.controls).forEach((key) => {
          const childControl = control.controls[key];
          findRecursively(childControl, key);
        });
      } else if (control.dirty) {
        dirtyControlsKeys.add(controlKey);
      }
    };

    findRecursively(form);
    return [...dirtyControlsKeys];
  }

  /**
   * Enhances a FormControl control with valueChanges by debouncing and filtering distinct values, even deeply nested.
   * Use it with FormControls that require reactivity and/or trigger actions (i.e. an api call)
   */
  static debounceDistinct(control: AbstractControl<any, any>, debounceInMs = 200) {
    return control.valueChanges.pipe(
      startWith(control.value),
      debounceTime(debounceInMs),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }
}
