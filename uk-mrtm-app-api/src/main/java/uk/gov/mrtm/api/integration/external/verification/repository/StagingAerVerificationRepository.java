package uk.gov.mrtm.api.integration.external.verification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerificationEntity;

import java.time.Year;
import java.util.Optional;

@Repository
public interface StagingAerVerificationRepository extends JpaRepository<StagingAerVerificationEntity, Long> {

    @Transactional(readOnly = true)
    Optional<StagingAerVerificationEntity> findByAccountIdAndYear(Long accountId, Year year);
}
