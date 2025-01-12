import {Type} from "@angular/core";

export interface TableauFilterInterface {
  showDefault: boolean;
  topComponent?: Type<any>;
  bottomComponent?: Type<any>;
}
