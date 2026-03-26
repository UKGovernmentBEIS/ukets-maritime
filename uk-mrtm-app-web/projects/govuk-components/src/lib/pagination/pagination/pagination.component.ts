import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { distinctUntilChanged, map, tap } from 'rxjs';

@Component({
  selector: 'govuk-pagination',
  imports: [AsyncPipe, RouterLink],
  standalone: true,
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  readonly route = inject(ActivatedRoute);

  readonly fragment = input<string>();
  readonly pageSize = input.required<number>();
  readonly count = input.required<number>();
  readonly hideResultCount = input(false);
  readonly hideNumbers = input(false);

  readonly currentPageChange = output<number>();

  totalPages = 1;
  pageNumbers = [1];

  currentPage$ = this.route.queryParamMap.pipe(
    map((res) => Number(res.get('page') || 1)),
    distinctUntilChanged(),
    tap((page) => this.currentPageChange.emit(page)),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.count || changes?.pageSize) {
      this.calculatePageCount();
    }
  }

  private calculatePageCount(): void {
    this.totalPages = Math.ceil((this.count() || 1) / (this.pageSize() || 1));
    this.pageNumbers = Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  isDisplayed(target: number, current: number): boolean {
    return this.pageNumbers.length <= 6 || (target >= current - 1 && target <= current + 1);
  }

  isDots(target: number, current: number): boolean {
    return (
      this.pageNumbers.length > 6 &&
      target !== 1 &&
      target !== this.totalPages &&
      (target === current - 2 || target === current + 2)
    );
  }
}
