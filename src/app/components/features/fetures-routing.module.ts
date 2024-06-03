import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { moviesResolver } from "../../resolvers/movies.resolver";
import { HomeComponent } from "./home/home.component";
import { MovieDetailsComponent } from "./movie/details-page/movie-details/movie-details-page.component";
import { movieResolver } from "../../resolvers/movie.resolver";
import { tvShowResolver } from "../../resolvers/tv-show.resolver";
import { TvShowDetailsPageComponent } from "./movie/details-page/tv-show-details-page/tv-show-details-page.component";
import { CatalogueComponent } from "./movie/catalogue/catalogue.component";
import { CelebsCatalogueComponent } from "./celeb/celebs-catalogue/celebs-catalogue.component";
import { CelebDetailsPageComponent } from "./celeb/celeb-details-page/celeb-details-page.component";
import { celebDetailsPageResolver } from "../../resolvers/celeb-details-page.resolver";
import { ProfileComponent } from "./profile/profile.component";
import { profileResolver } from "../../resolvers/profile.resolver";

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    component: HomeComponent,
    resolve: { data: moviesResolver }
  },
  {
    path: 'movie/details/:id',
    component: MovieDetailsComponent,
    resolve: { data: movieResolver }
  },
  {
    path: 'tv/details/:id',
    component: TvShowDetailsPageComponent,
    resolve: { data: tvShowResolver }
  },
  {
    path: 'browse/celebs/list',
    component: CelebsCatalogueComponent,
  },
  {
    path: 'celebs/details/:id',
    component: CelebDetailsPageComponent,
    resolve: { details: celebDetailsPageResolver }
  },
  {
    path: 'browse/:type/:endpoint',
    component: CatalogueComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    resolve: { user: profileResolver }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {
}
