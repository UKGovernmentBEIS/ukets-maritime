package uk.gov.mrtm.api.mireport.system.accountsregulatorsitecontacts;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;
import uk.gov.netz.api.mireport.system.MiReportSystemType;
import uk.gov.netz.api.mireport.system.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsMiReportResult;
import uk.gov.netz.api.userinfoapi.UserInfo;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeAccountAssignedRegulatorSiteContactReportGeneratorHandlerTest {

    @InjectMocks
    MaritimeAccountAssignedRegulatorSiteContactReportGeneratorHandler generator;

    @Mock
    MaritimeAccountAssignedRegulatorSiteContactsRepository repository;

    @Mock
    private UserInfoApi userAuthService;

    @Mock
    private EntityManager entityManager;

    @Test
    void getReportType() {
        assertEquals(MiReportSystemType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS, generator.getReportType());
    }

    @Test
    void generateMiReport() {
        EmptyMiReportSystemParams reportParams = EmptyMiReportSystemParams.builder().build();
        String userId = UUID.randomUUID().toString();
        String imoNumber1 = "0000001";
        String imoNumber2 = "0000002";

        when(repository.findAccountAssignedRegulatorSiteContacts(entityManager)).thenReturn(
                List.of(createAccountAssignedRegulatorSiteContact("businessId1","accountName1",
                                MrtmAccountStatus.LIVE, userId, imoNumber1),
                        createAccountAssignedRegulatorSiteContact("businessId1","accountName2",
                                MrtmAccountStatus.LIVE, null, imoNumber2)
                ));

        String firstName = "fname";
        String lastName = "lname";
        when(userAuthService.getUsers(List.of(userId))).thenReturn(List.of(createUserInfo(userId, firstName, lastName,
                "email")));

        AccountAssignedRegulatorSiteContactsMiReportResult<MaritimeAccountAssignedRegulatorSiteContact> miReportResult =
                (AccountAssignedRegulatorSiteContactsMiReportResult<MaritimeAccountAssignedRegulatorSiteContact>) generator.generateMiReport(entityManager, reportParams);

        assertNotNull(miReportResult);
        assertEquals(MiReportSystemType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS, miReportResult.getReportType());
        assertEquals(2, miReportResult.getResults().size());
        MaritimeAccountAssignedRegulatorSiteContact accountAssignedRegulatorSiteContact1 = miReportResult.getResults().get(0);
        MaritimeAccountAssignedRegulatorSiteContact accountAssignedRegulatorSiteContact2 = miReportResult.getResults().get(1);
        assertEquals(userId, accountAssignedRegulatorSiteContact1.getUserId());
        assertEquals("fname lname", accountAssignedRegulatorSiteContact1.getAssignedRegulatorName());
        assertEquals(imoNumber1, accountAssignedRegulatorSiteContact1.getImoNumber());
        assertNull(accountAssignedRegulatorSiteContact2.getUserId());
        assertNull(accountAssignedRegulatorSiteContact2.getAssignedRegulatorName());
        assertEquals(imoNumber2, accountAssignedRegulatorSiteContact2.getImoNumber());

    }

    @Test
    void getColumnNames() {
        assertThat(generator.getColumnNames()).containsExactlyElementsOf(MaritimeAccountAssignedRegulatorSiteContact.getColumnNames());
    }

    private UserInfo createUserInfo(String id, String firstName, String lastName, String email) {
        return UserInfo.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .enabled(true)
                .build();
    }

    private MaritimeAccountAssignedRegulatorSiteContact createAccountAssignedRegulatorSiteContact(String businessId, String accountName,
                                                                                                  MrtmAccountStatus accountStatus,
                                                                                                  String userId, String imoNumber) {
        return MaritimeAccountAssignedRegulatorSiteContact.builder()
                .accountId(businessId)
                .accountName(accountName)
                .accountStatus(accountStatus.name())
                .userId(userId)
                .imoNumber(imoNumber)
                .build();
    }
}
