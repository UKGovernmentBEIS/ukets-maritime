package uk.gov.mrtm.api.mireport.accountuserscontacts;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.netz.api.account.domain.AccountContactType;
import uk.gov.netz.api.authorization.core.domain.Authority;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.domain.Role;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountUserContact;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, MaritimeAccountUsersContactsRepository.class})
class MaritimeAccountUsersContactsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private MaritimeAccountUsersContactsRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAccountUserContacts() {
        Long accountId = 1L;
        String userId1 = "user1";
        String userId2 = "user2";
        String operatorRoleCode = "code";
        String roleName = "rolename";
        String imoNumber = "0000001";

        Role role = Role.builder()
                .code(operatorRoleCode)
                .name(roleName)
                .type(RoleTypeConstants.OPERATOR)
                .build();
        entityManager.persist(role);

        Authority user1Authority = Authority.builder()
                .accountId(1L)
                .code(operatorRoleCode)
                .userId(userId1)
                .status(AuthorityStatus.ACTIVE)
                .createdBy(userId1)
                .build();
        entityManager.persist(user1Authority);

        Authority user2Authority = Authority.builder()
                .accountId(1L)
                .code(operatorRoleCode)
                .userId(userId2)
                .status(AuthorityStatus.ACCEPTED)
                .createdBy(userId2)
                .build();
        entityManager.persist(user2Authority);

        Map<String, String> contacts = Map.of(
                AccountContactType.PRIMARY, userId1,
                AccountContactType.SERVICE, userId2,
                AccountContactType.FINANCIAL, userId1,
                AccountContactType.SECONDARY, userId2
        );
        MrtmAccount account = MrtmAccount.builder()
                .id(accountId)
                .name("name")
                .status(MrtmAccountStatus.LIVE)
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .emissionTradingScheme(MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME)
                .firstMaritimeActivityDate(LocalDate.of(2022, 1, 1))
                .businessId("businessId")
                .contacts(contacts)
                .imoNumber(imoNumber)
                .address(AddressState.builder()
                        .line1("line1")
                        .city("city")
                        .country("country")
                        .state("state")
                        .postcode("postcode")
                        .build())
                .build();
        entityManager.persist(account);

        flushAndClear();

        List<MaritimeAccountUserContact> expectedAccountUserContacts = List.of(
                createAccountUserContact(account,  userId1, user1Authority.getStatus(), roleName),
                createAccountUserContact(account,  userId2, user2Authority.getStatus(), roleName)
        );


        //invoke
        List<MaritimeAccountUserContact> accountUserContacts = repository.findAccountUserContacts(entityManager);

        assertEquals(2, accountUserContacts.size());
        assertThat(accountUserContacts).containsExactlyInAnyOrderElementsOf(expectedAccountUserContacts);

    }

    private MaritimeAccountUserContact createAccountUserContact(MrtmAccount account, String userId, AuthorityStatus authorityStatus, String roleName ) {
        Map<String, String> contacts = account.getContacts();

        return MaritimeAccountUserContact.builder()
                .userId(userId)
                .accountId(account.getBusinessId())
                .accountName(account.getName())
                .accountStatus(account.getStatus().name())
                .primaryContact(userId.equals(contacts.get(AccountContactType.PRIMARY)))
                .secondaryContact(userId.equals(contacts.get(AccountContactType.SECONDARY)))
                .financialContact(userId.equals(contacts.get(AccountContactType.FINANCIAL)))
                .serviceContact(userId.equals(contacts.get(AccountContactType.SERVICE)))
                .authorityStatus(authorityStatus.name())
                .role(roleName)
                .imoNumber(account.getImoNumber())
                .build();
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
