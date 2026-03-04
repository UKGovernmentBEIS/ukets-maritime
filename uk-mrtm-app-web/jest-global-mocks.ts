import { jest } from '@jest/globals';

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
  configurable: true,
});

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: '',
  writable: true,
  enumerable: true,
  configurable: true,
});

// Polyfill Modern Browser APIs
window.structuredClone = window.structuredClone || jest.fn((val: unknown) => JSON.parse(JSON.stringify(val)));

Object.assign(HTMLElement.prototype, {
  scrollIntoView: jest.fn(),
});

Object.assign(HTMLCanvasElement.prototype, {
  getContext: jest.fn(),
});

const mockShow = jest.fn(function (this: HTMLDialogElement) {
  this.open = true;
});

const mockClose = jest.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

Object.defineProperties(HTMLDialogElement.prototype, {
  show: { value: mockShow, writable: true },
  showModal: { value: mockShow, writable: true },
  close: { value: mockClose, writable: true },
});
