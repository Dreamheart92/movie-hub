import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SliceTextWithPeriods } from "../../../pipes/slice-text-with-periods.pipe";
import { MovieDetailsComponent } from "./details-page/movie-details/movie-details-page.component";
import { MoviesCategoriesComponent } from "./movies-categories/movies-categories";
import { SharedModule } from "../../shared/shared.module";
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { SafeUrlPipe } from "../../../pipes/safe-url.pipe";
import { TvShowDetailsPageComponent } from './details-page/tv-show-details-page/tv-show-details-page.component';
import { CatalogueComponent } from "./catalogue/catalogue.component";
import { DetailsPageComponent } from "./details-page/base-details-page/base-details-page.component";

@NgModule({
    declarations: [
        CatalogueComponent,
        DetailsPageComponent,
        MovieDetailsComponent,
        MoviesCategoriesComponent,
        TvShowDetailsPageComponent,
    ],
    providers: [],
    imports: [CommonModule, SharedModule, FormsModule, RouterModule, SliceTextWithPeriods, SafeUrlPipe],
    exports: [MovieDetailsComponent, MoviesCategoriesComponent, CatalogueComponent, MovieCardComponent],
})
export class MovieModule { }