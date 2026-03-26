package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeResponseHandlerTest {
    private static final String CORRELATION_ID = UUID.randomUUID().toString();
    private static final String REGISTRY_ID = "1234567";

    @InjectMocks
    private RegulatorNoticeResponseHandler service;

    @Mock
    private MrtmAccountQueryService accountQueryService;
    @Mock
    private NotifyRegistryEmailService notifyRegistryEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        RegulatorNoticeEventOutcome event = RegulatorNoticeEventOutcome.builder()
            .outcome(IntegrationEventOutcome.SUCCESS)
            .event(RegulatorNoticeEvent.builder()
                .registryId(REGISTRY_ID)
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_empty_list() {
        RegulatorNoticeEventOutcome event = RegulatorNoticeEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .event(RegulatorNoticeEvent.builder()
                .registryId(REGISTRY_ID)
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_non_empty_list() {
        List<IntegrationEventErrorDetails> infoErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0601).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0602).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0604).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0605).build()
        );
        List<IntegrationEventErrorDetails> actionErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0603).build()
        );

        List<IntegrationEventErrorDetails> allErrors = new ArrayList<>();
        allErrors.addAll(actionErrors);
        allErrors.addAll(infoErrors);

        RegulatorNoticeEventOutcome event = RegulatorNoticeEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(allErrors)
            .event(RegulatorNoticeEvent.builder()
                .registryId(REGISTRY_ID)
                .fileName("filename")
                .type("eventType")
                .build())
            .build();

        MrtmAccount account = MrtmAccount.builder()
            .businessId("businessId")
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();

        NotifyRegistryEmailServiceParams actionEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId("businessId")
            .correlationId(CORRELATION_ID)
            .errorsForMail(actionErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
            .integrationPoint("Regulator notice")
            .fields(getEventFields())
            .build();
        NotifyRegistryEmailServiceParams infoEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId("businessId")
            .correlationId(CORRELATION_ID)
            .errorsForMail(infoErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
            .integrationPoint("Regulator notice")
            .fields(getEventFields())
            .build();

        when(accountQueryService.getAccountByRegistryId(Integer.valueOf(REGISTRY_ID))).thenReturn(account);
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));

        service.handleResponse(event, CORRELATION_ID);

        verify(accountQueryService).getAccountByRegistryId(Integer.valueOf(REGISTRY_ID));
        verify(emailProperties).getEmail();
        verify(notifyRegistryEmailService).notifyRegulator(actionEmailParams);
        verify(notifyRegistryEmailService).notifyRegulator(infoEmailParams);

        verifyNoMoreInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    private Map<String, String> getEventFields() {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.REGISTRY_ID, REGISTRY_ID);
        fields.put(PayloadFieldsUtils.NOTIFICATION_TYPE, "eventType");
        fields.put(PayloadFieldsUtils.FILE_NAME, "filename");

        return fields;
    }
}