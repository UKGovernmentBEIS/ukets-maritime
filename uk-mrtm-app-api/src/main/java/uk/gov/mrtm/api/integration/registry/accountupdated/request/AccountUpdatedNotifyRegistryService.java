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
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountType;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.UpdateAccountDetailsMessage;

import java.util.HashMap;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapAccountHolderType;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCompanyRegistrationNumber;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapCrnJustification;
import static uk.gov.mrtm.api.integration.registry.accountcreated.util.RegistryMappingUtils.mapWithRegistryCountryCodes;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Account Updated";

    private final AccountUpdatedSendToRegistryProducer accountUpdatedSendToRegistryProducer;
    private final KafkaTemplate<String, AccountUpdatingEvent> accountUpdatedKafkaTemplate;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
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
        accountUpdatedSendToRegistryProducer.produce(accountUpdatingEvent, accountUpdatedKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, NotifyRegistryUtils.SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY, "Account updated event sent to registry" + accountUpdatingEvent);

        return createResponse(true, accountUpdatingEvent);
    }

    private void notifyRegulator(MrtmAccount account) {
        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getId(),
            INTEGRATION_POINT_KEY,
            "Cannot send update message to ETS Registry because account doesn't have a registry id");

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, account.getName());
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, account.getBusinessId());
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_ACCOUNT_UPDATE_MISSING_REGISTRY_ID_TEMPLATE)
                .templateParams(templateParams)
                .build())
            .build();
        notificationEmailService.notifyRecipient(emailData, emailProperties.getEmail().get(account.getCompetentAuthority().getCode()));
    }

    private AccountUpdatingEvent buildAccountUpdatingPayload(MrtmAccount account,
                                                             EmissionsMonitoringPlan emp,
                                                             String empId) {

        UpdateAccountDetailsMessage updateAccountDetailsMessage = UpdateAccountDetailsMessage.builder()
            .accountType(AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT.name())
            .registryId(String.valueOf(account.getRegistryId()))
            .monitoringPlanId(empId)
            .firstYearOfVerifiedEmissions(account.getFirstMaritimeActivityDate().getYear())
            .accountName(account.getName())
            .companyImoNumber(account.getImoNumber())
            .regulator(RegistryCompetentAuthorityEnum.getCompetentAuthorityEnum(account.getCompetentAuthority()).name())
            .build();

        AccountHolderMessage accountHolderMessage = AccountHolderMessage.builder().build();

        if (emp.getOperatorDetails() != null && emp.getOperatorDetails().getOrganisationStructure() != null) {
            OrganisationStructure organisationStructure = emp.getOperatorDetails().getOrganisationStructure();
            accountHolderMessage.setName(account.getName());
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
