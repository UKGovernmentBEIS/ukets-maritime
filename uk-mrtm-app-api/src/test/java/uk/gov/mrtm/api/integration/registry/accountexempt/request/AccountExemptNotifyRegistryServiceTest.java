package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEvent;

import java.time.Year;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountExemptNotifyRegistryServiceTest {

    private static final long ACCOUNT_ID = 1L;

    @InjectMocks
    private AccountExemptNotifyRegistryService service;

    @Mock
    private AccountExemptSendToRegistryProducer accountExemptSendToRegistryProducer;
    @Mock
    private KafkaTemplate<String, AccountExemptionUpdateEvent> accountExemptKafkaTemplate;
    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void notifyRegistry(boolean isExempt) {
        int registryId = 1234567;
        AccountExemptEvent event = AccountExemptEvent.builder()
            .year(Year.now())
            .isExempt(isExempt)
            .accountId(ACCOUNT_ID).build();
        MrtmAccount account = MrtmAccount.builder()
            .id(ACCOUNT_ID)
            .registryId(registryId)
            .build();
        AccountExemptionUpdateEvent accountExemptionUpdateEvent = AccountExemptionUpdateEvent.builder()
            .exemptionFlag(isExempt)
            .registryId((long) registryId)
            .reportingYear(Year.now())
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);

        service.notifyRegistry(event);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(accountExemptSendToRegistryProducer).produce(accountExemptionUpdateEvent, accountExemptKafkaTemplate);
        verifyNoMoreInteractions(mrtmAccountQueryService, accountExemptSendToRegistryProducer);
    }

    @Test
    void notifyRegistry_when_registry_id_is_null() {
        AccountExemptEvent event = AccountExemptEvent.builder().accountId(ACCOUNT_ID).build();
        MrtmAccount account = MrtmAccount.builder().id(ACCOUNT_ID).build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);

        service.notifyRegistry(event);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verifyNoMoreInteractions(mrtmAccountQueryService);
        verifyNoInteractions(accountExemptSendToRegistryProducer);
    }
}