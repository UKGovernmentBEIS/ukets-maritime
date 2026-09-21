package uk.gov.mrtm.api.thirdpartydatamanagement.common.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionStats;

import java.util.List;
import java.util.Set;

@Repository
public interface ImportThirdPartyDataTransactionRepository extends JpaRepository<ImportThirdPartyDataTransactionEntity, Long> {

    @Transactional(readOnly = true)
    @Query(""" 
            select new uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem(
                txn.id,
                txn.createdOn,
                txn.submitterName,
                txn.type,
                txn.year,
                txn.status
            )
            from ImportThirdPartyDataTransactionEntity txn
            where txn.id = :transactionId""")
    ThirdPartyDataManagementTransactionItem findImportTransaction(long transactionId);

    @Transactional(readOnly = true)
    @Query(""" 
            select new uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem(
                txn.id,
                txn.createdOn,
                txn.submitterName,
                txn.type,
                txn.year,
                txn.status
            )
            from ImportThirdPartyDataTransactionEntity txn
            where exists (
                select 1
                from ImportThirdPartyDataJobEntity job
                where job.transaction.id = txn.id
                  and job.account.id in :accountIds
            )""")
    List<ThirdPartyDataManagementTransactionItem> findImportTransactionsByAccountId(Set<Long> accountIds, Pageable pageable);


    @Transactional(readOnly = true)
    @Query("""
    select new uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionStats(
        count(txn),
        count(case when txn.status = 'COMPLETED' then 1 end) as totalCompletedImports,
        count(case when txn.status = 'COMPLETED_WITH_FAILURES' then 1 end) as totalCompletedWithFailuresImports,
        count(case when txn.status = 'FAILED' then 1 end) as totalFailedImports,
        count(case when txn.status = 'IN_PROGRESS' then 1 end) as totalInProgressImports)
    from ImportThirdPartyDataTransactionEntity txn
    where exists (
        select 1
        from ImportThirdPartyDataJobEntity job
        where job.transaction.id = txn.id
          and job.account.id in :accountIds
    )
    """)
    ThirdPartyDataManagementTransactionStats countTransactionStatusesForAccounts(
            Set<Long> accountIds
    );
}
