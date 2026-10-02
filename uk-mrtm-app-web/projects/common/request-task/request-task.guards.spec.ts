import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { lastValueFrom, Observable, of, throwError } from 'rxjs';

import { RequestActionsService, RequestItemsService, TasksService } from '@mrtm/api';

import { ErrorCodes, taskViewNotFoundError } from '@netz/common/error';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteSnapshotStub, expectBusinessErrorToBe, mockClass } from '@netz/common/testing';

import { Mocked } from 'vitest';

import { getRequestTaskPageDefaultCanActivateGuard } from './request-task.guards';
import { REQUEST_TASK_IS_EDITABLE_RESOLVER } from './request-task.providers';
import { mockRequestTask } from './testing';

describe('getRequestTaskPageDefaultCanActivateGuard', () => {
  let router: Router;
  let store: RequestTaskStore;
  let tasksService: Mocked<TasksService>;
  let requestActionsService: Mocked<RequestActionsService>;
  let requestItemsService: Mocked<RequestItemsService>;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      getRequestTaskPageDefaultCanActivateGuard()(
        new ActivatedRouteSnapshotStub({ taskId: '2' }) as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    ) as Observable<boolean | UrlTree>;

  beforeEach(() => {
    tasksService = mockClass(TasksService);
    requestActionsService = mockClass(RequestActionsService);
    requestItemsService = mockClass(RequestItemsService);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TasksService, useValue: tasksService },
        { provide: RequestActionsService, useValue: requestActionsService },
        { provide: RequestItemsService, useValue: requestItemsService },
        { provide: REQUEST_TASK_IS_EDITABLE_RESOLVER, useValue: () => true },
      ],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(RequestTaskStore);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should load the task into the store and allow access', async () => {
    const requestTaskItem = { ...mockRequestTask.requestTaskItem, requestInfo: { id: 'MAR00001' } };
    tasksService.getTaskItemInfoById.mockReturnValue(of(requestTaskItem) as any);
    requestActionsService.getRequestActionsByRequestId.mockReturnValue(of([]) as any);
    requestItemsService.getItemsByRequest.mockReturnValue(of({ items: [] }) as any);

    await expect(lastValueFrom(runGuard())).resolves.toBe(true);

    expect(tasksService.getTaskItemInfoById).toHaveBeenCalledWith(2);
    expect(store.state.requestTaskItem).toEqual(requestTaskItem);
  });

  it('should show the business error page when the task no longer exists', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    tasksService.getTaskItemInfoById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { code: ErrorCodes.NOTFOUND1001 } })),
    );

    await expect(lastValueFrom(runGuard(), { defaultValue: 'cancelled' })).resolves.toBe('cancelled');

    await expectBusinessErrorToBe(taskViewNotFoundError);
    expect(router.navigate).toHaveBeenCalledWith(['/error/business'], {
      state: { forceNavigation: true },
      skipLocationChange: true,
    });
    expect(requestActionsService.getRequestActionsByRequestId).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should redirect to the dashboard on any other error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    tasksService.getTaskItemInfoById.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 400 })));

    const result = await lastValueFrom(runGuard());

    expect(router.serializeUrl(result as UrlTree)).toBe('/dashboard');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
