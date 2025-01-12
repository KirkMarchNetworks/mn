import { FormControl, FormGroup } from "@angular/forms";

export type ControlsOfType<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
                  ? FormGroup<ControlsOfType<T[K]>>
                  : FormControl<T[K]>;
};
