package uk.gov.mrtm.api.mireport.system.verificationbodyusers;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.mireport.system.MrtmMiReportType;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;
import uk.gov.netz.api.mireport.system.MiReportSystemGenerator;
import uk.gov.netz.api.mireport.system.MiReportSystemResult;
import uk.gov.netz.api.mireport.userdefined.custom.AnyUserInfoDTO;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaritimeVerificationBodyUsersReportGeneratorHandlerHandler implements MiReportSystemGenerator<EmptyMiReportSystemParams> {

    private final MaritimeVerificationBodyUsersRepository verificationBodyUsersRepository;
    private final UserInfoApi userInfoApi;

    @Override
    @Transactional(readOnly = true)
    public MiReportSystemResult generateMiReport(EntityManager entityManager, EmptyMiReportSystemParams reportParams) {

        List<MaritimeVerificationBodyUser> verificationBodyUsers = verificationBodyUsersRepository.findAllVerificationBodyUsers(entityManager);
        Map<String, AnyUserInfoDTO> usersWithAttributes = getVerifierUserInfoByUserIds(verificationBodyUsers);
        verificationBodyUsers.stream().filter(user -> user.getUserId() != null).forEach(user -> appendUserDetails(user, usersWithAttributes.get(user.getUserId())));

        return MaritimeVerificationBodyUsersMiReportResult.builder()
                .reportType(getReportType())
                .columnNames(MaritimeVerificationBodyUser.getColumnNames())
                .results(verificationBodyUsers)
                .build();
    }

    @Override
    public String getReportType() {
        return MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS;
    }

    private Map<String, AnyUserInfoDTO> getVerifierUserInfoByUserIds(List<MaritimeVerificationBodyUser> verificationBodyUsers) {
        List<String> userIds = verificationBodyUsers.stream().map(MaritimeVerificationBodyUser::getUserId).filter(Objects::nonNull).toList();

        if (userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return userInfoApi.getUsersWithAttributes(userIds, AnyUserInfoDTO.class)
            .stream()
            .collect(Collectors.toMap(AnyUserInfoDTO::getId, Function.identity()));
    }

    private void appendUserDetails(MaritimeVerificationBodyUser verificationBodyUser, AnyUserInfoDTO verifierUserInfoDTO) {
        verificationBodyUser.setFullName(verifierUserInfoDTO.getFullName());
        verificationBodyUser.setTelephone(verifierUserInfoDTO.getTelephone());
        verificationBodyUser.setLastLogon(Optional.ofNullable(verifierUserInfoDTO.getLastLoginDate())
            .map(MaritimeVerificationBodyUsersReportGeneratorHandlerHandler::formatLastLoginDate).orElse(null));
        verificationBodyUser.setEmail(verifierUserInfoDTO.getEmail());
    }

    private static String formatLastLoginDate(String lastLoginDate) {
        return LocalDateTime.parse(lastLoginDate, DateTimeFormatter.ISO_DATE_TIME).format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss"));
    }
}
