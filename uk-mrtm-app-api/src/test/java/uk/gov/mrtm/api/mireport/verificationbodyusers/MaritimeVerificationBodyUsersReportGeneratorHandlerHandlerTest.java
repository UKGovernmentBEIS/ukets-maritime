package uk.gov.mrtm.api.mireport.verificationbodyusers;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.mireport.MrtmMiReportType;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeVerificationBodyUsersReportGeneratorHandlerHandlerTest {

    @InjectMocks
    private MaritimeVerificationBodyUsersReportGeneratorHandlerHandler generator;

    @Mock
    private MaritimeVerificationBodyUsersRepository verificationBodyUsersRepository;

    @Mock
    private EntityManager entityManager;

    @Test
    void getReportType() {
        assertEquals(MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS, generator.getReportType());
    }

    @Test
    void generateMiReport() {

        EmptyMiReportParams reportParams = EmptyMiReportParams.builder().build();
        String userId = UUID.randomUUID().toString();
        when(verificationBodyUsersRepository.findAllVerificationBodyUsers(entityManager))
                .thenReturn(List.of(createVerificationBodyUser("Verification Body Name", MrtmAccountStatus.LIVE, "12345",
                        "Verifier admin", AuthorityStatus.ACTIVE, userId)));

        MaritimeVerificationBodyUsersMiReportResult miReportResult =
                (MaritimeVerificationBodyUsersMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertNotNull(miReportResult);
        assertEquals(MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS, miReportResult.getReportType());
        assertEquals(1, miReportResult.getResults().size());
        MaritimeVerificationBodyUser verificationBodyUser = miReportResult.getResults().get(0);
        assertEquals(userId, verificationBodyUser.getUserId());
    }

    private MaritimeVerificationBodyUser createVerificationBodyUser(String verificationBodyName, MrtmAccountStatus accountStatus,
                                                                    String accreditationNumber, String role, AuthorityStatus authorityStatus,
                                                                    String userId) {

        return MaritimeVerificationBodyUser.builder()
                .verificationBodyName(verificationBodyName)
                .accountStatus(accountStatus.name())
                .accreditationReferenceNumber(accreditationNumber)
                .role(role)
                .authorityStatus(authorityStatus.name())
                .userId(userId)
                .build();
    }
}
