package uk.gov.mrtm.api.integration.external.emp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;

import java.util.Optional;

@Repository
public interface StagingEmissionsMonitoringPlanRepository extends JpaRepository<StagingEmissionsMonitoringPlanEntity, Long> {

    @Transactional(readOnly = true)
    Optional<StagingEmissionsMonitoringPlanEntity> findByAccountId(Long accountId);
}
