package uk.gov.mrtm.api.integration.registry.setoperator.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
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
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SetOperatorResponseHandlerTest {
    private static final String CORRELATION_ID = "correlation-id";
    private static final long OPERATOR_ID = 1L;
    private static final String EMITTER_ID = "emitterId";
    private static final String EMAIL = "email@email";
    private static final String FORDWAY_EMAIL = "fordwayEmail@email";
    private static final String INTEGRATION_POINT_KEY = "Set Operator ID";
    private static final String ACCOUNT_NAME = "account-name";
    private static final RegistryCompetentAuthorityEnum REGULATOR = RegistryCompetentAuthorityEnum.EA;

    @InjectMocks
    private SetOperatorResponseHandler handler;

    @Mock
    private SetOperatorSendToRegistryProducer setOperatorSendToRegistryProducer;
    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;
    @Mock
    private KafkaTemplate<String, OperatorUpdateEventOutcome> setOperatorKafkaTemplate;
    @Mock
    private SetOperatorRequestValidator validator;
    @Mock
    private MrtmAccountRepository mrtmAccountRepository;
    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    @Mock
    private MaritimeAccountUpdatedEventListenerResolver accountUpdatedRegistryListener;

    @Test
    void handleResponse_with_errors() {
        MrtmAccount mrtmAccount = MrtmAccount.builder().name(ACCOUNT_NAME).build();
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .operatorId(OPERATOR_ID)
            .emitterId(EMITTER_ID)
            .regulator(REGULATOR.name())
            .build();

        IntegrationEventErrorDetails error201 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0201).build();
        IntegrationEventErrorDetails error202 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0202).build();
        IntegrationEventErrorDetails error203 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0203).build();
        List<IntegrationEventErrorDetails> errorDetails = List.of(error201, error202, error203);
        OperatorUpdateEventOutcome outcome = OperatorUpdateEventOutcome.builder()
            .event(event)
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(errorDetails)
            .build();

        when(emailProperties.getEmail()).thenReturn(Map.of(REGULATOR.name(), EMAIL));
        when(emailProperties.getFordway()).thenReturn(FORDWAY_EMAIL);
        when(validator.validate(event)).thenReturn(errorDetails);
        when(mrtmAccountRepository.findByBusinessId(EMITTER_ID)).thenReturn(mrtmAccount);

        handler.handleResponse(event, CORRELATION_ID);

        verify(notificationEmailService).notifyRecipient(getEmailData(List.of(error201), true, MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE), FORDWAY_EMAIL);
        verify(notificationEmailService).notifyRecipient(getEmailData(List.of(error203), false, MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE), EMAIL);
        verify(notificationEmailService).notifyRecipient(getEmailData(List.of(error201, error202), false, MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE), EMAIL);
        verify(emailProperties).getEmail();
        verify(emailProperties).getFordway();
        verify(validator).validate(event);
        verify(mrtmAccountRepository, times(3)).findByBusinessId(EMITTER_ID);
        verify(setOperatorSendToRegistryProducer).produce(outcome, setOperatorKafkaTemplate);

        verifyNoMoreInteractions(notificationEmailService, emailProperties, validator, mrtmAccountRepository, setOperatorSendToRegistryProducer);
        verifyNoInteractions(setOperatorKafkaTemplate, emissionsMonitoringPlanQueryService, accountUpdatedRegistryListener);
    }

    @Test
    void handleResponse_with_no_errors() {
        MrtmAccount mrtmAccount = mock(MrtmAccount.class);
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .operatorId(OPERATOR_ID)
            .emitterId(EMITTER_ID)
            .regulator(REGULATOR.name())
            .build();

        OperatorUpdateEventOutcome outcome = OperatorUpdateEventOutcome.builder()
            .event(event)
            .outcome(IntegrationEventOutcome.SUCCESS)
            .errors(new ArrayList<>())
            .build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = mock(EmissionsMonitoringPlan.class);
        Long accountId = 123L;
        AccountUpdatedRegistryEvent updatedRegistryEvent = AccountUpdatedRegistryEvent.builder()
            .accountId(accountId)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();

        when(mrtmAccount.getId()).thenReturn(accountId);
        when(validator.validate(event)).thenReturn(new ArrayList<>());
        when(mrtmAccountRepository.findByBusinessId(EMITTER_ID)).thenReturn(mrtmAccount);
        when(emissionsMonitoringPlanQueryService.getLastestEmissionsMonitoringPlan(accountId)).thenReturn(emissionsMonitoringPlan);

        handler.handleResponse(event, CORRELATION_ID);

        verify(validator).validate(event);
        verify(mrtmAccountRepository).findByBusinessId(EMITTER_ID);
        verify(mrtmAccountRepository).save(mrtmAccount);
        verify(mrtmAccount).setRegistryId((int) OPERATOR_ID);
        verify(setOperatorSendToRegistryProducer).produce(outcome, setOperatorKafkaTemplate);
        verify(emissionsMonitoringPlanQueryService).getLastestEmissionsMonitoringPlan(accountId);
        verify(accountUpdatedRegistryListener).onAccountUpdatedEvent(updatedRegistryEvent);

        verifyNoMoreInteractions(mrtmAccount, notificationEmailService, validator,
            mrtmAccountRepository, setOperatorSendToRegistryProducer, emissionsMonitoringPlanQueryService,
            accountUpdatedRegistryListener);
        verifyNoInteractions(setOperatorKafkaTemplate, notificationEmailService, emailProperties);
    }

    private EmailData<EmailNotificationTemplateData> getEmailData(List<IntegrationEventErrorDetails> error, boolean isFordway,
                                                                  String templateName) {
        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, EMITTER_ID);
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, error);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS,
            Map.of(PayloadFieldsUtils.EMITTER_ID, EMITTER_ID, PayloadFieldsUtils.OPERATOR_ID, String.valueOf(OPERATOR_ID)));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, CORRELATION_ID);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, "Maritime");
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, ACCOUNT_NAME);
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.IS_FOR_FORDWAY, isFordway);


        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(templateName)
                .templateParams(templateParams)
                .build())
            .build();
        return emailData;
    }
}