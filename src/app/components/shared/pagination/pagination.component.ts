import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { QueryParamsService } from '../../../services/query-params.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() pages!: number;
  @Input() validPage: boolean = true;

  constructor(private queryService: QueryParamsService) { }

  nextPage() {
    if (this.pages !== undefined) {
      if (this.currentPage < this.pages) {
        this.currentPage++
        this.queryService.updateQuery({
          page: this.currentPage
        })
      }
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.queryService.updateQuery({
        page: this.currentPage
      })
    }
  }
}
