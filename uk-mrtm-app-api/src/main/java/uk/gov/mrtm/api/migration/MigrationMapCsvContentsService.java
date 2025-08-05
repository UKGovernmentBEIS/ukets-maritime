package uk.gov.mrtm.api.migration;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.netz.api.authorization.core.service.AuthorityService;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_INVALID_DATA_IN_ROW;
import static uk.gov.mrtm.api.migration.MigrationErrors.MIGRATION_ERROR_INVALID_REGULATOR_USER;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;


@Service
@RequiredArgsConstructor
@Validated
@Log4j2
public class MigrationMapCsvContentsService {

    private final UserAuthService userAuthService;
    private final AuthorityService<?> authorityService;
    private final Validator validator;
    private final MrtmAccountRepository mrtmAccountRepository;
    private final UserRoleTypeService userRoleTypeService;

    public List<MigrationCsvRecordDTO> mapToCsvRecords(String csvContents, List<String> results){

        List<MigrationCsvRecordDTO> csvRecords = new ArrayList<>();
        String[] records = csvContents.split("\n");
        if (records != null && records.length > 0){
            for (String record : records){
                String[] recordData = record.split("\t");
                if (recordData != null && recordData.length > 0){
                    MigrationCsvRecordDTO dto = toMigrationCsvRecord(recordData, results);
                    if (Objects.nonNull(dto)){
                        csvRecords.add(dto);
                    }
                }
            }
        }
        return csvRecords;
    }

