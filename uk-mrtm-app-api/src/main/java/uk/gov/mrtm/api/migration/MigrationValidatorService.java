package uk.gov.mrtm.api.migration;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.netz.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_DUPLICATE_IMO_IN_DB;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_INVALID_REGULATOR_USER;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT;
import static uk.gov.mrtm.api.migration.MigrationHelper.constructMigrationErrorMessage;


@Validated
@Service
@RequiredArgsConstructor
@Log4j2
public class MigrationValidatorService {

    private final MrtmAccountRepository mrtmAccountRepository;
    private final UserAuthService userAuthService;
    private final UserRoleTypeService userRoleTypeService;

    
    public void validateImoNumberUniquenessInCsv(List<MigrationCsvRecordDTO> csvRecordsList, List<String> results){
        csvRecordsList.forEach(record -> {
            if (isImoNumberDuplicateInCsvRecordsList(record, csvRecordsList)
                && !results.contains(
                        constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS))) {
                    results.add(constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS));
                log.warn(constructMigrationErrorMessage(record.getImoNumber(), MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS));
            }
        });
    }


    public void validateImoNumberUniquenessInDB(List<MigrationCsvRecordDTO> csvRecordsList, List<String> results){
        csvRecordsList.forEach(record -> {
            if (imoNumberExistsInDB(record)
                && !results.contains(
                        constructMigrationErrorMessage(record.getImoNumber(), (MIGRATION_ERROR_DUPLICATE_IMO_IN_DB)))) {
                    results.add(constructMigrationErrorMessage(record.getImoNumber(), (MIGRATION_ERROR_DUPLICATE_IMO_IN_DB)));
            }
        });
    }


    public void validateOperatorRoleInDB(List<MigrationCsvRecordDTO> csvRecordsList, List<String> results){
        csvRecordsList.forEach(record -> {
            if (isUserFoundWithDifferentRoleInDB(record.getOperatorEmail(), RoleTypeConstants.OPERATOR)
                    && !results.contains(
                            constructMigrationErrorMessage(
                                    record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB)))) {
                results.add(constructMigrationErrorMessage(
                        record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB)));
                log.warn(constructMigrationErrorMessage(
                        record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB)));
            }
        });
    }


    public void validateOperatorAlreadyAnAccountUser(List<MigrationCsvRecordDTO> csvRecordsList, List<String> results){
        csvRecordsList.forEach(record -> {
            if (isOperatorAlreadyAnAccountUser(record.getImoNumber(), record)
                    && !results.contains(
                            constructMigrationErrorMessage(
                                    record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT)))) {
                results.add(constructMigrationErrorMessage(record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT)));
                log.warn(constructMigrationErrorMessage(record.getImoNumber(), (MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT)));
            }
        });
    }


    public boolean isImoNumberDuplicateInCsvRecordsList(MigrationCsvRecordDTO recordToCheck, List<MigrationCsvRecordDTO> csvRecordsList){
        AtomicInteger counter = new AtomicInteger();
        csvRecordsList.forEach(csvRec -> {
            if (csvRec.getImoNumber().equals(recordToCheck.getImoNumber())){
                counter.getAndIncrement();
            }
        });
        return counter.get() > 1;
    }


    public boolean imoNumberExistsInDB(MigrationCsvRecordDTO recordToCheck){
        return mrtmAccountRepository.existsByImoNumber(recordToCheck.getImoNumber());
    }


    public boolean isUserFoundWithDifferentRoleInDB(String userEmail, String roleCodeToCheck){
        UserInfoDTO user;
        try{
            user = userAuthService.getUserByEmail(userEmail)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        } catch (BusinessException e){
            return false;
        }
        UserRoleTypeDTO userRole = userRoleTypeService.getUserRoleTypeByUserId(user.getUserId());

        return !roleCodeToCheck.equals(userRole.getRoleType());
    }


    public boolean isOperatorAlreadyAnAccountUser(String imoNumber, MigrationCsvRecordDTO recordToCheck){

        UserInfoDTO operatorUser;
        try{
            operatorUser = userAuthService.getUserByEmail(recordToCheck.getOperatorEmail())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        } catch (BusinessException e){
            return false;
        }

        return mrtmAccountRepository.findByUserId(operatorUser.getUserId()).stream()
                .filter(acc -> acc.getImoNumber().equals(imoNumber))
                .findFirst()
                .isPresent();
    }


    public void validateRegulatorRoleInDB(List<MigrationCsvRecordDTO> csvRecordsList, List<String> results){
        csvRecordsList.forEach(record -> {
            if (isUserFoundWithDifferentRoleInDB(record.getRegulatingAuthority(), RoleTypeConstants.REGULATOR)
                    && !results.contains(
                    constructMigrationErrorMessage(
                            record.getImoNumber(), (MIGRATION_ERROR_INVALID_REGULATOR_USER)))) {
                results.add(constructMigrationErrorMessage(
                        record.getImoNumber(), (MIGRATION_ERROR_INVALID_REGULATOR_USER)));
                log.warn(constructMigrationErrorMessage(
                        record.getImoNumber(), (MIGRATION_ERROR_INVALID_REGULATOR_USER)));
            }
        });
    }
}
