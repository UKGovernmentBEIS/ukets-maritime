package uk.gov.mrtm.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmAccountReportingYearsUpdatedEvent;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountUpdateDTO;
import uk.gov.mrtm.api.account.enumeration.AccountSearchKey;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.account.transform.AddressStateMapper;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.mrtm.api.account.transform.RegisteredAddressStateMapper;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountupdated.request.MaritimeAccountUpdatedEventListenerResolver;
import uk.gov.netz.api.account.service.AccountSearchAdditionalKeywordService;
import uk.gov.netz.api.account.service.validator.AccountStatus;
import uk.gov.netz.api.authorization.core.domain.AppUser;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MrtmAccountUpdateService {
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final MrtmAccountRepository mrtmAccountRepository;
    private final MrtmAccountMapper mrtmAccountMapper;
    private final AccountSearchAdditionalKeywordService accountSearchAdditionalKeywordService;
    private final RegisteredAddressStateMapper registeredAddressStateMapper;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final AddressStateMapper addressStateMapper;
    private final ApplicationEventPublisher publisher;
    private final MaritimeAccountUpdatedEventListenerResolver accountUpdatedRegistryListener;

    @Value("${feature-flag.aer.workflow.enabled}")
    private boolean aerEnabled;

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public void updateMaritimeAccount(Long accountId, MrtmAccountUpdateDTO mrtmAccountUpdateDTO, AppUser user) {
        MrtmAccount mrtmAccount = mrtmAccountQueryService.getAccountById(accountId);

        mrtmAccountMapper.updateMrtmAccount(mrtmAccount, mrtmAccountUpdateDTO);
        mrtmAccount.setUpdatedBy(user.getUserId());
        mrtmAccount.setLastUpdatedDate(LocalDateTime.now());

        accountSearchAdditionalKeywordService.storeKeywordsForAccount(accountId,
                Map.of(AccountSearchKey.ACCOUNT_NAME.name(), mrtmAccountUpdateDTO.getName()));

        final List<Year> reportingYears = ReportingYearService
                .calculateReportingYears(Year.of(mrtmAccountUpdateDTO.getFirstMaritimeActivityDate().getYear()));

        if (aerEnabled) {
            publisher.publishEvent(MrtmAccountReportingYearsUpdatedEvent.builder()
                    .accountId(accountId)
                    .reportingYears(reportingYears)
                    .build());
        }

        sendAccountUpdateToRegistry(accountId);
    }

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public void closeAccount(Long accountId, AppUser appUser, String reason) {
        MrtmAccount mrtmAccount = mrtmAccountQueryService.getAccountById(accountId);
        mrtmAccount.setClosureReason(reason);
        mrtmAccount.setClosingDate(LocalDateTime.now());
        mrtmAccount.setClosedBy(appUser.getUserId());
        mrtmAccount.setClosedByName(appUser.getFullName());
        mrtmAccount.setStatus(MrtmAccountStatus.CLOSED);

        mrtmAccountRepository.save(mrtmAccount);
    }

    @Transactional
    @AccountStatus(expression = "{#status == 'NEW'}")
    public void updateAccountUponEmpApproved(Long accountId, String name, AddressStateDTO contactAddress, AddressStateDTO registeredAddress) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(accountId);
        account.setName(name);
        account.setAddress(addressStateMapper.toAddressStateDTO(contactAddress));
        account.setRegisteredAddress(registeredAddressStateMapper.toRegisteredAddressState(registeredAddress));
        account.setStatus(MrtmAccountStatus.LIVE);
    }

    @Transactional
    @AccountStatus(expression = "{#status == 'NEW'}")
    public void updateAccountUponEmpWithdrawn(Long accountId) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(accountId);
        account.setStatus(MrtmAccountStatus.WITHDRAWN);
    }

    @Transactional
    @AccountStatus(expression = "{#status == 'LIVE'}")
    public void updateAccountUponEmpVariationApproved(Long accountId, String name, AddressStateDTO contactAddress, AddressStateDTO registeredAddress) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(accountId);
        account.setName(name);
        account.setAddress(addressStateMapper.toAddressStateDTO(contactAddress));
        account.setRegisteredAddress(registeredAddressStateMapper.toRegisteredAddressState(registeredAddress));
    }

    private void sendAccountUpdateToRegistry(Long accountId) {
        EmissionsMonitoringPlan emissionsMonitoringPlan = emissionsMonitoringPlanQueryService
            .getLastestEmissionsMonitoringPlan(accountId);

        accountUpdatedRegistryListener.onAccountUpdatedEvent(AccountUpdatedRegistryEvent.builder()
            .accountId(accountId)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build());
    }

}
