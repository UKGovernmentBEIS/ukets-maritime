import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reviewSubtaskTitle',
})
export class ReviewSubtaskTitlePipe implements PipeTransform {
  transform(value: string): string {
    return `Review ${value.charAt(0).toLowerCase() + value.slice(1)}`;
  }
}
