import { TestBed } from '@angular/core/testing';

import { firstValueFrom, Observable, of } from 'rxjs';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';

import { AuthService } from '@core/services/auth.service';
import { roleCanMatch } from '@service-access/service-access.guards';

describe('roleCanMatch', () => {
  let store: AuthStore;
  let checkUser: ReturnType<typeof vi.fn>;

  const match = (...roleTypes: UserStateDTO['roleType'][]): Promise<boolean> => {
    const result$ = TestBed.runInInjectionContext(() =>
      roleCanMatch(...roleTypes)({} as any, [], {} as any),
    ) as Observable<boolean>;
    return firstValueFrom(result$);
  };

  beforeEach(() => {
    checkUser = vi.fn(() => of(undefined));

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { checkUser } }],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should resolve the user before reading the role', async () => {
    store.setUserState({ roleType: 'REGULATOR', status: 'ENABLED' });

    expect(await match('REGULATOR')).toBe(true);
    expect(checkUser).toHaveBeenCalled();
  });

  it('should not match a different role', async () => {
    store.setUserState({ roleType: 'VERIFIER', status: 'ENABLED' });

    expect(await match('REGULATOR')).toBe(false);
  });

  it('should match any of several roles', async () => {
    store.setUserState({ roleType: 'REGULATOR', status: 'ENABLED' });
    expect(await match('VERIFIER', 'REGULATOR')).toBe(true);

    store.setUserState({ roleType: 'OPERATOR', status: 'ENABLED' });
    expect(await match('VERIFIER', 'REGULATOR')).toBe(false);
  });

  it('should read the role only after checkUser completes', async () => {
    checkUser.mockImplementation(() =>
      of(undefined).pipe((source) => {
        store.setUserState({ roleType: 'REGULATOR', status: 'ENABLED' });
        return source;
      }),
    );

    expect(await match('REGULATOR')).toBe(true);
  });
});
