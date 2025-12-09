package uk.gov.mrtm.api.integration.external.aer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;

import java.time.Year;
import java.util.Optional;

@Repository
public interface StagingAerRepository extends JpaRepository<StagingAerEntity, Long> {

    @Transactional(readOnly = true)
    Optional<StagingAerEntity> findByAccountIdAndYear(Long accountId, Year year);
}
