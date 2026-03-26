package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.netz.api.account.service.AccountContactQueryService;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.netz.api.common.domain.PhoneNumberDTO;
import uk.gov.netz.api.user.operator.domain.OperatorUserDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserAuthService;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;
import uk.gov.netz.integration.model.metscontacts.MetsContactsMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.integration.registry.accountcontacts.domain.RegistryAccountContactUserType.CONSULTANT_AGENT;
import static uk.gov.mrtm.api.integration.registry.accountcontacts.domain.RegistryAccountContactUserType.EMITTER;
import static uk.gov.mrtm.api.integration.registry.accountcontacts.domain.RegistryAccountContactUserType.OPERATOR;
import static uk.gov.mrtm.api.integration.registry.accountcontacts.domain.RegistryAccountContactUserType.OPERATOR_ADMIN;

@ExtendWith(MockitoExtension.class)
class AccountContactsNotifyRegistryServiceTest {
    private static final Long ACCOUNT_ID_1 = 1L;
    private static final Long ACCOUNT_ID_2 = 2L;

    @InjectMocks
    private AccountContactsNotifyRegistryService service;

    @Mock
    private MrtmAccountQueryService accountQueryService;
    @Mock
    private AccountContactsSendToRegistryProducer accountContactsSendToRegistryProducer;
    @Mock
    private OperatorAuthorityQueryService operatorAuthorityQueryService;
    @Mock
    private AccountContactQueryService accountContactQueryService;
    @Mock
    private KafkaTemplate<String, MetsContactsEvent> accountContactsKafkaTemplate;
    @Mock
    private OperatorUserAuthService operatorUserAuthService;

    @Test
    void notifyRegistry_when_registry_id_is_null() {
        AccountContactsRegistryEvent event = AccountContactsRegistryEvent.builder()
            .accountIds(Set.of(ACCOUNT_ID_1))
            .build();

        when(accountQueryService.getAccountById(ACCOUNT_ID_1)).thenReturn(MrtmAccount.builder().build());

        service.notifyRegistry(event);

        verify(accountQueryService).getAccountById(ACCOUNT_ID_1);
        verifyNoMoreInteractions(accountQueryService);
        verifyNoInteractions(accountContactsSendToRegistryProducer, operatorAuthorityQueryService,
            accountContactQueryService, operatorUserAuthService);
    }

