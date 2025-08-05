package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountDetailsMessage;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedResponseHandler {

    private static final String INTEGRATION_POINT_KEY = "Account Created";

    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final MrtmAccountRepository accountRepository;


    public void handleResponse(AccountOpeningEventOutcome event, String correlationId) {
        log.info("Received account opening outcome with correlationId {}", correlationId);
        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {
            if (!ObjectUtils.isEmpty(event.getErrors())) {
                final List<IntegrationEventErrorDetails> actionErrors = event.getErrors().stream()
                        .filter(errorDetails -> errorDetails.getError().equals(IntegrationEventError.ERROR_0106))
                        .toList();
                if (!ObjectUtils.isEmpty(actionErrors)) {
                    notifyRegulator(event, correlationId, actionErrors,
                            MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE);
                }

                List<IntegrationEventErrorDetails> remainingErrors = event.getErrors()
                        .stream()
                        .filter(errorDetails -> !errorDetails.getError().equals(IntegrationEventError.ERROR_0106))
                        .toList();

                if (!ObjectUtils.isEmpty(remainingErrors)) {
                    notifyRegulator(event, correlationId, remainingErrors,
                            MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE);
                }

                log.info(RESPONSE_LOG_FORMAT,
                        SERVICE_KEY,
                        event.getEvent().getAccountDetails().getEmitterId(),
                        INTEGRATION_POINT_KEY,
                        "Failed to process a request and notified regulator with errors " + event);
            } else {
                log.info(RESPONSE_LOG_FORMAT,
                        SERVICE_KEY,
                        event.getEvent().getAccountDetails().getEmitterId(),
                        INTEGRATION_POINT_KEY,
                        "Failed to process a request, but received unknown error(s) " + event);
            }
        } else {
            log.info("Successfully created registry account with emitter ID: '{}'",
                event.getEvent().getAccountDetails().getEmitterId());
        }
    }

    private void notifyRegulator(AccountOpeningEventOutcome event, String correlationId,
                                 List<IntegrationEventErrorDetails> errorsForMail, String templateName) {
        final AccountDetailsMessage accountDetails = event.getEvent().getAccountDetails();
        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, accountDetails.getEmitterId());
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, errorsForMail);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, getAccountOpeningFields(event.getEvent()));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, correlationId);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, accountDetails.getAccountName());
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);

        final CompetentAuthorityEnum competentAuthority = accountRepository.findByImoNumber(accountDetails.getCompanyImoNumber()).map(MrtmAccount::getCompetentAuthority)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(templateName)
                        .templateParams(templateParams)
                        .build())
                .build();
        notificationEmailService.notifyRecipient(emailData, emailProperties.getEmail().get(competentAuthority.getCode()));
    }

    private Map<String, String> getAccountOpeningFields(AccountOpeningEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        // account details
        fields.put(PayloadFieldsUtils.EMITTER_ID, asStringOrEmpty(event.getAccountDetails().getEmitterId()));
        fields.put(PayloadFieldsUtils.INSTALLATION_ACTIVITY_TYPE, asStringOrEmpty(event.getAccountDetails().getInstallationActivityType()));
        fields.put(PayloadFieldsUtils.INSTALLATION_NAME, asStringOrEmpty(event.getAccountDetails().getInstallationName()));
        fields.put(PayloadFieldsUtils.ACCOUNT_NAME, asStringOrEmpty(event.getAccountDetails().getAccountName()));
        fields.put(PayloadFieldsUtils.PERMIT_ID, asStringOrEmpty(event.getAccountDetails().getPermitId()));
        fields.put(PayloadFieldsUtils.EMP_ID, asStringOrEmpty(event.getAccountDetails().getMonitoringPlanId()));
        fields.put(PayloadFieldsUtils.IMO_NUMBER, asStringOrEmpty(event.getAccountDetails().getCompanyImoNumber()));
        fields.put(PayloadFieldsUtils.REGULATOR, asStringOrEmpty(event.getAccountDetails().getRegulator()));
        fields.put(PayloadFieldsUtils.DATE_OF_ISSUANCE, asStringOrEmpty(event.getAccountDetails().getEmpPermitIssuanceDate()));
        fields.put(PayloadFieldsUtils.FIRST_YEAR_OF_VERIFIED_EMISSIONS, asStringOrEmpty(event.getAccountDetails().getFirstYearOfVerifiedEmissions()));
        //account holder
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_NAME, asStringOrEmpty(event.getAccountHolder().getName()));
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_TYPE, asStringOrEmpty(event.getAccountHolder().getAccountHolderType()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_1, asStringOrEmpty(event.getAccountHolder().getAddressLine1()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_2, asStringOrEmpty(event.getAccountHolder().getAddressLine2()));
        fields.put(PayloadFieldsUtils.CITY, asStringOrEmpty(event.getAccountHolder().getTownOrCity()));
        fields.put(PayloadFieldsUtils.STATE, asStringOrEmpty(event.getAccountHolder().getStateOrProvince()));
        fields.put(PayloadFieldsUtils.COUNTRY, asStringOrEmpty(event.getAccountHolder().getCountry()));
        fields.put(PayloadFieldsUtils.POSTCODE, asStringOrEmpty(event.getAccountHolder().getPostalCode()));
        fields.put(PayloadFieldsUtils.CRN_NOT_EXIST, asStringOrEmpty(event.getAccountHolder().getCrnNotExist()));
        fields.put(PayloadFieldsUtils.CRN, asStringOrEmpty(event.getAccountHolder().getCompanyRegistrationNumber()));
        fields.put(PayloadFieldsUtils.CRN_JUSTIFICATION, asStringOrEmpty(event.getAccountHolder().getCrnJustification()));

        return fields;
    }
}
