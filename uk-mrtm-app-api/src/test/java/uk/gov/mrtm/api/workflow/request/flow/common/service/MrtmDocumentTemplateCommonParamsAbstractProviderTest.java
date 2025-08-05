package uk.gov.mrtm.api.workflow.request.flow.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanIdentifierGenerator;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
import uk.gov.netz.api.account.domain.AccountContactType;
import uk.gov.netz.api.account.service.AccountContactQueryService;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.referencedata.domain.Country;
import uk.gov.netz.api.referencedata.service.CountryService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmDocumentTemplateCommonParamsAbstractProviderTest {
    private static final long ACCOUNT_ID = 1L;

    @InjectMocks
    private MrtmDocumentTemplateCommonParamsAbstractProvider mrtmDocumentTemplateCommonParamsAbstractProvider;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;
    @Mock
    private CountryService countryService;
    @Mock
    private AccountContactQueryService accountContactQueryService;
    @Mock
    private UserAuthService userAuthService;
    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;
    @Mock
    private EmissionsMonitoringPlanIdentifierGenerator generator;

    @Test
    void getPermitReferenceId() {
        String id = "id";
        when(empQueryService.getEmpIdByAccountId(ACCOUNT_ID)).thenReturn(Optional.of(id));
        assertEquals("id", mrtmDocumentTemplateCommonParamsAbstractProvider.getPermitReferenceId(ACCOUNT_ID));

        verify(generator).generate(ACCOUNT_ID);
        verify(empQueryService).getEmpIdByAccountId(ACCOUNT_ID);
        verifyNoMoreInteractions(empQueryService, generator);
        verifyNoInteractions(mrtmAccountQueryService, countryService, accountContactQueryService, userAuthService);
    }

    @Test
    void getPermitReferenceId_when_getEmpIdByAccountId_is_null() {
        String id = "id";
        when(generator.generate(ACCOUNT_ID)).thenReturn(id);
        assertEquals("id", mrtmDocumentTemplateCommonParamsAbstractProvider.getPermitReferenceId(ACCOUNT_ID));

        verify(empQueryService).getEmpIdByAccountId(ACCOUNT_ID);
        verify(generator).generate(ACCOUNT_ID);
        verifyNoMoreInteractions(empQueryService, generator);
        verifyNoInteractions(mrtmAccountQueryService, countryService, accountContactQueryService, userAuthService);
    }

    @Test
    void testGetAccountTemplateParams() {
        String serviceContactId = UUID.randomUUID().toString();
        UserInfoDTO serviceContactUserInfoDTO = UserInfoDTO.builder()
            .userId(serviceContactId)
            .firstName("Foo")
            .lastName("Bar")
            .email("Foo@Bar")
            .build();

        String primaryContactId = UUID.randomUUID().toString();
        UserInfoDTO primaryContactUserInfoDTO = UserInfoDTO.builder()
            .userId(serviceContactId)
            .firstName("John")
            .lastName("Doe")
            .email("John@Doe")
            .build();

        AddressState addressState = AddressState
            .builder()
            .line1("line1")
            .line2("line2")
            .country("GR")
            .postcode("123")
            .city("city")
            .build();

        String imoNumber = "1234567";
        String name = "name";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.OPRED;
        String location = String.format("%s\n%s\n%s\n%s\n%s",
            addressState.getLine1(),
            addressState.getLine2(),
            addressState.getCity(),
            addressState.getPostcode(),
            "Greece");

        MrtmAccountTemplateParams expected = MrtmAccountTemplateParams.builder()
            .imoNumber(imoNumber)
            .name(name)
            .competentAuthority(competentAuthority)
            .location(location)
            .primaryContact(primaryContactUserInfoDTO.getFullName())
            .primaryContactEmail(primaryContactUserInfoDTO.getEmail())
            .serviceContact(serviceContactUserInfoDTO.getFullName())
            .serviceContactFirstName(serviceContactUserInfoDTO.getFirstName())
            .serviceContactEmail(serviceContactUserInfoDTO.getEmail())
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(MrtmAccount.builder()
            .imoNumber(imoNumber)
            .name(name)
            .competentAuthority(competentAuthority)
            .address(addressState)
            .build());

        when(countryService.getReferenceData())
            .thenReturn(List.of(Country.builder().code(addressState.getCountry()).name("Greece").build()));
        when(accountContactQueryService.findContactByAccountAndContactType(
            ACCOUNT_ID, AccountContactType.SERVICE)).thenReturn(Optional.of(serviceContactId));
        when(userAuthService.getUserByUserId(serviceContactId)).thenReturn(serviceContactUserInfoDTO);

        when(accountContactQueryService.findContactByAccountAndContactType(
            ACCOUNT_ID, AccountContactType.PRIMARY)).thenReturn(Optional.of(primaryContactId));
        when(userAuthService.getUserByUserId(primaryContactId)).thenReturn(primaryContactUserInfoDTO);

        MrtmAccountTemplateParams actual =
            mrtmDocumentTemplateCommonParamsAbstractProvider.getAccountTemplateParams(ACCOUNT_ID);


        assertEquals(expected, actual);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(countryService).getReferenceData();
        verify(accountContactQueryService).findContactByAccountAndContactType(ACCOUNT_ID, AccountContactType.SERVICE);
        verify(userAuthService).getUserByUserId(serviceContactId);
        verify(accountContactQueryService).findContactByAccountAndContactType(ACCOUNT_ID, AccountContactType.PRIMARY);
        verify(userAuthService).getUserByUserId(primaryContactId);

        verifyNoMoreInteractions(mrtmAccountQueryService, countryService, accountContactQueryService, userAuthService);
    }

    @Test
    void testGetAccountTemplateParams_when_no_contact_exists() {
        AddressState addressState = AddressState
            .builder()
            .line1("line1")
            .line2("line2")
            .country("GR")
            .postcode("123")
            .city("city")
            .build();

        String imoNumber = "1234567";
        String name = "name";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.OPRED;
        String location = String.format("%s\n%s\n%s\n%s\n%s",
            addressState.getLine1(),
            addressState.getLine2(),
            addressState.getCity(),
            addressState.getPostcode(),
            "Greece");

        MrtmAccountTemplateParams expected = MrtmAccountTemplateParams.builder()
            .imoNumber(imoNumber)
            .name(name)
            .competentAuthority(competentAuthority)
            .location(location)
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(MrtmAccount.builder()
            .imoNumber(imoNumber)
            .name(name)
            .competentAuthority(competentAuthority)
            .address(addressState)
            .build());

        when(countryService.getReferenceData())
            .thenReturn(List.of(Country.builder().code(addressState.getCountry()).name("Greece").build()));
        when(accountContactQueryService.findContactByAccountAndContactType(
            ACCOUNT_ID, AccountContactType.SERVICE)).thenReturn(Optional.empty());

        when(accountContactQueryService.findContactByAccountAndContactType(
            ACCOUNT_ID, AccountContactType.PRIMARY)).thenReturn(Optional.empty());

        MrtmAccountTemplateParams actual =
            mrtmDocumentTemplateCommonParamsAbstractProvider.getAccountTemplateParams(ACCOUNT_ID);

        assertEquals(expected, actual);

        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(countryService).getReferenceData();
        verify(accountContactQueryService).findContactByAccountAndContactType(ACCOUNT_ID, AccountContactType.SERVICE);
        verify(accountContactQueryService).findContactByAccountAndContactType(ACCOUNT_ID, AccountContactType.PRIMARY);

        verifyNoMoreInteractions(mrtmAccountQueryService, countryService, accountContactQueryService, userAuthService);
        verifyNoMoreInteractions(userAuthService);
    }
}
