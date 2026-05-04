package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.account.AccountDetailsMessage;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;
import uk.gov.netz.integration.model.account.AccountType;

import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapAccountHolderType;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCompanyRegistrationNumber;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCrnJustification;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapWithRegistryCountryCodes;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedNotifyRegistryService {


    private static final String INTEGRATION_POINT_KEY = "Account Created";

    private final MrtmAccountQueryService accountQueryService;
    private final AccountCreatedSendToRegistryProducer accountCreatedSendToRegistryProducer;
    private final EmissionsMonitoringPlanQueryService empQueryService;
    private final KafkaTemplate<String, AccountOpeningEvent> accountCreatedKafkaTemplate;


    public void notifyRegistry(EmpApprovedEvent event) {

        Long accountId = event.getAccountId();
        final MrtmAccount account = accountQueryService.getAccountById(accountId);

        if (!ObjectUtils.isEmpty(account.getRegistryId())) {
            log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, accountId,
                    INTEGRATION_POINT_KEY,
                    "Cannot send emissions to ETS Registry because Operator Id already exists");

            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_ACCOUNT_CREATION_REGISTRY_ID_EXISTS, event);
        }

        final AccountOpeningEvent accountOpeningEvent = AccountOpeningEvent.builder()
                .accountType(AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT)
                .accountDetails(buildAccountDetails(account))
                .accountHolder(buildAccountHolder(event.getEmissionsMonitoringPlan(), account.getName()))
                .build();

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getRegistryId(),
            INTEGRATION_POINT_KEY, "Sending account created event to registry " + accountOpeningEvent);

        accountCreatedSendToRegistryProducer.produce(accountOpeningEvent,
                accountCreatedKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, accountId,
                INTEGRATION_POINT_KEY, "Account created event sent to registry " + accountOpeningEvent);
    }


    private AccountDetailsMessage buildAccountDetails(MrtmAccount account) {
        final String empId = empQueryService.getEmpIdByAccountId(account.getId()).orElse(null);

        return AccountDetailsMessage.builder()
                .emitterId(account.getBusinessId())
                .accountName(account.getName())
                .monitoringPlanId(empId)
                .companyImoNumber(account.getImoNumber())
                .regulator(RegistryCompetentAuthorityEnum.getCompetentAuthorityEnum(account.getCompetentAuthority()).name())
                .firstYearOfVerifiedEmissions(account.getFirstMaritimeActivityDate().getYear())
                .build();
    }

    private AccountHolderMessage buildAccountHolder(EmissionsMonitoringPlan emp, String accountName) {
        AddressStateDTO registeredAddress = emp.getOperatorDetails().getOrganisationStructure().getRegisteredAddress();
        return AccountHolderMessage.builder()
                .accountHolderType(mapAccountHolderType(emp.getOperatorDetails().getOrganisationStructure().getLegalStatusType()))
                .name(accountName)
                .addressLine1(registeredAddress.getLine1())
                .addressLine2(registeredAddress.getLine2())
                .townOrCity(registeredAddress.getCity())
                .stateOrProvince(registeredAddress.getState())
                .country(mapWithRegistryCountryCodes(registeredAddress.getCountry()))
                .postalCode(registeredAddress.getPostcode())
                .crnNotExist(!OrganisationLegalStatusType.LIMITED_COMPANY.equals(emp.getOperatorDetails().getOrganisationStructure()
                        .getLegalStatusType()))
                .companyRegistrationNumber(mapCompanyRegistrationNumber(emp.getOperatorDetails().getOrganisationStructure()))
                .crnJustification(mapCrnJustification(emp.getOperatorDetails().getOrganisationStructure()))
                .build();
    }
}
