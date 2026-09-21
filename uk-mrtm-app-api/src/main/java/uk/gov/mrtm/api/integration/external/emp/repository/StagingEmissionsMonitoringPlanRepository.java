package uk.gov.mrtm.api.integration.external.emp.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface StagingEmissionsMonitoringPlanRepository extends JpaRepository<StagingEmissionsMonitoringPlanEntity, Long> {

    @Transactional(readOnly = true)
    Optional<StagingEmissionsMonitoringPlanEntity> findByAccountId(Long accountId);

    @Transactional(readOnly = true)
    List<StagingEmissionsMonitoringPlanEntity> findAllByIdIn(Set<Long> ids);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM StagingEmissionsMonitoringPlanEntity s WHERE s.id = :id")
    Optional<StagingEmissionsMonitoringPlanEntity> findByIdForUpdate(Long id);

    @Modifying
    @Query(
        "UPDATE StagingEmissionsMonitoringPlanEntity s SET s.importInProgress = :inProgress " +
        "WHERE s.id IN :ids"
    )
    void updateImportStatusByIdIn(Set<Long> ids, boolean inProgress);
}