    public List<Pair<AppUser, MrtmAccountDTO>> getMrtmAccountDtosFromCsvContents(List<MigrationCsvRecordDTO> csvRecords,
                                                                                 List<String> results) {
        List<Pair<AppUser, MrtmAccountDTO>> mrtmAccountDTOS = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(csvRecords)){
            csvRecords.forEach(csvRecord -> {
                if (Objects.nonNull(csvRecord)) {
                    AppUser submitter = constructAppUser(csvRecord);

                    if (Objects.nonNull(submitter)){
                        mrtmAccountDTOS.add(Pair.of(submitter, constructMrtmAccountDto(csvRecord)));
                    } else {
                        results.add(MigrationHelper.constructMigrationErrorMessage(csvRecord.getImoNumber(),
                                MIGRATION_ERROR_INVALID_REGULATOR_USER));
                        log.warn(MigrationHelper.constructMigrationErrorMessage(csvRecord.getImoNumber(),
                                MIGRATION_ERROR_INVALID_REGULATOR_USER));
                    }
                }
            });
        }
        return mrtmAccountDTOS;
    }


    public List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> getOperatorUserInvitationDtosFromCsvContents(
            List<MigrationCsvRecordDTO> csvRecords, List<String> results) {

        List<Triple<MrtmAccount, AppUser, OperatorUserInvitationDTO>> operatorUserInvitationDTOS = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(csvRecords)){
            csvRecords.forEach(csvRecord -> {

                if (Objects.nonNull(csvRecord)) {
                    AppUser submitter = constructAppUser(csvRecord);

                    if (Objects.nonNull(submitter)){
                        MrtmAccount account;
                        try {
                            account = mrtmAccountRepository.findByImoNumber(csvRecord.getImoNumber())
                                    .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
                            operatorUserInvitationDTOS.add(
                                    Triple.of(account, submitter, constructOperatorUserInvitationDTO(csvRecord)));
                        } catch (BusinessException be) {
                            results.add(MigrationHelper.constructMigrationErrorMessage(
                                    csvRecord.getImoNumber(), MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST));
                            log.warn(MigrationHelper.constructMigrationErrorMessage(
                                    csvRecord.getImoNumber(), MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST));
                        }
                    } else {
                        results.add(MigrationHelper.constructMigrationErrorMessage(csvRecord.getImoNumber(),
                                MIGRATION_ERROR_INVALID_REGULATOR_USER));
                        log.warn(MigrationHelper.constructMigrationErrorMessage(csvRecord.getImoNumber(),
                                MIGRATION_ERROR_INVALID_REGULATOR_USER));
                    }
                }
            });

        }
        return operatorUserInvitationDTOS;
    }


    private MrtmAccountDTO constructMrtmAccountDto(MigrationCsvRecordDTO csvRecord){

        if(Objects.nonNull(csvRecord)){
            AddressStateDTO address = AddressStateDTO.builder()
                    .city(csvRecord.getCity())
                    .line1(csvRecord.getAddressLine1())
                    .line2(csvRecord.getAddressLine2())
                    .state(csvRecord.getState())
                    .country(csvRecord.getCountry())
                    .postcode(csvRecord.getPostcode())
                    .build();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");
            LocalDate dateOfFirstMaritimeActivity = LocalDate.parse(csvRecord.getDateOfFirstMaritimeActivity(), formatter);

            MrtmAccountDTO mrtmAccountDTO = MrtmAccountDTO.builder()
                    .imoNumber(csvRecord.getImoNumber())
                    .name(csvRecord.getOperatorName())
                    .address(address)
                    .firstMaritimeActivityDate(dateOfFirstMaritimeActivity)
                    .build();
            mrtmAccountDTO.setAddress(address);

            return mrtmAccountDTO;
        }
        return null;
    }


    private MigrationCsvRecordDTO toMigrationCsvRecord(String[] csvRecordParts, List<String> results){

        if (csvRecordParts.length < 13){
            String recordData = getRecordData(csvRecordParts);
            results.add(MigrationHelper.constructMigrationRowErrorMessage(recordData,
                    MIGRATION_ERROR_INVALID_DATA_IN_ROW));
            log.warn(MigrationHelper.constructMigrationRowErrorMessage(recordData,
                    MIGRATION_ERROR_INVALID_DATA_IN_ROW));
            return null;
        }
        try {
            MigrationCsvRecordDTO recordDto = MigrationCsvRecordDTO.builder()
                    .regulatingAuthority(unescapeInput(csvRecordParts[0]))
                    .imoNumber(addLeadingZeros(unescapeInput(csvRecordParts[1])))
                    .operatorName(unescapeInput(csvRecordParts[2]))
                    .addressLine1(unescapeInput(csvRecordParts[3]))
                    .addressLine2(unescapeInput(csvRecordParts[4]))
                    .city(unescapeInput(csvRecordParts[5]))
                    .state(unescapeInput(csvRecordParts[6]))
                    .postcode(unescapeInput(csvRecordParts[7]))
                    .country(unescapeInput(csvRecordParts[8]))
                    .dateOfFirstMaritimeActivity(unescapeInput(csvRecordParts[9]))
                    .operatorFirstName(unescapeInput(csvRecordParts[10]))
                    .operatorLastName(unescapeInput(csvRecordParts[11]))
                    .operatorEmail(unescapeInput(csvRecordParts[12]))
                    .build();

            Set<ConstraintViolation<MigrationCsvRecordDTO>> violations = validator.validate(recordDto);
            if (CollectionUtils.isNotEmpty(violations)){
                violations.forEach(violation -> {
                    results.add(
                            MigrationHelper.constructMigrationErrorMessage(recordDto.getImoNumber(), violation.getMessage()));
                    log.warn(MigrationHelper.constructMigrationErrorMessage(recordDto.getImoNumber(), violation.getMessage()));
                });
            }
            return recordDto;
        } catch (Exception e){
            String recordData = getRecordData(csvRecordParts);
            results.add(MigrationHelper.constructMigrationRowErrorMessage(recordData,
                    MIGRATION_ERROR_INVALID_DATA_IN_ROW));
            log.warn(MigrationHelper.constructMigrationRowErrorMessage(recordData,
                    MIGRATION_ERROR_INVALID_DATA_IN_ROW));
        }

        return null;
    }


    private String getRecordData(String[] csvRecordParts){
        StringBuilder resultText = new StringBuilder();
        if (Objects.nonNull(csvRecordParts) && csvRecordParts.length > 0) {
            Arrays.stream(csvRecordParts).forEach(value -> {
                resultText.append(value+"--");
            });
            resultText.replace(resultText.length() - 2, resultText.length(), "");
        }
        return resultText.toString();
    }


    private OperatorUserInvitationDTO constructOperatorUserInvitationDTO(MigrationCsvRecordDTO csvRecord){

        if(Objects.nonNull(csvRecord)){
            OperatorUserInvitationDTO operatorUserInvitationDTO = OperatorUserInvitationDTO.builder()
                    .email(csvRecord.getOperatorEmail())
                    .firstName(csvRecord.getOperatorFirstName())
                    .lastName(csvRecord.getOperatorLastName())
                    .roleCode("operator_admin")
                    .build();

            return operatorUserInvitationDTO;
        }
        return null;
    }


    private String unescapeInput(String input){
        return StringEscapeUtils.unescapeXml(input.trim()).replaceAll("&#44", ",").replaceAll("&#39", "'");
    }


    private AppUser constructAppUser(MigrationCsvRecordDTO csvRecord){
        final UserInfoDTO submitter;
        List<AuthorityDTO> userAuthorities;
        AppUser user;
        try {
            submitter = userAuthService.getUserByEmail(csvRecord.getRegulatingAuthority())
                    .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
            userAuthorities = authorityService.getAuthoritiesByUserId(submitter.getUserId());
            String userRoleType = userRoleTypeService.getUserRoleTypeByUserId(submitter.getUserId()).getRoleType();
            List<AppAuthority> authorities = new ArrayList<>();

            if (CollectionUtils.isNotEmpty(userAuthorities)){
                authorities.add(AppAuthority.builder()
                        .competentAuthority(userAuthorities.get(0).getCompetentAuthority())
                        .build());
            }

            user = AppUser.builder()
                    .authorities(authorities)
                    .email(submitter.getEmail())
                    .userId(submitter.getUserId())
                    .firstName(submitter.getFirstName())
                    .lastName(submitter.getLastName())
                    .roleType(userRoleType)
                    .build();

        } catch (BusinessException be) {
            return null;
        }

        return user;
    }

    private String addLeadingZeros(String imoNumber){

        if (StringUtils.isNotBlank(imoNumber) && imoNumber.length() < 7){
            return String.format("%7s", imoNumber).replace(' ', '0');
        }
        return imoNumber;
    }

}
