package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsEntity;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerRequestQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class ReportableEmissionsNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Update emissions value";

    private final MrtmAccountQueryService accountQueryService;
    private final AerRequestQueryService requestQueryService;
    private final ReportableEmissionsSendToRegistryProducer reportableEmissionsSendToRegistryProducer;
    private final KafkaTemplate<String, AccountEmissionsUpdateEvent> accountEmissionsUpdateEventKafkaTemplate;
    private final ReportableEmissionsRepository reportableEmissionsRepository;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final DateService dateService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    @Value("${feature-flag.updated.emissions.integration.reporting.period.check.disabled}")
    private boolean emissionsUpdatedReportingPeriodCheckDisabled;

    @Transactional
    public ReportableEmissionsUpdatedSubmittedEventDetails notifyRegistry(ReportableEmissionsUpdatedEvent event) {
        Long accountId = event.getAccountId();
        MrtmAccount account = accountQueryService.getAccountById(accountId);

        if (isExempt(event)) {
            return createResponse(false, null);
        }

        if (account.getRegistryId() == null) {
            notifyRegulator(account);
            return createResponse(false, null);
        }

        if (event.isFromDoe()) {
            AccountEmissionsUpdateEvent eventPayload = notifyRegistry(event, account);
            return createResponse(true, eventPayload);
        }

        Request aerRequest = getAer(event, accountId);
        AerRequestPayload aerRequestPayload =  ((AerRequestPayload) aerRequest.getPayload());
        if (aerConditionsAreSatisfied(event, aerRequestPayload)) {
            AccountEmissionsUpdateEvent eventPayload = notifyRegistry(event, account);
            return createResponse(true, eventPayload);
        }

        return createResponse(false, null);
    }

    private boolean aerConditionsAreSatisfied(ReportableEmissionsUpdatedEvent event,
                                              AerRequestPayload aerRequestPayload) {
        boolean isVerificationPerformed = aerRequestPayload.isVerificationPerformed();

        if (!isVerificationPerformed || event.isFromRegulator()) {
            log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY,
                "Emissions updated are not sent to ETS Registry on regulator verified AER review completed" +
                    "OR on operator non-verified AER submission");
            return false;
        }

        if (!isWithingReportingPeriod(event)) {
            log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY, "Emissions updated are not sent to ETS Registry because AER " +
                    "(initiator type: AER), is not submitted within the reporting period");
            return false;
        }

        return true;
    }

    private boolean isExempt(ReportableEmissionsUpdatedEvent event) {
        Optional<ReportableEmissionsEntity> reportableEmissions =
            reportableEmissionsRepository.findByAccountIdAndYear(event.getAccountId(), event.getYear());

        if(reportableEmissions.isEmpty() || reportableEmissions.get().isExempted()) {
            log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(), INTEGRATION_POINT_KEY,
                "Not emission will be published for exempt account");
            return true;
        }
        return false;
    }

    private boolean isWithingReportingPeriod(ReportableEmissionsUpdatedEvent event) {
        if (emissionsUpdatedReportingPeriodCheckDisabled) {
            return true;
        }

        int reportingYear = event.getYear().plusYears(1).getValue();
        LocalDate fromReportingPeriod = LocalDate.of(reportingYear, Month.JANUARY, 1);
        LocalDate toReportingPeriod = LocalDate.of(reportingYear, Month.APRIL, 30);

        LocalDate now = dateService.getLocalDate();

        return (now.isAfter(fromReportingPeriod) || now.equals(fromReportingPeriod)) &&
            (now.isBefore(toReportingPeriod) || now.equals(toReportingPeriod));
    }

    private AccountEmissionsUpdateEvent notifyRegistry(ReportableEmissionsUpdatedEvent event, MrtmAccount account) {
        BigDecimal roundedEmissions = event.getReportableEmissions().setScale(0, RoundingMode.HALF_UP);

        final AccountEmissionsUpdateEvent accountEmissionsUpdatedRequestEvent = AccountEmissionsUpdateEvent.builder()
            .registryId(Long.valueOf(account.getRegistryId()))
            .reportableEmissions(roundedEmissions.longValueExact())
            .reportingYear(event.getYear()).build();

        reportableEmissionsSendToRegistryProducer.produce(accountEmissionsUpdatedRequestEvent,
            accountEmissionsUpdateEventKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
            INTEGRATION_POINT_KEY, "Emissions sent to registry " + accountEmissionsUpdatedRequestEvent);

        return accountEmissionsUpdatedRequestEvent;
    }

    private void notifyRegulator(MrtmAccount account) {
        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getId(),
            INTEGRATION_POINT_KEY,
            "Cannot send emissions to ETS Registry because account doesn't have a registry id");

        String noRegistryIdErrorMessage = "No Registry ID exists in METS account";
        IntegrationEventErrorDetails integrationEventErrorDetails = IntegrationEventErrorDetails.builder()
            .error(IntegrationEventError.ERROR_0801)
            .errorMessage(noRegistryIdErrorMessage)
            .build();

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, account.getBusinessId());
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, List.of(integrationEventErrorDetails));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, PayloadFieldsUtils.EMPTY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, account.getName());
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
                .templateParams(templateParams)
                .build())
            .build();
        notificationEmailService.notifyRecipient(emailData, emailProperties.getEmail().get(account.getCompetentAuthority().getCode()));
    }

    private Request getAer(ReportableEmissionsUpdatedEvent event, Long accountId) {
        Optional<Request> aerRequestOptional = requestQueryService
            .findRequestByAccountAndTypeForYear(accountId, event.getYear());

        if (aerRequestOptional.isEmpty()) {
            log.error(REQUEST_LOG_FORMAT,
                SERVICE_KEY, event.getAccountId(), INTEGRATION_POINT_KEY,
                "Cannot send emissions to ETS Registry because no aer request has been found");

            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_AER_NOT_FOUND, event);
        }

        return aerRequestOptional.get();
    }

    private ReportableEmissionsUpdatedSubmittedEventDetails createResponse(boolean notifiedRegistry,
                                                                           AccountEmissionsUpdateEvent data) {
        return ReportableEmissionsUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(data)
            .build();
    }
}
