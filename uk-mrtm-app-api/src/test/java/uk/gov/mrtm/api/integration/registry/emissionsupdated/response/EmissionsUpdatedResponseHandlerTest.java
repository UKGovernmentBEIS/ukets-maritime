package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

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
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.time.Year;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    private NotifyRegistryEmailService notifyRegistryEmailService;

    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        AccountEmissionsUpdateEventOutcome event = AccountEmissionsUpdateEventOutcome.builder()
            .event(AccountEmissionsUpdateEvent.builder().registryId(TEST_REGISTRY_ID).build())
            .outcome(IntegrationEventOutcome.SUCCESS).build();
        handler.handleResponse(event, CORRELATION_ID);
        verifyNoInteractions(notifyRegistryEmailService, accountQueryService);
    }

    @Test
    void handleResponse_error_with_no_errors() {
        AccountEmissionsUpdateEventOutcome event = AccountEmissionsUpdateEventOutcome.builder()
            .event(AccountEmissionsUpdateEvent.builder().registryId(TEST_REGISTRY_ID).build())
            .errors(Collections.emptyList())
            .outcome(IntegrationEventOutcome.ERROR).build();

        handler.handleResponse(event, CORRELATION_ID);
        verifyNoInteractions(notifyRegistryEmailService, accountQueryService);
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
        MrtmAccount mrtmAccount = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.SCOTLAND)
            .businessId(EMITTER_ID)
            .name(ACCOUNT_NAME)
            .build();
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(TEST_REGISTRY_ID));
        fields.put(PayloadFieldsUtils.EMISSIONS, asStringOrEmpty(REPORTABLE_EMISSIONS));
        fields.put(PayloadFieldsUtils.YEAR, asStringOrEmpty(YEAR));
        String email = "test-email@example.com";
        IntegrationEventErrorDetails error803 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0803).build();
        IntegrationEventErrorDetails error801 = IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0801).build();

        NotifyRegistryEmailServiceParams infoEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(mrtmAccount)
            .emitterId(EMITTER_ID)
            .correlationId(CORRELATION_ID)
            .errorsForMail(List.of(error801))
            .recipient(email)
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
            .integrationPoint(INTEGRATION_POINT_KEY)
            .fields(fields)
            .build();

        NotifyRegistryEmailServiceParams actionEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(mrtmAccount)
            .emitterId(EMITTER_ID)
            .correlationId(CORRELATION_ID)
            .errorsForMail(List.of(error803))
            .recipient(email)
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
            .integrationPoint(INTEGRATION_POINT_KEY)
            .fields(fields)
            .build();

        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.SCOTLAND.getCode(), email));
        when(accountQueryService.getAccountByRegistryId(TEST_REGISTRY_ID.intValue())).thenReturn(mrtmAccount);

        handler.handleResponse(event, CORRELATION_ID);
        verify(emailProperties).getEmail();
        verify(accountQueryService).getAccountByRegistryId(TEST_REGISTRY_ID.intValue());
        verify(notifyRegistryEmailService).notifyRegulator(actionEmailParams);
        verify(notifyRegistryEmailService).notifyRegulator(infoEmailParams);

        verifyNoMoreInteractions(notifyRegistryEmailService, accountQueryService);
    }
}
