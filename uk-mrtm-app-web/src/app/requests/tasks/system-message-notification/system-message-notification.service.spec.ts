import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SystemMessageNotificationService } from '@requests/tasks/system-message-notification/system-message-notification.service';

describe('SystemMessageNotificationService', () => {
  let service: SystemMessageNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SystemMessageNotificationService],
    });
    service = TestBed.inject(SystemMessageNotificationService);
  });

  it('should return empty array if messageText is empty', () => {
    expect(service.parseMessage('')).toEqual([]);
    expect(service.parseMessage(null as any)).toEqual([]);
    expect(service.parseMessage(undefined as any)).toEqual([]);
  });

  it('should return plain text if no links are present', () => {
    const result = service.parseMessage('Hello world');
    expect(result).toEqual([{ text: 'Hello world' }]);
  });

  it('should convert JSON params to correct route (ACCOUNT_USERS_SETUP)', () => {
    const msg = 'Manage [Account Users]({"action": "ACCOUNT_USERS_SETUP", "accountId": 123})';
    const result = service.parseMessage(msg);

    expect(result).toEqual([{ text: 'Manage ' }, { text: 'Account Users', route: '/accounts/123', fragment: 'users' }]);
  });

  it('should convert JSON params to correct route (VERIFICATION_BODY_USERS_SETUP)', () => {
    const msg = 'Setup [Verifiers]({"action": "VERIFICATION_BODY_USERS_SETUP"})';
    const result = service.parseMessage(msg);

    expect(result).toEqual([{ text: 'Setup ' }, { text: 'Verifiers', route: '/user/verifiers', fragment: null }]);
  });

  it('should fall back to default route for unknown action', () => {
    const msg = 'Go [Home]({"action": "SOMETHING_UNKNOWN"})';
    const result = service.parseMessage(msg);

    expect(result).toEqual([{ text: 'Go ' }, { text: 'Home', route: '/', fragment: null }]);
  });

  it('should decode HTML entities before parsing', () => {
    const msg = 'Check [Users]({&quot;action&quot;: &quot;ACCOUNT_USERS_SETUP&quot;, &quot;accountId&quot;: 42})';
    const result = service.parseMessage(msg);

    expect(result).toEqual([{ text: 'Check ' }, { text: 'Users', route: '/accounts/42', fragment: 'users' }]);
  });

  it('should handle mixed text and multiple links', () => {
    const msg =
      'Visit [Account Users]({"action": "ACCOUNT_USERS_SETUP", "accountId": 123}) or [Verifiers]({"action": "VERIFICATION_BODY_USERS_SETUP"}) today!';
    const result = service.parseMessage(msg);

    expect(result).toEqual([
      { text: 'Visit ' },
      { text: 'Account Users', route: '/accounts/123', fragment: 'users' },
      { text: ' or ' },
      { text: 'Verifiers', route: '/user/verifiers', fragment: null },
      { text: ' today!' },
    ]);
  });
});
