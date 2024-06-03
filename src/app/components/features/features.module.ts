import { NgModule } from "@angular/core";
import { CommonModule, NgClass, NgIf } from "@angular/common";
import { LoadingDirective } from "../../directives/loading.directive";
import { HomeModule } from "./home/home.module";
import { MovieModule } from "./movie/movie.module";
import { SharedModule } from "../shared/shared.module";
import { CelebsCatalogueComponent } from "./celeb/celebs-catalogue/celebs-catalogue.component";
import { RouterModule } from "@angular/router";
import { CelebDetailsPageComponent } from './celeb/celeb-details-page/celeb-details-page.component';
import { FilmographyTableComponent } from './celeb/filmography-table/filmography-table.component';
import { ProfileComponent } from './profile/profile.component';
import { SliceTextWithPeriods } from "../../pipes/slice-text-with-periods.pipe";

@NgModule({
  declarations: [
    CelebsCatalogueComponent,
    CelebDetailsPageComponent,
    FilmographyTableComponent,
    ProfileComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    HomeModule,
    MovieModule,
    NgClass,
    LoadingDirective,
    SharedModule,
    RouterModule,
    SliceTextWithPeriods
  ],
  exports: []
})
export class FeaturesModule {
}