    @ParameterizedTest
    @MethodSource
    void notifyRegistry(String mrtmOperatorRoleCode1, String registryOperatorRoleCode1,
                        String mrtmOperatorRoleCode2, String registryOperatorRoleCode2) {
        AccountContactsRegistryEvent event = AccountContactsRegistryEvent.builder()
            .accountIds(Set.of(ACCOUNT_ID_1, ACCOUNT_ID_2))
            .build();

        int registryId1 = 1234567;
        int registryId2 = 7654321;
        MrtmAccount mrtmAccount1 = MrtmAccount.builder().id(ACCOUNT_ID_1).registryId(registryId1).build();
        MrtmAccount mrtmAccount2 = MrtmAccount.builder().id(ACCOUNT_ID_2).registryId(registryId2).build();
        String userId1 = "userId1";
        String userId2 = "userId2";
        List<AuthorityRoleDTO> authorityRoleDTOList1 = List.of(
            AuthorityRoleDTO.builder().userId(userId1).roleCode(mrtmOperatorRoleCode1).build()
        );
        List<AuthorityRoleDTO> authorityRoleDTOList2 = List.of(
            AuthorityRoleDTO.builder().userId(userId1).roleCode(mrtmOperatorRoleCode1).build(),
            AuthorityRoleDTO.builder().userId(userId2).roleCode(mrtmOperatorRoleCode2).build()
        );
        Map<String, String> accountContacts1 = new HashMap<>();
        accountContacts1.put("PRIMARY", userId1);
        accountContacts1.put("SERVICE", userId1);
        Map<String, String> accountContacts2 = Map.of("PRIMARY", userId2);
        OperatorUserDTO operatorUserDTO1 = OperatorUserDTO.builder()
            .firstName("firstName1")
            .lastName("lastName1")
            .email("email1")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("phoneNumberCountryCode1").number("phoneNumber1").build())
            .mobileNumber(PhoneNumberDTO.builder().countryCode("mobileNumberCountryCode1").number("mobileNumber1").build())
            .build();
        OperatorUserDTO operatorUserDTO2 = OperatorUserDTO.builder()
            .firstName("firstName2")
            .lastName("lastName2")
            .email("email2")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("phoneNumberCountryCode2").number("phoneNumber2").build())
            .mobileNumber(PhoneNumberDTO.builder().countryCode("mobileNumberCountryCode2").number("mobileNumber2").build())
            .build();
        MetsContactsEvent metsContactsEvent1 = getMetsContactsEvent1(registryOperatorRoleCode1, registryId1);
        MetsContactsEvent metsContactsEvent2 = getMetsContactsEvent2(registryOperatorRoleCode1, registryOperatorRoleCode2, registryId2);

        when(accountQueryService.getAccountById(ACCOUNT_ID_1)).thenReturn(mrtmAccount1);
        when(accountQueryService.getAccountById(ACCOUNT_ID_2)).thenReturn(mrtmAccount2);
        when(operatorAuthorityQueryService.findOperatorUserAuthorityRoleListByAccountAndStatus
            (ACCOUNT_ID_1, Set.of(AuthorityStatus.ACTIVE))).thenReturn(authorityRoleDTOList1);
        when(operatorAuthorityQueryService.findOperatorUserAuthorityRoleListByAccountAndStatus
            (ACCOUNT_ID_2, Set.of(AuthorityStatus.ACTIVE))).thenReturn(authorityRoleDTOList2);
        when(accountContactQueryService.findOperatorContactTypesByAccount(ACCOUNT_ID_1))
            .thenReturn(accountContacts1);
        when(accountContactQueryService.findOperatorContactTypesByAccount(ACCOUNT_ID_2))
            .thenReturn(accountContacts2);
        when(operatorUserAuthService.getUserById(userId1)).thenReturn(operatorUserDTO1);
        when(operatorUserAuthService.getUserById(userId2)).thenReturn(operatorUserDTO2);

        service.notifyRegistry(event);

        verify(accountQueryService).getAccountById(ACCOUNT_ID_1);
        verify(accountQueryService).getAccountById(ACCOUNT_ID_2);
        verify(operatorUserAuthService, times(1)).getUserById(userId1);
        verify(operatorUserAuthService, times(1)).getUserById(userId2);
        verify(operatorAuthorityQueryService)
            .findOperatorUserAuthorityRoleListByAccountAndStatus(ACCOUNT_ID_1, Set.of(AuthorityStatus.ACTIVE));
        verify(operatorAuthorityQueryService)
            .findOperatorUserAuthorityRoleListByAccountAndStatus(ACCOUNT_ID_2, Set.of(AuthorityStatus.ACTIVE));
        verify(accountContactQueryService).findOperatorContactTypesByAccount(ACCOUNT_ID_1);
        verify(accountContactQueryService).findOperatorContactTypesByAccount(ACCOUNT_ID_2);
        verify(accountContactsSendToRegistryProducer).produce(metsContactsEvent1, accountContactsKafkaTemplate);
        verify(accountContactsSendToRegistryProducer).produce(metsContactsEvent2, accountContactsKafkaTemplate);

        verifyNoMoreInteractions(accountQueryService, accountContactQueryService, operatorAuthorityQueryService,
            operatorUserAuthService, accountContactsSendToRegistryProducer);
    }

    private static Stream<Arguments> notifyRegistry() {
        return Stream.of(
            Arguments.of("operator_admin", OPERATOR_ADMIN.name(), "operator", OPERATOR.name()),
            Arguments.of("consultant_agent", CONSULTANT_AGENT.name(), "emitter_contact", EMITTER.name())
        );
    }

    private MetsContactsEvent getMetsContactsEvent2(String registryOperatorRoleCode1, String registryOperatorRoleCode2, int registryId2) {
        return MetsContactsEvent.builder()
            .operatorId(String.valueOf(registryId2))
            .details(List.of(
                MetsContactsMessage.builder()
                    .firstName("firstName1")
                    .lastName("lastName1")
                    .telephoneCountryCode("phoneNumberCountryCode1")
                    .telephoneNumber("phoneNumber1")
                    .mobilePhoneCountryCode("mobileNumberCountryCode1")
                    .mobileNumber("mobileNumber1")
                    .email("email1")
                    .userType(registryOperatorRoleCode1)
                    .contactTypes(List.of())
                    .build(),
                MetsContactsMessage.builder()
                    .firstName("firstName2")
                    .lastName("lastName2")
                    .telephoneCountryCode("phoneNumberCountryCode2")
                    .telephoneNumber("phoneNumber2")
                    .mobilePhoneCountryCode("mobileNumberCountryCode2")
                    .mobileNumber("mobileNumber2")
                    .email("email2")
                    .userType(registryOperatorRoleCode2)
                    .contactTypes(List.of("PRIMARY"))
                    .build()
            ))
            .build();
    }

    private MetsContactsEvent getMetsContactsEvent1(String registryOperatorRoleCode1, int registryId1) {
        return MetsContactsEvent.builder()
            .operatorId(String.valueOf(registryId1))
            .details(List.of(
                MetsContactsMessage.builder()
                    .firstName("firstName1")
                    .lastName("lastName1")
                    .telephoneCountryCode("phoneNumberCountryCode1")
                    .telephoneNumber("phoneNumber1")
                    .mobilePhoneCountryCode("mobileNumberCountryCode1")
                    .mobileNumber("mobileNumber1")
                    .email("email1")
                    .userType(registryOperatorRoleCode1)
                    .contactTypes(List.of("PRIMARY", "SERVICE"))
                    .build()
            ))
            .build();
    }
}