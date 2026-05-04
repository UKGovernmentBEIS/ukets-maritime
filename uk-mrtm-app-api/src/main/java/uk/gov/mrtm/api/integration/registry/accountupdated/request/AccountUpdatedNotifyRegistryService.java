package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountType;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.UpdateAccountDetailsMessage;

import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapAccountHolderType;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCompanyRegistrationNumber;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCrnJustification;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapWithRegistryCountryCodes;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Account Updated";

    private final AccountUpdatedSendToRegistryProducer accountUpdatedSendToRegistryProducer;
    private final KafkaTemplate<String, AccountUpdatingEvent> accountUpdatedKafkaTemplate;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final NotifyRegistryEmailService notifyRegistryEmailService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final EmissionsMonitoringPlanQueryService empQueryService;

    public AccountUpdatedSubmittedEventDetails notifyRegistry(AccountUpdatedRegistryEvent event) {

        final MrtmAccount account = mrtmAccountQueryService.getAccountById(event.getAccountId());
        final String empId = empQueryService.getEmpIdByAccountId(event.getAccountId()).orElse(null);
        final EmissionsMonitoringPlan emp = event.getEmissionsMonitoringPlan();
        if(emp == null) {
            log.info(REQUEST_LOG_FORMAT, NotifyRegistryUtils.SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY, "EMP data not found");
            return createResponse(false, null);
        }

        if(ObjectUtils.isEmpty(account.getRegistryId())) {
            notifyRegulator(account);
            return createResponse(false, null);
        }

        AccountUpdatingEvent accountUpdatingEvent = buildAccountUpdatingPayload(account, emp, empId);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getRegistryId(),
            INTEGRATION_POINT_KEY, "Sending account updated event to registry " + accountUpdatingEvent);

        accountUpdatedSendToRegistryProducer.produce(accountUpdatingEvent, accountUpdatedKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, NotifyRegistryUtils.SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY, "Account updated event sent to registry" + accountUpdatingEvent);

        return createResponse(true, accountUpdatingEvent);
    }

    private void notifyRegulator(MrtmAccount account) {
        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getId(),
            INTEGRATION_POINT_KEY,
            "Cannot send update message to ETS Registry because account doesn't have a registry id");

        String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());

        notifyRegistryEmailService.notifyRegulator(
            NotifyRegistryEmailServiceParams.builder()
                .account(account)
                .emitterId(account.getBusinessId())
                .recipient(recipient)
                .isFordway(false)
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_ACCOUNT_UPDATE_MISSING_REGISTRY_ID_TEMPLATE)
                .integrationPoint(INTEGRATION_POINT_KEY)
                .build()
        );
    }

    private AccountUpdatingEvent buildAccountUpdatingPayload(MrtmAccount account,
                                                             EmissionsMonitoringPlan emp,
                                                             String empId) {

        UpdateAccountDetailsMessage updateAccountDetailsMessage = UpdateAccountDetailsMessage.builder()
            .accountType(AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT.name())
            .registryId(String.valueOf(account.getRegistryId()))
            .monitoringPlanId(empId)
            .firstYearOfVerifiedEmissions(account.getFirstMaritimeActivityDate().getYear())
            .accountName(emp.getOperatorDetails().getOperatorName())
            .companyImoNumber(account.getImoNumber())
            .regulator(RegistryCompetentAuthorityEnum.getCompetentAuthorityEnum(account.getCompetentAuthority()).name())
            .build();

        AccountHolderMessage accountHolderMessage = AccountHolderMessage.builder().build();

        if (emp.getOperatorDetails() != null && emp.getOperatorDetails().getOrganisationStructure() != null) {
            OrganisationStructure organisationStructure = emp.getOperatorDetails().getOrganisationStructure();
            accountHolderMessage.setName(emp.getOperatorDetails().getOperatorName());
            accountHolderMessage.setCompanyRegistrationNumber(mapCompanyRegistrationNumber(organisationStructure));
            accountHolderMessage.setCrnJustification(mapCrnJustification(organisationStructure));

            if (organisationStructure.getLegalStatusType() != null) {
                OrganisationLegalStatusType legalStatusType = organisationStructure.getLegalStatusType();
                accountHolderMessage.setAccountHolderType(mapAccountHolderType(legalStatusType));
                accountHolderMessage.setCrnNotExist(!OrganisationLegalStatusType.LIMITED_COMPANY.equals(legalStatusType));
            }

            if (organisationStructure.getRegisteredAddress() != null) {
                AddressStateDTO registeredAddress = organisationStructure.getRegisteredAddress();
                accountHolderMessage.setAddressLine1(registeredAddress.getLine1());
                accountHolderMessage.setAddressLine2(registeredAddress.getLine2());
                accountHolderMessage.setTownOrCity(registeredAddress.getCity());
                accountHolderMessage.setStateOrProvince(registeredAddress.getState());
                accountHolderMessage.setCountry(mapWithRegistryCountryCodes(registeredAddress.getCountry()));
                accountHolderMessage.setPostalCode(registeredAddress.getPostcode());
            }
        }

        return AccountUpdatingEvent.builder()
            .accountDetails(updateAccountDetailsMessage)
            .accountHolder(accountHolderMessage)
            .build();
    }

    private AccountUpdatedSubmittedEventDetails createResponse(boolean notifiedRegistry,
                                                               AccountUpdatingEvent data) {
        return AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(data)
            .build();
    }
}
