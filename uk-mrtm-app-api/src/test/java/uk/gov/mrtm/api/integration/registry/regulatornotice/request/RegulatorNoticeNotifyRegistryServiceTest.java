package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeNotificationType;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeNotifyRegistryServiceTest {
    private static final long ACCOUNT_ID = 1L;
    private static final String BUSINESS_ID = "businessId";

    @InjectMocks
    private RegulatorNoticeNotifyRegistryService service;

    @Mock
    private RegulatorNoticeSendToRegistryProducer regulatorNoticeSendToRegistryProducer;
    @Mock
    private KafkaTemplate<String, RegulatorNoticeEvent> regulatorNoticeKafkaTemplate;
    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;
    @Mock
    private NotifyRegistryEmailService notifyRegistryEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void notifyRegistry_registry_id_is_null() {
        MrtmRegulatorNoticeEvent event = MrtmRegulatorNoticeEvent.builder().accountId(ACCOUNT_ID).build();
        MrtmAccount account = MrtmAccount.builder()
            .id(ACCOUNT_ID)
            .businessId(BUSINESS_ID)
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();
        String recipient =  "recipient@recipient";
        RegulatorNoticeSubmittedEventDetails expectedResponse = RegulatorNoticeSubmittedEventDetails.builder()
            .notifiedRegistry(false)
            .build();
        NotifyRegistryEmailServiceParams emailServiceParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId(BUSINESS_ID)
            .recipient(recipient)
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_ACCOUNT_UPDATE_MISSING_REGISTRY_ID_TEMPLATE)
            .integrationPoint("Regulator notice")
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), recipient));

        RegulatorNoticeSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(emailProperties).getEmail();
        verify(notifyRegistryEmailService).notifyRegulator(emailServiceParams);
        verifyNoMoreInteractions(mrtmAccountQueryService, emailProperties, notifyRegistryEmailService);
        verifyNoInteractions(regulatorNoticeSendToRegistryProducer, regulatorNoticeKafkaTemplate);
    }


    @Test
    void notifyRegistry_registry_id_is_not_null() {
        byte[] file = "content".getBytes();
        String fileName = "fileName";
        MrtmRegulatorNoticeNotificationType notificationType = mock(MrtmRegulatorNoticeNotificationType.class);
        MrtmRegulatorNoticeEvent event = MrtmRegulatorNoticeEvent.builder()
            .accountId(ACCOUNT_ID)
            .fileName(fileName)
            .file(file)
            .notificationType(notificationType)
            .build();
        int registryId = 1234567;
        MrtmAccount account = MrtmAccount.builder()
            .id(ACCOUNT_ID)
            .businessId(BUSINESS_ID)
            .registryId(registryId)
            .build();
        RegulatorNoticeEvent regulatorNoticeEvent = RegulatorNoticeEvent.builder()
            .registryId(String.valueOf(registryId))
            .fileName(fileName)
            .fileData(file)
            .build();
        RegulatorNoticeSubmittedEventDetails expectedResponse = RegulatorNoticeSubmittedEventDetails.builder()
            .notifiedRegistry(true)
            .data(regulatorNoticeEvent)
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);

        RegulatorNoticeSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(regulatorNoticeSendToRegistryProducer).produce(regulatorNoticeEvent, regulatorNoticeKafkaTemplate);

        verifyNoMoreInteractions(mrtmAccountQueryService, regulatorNoticeSendToRegistryProducer);
        verifyNoInteractions(notifyRegistryEmailService, emailProperties);
    }
}