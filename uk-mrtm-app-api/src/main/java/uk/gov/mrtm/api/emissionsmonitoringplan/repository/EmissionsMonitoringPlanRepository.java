package uk.gov.mrtm.api.emissionsmonitoringplan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpAccountDTO;

import java.util.Optional;
import java.util.Set;

@Repository
public interface EmissionsMonitoringPlanRepository extends JpaRepository<EmissionsMonitoringPlanEntity, String> {

    Optional<EmissionsMonitoringPlanEntity> findByAccountId(Long accountId);

    @Transactional(readOnly = true)
    @Query(name = EmissionsMonitoringPlanEntity.NAMED_QUERY_FIND_ID_BY_ACCOUNT_ID)
    Optional<String> findIdByAccountId(Long accountId);

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(name = EmissionsMonitoringPlanEntity.NAMED_QUERY_UPDATE_FILE_DOCUMENT_UUID_BY_ID)
    void updateFileDocumentUuid(@Param("empId") String empId, @Param("fileDocumentUUid") String fileDocumentUUid);

    @Transactional(readOnly = true)
    @Query(name = EmissionsMonitoringPlanEntity.NAMED_NATIVE_QUERY_FIND_ALL_BY_ACCOUNT_IDS, nativeQuery = true)
    Set<EmpAccountDTO> findAllByAccountIdIn(Set<Long> accountIds);

    @Transactional(readOnly = true)
    boolean existsByIdAndFileDocumentUuid(String empId, String fileDocumentUuid);

    @Transactional(readOnly = true)
    @Query(name = EmissionsMonitoringPlanEntity.NAMED_QUERY_FIND_EMP_ACCOUNT_BY_ID)
    Optional<Long> findEmpAccountById(String id);
}
