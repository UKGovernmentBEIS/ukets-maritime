package uk.gov.mrtm.api.migration.mrtmaccount;


import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountCreateService;
import uk.gov.mrtm.api.migration.DryRunException;
import uk.gov.mrtm.api.migration.MigrationCsvRecordDTO;
import uk.gov.mrtm.api.migration.MigrationMapCsvContentsService;
import uk.gov.mrtm.api.migration.MigrationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MigrationMrtmAccountCreationServiceTest {

    @InjectMocks
    MigrationMrtmAccountCreationService mrtmAccountCreationService;

    @Mock
    private MrtmAccountCreateService mrtmAccountCreateService;

    @Mock
    private MigrationMapCsvContentsService migrationMapCsvContentsService;

    @Mock
    private MigrationValidatorService migrationValidatorService;

    private List<MigrationCsvRecordDTO> migrationCsvRecords;
    private List<Pair<AppUser, MrtmAccountDTO>> mrtmAccountDtos;
    private List<String> results;

    private final String csvContents = "regulator.england@pmrv.uk\t0610843\tRatu Shipping Co SA\tSuite 502&#44  5th Floor"
            + "&#44  World Trade Center\tCalle 53 Este&#44  Urbanizacion Marbella"
            + "\tPanama City\t\t0901\tPanama\t01/09/2024\tFrank\tFord\tFrank@ratu.com";

    @BeforeEach
    void setUp() {
        migrationCsvRecords = new ArrayList<>();
        mrtmAccountDtos = new ArrayList<>();
        results = new ArrayList<>();
    }

    @Test
    void migrate_commit_success() {

        when(migrationMapCsvContentsService.mapToCsvRecords(anyString(), anyList()))
                .thenReturn(migrationCsvRecords);
        when(migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(anyList(), anyList()))
                .thenReturn(mrtmAccountDtos);

        List<String> migrationResults = mrtmAccountCreationService.migrate(csvContents);

        verify(mrtmAccountCreateService, times(mrtmAccountDtos.size()))
                .createMaritimeAccount(any(MrtmAccountDTO.class), any(AppUser.class));
        assertTrue(migrationResults.isEmpty());
    }

    @Test
    void migrate_withAccountCreationError_addErrorToResults() {

        AppUser appUser = AppUser.builder().build();
        MrtmAccountDTO accountDTO = new MrtmAccountDTO();
        mrtmAccountDtos.add(Pair.of(appUser, accountDTO));

        when(migrationMapCsvContentsService.mapToCsvRecords(anyString(), anyList()))
                .thenReturn(migrationCsvRecords);
        when(migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(anyList(), anyList()))
                .thenReturn(mrtmAccountDtos);

        doThrow(new BusinessException(ErrorCode.FORBIDDEN)).when(mrtmAccountCreateService)
                .createMaritimeAccount(any(MrtmAccountDTO.class), any(AppUser.class));

        List<String> migrationResults = mrtmAccountCreationService.migrate(csvContents);

        assertFalse(migrationResults.isEmpty());
        assertTrue(migrationResults.stream().anyMatch(result -> result.contains("Forbidden")));
    }


    @Test
    void migrateDryRun_throwDryRunException() {

        when(migrationMapCsvContentsService.mapToCsvRecords(anyString(), anyList()))
                .thenReturn(migrationCsvRecords);
        when(migrationMapCsvContentsService.getMrtmAccountDtosFromCsvContents(anyList(), anyList()))
                .thenReturn(mrtmAccountDtos);
        doNothing().when(migrationValidatorService).validateImoNumberUniquenessInCsv(anyList(), anyList());

        DryRunException exception = assertThrows(DryRunException.class, () -> {
            mrtmAccountCreationService.migrateDryRun(csvContents);
        });

        assertTrue(exception.getErrors().contains("CAUTION: Execution in DRY mode leads to no account creation."));
    }

}
