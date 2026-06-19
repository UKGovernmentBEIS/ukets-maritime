package uk.gov.mrtm.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountIdAndNameDTO;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class MrtmAccountQueryService {

    private final MrtmAccountRepository accountRepository;
    private final MrtmAccountMapper accountMapper;

    public MrtmAccount getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    public MrtmAccount getAccountByRegistryId(Integer registryId) {
        return accountRepository.findByRegistryId(registryId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    public Long getAccountIdByImoNumber(String imoNumber) {
        return accountRepository.findAccountIdByImoNumber(imoNumber)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    public Optional<Long> findVerificationBodyIdByImoNumber(String imoNumber) {
        return accountRepository.findVerificationBodyIdByImoNumber(imoNumber);
    }

    public boolean isExistingAccountImoNumber(String imoNumber) {
        return accountRepository.existsByImoNumber(imoNumber);
    }

    public List<Long> getAccountIdsByStatuses(List<MrtmAccountStatus> accountStatuses) {
        return accountRepository.findAllByStatusIn(accountStatuses).stream()
                .map(MrtmAccount::getId)
                .toList();
    }

    public boolean existsAccountById(Long accountId) {
        return accountRepository.existsById(accountId);
    }

    @Transactional
    public MrtmAccountViewDTO getAccountDTOByIdAndUser(Long accountId) {
        MrtmAccount account = getAccountById(accountId);

        return accountMapper.toMrtmAccountViewDTO(account);
    }

    @Transactional
    public MrtmAccount findByBusinessId(String businessId) {
        return accountRepository.findByBusinessId(businessId);
    }

    public boolean existsByImoNumberAndId(String imoNumber, Long accountId) {
        return accountRepository.existsByImoNumberAndId(imoNumber, accountId);
    }

    public Set<MrtmAccountIdAndNameDTO> getAllByCAAndStatuses(
            CompetentAuthorityEnum ca, Set<MrtmAccountStatus> statuses) {
        return accountRepository.findAllByCAAndStatusesAndEmissionTradingSchemes(ca,
                statuses == null ? Set.of() : statuses);
    }
}
