package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountupdated.request.MaritimeAccountUpdatedEventListenerResolver;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.mrtm.api.integration.registry.setoperator.validate.SetOperatorRequestValidator;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.error.ContactPoint;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.set.operator.enabled", havingValue = "true")
public class SetOperatorResponseHandler {

    private static final String INTEGRATION_POINT_KEY = "Set Operator ID";

    private final SetOperatorSendToRegistryProducer setOperatorSendToRegistryProducer;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final KafkaTemplate<String, OperatorUpdateEventOutcome> setOperatorKafkaTemplate;
    private final SetOperatorRequestValidator validator;
    private final MrtmAccountRepository mrtmAccountRepository;
    private final MaritimeAccountUpdatedEventListenerResolver accountUpdatedRegistryListener;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    public void handleResponse(OperatorUpdateEvent event, String correlationId) {
        log.info("Set operator outcome with correlationId {} and emitter ID {}", correlationId, event.getEmitterId());
        OperatorUpdateEventOutcome eventOutcome = process(event, correlationId);

        setOperatorSendToRegistryProducer.produce(eventOutcome, setOperatorKafkaTemplate);
    }

    private OperatorUpdateEventOutcome process(OperatorUpdateEvent event, String correlationId) {
        List<IntegrationEventErrorDetails> errors = validator.validate(event);

        if (errors.isEmpty()) {
            MrtmAccount account = mrtmAccountRepository.findByBusinessId(event.getEmitterId());
            saveOperatorId(account, event.getOperatorId());
            sendUpdateAccountEvent(account.getId());
        } else {
            handleValidationErrors(event, correlationId, errors);
        }

        return OperatorUpdateEventOutcome.builder()
            .event(event)
            .outcome(errors.isEmpty() ? IntegrationEventOutcome.SUCCESS : IntegrationEventOutcome.ERROR)
            .errors(errors)
            .build();
    }

    private void sendUpdateAccountEvent(Long accountId) {
        EmissionsMonitoringPlan emissionsMonitoringPlan = emissionsMonitoringPlanQueryService
            .getLastestEmissionsMonitoringPlan(accountId);

        accountUpdatedRegistryListener
            .onAccountUpdatedEvent(AccountUpdatedRegistryEvent.builder()
                .accountId(accountId)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .build());
    }

    private void handleValidationErrors(OperatorUpdateEvent event, String correlationId, List<IntegrationEventErrorDetails> errors) {
        CompetentAuthorityEnum ca = RegistryCompetentAuthorityEnum.getCompetentAuthorityEnum(event.getRegulator()).getCompetentAuthorityEnum();
        String recipient = emailProperties.getEmail().get(ca.getCode());

        notifyActionRecipients(errors, ContactPoint.SERVICE_DESK, event, correlationId, emailProperties.getFordway(), true);
        notifyActionRecipients(errors, ContactPoint.METS_REGULATORS, event, correlationId, recipient, false);
        notifyInfoRecipients(event, correlationId, errors, recipient);
    }

    private void notifyActionRecipients(List<IntegrationEventErrorDetails> errors, ContactPoint contactPoint,
                                        OperatorUpdateEvent event, String correlationId, String recipient, boolean isFordway) {

        List<IntegrationEventErrorDetails> actionMetsErrors = errors
            .stream()
            .filter(error -> error.getError().getActionRecipients().contains(contactPoint))
            .toList();

        if (!actionMetsErrors.isEmpty()) {
            notifyRegulator(event, correlationId, actionMetsErrors, recipient, isFordway,
                MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE);
        }
    }

    private void notifyInfoRecipients(OperatorUpdateEvent event, String correlationId,
                                      List<IntegrationEventErrorDetails> errors, String recipient) {

        List<IntegrationEventErrorDetails> infoMetsErrors = errors
            .stream()
            .filter(error -> error.getError().getInformationRecipients().contains(ContactPoint.METS_REGULATORS))
            .toList();

        if (!infoMetsErrors.isEmpty()) {
            notifyRegulator(event, correlationId, infoMetsErrors, recipient, false,
                MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE);
        }
    }

    private void notifyRegulator(OperatorUpdateEvent event, String correlationId,
                                 List<IntegrationEventErrorDetails> errorsForMail,
                                 String recipient, boolean isFordway, String templateName) {
        MrtmAccount account = mrtmAccountRepository.findByBusinessId(event.getEmitterId());

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, asStringOrEmpty(event.getEmitterId()));
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, errorsForMail);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, getAccountFields(event));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, correlationId);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, asStringOrEmpty(account != null ? account.getName(): null));
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.IS_FOR_FORDWAY, isFordway);


        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(templateName)
                .templateParams(templateParams)
                .build())
            .build();
        notificationEmailService.notifyRecipient(emailData, recipient);
    }

    private Map<String, String> getAccountFields(OperatorUpdateEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.EMITTER_ID, asStringOrEmpty(event.getEmitterId()));
        fields.put(PayloadFieldsUtils.OPERATOR_ID, asStringOrEmpty(event.getOperatorId()));

        return fields;
    }

    private void saveOperatorId(MrtmAccount account, Long operatorId) {
        account.setRegistryId(operatorId.intValue());
        mrtmAccountRepository.save(account);
    }
}
