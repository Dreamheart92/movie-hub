import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { LoadingDirective } from "../../../directives/loading.directive";
import { RouterModule } from "@angular/router";
import { MovieModule } from "../movie/movie.module";
import { SliceTextWithPeriods } from "../../../pipes/slice-text-with-periods.pipe";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [HomeComponent],
  providers: [LoadingDirective],
  imports: [CommonModule, FormsModule, MovieModule, SharedModule, LoadingDirective, RouterModule, SliceTextWithPeriods, MovieModule],
  exports: [HomeComponent]
})
export class HomeModule { }
