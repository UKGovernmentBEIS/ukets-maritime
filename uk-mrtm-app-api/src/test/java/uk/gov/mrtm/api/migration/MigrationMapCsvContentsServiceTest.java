package uk.gov.mrtm.api.migration;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.netz.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.netz.api.authorization.core.service.AuthorityService;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_DUPLICATE_IMO_IN_DB;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_INVALID_REGULATOR_USER;
import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;
import static uk.gov.netz.api.authorization.core.domain.AuthorityStatus.ACTIVE;

@ExtendWith(MockitoExtension.class)
class MigrationMapCsvContentsServiceTest {

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private Validator validator;

    @Mock
    private MrtmAccountRepository mrtmAccountRepository;

    @Mock
    private UserRoleTypeService userRoleTypeService;

    @Mock AuthorityService authorityService;

    @InjectMocks
    private MigrationMapCsvContentsService migrationMapCsvContentsService;

    private List<String> results;

    private final String csvContents =
            "regulator.england@pmrv.uk\t0610843\tRatu Shipping Co SA\tSuite 502,  5th Floor"
            + "&#44  World Trade Center\tCalle 53 Este,  Urbanizacion Marbella"
            + "\tPanama City\t\t0901\tPanama\t01/09/2024\tFrank\tFord\tfrank@ratu.com";

    @BeforeEach
    void setUp() {
        results = new ArrayList<>();
    }

    @Test
    void mapToCsvRecords_success() {

        when(validator.validate(any(MigrationCsvRecordDTO.class)))
                .thenReturn(Collections.emptySet());

        List<MigrationCsvRecordDTO> records = migrationMapCsvContentsService.mapToCsvRecords(csvContents, results);

        assertEquals(1, records.size());
        assertTrue(results.isEmpty());
        assertEquals("0610843", records.get(0).getImoNumber());
    }

    @Test
    void mapToCsvRecords_withValidationErrors() {

        ConstraintViolation<MigrationCsvRecordDTO> mockViolation = mock(ConstraintViolation.class);
        when(mockViolation.getMessage()).thenReturn(MIGRATION_ERROR_DUPLICATE_IMO_IN_DB);
        Set<ConstraintViolation<MigrationCsvRecordDTO>> violations = new HashSet<>();
        violations.add(mockViolation);
        when(validator.validate(any(MigrationCsvRecordDTO.class))).thenReturn(violations);

        List<MigrationCsvRecordDTO> records = migrationMapCsvContentsService.mapToCsvRecords(csvContents, results);

        assertFalse(results.isEmpty());
        assertEquals(1, records.size());
        assertTrue(results.get(0).equals(constructMigrationErrorMessage("0610843", MIGRATION_ERROR_DUPLICATE_IMO_IN_DB)));  // Validation error message captured
    }

    @Test
    void getMrtmAccountDtosFromCsvContents_success() {

        List<MigrationCsvRecordDTO> records = constructMigrationCsvRecordDtoList();

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("regulator.england@pmrv.uk")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        UserRoleTypeDTO roleType = UserRoleTypeDTO.builder()
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .roleType(RoleTypeConstants.REGULATOR)
                .build();

        when(userAuthService.getUserByEmail(userInfo.getEmail())).thenReturn(Optional.of(userInfo));
        when(userRoleTypeService.getUserRoleTypeByUserId(userInfo.getUserId())).thenReturn(roleType);

        List<Pair<AppUser, MrtmAccountDTO>> result = migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(records, results);

        assertEquals(1, result.size());
        assertTrue(results.isEmpty());
    }

    @Test
    void getMrtmAccountDtosFromCsvContents_invalidUser() {

        List<MigrationCsvRecordDTO> records = constructMigrationCsvRecordDtoList();

        when(userAuthService.getUserByEmail(anyString())).thenReturn(Optional.empty());

        List<Pair<AppUser, MrtmAccountDTO>> result = migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(records, results);

        assertEquals(0, result.size());
        assertFalse(results.isEmpty());
        assertTrue(results.get(0).contains(constructMigrationErrorMessage(records.get(0).getImoNumber(), MIGRATION_ERROR_INVALID_REGULATOR_USER)));
    }

    @Test
    void getOperatorUserInvitationDtosFromCsvContents_success() {

        List<MigrationCsvRecordDTO> records = constructMigrationCsvRecordDtoList();

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("regulator.england@pmrv.uk")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        UserRoleTypeDTO roleType = UserRoleTypeDTO.builder()
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .roleType(RoleTypeConstants.REGULATOR)
                .build();

        AuthorityDTO authority = AuthorityDTO.builder()
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .accountId(1L)
                .status(ACTIVE)
                .build();

        when(userAuthService.getUserByEmail(userInfo.getEmail())).thenReturn(Optional.of(userInfo));
        when(userRoleTypeService.getUserRoleTypeByUserId(userInfo.getUserId())).thenReturn(roleType);
        when(authorityService.getAuthoritiesByUserId(userInfo.getUserId())).thenReturn(List.of(authority));

        MrtmAccount mockAccount = mock(MrtmAccount.class);
        when(mrtmAccountRepository.findByImoNumber(anyString())).thenReturn(Optional.of(mockAccount));

        List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> result = migrationMapCsvContentsService
                .getOperatorUserInvitationDtosFromCsvContents(records, results);

        assertEquals(1, result.size());
        assertTrue(results.isEmpty());
    }

    @Test
    void getOperatorUserInvitationDtosFromCsvContents_accountDoesNotExist() {

        List<MigrationCsvRecordDTO> records = constructMigrationCsvRecordDtoList();
        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("regulator.england@pmrv.uk")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        UserRoleTypeDTO roleType = UserRoleTypeDTO.builder()
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .roleType(RoleTypeConstants.REGULATOR)
                .build();

        when(userAuthService.getUserByEmail(userInfo.getEmail())).thenReturn(Optional.of(userInfo));
        when(userRoleTypeService.getUserRoleTypeByUserId(userInfo.getUserId())).thenReturn(roleType);

        when(mrtmAccountRepository.findByImoNumber(anyString())).thenReturn(Optional.empty());

        List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> result = migrationMapCsvContentsService
                .getOperatorUserInvitationDtosFromCsvContents(records, results);

        assertEquals(0, result.size());
        assertFalse(results.isEmpty());
        assertTrue(results.get(0).contains(constructMigrationErrorMessage(records.get(0).getImoNumber(), MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST)));
    }


    private List<MigrationCsvRecordDTO> constructMigrationCsvRecordDtoList(){
        MigrationCsvRecordDTO csvRecord1 = MigrationCsvRecordDTO.builder()
                .regulatingAuthority("regulator.england@pmrv.uk")
                .imoNumber("0610843")
                .operatorName("Ratu Shipping Co SA")
                .addressLine1("Suite 502,  5th Floor,  World Trade Center")
                .addressLine2("Calle 53 Este,  Urbanizacion Marbella")
                .city("Panama City")
                .state("")
                .postcode("0901")
                .country("Panama")
                .dateOfFirstMaritimeActivity("01/09/2024")
                .operatorFirstName("Frank")
                .operatorLastName("Ford")
                .operatorEmail("Frank@ratu.com")
                .build();
        return List.of(csvRecord1);
    }

}