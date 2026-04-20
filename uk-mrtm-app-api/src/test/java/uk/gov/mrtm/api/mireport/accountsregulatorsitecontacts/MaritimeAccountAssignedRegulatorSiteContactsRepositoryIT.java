package uk.gov.mrtm.api.mireport.accountsregulatorsitecontacts;

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
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, MaritimeAccountAssignedRegulatorSiteContactsRepository.class})
class MaritimeAccountAssignedRegulatorSiteContactsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private MaritimeAccountAssignedRegulatorSiteContactsRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAccountAssignedRegulatorSiteContacts() {
        String userId1 = "userId1";
        String userId2 = "userId2";

        String imoNumber1 = "0000001";
        String imoNumber2 = "0000002";
        String imoNumber3 = "0000003";
        String imoNumber4 = "0000004";


        Authority userAuthority = Authority.builder()
                .userId(userId1)
                .status(AuthorityStatus.ACTIVE)
                .createdBy("createdBy")
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .build();
        entityManager.persist(userAuthority);

        MrtmAccount account1 = createAccount(1L, "accountName1", MrtmAccountStatus.LIVE, Map.of(AccountContactType.CA_SITE, userId1), imoNumber1);
        entityManager.persist(account1);
        MrtmAccount account2 = createAccount(2L, "accountName2", MrtmAccountStatus.LIVE, Map.of(AccountContactType.CA_SITE, userId2), imoNumber2);
        entityManager.persist(account2);
        MrtmAccount account3 = createAccount(3L, "accountName3", MrtmAccountStatus.LIVE, Map.of(AccountContactType.PRIMARY, "primaryContactUser"), imoNumber3);
        entityManager.persist(account3);
        MrtmAccount account4 = createAccount(4L, "accountName4", MrtmAccountStatus.CLOSED, Map.of(AccountContactType.CA_SITE, userId1), imoNumber4);
        entityManager.persist(account4);

        flushAndClear();

        List<MaritimeAccountAssignedRegulatorSiteContact> expectedAccountAssignedRegulatorSiteContacts = List.of(
                createAccountAssignedRegulatorSiteContact(account4,  userAuthority.getStatus()),
                createAccountAssignedRegulatorSiteContact(account1,  userAuthority.getStatus()),
                createAccountAssignedRegulatorSiteContact(account2,  null),
                createAccountAssignedRegulatorSiteContact(account3,  null)
        );

        List<MaritimeAccountAssignedRegulatorSiteContact> accountAssignedRegulatorSiteContacts =
                repository.findAccountAssignedRegulatorSiteContacts(entityManager);

        assertEquals(4, accountAssignedRegulatorSiteContacts.size());
        assertThat(accountAssignedRegulatorSiteContacts).containsExactlyElementsOf(expectedAccountAssignedRegulatorSiteContacts);
    }

    private MrtmAccount createAccount(Long id, String name, MrtmAccountStatus status, Map<String, String> contacts, String imoNumber) {
        return MrtmAccount.builder()
                .businessId(String.valueOf(id))
                .id(id)
                .name(name)
                .status(status)
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .emissionTradingScheme(MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME)
                .contacts(contacts)
                .imoNumber(imoNumber)
                .firstMaritimeActivityDate(LocalDate.now())
                .address(AddressState.builder()
                        .line1("line1")
                        .city("city")
                        .state("state")
                        .country("country")
                        .postcode("postcode")
                        .build())
                .build();
    }

    private MaritimeAccountAssignedRegulatorSiteContact createAccountAssignedRegulatorSiteContact(MrtmAccount account, AuthorityStatus authorityStatus) {
        Map<String, String> contacts = account.getContacts();

        return MaritimeAccountAssignedRegulatorSiteContact.builder()
                .accountId(account.getBusinessId())
                .accountName(account.getName())
                .accountStatus(account.getStatus().getName())
                .authorityStatus(authorityStatus != null ? authorityStatus.name() : null)
                .userId(!contacts.isEmpty() ? contacts.get(AccountContactType.CA_SITE) : null )
                .imoNumber(account.getImoNumber())
                .build();
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
