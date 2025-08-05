package uk.gov.mrtm.api.migration.operatoruser;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.migration.DryRunException;
import uk.gov.mrtm.api.migration.ExecutionMode;
import uk.gov.mrtm.api.migration.MigrationBaseService;
import uk.gov.mrtm.api.migration.MigrationCsvRecordDTO;
import uk.gov.mrtm.api.migration.MigrationMapCsvContentsService;
import uk.gov.mrtm.api.migration.MigrationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserInvitationService;

import java.util.ArrayList;
import java.util.List;

import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;

@Service
@RequiredArgsConstructor
@Log4j2
public class MigrationOperatorAdminUserInvitationService extends MigrationBaseService {

    private final OperatorUserInvitationService operatorUserInvitationService;
    private final MigrationMapCsvContentsService migrationMapCsvContentsService;
    private final MigrationValidatorService migrationValidatorService;

    @Override
    public String getResource() {
        return "operator-admin-users-invite";
    }

    @Override
    public void migrateDryRun(String input) {
        List<String> failedEntries = doSendUserInvitations(input, ExecutionMode.DRY);
        failedEntries.add("CAUTION: Execution in DRY mode leads to no invitations being send.");
        throw new DryRunException(failedEntries);
    }

    @Override
    public List<String> migrate(String input) {

        return doSendUserInvitations(input, ExecutionMode.COMMIT);
    }

    private List<String> doSendUserInvitations(String csvContents, ExecutionMode executionMode){

        List<String> results = new ArrayList<>();
        List<MigrationCsvRecordDTO> migrationCsvRecords
                = migrationMapCsvContentsService.mapToCsvRecords(csvContents, results);

        migrationValidatorService.validateRegulatorRoleInDB(migrationCsvRecords, results);              //Check that the regulator exists and has the correct role
        migrationValidatorService.validateImoNumberUniquenessInCsv(migrationCsvRecords, results);       //Check Uniqueness of IMO number in CSV Records List.
        migrationValidatorService.validateOperatorRoleInDB(migrationCsvRecords, results);               //Check for Uniqueness of Operator email in DB.
        migrationValidatorService.validateOperatorAlreadyAnAccountUser(migrationCsvRecords, results);   //Check if the Operator given is already a member of the account given

        List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> operatorUserInvitationsList =
                migrationMapCsvContentsService.getOperatorUserInvitationDtosFromCsvContents(migrationCsvRecords, results);

        switch (executionMode) {
            case COMMIT:
                for (Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO> operatorUserInvitationTriple : operatorUserInvitationsList) {
                    try {
                        operatorUserInvitationService
                                .inviteUserToAccount(operatorUserInvitationTriple.getLeft().getId(),
                                        operatorUserInvitationTriple.getRight(), operatorUserInvitationTriple.getMiddle());
                        Thread.sleep(500L);
                    } catch (Exception e) {
                        results.add(constructMigrationErrorMessage(
                                operatorUserInvitationTriple.getLeft().getImoNumber(), e.getMessage()));
                        log.warn(constructMigrationErrorMessage(
                                operatorUserInvitationTriple.getLeft().getImoNumber(), e.getMessage()));
                    }
                }
                break;
            case DRY:
                // Form records and validate without saving in DB
                break;
            default:
                break;
        }

        return results;
    }

}
