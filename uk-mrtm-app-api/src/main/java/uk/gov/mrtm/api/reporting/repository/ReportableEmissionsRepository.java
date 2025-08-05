package uk.gov.mrtm.api.reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsEntity;

import java.time.Year;
import java.util.Optional;

@Repository
public interface ReportableEmissionsRepository extends JpaRepository<ReportableEmissionsEntity, Long> {

    @Transactional(readOnly = true)
    Optional<ReportableEmissionsEntity> findByAccountIdAndYear(Long accountId, Year year);
}
