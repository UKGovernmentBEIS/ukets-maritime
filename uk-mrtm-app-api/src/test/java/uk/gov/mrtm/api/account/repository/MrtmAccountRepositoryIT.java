package uk.gov.mrtm.api.account.repository;

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
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.netz.api.account.domain.AccountContactType;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class MrtmAccountRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private MrtmAccountRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void existsByImoNumber() {
        String imoNumber1 = "0000000";
        String imoNumber2 = "0000001";
        createAccount(1L, imoNumber1, null);
        createAccount(2L, imoNumber2, null);

        assertTrue(repository.existsByImoNumber(imoNumber1));
        assertTrue(repository.existsByImoNumber(imoNumber2));
        assertFalse(repository.existsByImoNumber("0000002"));
    }

    @Test
    void findAllByStatusIn() {
        MrtmAccount account1 = createAccount(1L, "0000000", null);

        assertEquals(1, repository.findAllByStatusIn(List.of(MrtmAccountStatus.NEW)).size());
        assertEquals(account1, repository.findAllByStatusIn(List.of(MrtmAccountStatus.NEW)).getFirst());
        assertEquals(0, repository.findAllByStatusIn(List.of(MrtmAccountStatus.WITHDRAWN)).size());
    }

    @Test
    void findByImoNumber() {
        String imoNumber1 = "0000000";
        String imoNumber2 = "0000001";
        MrtmAccount account1 = createAccount(1L, imoNumber1, null);
        MrtmAccount account2 = createAccount(2L, imoNumber2, null);

        assertEquals(account1, repository.findByImoNumber(imoNumber1).get());
        assertEquals(account2, repository.findByImoNumber(imoNumber2).get());
        assertTrue(repository.findByImoNumber("0000002").isEmpty());
    }

    @Test
    void findAccountIdByImoNumber() {
        String imoNumber1 = "0000000";
        String imoNumber2 = "0000001";
        long accountId1 = 1L;
        long accountId2 = 2L;
        createAccount(accountId1, imoNumber1, null);
        createAccount(accountId2, imoNumber2, null);

        assertEquals(accountId1, repository.findAccountIdByImoNumber(imoNumber1).get());
        assertEquals(accountId2, repository.findAccountIdByImoNumber(imoNumber2).get());
        assertTrue(repository.findAccountIdByImoNumber("0000002").isEmpty());
    }


    @Test
    void findVerificationBodyIdByImoNumber() {
        String imoNumber1 = "0000000";
        long accountId1 = 1L;
        createAccount(accountId1, imoNumber1, null);

        assertEquals(100L, repository.findVerificationBodyIdByImoNumber(imoNumber1).get());
        assertTrue(repository.findVerificationBodyIdByImoNumber("0000002").isEmpty());
    }

    @Test
    void findByBusinessId() {
        long accountId1 = 1234L;
        long accountId2 = 4321L;

        MrtmAccount account1 = createAccount(accountId1, "0000000", null);
        MrtmAccount account2 = createAccount(accountId2, "0000001", null);

        assertEquals(account1, repository.findByBusinessId(String.valueOf(accountId1)));
        assertEquals(account2, repository.findByBusinessId(String.valueOf(accountId2)));
        assertNull(repository.findByBusinessId("1"));
    }

    @Test
    void findByRegistryId() {
        int registryId1 = 1234567;
        int registryId2 = 7654321;

        createAccount(1234L, "1111111", registryId1);

        assertTrue(repository.findByRegistryId(registryId1).isPresent());
        assertFalse(repository.findByRegistryId(registryId2).isPresent());
    }

    @Test
    void findByUserId() {
        String imoNumber1 = "0000000";
        String imoNumber2 = "0000001";
        String imoNumber3 = "0000003";
        String contactValue1 = "01";
        String contactValue2 = "02";
        MrtmAccount account1 = createAccountWithContacts(1L, imoNumber1, contactValue1);
        MrtmAccount account2 = createAccountWithContacts(2L, imoNumber2, contactValue2);
        MrtmAccount account3 = createAccountWithContacts(3L, imoNumber3, contactValue1);

        assertEquals(List.of(account1, account3), repository.findByUserId("primaryContact" + contactValue1));
        assertEquals(List.of(account2), repository.findByUserId("secondaryContact" + contactValue2));
        assertEquals(List.of(), repository.findByUserId("notExistingServiceContact"));
    }

    @Test
    void existsByImoNumberAndId() {
        String imoNumber1 = "0000001";
        String imoNumber2 = "0000002";
        Long accountId1 = 1L;
        Long accountId2 = 2L;
        createAccount(accountId1, imoNumber1, null);
        createAccount(accountId2, imoNumber2, null);

        assertTrue(repository.existsByImoNumberAndId(imoNumber1, accountId1));
        assertTrue(repository.existsByImoNumberAndId(imoNumber2, accountId2));
        assertFalse(repository.existsByImoNumberAndId("0000002", 3L));
        assertFalse(repository.existsByImoNumberAndId(imoNumber1, accountId2));
    }

    private MrtmAccount createAccount(Long id, String imoNumber, Integer registryId) {
        MrtmAccount account = MrtmAccount.builder()
                .id(id)
                .businessId(String.valueOf(id))
                .registryId(registryId)
                .name("name")
                .verificationBodyId(100L)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .status(MrtmAccountStatus.NEW)
                .emissionTradingScheme(MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME)
                .imoNumber(imoNumber)
                .firstMaritimeActivityDate(LocalDate.now())
                .address(AddressState.builder()
                        .line1("line1")
                        .city("city")
                        .country("EN")
                        .build()
                )
                .build();

        entityManager.persist(account);
        return account;
    }

    private MrtmAccount createAccountWithContacts(Long id, String imoNumber, String contactValue){

        MrtmAccount account = createAccount(id, imoNumber, null);
        account.getContacts().put(AccountContactType.PRIMARY, "primaryContact" + contactValue);
        account.getContacts().put(AccountContactType.SECONDARY, "secondaryContact" + contactValue);
        account.getContacts().put(AccountContactType.SERVICE, "serviceContact" + contactValue);
        account.getContacts().put(AccountContactType.FINANCIAL, "financialContact" + contactValue);

        return account;
    }
}
