import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {

  constructor(private router: Router, private route: ActivatedRoute) { }

  updateQuery(query: Object) {

    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: query,
        queryParamsHandling: 'merge'
      })
  }
}