package uk.gov.mrtm.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountCreatedEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.enumeration.AccountSearchKey;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.account.service.AccountSearchAdditionalKeywordService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MrtmAccountCreateService {

    private final MrtmAccountRepository mrtmAccountRepository;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final MrtmAccountMapper mrtmAccountMapper;
    private final AccountSearchAdditionalKeywordService accountSearchAdditionalKeywordService;
    private final ApplicationEventPublisher publisher;

    @Transactional
    public void createMaritimeAccount(MrtmAccountDTO accountCreationDTO, AppUser appUser) {

        validateImoNumberUniqueness(accountCreationDTO.getImoNumber());
        Long accountId = mrtmAccountRepository.generateId();
        String businessId = AccountBusinessIdGenerator.generate(accountId);
        MrtmAccount mrtmAccount = mrtmAccountMapper.toMrtmAccount(accountCreationDTO, accountId, MrtmAccountStatus.NEW,
                MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME, appUser.getCompetentAuthority(), businessId);

        mrtmAccount.setCreatedDate(LocalDateTime.now());
        mrtmAccount.setCreatedByUserId(appUser.getUserId());

        mrtmAccountRepository.save(mrtmAccount);
        storeKeywords(accountCreationDTO, businessId, accountId);

        List<Year> reportingYears = ReportingYearService
            .calculateReportingYears(Year.of(accountCreationDTO.getFirstMaritimeActivityDate().getYear()));

        publisher.publishEvent(MrtmAccountCreatedEvent.builder()
                .accountId(accountId)
                .reportingYears(reportingYears)
                .build());
    }

    private void validateImoNumberUniqueness(String imoNumber) {
        if (mrtmAccountQueryService.isExistingAccountImoNumber(imoNumber)) {
            throw new BusinessException(MrtmErrorCode.IMO_NUMBER_ALREADY_RELATED_WITH_ANOTHER_ACCOUNT, imoNumber);
        }
    }

    private void storeKeywords(MrtmAccountDTO accountCreationDTO, String businessId, Long accountId) {
        Map<String, String> keywords = Map.of(
            AccountSearchKey.ACCOUNT_NAME.name(), accountCreationDTO.getName(),
            AccountSearchKey.IMO_NUMBER.name(), accountCreationDTO.getImoNumber(),
            AccountSearchKey.BUSINESS_ID.name(), businessId);

        accountSearchAdditionalKeywordService.storeKeywordsForAccount(accountId, keywords);
    }
}
