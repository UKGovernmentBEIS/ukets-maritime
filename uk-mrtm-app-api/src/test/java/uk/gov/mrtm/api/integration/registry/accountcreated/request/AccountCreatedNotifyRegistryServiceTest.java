package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.RegisteredAddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;

import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountCreatedNotifyRegistryServiceTest {
    private static final String EMP_ID = "UK-1";
    private static final Long ACCOUNT_ID = 1L;
    private static final String EMITTER_ID = "MA000001";
    private static final String ACCOUNT_NAME = "name";
    private static final String IMO_NUMBER = "0000000";

    @InjectMocks
    private AccountCreatedNotifyRegistryService accountCreatedNotifyRegistryService;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Mock
    private AccountCreatedSendToRegistryProducer accountCreatedSendToRegistryProducer;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Mock
    private KafkaTemplate<String, AccountOpeningEvent> accountCreatedKafkaTemplate;

    @Captor
    private ArgumentCaptor<AccountOpeningEvent> accountOpeningEventArgumentCaptor;

    @ParameterizedTest
    @MethodSource("notifyRegistrySuccessScenarios")
    void notifyRegistry(Optional<String> empIdOptional, String empId) {
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.NORTHERN_IRELAND;
        LocalDate firstMaritimeActivity = LocalDate.of(2025, 3, 16);

        MrtmAccount account = createAccount(EMITTER_ID, ACCOUNT_NAME, IMO_NUMBER, ca, firstMaritimeActivity);

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(empQueryService.getEmpIdByAccountId(ACCOUNT_ID)).thenReturn(empIdOptional);

        accountCreatedNotifyRegistryService.notifyRegistry(createEvent());

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(empQueryService).getEmpIdByAccountId(ACCOUNT_ID);
        verify(accountCreatedSendToRegistryProducer).produce(accountOpeningEventArgumentCaptor.capture(),
                eq(accountCreatedKafkaTemplate));
        verifyNoMoreInteractions(accountQueryService, accountCreatedSendToRegistryProducer, empQueryService);

        final AccountOpeningEvent accountOpeningEventCaptured = accountOpeningEventArgumentCaptor.getValue();
        assertEquals(EMITTER_ID, accountOpeningEventCaptured.getAccountDetails().getEmitterId());
        assertEquals(ACCOUNT_NAME, accountOpeningEventCaptured.getAccountDetails().getAccountName());
        assertEquals(empId, accountOpeningEventCaptured.getAccountDetails().getMonitoringPlanId());
        assertEquals(IMO_NUMBER, accountOpeningEventCaptured.getAccountDetails().getCompanyImoNumber());
        assertEquals("DAERA", accountOpeningEventCaptured.getAccountDetails().getRegulator());
        assertEquals(2025, accountOpeningEventCaptured.getAccountDetails().getFirstYearOfVerifiedEmissions());
        assertEquals("ORGANISATION", accountOpeningEventCaptured.getAccountHolder().getAccountHolderType());
        assertEquals(ACCOUNT_NAME, accountOpeningEventCaptured.getAccountHolder().getName());
        assertEquals("line1", accountOpeningEventCaptured.getAccountHolder().getAddressLine1());
        assertEquals("line2", accountOpeningEventCaptured.getAccountHolder().getAddressLine2());
        assertEquals("city", accountOpeningEventCaptured.getAccountHolder().getTownOrCity());
        assertEquals("state", accountOpeningEventCaptured.getAccountHolder().getStateOrProvince());
        assertEquals("UK", accountOpeningEventCaptured.getAccountHolder().getCountry());
        assertEquals("postcode", accountOpeningEventCaptured.getAccountHolder().getPostalCode());
        Assertions.assertFalse(accountOpeningEventCaptured.getAccountHolder().getCrnNotExist());
        assertEquals("registration number", accountOpeningEventCaptured.getAccountHolder().getCompanyRegistrationNumber());
        assertNull(accountOpeningEventCaptured.getAccountHolder().getCrnJustification());
    }

    public static Stream<Arguments> notifyRegistrySuccessScenarios() {
        return Stream.of(
            Arguments.of(Optional.of(EMP_ID), EMP_ID),
            Arguments.of(Optional.empty(), null)
        );
    }

    @Test
    void notifyRegistry_registry_id_exists() {
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.NORTHERN_IRELAND;
        LocalDate firstMaritimeActivity = LocalDate.of(2025, 3, 16);
        MrtmAccount account = createAccount(EMITTER_ID, ACCOUNT_NAME, IMO_NUMBER, ca, firstMaritimeActivity);
        account.setRegistryId(1000000);

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        final EmpApprovedEvent event = createEvent();
        BusinessException be = assertThrows(BusinessException.class, () -> accountCreatedNotifyRegistryService.notifyRegistry(event));
        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INTEGRATION_REGISTRY_ACCOUNT_CREATION_REGISTRY_ID_EXISTS);

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verifyNoMoreInteractions(accountQueryService);
        verifyNoInteractions(accountCreatedSendToRegistryProducer, empQueryService);
    }

    private EmpApprovedEvent createEvent() {
        return EmpApprovedEvent.builder()
            .accountId(ACCOUNT_ID)
            .emissionsMonitoringPlan(
                EmissionsMonitoringPlan.builder()
                    .operatorDetails(EmpOperatorDetails.builder()
                        .organisationStructure(LimitedCompanyOrganisation.builder()
                            .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                            .registrationNumber("registration number")
                            .registeredAddress(
                                AddressStateDTO.builder()
                                    .line1("line1")
                                    .line2("line2")
                                    .city("city")
                                    .state("state")
                                    .country("GB")
                                    .postcode("postcode")
                                    .build()
                            )
                            .build())
                        .build())
                    .build())
            .build();
    }

    private MrtmAccount createAccount(String emitterId, String accountName, String imoNumber,
                                      CompetentAuthorityEnum ca, LocalDate firstMaritimeActivity) {
        return MrtmAccount.builder()
                .id(ACCOUNT_ID)
                .businessId(emitterId)
                .name(accountName)
                .imoNumber(imoNumber)
                .competentAuthority(ca)
                .firstMaritimeActivityDate(firstMaritimeActivity)
                .registeredAddress(RegisteredAddressState.builder()
                        .line1("account line1")
                        .line2("account line2")
                        .city("account city")
                        .state("account state")
                        .country("account GB")
                        .postcode("account postcode")
                        .build())
                .build();
    }
}
