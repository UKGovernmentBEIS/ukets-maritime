package uk.gov.mrtm.api.migration;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.netz.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_DUPLICATE_IMO_IN_DB;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT;
import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;

@ExtendWith(MockitoExtension.class)
class MigrationValidatorServiceTest {

    @InjectMocks
    private MigrationValidatorService migrationValidatorService;

    @Mock
    private MrtmAccountRepository mrtmAccountRepository;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private UserRoleTypeService userRoleTypeService;

    private List<MigrationCsvRecordDTO> csvRecordsList;
    private List<String> results;

    @BeforeEach
    void setUp() {
        csvRecordsList = new ArrayList<>();
        results = new ArrayList<>();
    }

    @Test
    void validateImoNumberUniquenessInCsv_noDuplicate() {

        MigrationCsvRecordDTO record1 = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        MigrationCsvRecordDTO record2 = MigrationCsvRecordDTO.builder()
                .imoNumber("7654321")
                .operatorEmail("operator2@test.com")
                .build();

        csvRecordsList.add(record1);
        csvRecordsList.add(record2);

        migrationValidatorService.validateImoNumberUniquenessInCsv(csvRecordsList, results);

        assertTrue(results.isEmpty());
    }

    @Test
    void validateImoNumberUniquenessInCsv_withDuplicate() {

        MigrationCsvRecordDTO record1 = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        MigrationCsvRecordDTO record2 = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator2@test.com")
                .build();

        csvRecordsList.add(record1);
        csvRecordsList.add(record2);

        migrationValidatorService.validateImoNumberUniquenessInCsv(csvRecordsList, results);

        assertFalse(results.isEmpty());
        assertTrue(results.contains(constructMigrationErrorMessage(record1.getImoNumber(), MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS)));
    }


    @Test
    void validateImoNumberUniquenessInDB_imoExistsInDb() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        csvRecordsList.add(record);

        when(mrtmAccountRepository.existsByImoNumber("1234567")).thenReturn(true);

        migrationValidatorService.validateImoNumberUniquenessInDB(csvRecordsList, results);

        assertFalse(results.isEmpty());
        assertTrue(results.contains(
                constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_DUPLICATE_IMO_IN_DB)));
    }


    @Test
    void validateImoNumberUniquenessInDB_imoDoesNotExistInDb() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        csvRecordsList.add(record);

        migrationValidatorService.validateImoNumberUniquenessInDB(csvRecordsList, results);

        assertTrue(results.isEmpty());
    }


    @Test
    void validateOperatorRoleInDB_operatorWithDifferentRole() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        csvRecordsList.add(record);

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("operator1@test.com")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        UserRoleTypeDTO roleType = UserRoleTypeDTO.builder()
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .roleType(RoleTypeConstants.REGULATOR)
                .build();

        when(userAuthService.getUserByEmail(userInfo.getEmail())).thenReturn(Optional.of(userInfo));
        when(userRoleTypeService.getUserRoleTypeByUserId(userInfo.getUserId())).thenReturn(roleType);

        migrationValidatorService.validateOperatorRoleInDB(csvRecordsList, results);

        assertFalse(results.isEmpty());
        assertTrue(results.contains(constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB)));
    }

    @Test
    void validateRegulatorRoleInDB_operatorWithDifferentRole() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("regulator1@test.com")
                .build();
        csvRecordsList.add(record);

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("regulator1@test.com")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        UserRoleTypeDTO roleType = UserRoleTypeDTO.builder()
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .roleType(RoleTypeConstants.REGULATOR)
                .build();

        when(userAuthService.getUserByEmail(userInfo.getEmail())).thenReturn(Optional.of(userInfo));
        when(userRoleTypeService.getUserRoleTypeByUserId(userInfo.getUserId())).thenReturn(roleType);

        migrationValidatorService.validateOperatorRoleInDB(csvRecordsList, results);

        assertFalse(results.isEmpty());
        assertTrue(results.contains(constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB)));
    }

    @Test
    void validateOperatorAlreadyAnAccountUser_operatorIsAccountUser() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        csvRecordsList.add(record);

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .email("operator1@test.com")
                .userId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")
                .build();
        MrtmAccount account = MrtmAccount.builder().id(1L).imoNumber("1234567").build();

        when(userAuthService.getUserByEmail("operator1@test.com")).thenReturn(Optional.of(userInfo));
        when(mrtmAccountRepository.findByUserId("b4b7a9f9-122e-4ad5-8498-f2bd30a7ba08")).thenReturn(List.of(account));

        migrationValidatorService.validateOperatorAlreadyAnAccountUser(csvRecordsList, results);

        assertFalse(results.isEmpty());
        assertTrue(results.contains(constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT)));
    }

    @Test
    void validateOperatorAlreadyAnAccountUser_operatorIsNotAccountUser() {

        MigrationCsvRecordDTO record = MigrationCsvRecordDTO.builder()
                .imoNumber("1234567")
                .operatorEmail("operator1@test.com")
                .build();
        csvRecordsList.add(record);

        migrationValidatorService.validateOperatorAlreadyAnAccountUser(csvRecordsList, results);

        assertTrue(results.isEmpty());
    }
}

