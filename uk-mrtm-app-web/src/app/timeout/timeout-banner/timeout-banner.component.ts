import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { takeUntil } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective } from '@netz/govuk-components';

import { SecondsToMinutesPipe } from '@shared/pipes';
import { TimeoutBannerService } from '@timeout/timeout-banner/timeout-banner.service';
import dialogPolyfill from 'dialog-polyfill';

@Component({
  selector: 'mrtm-timeout-banner',
  standalone: true,
  templateUrl: './timeout-banner.component.html',
  styleUrl: './timeout-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
  imports: [PageHeadingComponent, AsyncPipe, SecondsToMinutesPipe, ButtonDirective],
})
export class TimeoutBannerComponent implements AfterViewInit {
  private readonly document = inject<Document>(DOCUMENT);
  readonly timeoutBannerService = inject(TimeoutBannerService);
  private readonly renderer = inject(Renderer2);
  private readonly destroy$ = inject(DestroySubject);

  @Input() timeOffsetSeconds: number;
  @ViewChild('modal') readonly modal: ElementRef<HTMLDialogElement>;

  private overlayClass = 'govuk-timeout-warning-overlay';
  private lastFocusedElement = null;

  ngAfterViewInit(): void {
    if (typeof HTMLDialogElement?.prototype?.showModal !== 'function') {
      dialogPolyfill.registerDialog(this.modal.nativeElement);
    }

    this.timeoutBannerService.isVisible$.pipe(takeUntil(this.destroy$)).subscribe((isVisible) => {
      isVisible ? this.showDialog() : this.hideDialog();
    });
  }

  isDialogOpen(): boolean {
    return this.modal && this.modal.nativeElement.getAttribute('open') === '';
  }

  showDialog(): void {
    if (!this.isDialogOpen()) {
      this.renderer.addClass(this.document.body, this.overlayClass);
      this.saveLastFocusedElement();
      (<any>this.modal.nativeElement).showModal();
      this.modal.nativeElement.setAttribute('tabindex', '-1');
      this.modal.nativeElement.focus();
    }
  }

  hideDialog(): void {
    if (this.isDialogOpen()) {
      this.renderer.removeClass(this.document.body, this.overlayClass);
      this.modal.nativeElement.removeAttribute('tabindex');
      (<any>this.modal.nativeElement).close();
      this.setFocusOnLastFocusedElement();
    }
  }

  saveLastFocusedElement(): void {
    this.lastFocusedElement =
      this.document.activeElement && this.document.activeElement !== this.document.body
        ? this.document.activeElement
        : this.document.querySelector(':focus');
  }

  setFocusOnLastFocusedElement(): void {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  continue(): void {
    this.timeoutBannerService.extendSession();
  }

  signOut(): void {
    this.timeoutBannerService.signOut();
  }
}
