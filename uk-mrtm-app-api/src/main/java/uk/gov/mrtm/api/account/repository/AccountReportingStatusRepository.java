package uk.gov.mrtm.api.account.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;

import java.time.Year;
import java.util.List;

@Repository
public interface AccountReportingStatusRepository extends JpaRepository<AccountReportingStatus, Long> {

    @Transactional(readOnly = true)
    Page<AccountReportingStatus> findByAccountIdOrderByYearDesc(Pageable pageable, Long accountId);

    @Transactional(readOnly = true)
    AccountReportingStatus findByAccountIdAndYear(Long accountId, Year year);

    @Transactional(readOnly = true)
    List<AccountReportingStatus> findByAccountIdOrderByYearDesc(Long accountId);

    @Transactional(readOnly = true)
    boolean existsByAccountIdAndYear(Long accountId, Year year);
}
