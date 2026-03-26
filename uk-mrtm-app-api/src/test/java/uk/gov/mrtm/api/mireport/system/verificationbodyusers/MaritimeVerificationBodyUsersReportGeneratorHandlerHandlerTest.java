package uk.gov.mrtm.api.mireport.system.verificationbodyusers;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.mireport.system.MrtmMiReportType;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;
import uk.gov.netz.api.mireport.userdefined.custom.AnyUserInfoDTO;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeVerificationBodyUsersReportGeneratorHandlerHandlerTest {

    @InjectMocks
    private MaritimeVerificationBodyUsersReportGeneratorHandlerHandler generator;

    @Mock
    private MaritimeVerificationBodyUsersRepository verificationBodyUsersRepository;

    @Mock
    private EntityManager entityManager;

    @Mock
    private UserInfoApi userInfoApi;

    @Test
    void getReportType() {
        assertEquals(MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS, generator.getReportType());
    }

    @ParameterizedTest
    @MethodSource
    void generateMiReport(String lastLogin, String convertedLastLogin) {
        String userId = UUID.randomUUID().toString();

        EmptyMiReportSystemParams reportParams = EmptyMiReportSystemParams.builder().build();
        MaritimeVerificationBodyUser verificationBodyUser = createVerificationBodyUser(
            userId);
        MaritimeVerificationBodyUsersMiReportResult expectedResponse =
            createExpectedMaritimeVerificationBodyUsersMiReportResult(userId, convertedLastLogin);

        AnyUserInfoDTO verificationBodyUserDTO = createVerificationBodyUserDTO(userId, lastLogin);
        when(verificationBodyUsersRepository.findAllVerificationBodyUsers(entityManager)).thenReturn(List.of(verificationBodyUser));
        when(userInfoApi.getUsersWithAttributes(List.of(userId), AnyUserInfoDTO.class)).thenReturn(List.of(verificationBodyUserDTO));

        MaritimeVerificationBodyUsersMiReportResult actualResponse =
            (MaritimeVerificationBodyUsersMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertEquals(expectedResponse, actualResponse);

        verify(verificationBodyUsersRepository).findAllVerificationBodyUsers(entityManager);
        verify(userInfoApi).getUsersWithAttributes(List.of(userId), AnyUserInfoDTO.class);

        verifyNoMoreInteractions(verificationBodyUsersRepository, userInfoApi);
    }

    private static Stream<Arguments> generateMiReport() {
        return Stream.of(
            Arguments.of("2026-03-18T10:38:29.695282900", "18 March 2026 10:38:29"),
            Arguments.of(null, null)
        );
    }

    @Test
    void generateMiReport_when_user_id_is_null() {

        EmptyMiReportSystemParams reportParams = EmptyMiReportSystemParams.builder().build();
        MaritimeVerificationBodyUser verificationBodyUser = createVerificationBodyUser(null);
        MaritimeVerificationBodyUsersMiReportResult expectedResponse =
            createExpectedMaritimeVerificationBodyUsersMiReportResult(null, null);

        when(verificationBodyUsersRepository.findAllVerificationBodyUsers(entityManager)).thenReturn(List.of(verificationBodyUser));

        MaritimeVerificationBodyUsersMiReportResult actualResponse =
            (MaritimeVerificationBodyUsersMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertEquals(expectedResponse, actualResponse);

        verify(verificationBodyUsersRepository).findAllVerificationBodyUsers(entityManager);
        verifyNoInteractions(userInfoApi);
        verifyNoMoreInteractions(verificationBodyUsersRepository);
    }

    private MaritimeVerificationBodyUser createVerificationBodyUser(String userId) {

        return MaritimeVerificationBodyUser.builder()
                .verificationBodyName("Verification Body Name")
                .accountStatus(MrtmAccountStatus.LIVE.name())
                .accreditationReferenceNumber("12345")
                .role("Verifier admin")
                .authorityStatus(AuthorityStatus.ACTIVE.name())
                .userId(userId)
                .build();
    }

    private AnyUserInfoDTO createVerificationBodyUserDTO(String userId, String lastLogin) {

        return AnyUserInfoDTO.builder()
            .email("email")
            .lastLoginDate(lastLogin)
            .lastName("lastName")
            .firstName("firstName")
            .phoneNumber("phoneNumber")
            .id(userId)
            .build();
    }
    private MaritimeVerificationBodyUsersMiReportResult createExpectedMaritimeVerificationBodyUsersMiReportResult(String userId,
                                                                                                                  String lastLogin) {
        MaritimeVerificationBodyUser expectedVerificationBodyUser = MaritimeVerificationBodyUser.builder()
            .verificationBodyName("Verification Body Name")
            .accountStatus(MrtmAccountStatus.LIVE.name())
            .accreditationReferenceNumber("12345")
            .role("Verifier admin")
            .authorityStatus(AuthorityStatus.ACTIVE.name())
            .userId(userId)
            .email(userId != null ? "email": null)
            .lastLogon(userId != null ? lastLogin: null)
            .fullName(userId != null ? "firstName lastName": null)
            .telephone(userId != null ? "phoneNumber": null)
            .build();

        return MaritimeVerificationBodyUsersMiReportResult.builder()
            .reportType(MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS)
            .results(List.of(expectedVerificationBodyUser))
            .columnNames(List.of("Verification body name", "Account status", "Accreditation reference number",
                "User role", "User status", "Name", "Email", "Telephone", "Last login"))
            .build();
    }
}
