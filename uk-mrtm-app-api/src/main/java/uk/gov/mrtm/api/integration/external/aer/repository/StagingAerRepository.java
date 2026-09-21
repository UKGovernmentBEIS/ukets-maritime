package uk.gov.mrtm.api.integration.external.aer.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;

import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface StagingAerRepository extends JpaRepository<StagingAerEntity, Long> {

    @Transactional(readOnly = true)
    Optional<StagingAerEntity> findByAccountIdAndYear(Long accountId, Year year);

    @Transactional(readOnly = true)
    List<StagingAerEntity> findAllByIdInAndYear(Set<Long> ids, Year year);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM StagingAerEntity s WHERE s.id = :id")
    Optional<StagingAerEntity> findByIdForUpdate(Long id);

    @Modifying
    @Query(
        "UPDATE StagingAerEntity s SET s.importInProgress = :inProgress " +
        "WHERE s.id IN :ids"
    )
    void updateImportStatusByIdIn(Set<Long> ids, boolean inProgress);
}
