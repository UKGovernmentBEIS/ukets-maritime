package uk.gov.mrtm.api.migration.operatoruser;

import org.apache.commons.lang3.tuple.Triple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.migration.DryRunException;
import uk.gov.mrtm.api.migration.MigrationCsvRecordDTO;
import uk.gov.mrtm.api.migration.MigrationMapCsvContentsService;
import uk.gov.mrtm.api.migration.MigrationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserInvitationService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;


@ExtendWith(MockitoExtension.class)
class MigrationOperatorAdminUserInvitationServiceTest {

    @InjectMocks
    private MigrationOperatorAdminUserInvitationService migrationOperatorAdminUserInvitation;

    @Mock
    private OperatorUserInvitationService operatorUserInvitationService;

    @Mock
    private MigrationMapCsvContentsService migrationMapCsvContentsService;

    @Mock
    private MigrationValidatorService migrationValidatorService;


    private final String csvContents =
            "regulator.england@pmrv.uk\t0610843\tRatu Shipping Co SA\tSuite 502,  5th Floor"
                    + "&#44  World Trade Center\tCalle 53 Este,  Urbanizacion Marbella"
                    + "\tPanama City\t\t0901\tPanama\t01/09/2024\tFrank\tFord\tfrank@ratu.com";
    private List<String> results;
    private List<MigrationCsvRecordDTO> migrationCsvRecords;
    private List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> operatorUserInvitationsList;


    @BeforeEach
    void setUp() {
        results = new ArrayList<>();
        migrationCsvRecords = new ArrayList<>();
        operatorUserInvitationsList = new ArrayList<>();
    }

    @Test
    void migrateDryRun_throwsDryRunException() {

        List<MigrationCsvRecordDTO> records = constructMigrationCsvRecordDtoList();

        when(migrationMapCsvContentsService.mapToCsvRecords(csvContents, results))
                .thenReturn(records);
        when(migrationMapCsvContentsService.getOperatorUserInvitationDtosFromCsvContents(records, results))
                .thenReturn(operatorUserInvitationsList);

        doNothing().when(migrationValidatorService).validateRegulatorRoleInDB(anyList(), anyList());
        doNothing().when(migrationValidatorService).validateImoNumberUniquenessInCsv(anyList(), anyList());
        doNothing().when(migrationValidatorService).validateOperatorRoleInDB(anyList(), anyList());
        doNothing().when(migrationValidatorService).validateOperatorAlreadyAnAccountUser(anyList(), anyList());

        DryRunException exception = assertThrows(DryRunException.class, () -> {
            migrationOperatorAdminUserInvitation.migrateDryRun(csvContents);
        });

        assertTrue(exception.getErrors().contains("CAUTION: Execution in DRY mode leads to no invitations being send."));
    }

    @Test
    void migrate_success() {

        when(migrationMapCsvContentsService.mapToCsvRecords(anyString(), anyList()))
                .thenReturn(migrationCsvRecords);
        when(migrationMapCsvContentsService.getOperatorUserInvitationDtosFromCsvContents(anyList(), anyList()))
                .thenReturn(operatorUserInvitationsList);

        List<String> result = migrationOperatorAdminUserInvitation.migrate(csvContents);

        verify(operatorUserInvitationService, times(operatorUserInvitationsList.size()))
                .inviteUserToAccount(anyLong(), any(OperatorUserInvitationDTO.class), any(AppUser.class));

        assertTrue(result.isEmpty());
    }

    @Test
    void migrate_withInvitationErrors() {

        MigrationCsvRecordDTO csvRecord = new MigrationCsvRecordDTO();
        migrationCsvRecords.add(csvRecord);
        AppUser appUser = AppUser.builder().roleType("REGULATOR").build();
        MrtmAccount mrtmAccount = MrtmAccount.builder().id(1L).imoNumber("1234567").build();
        OperatorUserInvitationDTO invitationDTO = OperatorUserInvitationDTO.builder().roleCode("operator_admin").build();
        operatorUserInvitationsList.add(Triple.of(mrtmAccount, appUser, invitationDTO));

        when(migrationMapCsvContentsService.mapToCsvRecords(anyString(), anyList()))
                .thenReturn(migrationCsvRecords);
        when(migrationMapCsvContentsService.getOperatorUserInvitationDtosFromCsvContents(anyList(), anyList()))
                .thenReturn(operatorUserInvitationsList);

        doThrow(new BusinessException(ErrorCode.FORBIDDEN)).when(operatorUserInvitationService)
                .inviteUserToAccount(1L, invitationDTO, appUser);

        List<String> result = migrationOperatorAdminUserInvitation.migrate(csvContents);

        verify(operatorUserInvitationService, times(1))
                .inviteUserToAccount(1L, invitationDTO, appUser);

        assertFalse(result.isEmpty());
        assertTrue(result.get(0).contains(constructMigrationErrorMessage(mrtmAccount.getImoNumber(), "Forbidden")));
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

