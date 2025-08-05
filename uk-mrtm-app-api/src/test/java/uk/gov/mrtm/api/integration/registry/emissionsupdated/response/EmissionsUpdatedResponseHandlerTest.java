package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.time.Year;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@ExtendWith(MockitoExtension.class)
class EmissionsUpdatedResponseHandlerTest {

    private static final Long TEST_REGISTRY_ID = 1234L;
    private static final Year YEAR = Year.now();
    private static final Long REPORTABLE_EMISSIONS = 5000L;
    private static final String CORRELATION_ID = "correlation-id";
    private static final String EMITTER_ID = "emitterId";
    private static final String INTEGRATION_POINT_KEY = "Update emissions value";
    private static final String ACCOUNT_NAME = "account-name";

    @InjectMocks
    private EmissionsUpdatedResponseHandler handler;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        AccountEmissionsUpdateEventOutcome event = AccountEmissionsUpdateEventOutcome.builder()
            .event(AccountEmissionsUpdateEvent.builder().registryId(TEST_REGISTRY_ID).build())
            .outcome(IntegrationEventOutcome.SUCCESS).build();
        handler.handleResponse(event, CORRELATION_ID);
        verifyNoInteractions(notificationEmailService, accountQueryService);
    }

    @Test
    void handleResponse_error_with_no_errors() {
        AccountEmissionsUpdateEventOutcome event = AccountEmissionsUpdateEventOutcome.builder()
            .event(AccountEmissionsUpdateEvent.builder().registryId(TEST_REGISTRY_ID).build())
            .errors(Collections.emptyList())
            .outcome(IntegrationEventOutcome.ERROR).build();

        handler.handleResponse(event, CORRELATION_ID);
        verifyNoInteractions(notificationEmailService, accountQueryService);
    }

    @Test
    void handleResponse_error_with_errors() {
        AccountEmissionsUpdateEventOutcome event = AccountEmissionsUpdateEventOutcome.builder()
            .event(AccountEmissionsUpdateEvent.builder()
                .registryId(TEST_REGISTRY_ID)
                .reportableEmissions(REPORTABLE_EMISSIONS)
                .reportingYear(YEAR)
                .build())
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(List.of(IntegrationEventError.ERROR_0803, IntegrationEventError.ERROR_0801))
            .build();

        IntegrationEventErrorDetails error803 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0803).build();
        IntegrationEventErrorDetails error801 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0801).build();

        String email = "test-email@example.com";
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.SCOTLAND.getCode(), email));
        when(accountQueryService.getAccountByRegistryId(TEST_REGISTRY_ID.intValue())).thenReturn(MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.SCOTLAND)
            .businessId(EMITTER_ID)
            .name(ACCOUNT_NAME)
            .build());

        handler.handleResponse(event, CORRELATION_ID);
        verify(emailProperties, times(2)).getEmail();
        verify(accountQueryService, times(2)).getAccountByRegistryId(TEST_REGISTRY_ID.intValue());
        verify(notificationEmailService).notifyRecipient(getEmailData(List.of(error801), MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE), email);
        verify(notificationEmailService).notifyRecipient(getEmailData(List.of(error803), MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE), email);

        verifyNoMoreInteractions(notificationEmailService, accountQueryService);
    }

    private EmailData<EmailNotificationTemplateData> getEmailData(List<IntegrationEventErrorDetails> error,
                                                                  String templateName) {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(TEST_REGISTRY_ID));
        fields.put(PayloadFieldsUtils.EMISSIONS, asStringOrEmpty(REPORTABLE_EMISSIONS));
        fields.put(PayloadFieldsUtils.YEAR, asStringOrEmpty(YEAR));

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, EMITTER_ID);
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, error);
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, CORRELATION_ID);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, "Maritime");
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, ACCOUNT_NAME);
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, fields);


        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(templateName)
                .templateParams(templateParams)
                .build())
            .build();
        return emailData;
    }
}
