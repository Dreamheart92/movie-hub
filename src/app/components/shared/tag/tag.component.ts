import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {
  @Input() element!: {
    name: string,
    id: string,
    query: string,
    type: string
  }
  @Input() backgroundColor: string = '#f1c40f';
  @Input() textColor: string = 'black';

  get query() {
    return {
      [this.element.query]: this.element.id
    }
  }
}