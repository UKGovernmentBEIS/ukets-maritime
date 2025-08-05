package uk.gov.mrtm.api.migration.mrtmaccount;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountCreateService;
import uk.gov.mrtm.api.migration.DryRunException;
import uk.gov.mrtm.api.migration.ExecutionMode;
import uk.gov.mrtm.api.migration.MigrationBaseService;
import uk.gov.mrtm.api.migration.MigrationMapCsvContentsService;
import uk.gov.mrtm.api.migration.MigrationCsvRecordDTO;
import uk.gov.mrtm.api.migration.MigrationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;

import java.util.ArrayList;
import java.util.List;

import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;


@Log4j2
@Service
@AllArgsConstructor
public class MigrationMrtmAccountCreationService extends MigrationBaseService {

    private final MrtmAccountCreateService mrtmAccountCreateService;
    private final MigrationMapCsvContentsService migrationMapCsvContentsService;
    private final MigrationValidatorService migrationValidatorService;

    @Override
    public String getResource() {
        return "mrtm-accounts";
    }


    @Override
    public List<String> migrate(String csvContents) {
        return doMigrateMrtmAccounts(csvContents, ExecutionMode.COMMIT);
    }


    @Override
    public void migrateDryRun(String csvContents) {

        List<String> migrationDryRvnResults = doMigrateMrtmAccounts(csvContents, ExecutionMode.DRY);
        migrationDryRvnResults.add("CAUTION: Execution in DRY mode leads to no account creation.");

        throw new DryRunException(migrationDryRvnResults);
    }


    private List<String> doMigrateMrtmAccounts(String csvContents, ExecutionMode executionMode){

        List<String> results = new ArrayList<>();
        List<MigrationCsvRecordDTO> migrationCsvRecords = migrationMapCsvContentsService.mapToCsvRecords(csvContents, results);

        migrationValidatorService.validateRegulatorRoleInDB(migrationCsvRecords, results);              //Check if Regulator user exists and has the correct role
        migrationValidatorService.validateImoNumberUniquenessInCsv(migrationCsvRecords, results);       //Check Uniqueness of IMO number in CSV Records List.
        migrationValidatorService.validateImoNumberUniquenessInDB(migrationCsvRecords, results);        //Check Uniqueness of IMO number in DB

        List<Pair<AppUser, MrtmAccountDTO>> mrtmAccountList = migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(migrationCsvRecords, results);

        switch (executionMode) {
            case COMMIT:
                for (Pair<AppUser, MrtmAccountDTO> mrtmAccountPair : mrtmAccountList){
                    try {
                        mrtmAccountCreateService.createMaritimeAccount(
                                mrtmAccountPair.getRight(), mrtmAccountPair.getLeft());
                    } catch (Exception e) {
                        results.add(constructMigrationErrorMessage(
                                mrtmAccountPair.getRight().getImoNumber(), e.getMessage()));
                        log.warn(constructMigrationErrorMessage(
                                mrtmAccountPair.getRight().getImoNumber(), e.getMessage()));
                    }
                }
                break;
            case DRY:
                // Form records without saving in DB
                break;
            default:
                break;
        }

        return results;
    }
}
