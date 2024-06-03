import { Component, EventEmitter, Input, Renderer2 } from '@angular/core';
import { QueryParamsService } from '../../../services/query-params.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent<T extends { selected?: boolean, id?: string, name?: string,url?: string }> {
  @Input() elements: T[] = [];
  @Input() elementType: string = '';
  @Input() oneOptionOnly: boolean = false;

  baseElementCount: number = 5;
  isFiltersShown: boolean = false;

  constructor(private queryService: QueryParamsService) { }

  showMore() {
    this.isFiltersShown = !this.isFiltersShown;

    if (this.baseElementCount === 5) {
      this.baseElementCount = this.elements.length;
    } else {
      this.baseElementCount = 5;
    }
  }

  selectFilter(selectedElement: T) {
    const findElement = this.elements.find(element => selectedElement === element);

    if (findElement !== undefined) {
      findElement.selected = !findElement.selected;
      if (this.oneOptionOnly) {
        this.resetOtherOptions(findElement)
      }
      const selectedFilters = this.elements.filter(element => element.selected);
      const queryParams = selectedFilters.map(element => element.id);

      this.queryService.updateQuery({
        [this.elementType]: queryParams.join('+')
      });
    }
  }

  sortElementsBySelected() {
    this.elements = this.elements.sort((a, b) => {
      return (b.selected as any) - (a.selected as any);
    })
  }

  resetFilter() {
    this.elements.forEach(element => element.selected = false);
  }

  resetOtherOptions(findElement: T) {
    this.elements.forEach(element => {
      if (element.id !== findElement?.id) {
        element.selected = false;
      }
    });
  }
}
