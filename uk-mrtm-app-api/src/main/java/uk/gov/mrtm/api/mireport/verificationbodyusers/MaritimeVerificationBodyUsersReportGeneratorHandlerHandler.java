package uk.gov.mrtm.api.mireport.verificationbodyusers;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.mireport.MrtmMiReportType;
import uk.gov.netz.api.mireport.MiReportGeneratorHandler;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;
import uk.gov.netz.api.mireport.domain.MiReportResult;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaritimeVerificationBodyUsersReportGeneratorHandlerHandler implements MiReportGeneratorHandler<EmptyMiReportParams> {

    private final MaritimeVerificationBodyUsersRepository verificationBodyUsersRepository;

    @Override
    @Transactional(readOnly = true)
    public MiReportResult generateMiReport(EntityManager entityManager, EmptyMiReportParams reportParams) {

        List<MaritimeVerificationBodyUser> verificationBodyUsers = verificationBodyUsersRepository.findAllVerificationBodyUsers(entityManager);

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
}
