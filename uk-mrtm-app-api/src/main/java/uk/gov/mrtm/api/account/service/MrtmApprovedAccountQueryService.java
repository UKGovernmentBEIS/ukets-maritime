package uk.gov.mrtm.api.account.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.account.repository.AccountBaseRepository;
import uk.gov.netz.api.account.service.ApprovedAccountQueryAbstractService;

import java.util.Optional;
import java.util.Set;

@Service
public class MrtmApprovedAccountQueryService extends ApprovedAccountQueryAbstractService<MrtmAccount> {

    private final AccountBaseRepository<MrtmAccount> accountBaseRepository;

    public MrtmApprovedAccountQueryService(AccountBaseRepository<MrtmAccount> accountBaseRepository) {
        super(accountBaseRepository);
        this.accountBaseRepository = accountBaseRepository;
    }

    public Optional<MrtmAccount> getApprovedAccountById(Long accountId) {
        return this.accountBaseRepository.findByIdAndStatusNotIn(accountId, getStatusesConsideredNotApproved().stream().toList());
    }

    @Override
    public Set<AccountStatus> getStatusesConsideredNotApproved() {
        return Set.of(MrtmAccountStatus.CLOSED);
    }

}
