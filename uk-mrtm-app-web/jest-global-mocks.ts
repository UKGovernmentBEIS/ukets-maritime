import { jest } from '@jest/globals';

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: jest.fn(),
});

HTMLCanvasElement.prototype.getContext = jest.fn() as typeof HTMLCanvasElement.prototype.getContext;
HTMLDialogElement.prototype.show = jest.fn(function () {
  this.open = true;
});
HTMLDialogElement.prototype.close = jest.fn(function () {
  this.open = false;
});
HTMLDialogElement.prototype.showModal = HTMLDialogElement.prototype.show;
