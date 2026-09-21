package uk.gov.mrtm.api.thirdpartydatamanagement.common.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataJobEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementJobItem;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ImportThirdPartyDataJobRepository extends JpaRepository<ImportThirdPartyDataJobEntity, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select job from ImportThirdPartyDataJobEntity job where job.id = :id")
    Optional<ImportThirdPartyDataJobEntity> findByIdForUpdate(long id);

    @Transactional(readOnly = true)
    @Query("select case when count(job) > 0 then true else false end " +
        "from ImportThirdPartyDataJobEntity job " +
        "where job.transaction.id = :transactionId and job.account.id in :accountIds")
    boolean existsByTransactionIdAndAccountIds(long transactionId, Set<Long> accountIds);

    long countByTransactionIdAndStatus(Long transactionId, ThirdPartyDataManagementImportResult status);

    long countByTransactionIdAndStatusNot(Long transactionId, ThirdPartyDataManagementImportResult status);

    long countByTransactionId(Long transactionId);

    @Transactional(readOnly = true)
    @Query("select new uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementJobItem( " +
        "        acc.name, " +
        "        job.status " +
        "    ) " +
        "    from ImportThirdPartyDataJobEntity job " +
        "    join Account acc on acc.id = job.account.id " +
        "    where job.transaction.id = :transactionId " +
        "    and job.account.id in :accountIds")
    List<ThirdPartyDataManagementJobItem> findAllByTransactionIdAndAccountIds(long transactionId, Set<Long> accountIds);

    @Modifying
    @Query(value = """
        UPDATE sch_third_party_data.import_third_party_data_job job
        SET status = :status
        WHERE id = :id
    """, nativeQuery = true)
    void updateStatus(@Param("id") long id, @Param("status") String status);

}
