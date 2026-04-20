package uk.gov.mrtm.api.mireport.accountuserscontacts;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.mireport.MiReportType;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountsUsersContactsMiReportResult;
import uk.gov.netz.api.mireport.accountuserscontacts.OperatorUserInfoDTO;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeAccountUsersContactsReportGeneratorHandlerTest {

    @InjectMocks
    private MaritimeAccountUsersContactsReportGeneratorHandler generator;

    @Mock
    private MaritimeAccountUsersContactsRepository accountUsersContactsRepository;

    @Mock
    private UserInfoApi userInfoApi;

    @Mock
    private EntityManager entityManager;

    @Test
    void getReportType() {
        assertThat(generator.getReportType()).isEqualTo(MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS);
    }

    @Test
    void getColumnNames() {
        assertThat(generator.getColumnNames()).containsExactlyElementsOf(MaritimeAccountUserContact.getColumnNames());
    }

    @Test
    void generateMiReport() {
        EmptyMiReportParams reportParams = EmptyMiReportParams.builder().build();
        String loginDate = "2022-08-18T16:48:14.729098Z";
        String permitId = "permitId";
        String imoNumber = "0000001";
        String parsedLoginDate = LocalDateTime.parse(loginDate, DateTimeFormatter.ISO_DATE_TIME).format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss"));
        MaritimeAccountUserContact accountUserContact = MaritimeAccountUserContact.builder()
                .userId("userId")
                .accountId("emitterId")
                .accountName("accountName")
                .accountStatus("accountStatus")
                .permitId(permitId)
                .primaryContact(true)
                .secondaryContact(true)
                .financialContact(true)
                .serviceContact(true)
                .authorityStatus("authorityStatus")
                .role("role")
                .imoNumber(imoNumber)
                .build();
        OperatorUserInfoDTO operatorUserInfoDTO = OperatorUserInfoDTO.builder()
                .id("userId")
                .firstName("firstname")
                .lastName("lastname")
                .email("test@test.com")
                .phoneNumber("6939")
                .phoneNumberCode("30")
                .lastLoginDate(loginDate)
                .build();
        MaritimeAccountUserContact accountUserContactExpected = MaritimeAccountUserContact.builder()
                .userId("userId")
                .accountId("emitterId")
                .accountName("accountName")
                .accountStatus("accountStatus")
                .permitId(permitId)
                .primaryContact(true)
                .secondaryContact(true)
                .financialContact(true)
                .serviceContact(true)
                .authorityStatus("authorityStatus")
                .role("Operator")
                .name(operatorUserInfoDTO.getFullName())
                .email("test@test.com")
                .telephone(operatorUserInfoDTO.getTelephone())
                .lastLogon(parsedLoginDate)
                .role("role")
                .imoNumber(imoNumber)
                .build();

        when(userInfoApi.getUsersWithAttributes(Collections.singletonList("userId"), OperatorUserInfoDTO.class)).thenReturn(
                Collections.singletonList(operatorUserInfoDTO));
        when(accountUsersContactsRepository.findAccountUserContacts(entityManager))
                .thenReturn(Collections.singletonList(accountUserContact));
        AccountsUsersContactsMiReportResult<MaritimeAccountUserContact> report =
                (AccountsUsersContactsMiReportResult<MaritimeAccountUserContact>) generator.generateMiReport(entityManager, reportParams);

        assertThat(report.getResults()).hasSize(1);
        MaritimeAccountUserContact accountUserContactActual = (MaritimeAccountUserContact) report.getResults().get(0);

        Assertions.assertEquals(accountUserContactExpected, accountUserContactActual);
    }
}
