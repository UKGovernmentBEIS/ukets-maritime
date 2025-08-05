package uk.gov.mrtm.api.emissionsmonitoringplan.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.netz.api.common.AbstractContainerBaseTest;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class EmissionsMonitoringPlanRepositoryIT extends AbstractContainerBaseTest {
    private static final UUID DOCUMENT_ID = UUID.randomUUID();
    private static final String EMP_ID_1 = "empId1";
    private static final String EMP_ID_2 = "empId2";
    private static final String EMP_ID_3 = "empId3";
    private static final Long ACCOUNT_ID = 1L;
    private static final String FILE_DOCUMENT_ID_1 = "fileDocumentId1";
    private static final String FILE_DOCUMENT_ID_2 = "fileDocumentId2";

    @Autowired
    private EmissionsMonitoringPlanRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findByAccountId() {

        EmissionsMonitoringPlanEntity empEntity = createEmpEntity(EMP_ID_1, FILE_DOCUMENT_ID_1);
        flushAndClear();
        final Optional<EmissionsMonitoringPlanEntity> actual = repository.findByAccountId(ACCOUNT_ID);
        assertFalse(actual.isEmpty());
        assertEquals(empEntity.getId(), actual.get().getId());
        assertEquals(empEntity.getAccountId(), actual.get().getAccountId());
        assertEquals(empEntity.getFileDocumentUuid(), actual.get().getFileDocumentUuid());
        assertEquals(DOCUMENT_ID.toString(), empEntity.getEmpContainer().getEmpAttachments().get(DOCUMENT_ID));
    }

    @Test
    void findIdByAccountId() {

        EmissionsMonitoringPlanEntity empEntity = createEmpEntity(EMP_ID_1, FILE_DOCUMENT_ID_1);
        flushAndClear();
        final Optional<String> actual = repository.findIdByAccountId(ACCOUNT_ID);
        assertFalse(actual.isEmpty());
        assertEquals(empEntity.getId(), actual.get());
    }

    @Test
    void existsByIdAndFileDocumentUuid() {
        createEmpEntity(EMP_ID_1, FILE_DOCUMENT_ID_1);
        createEmpEntity(EMP_ID_2, FILE_DOCUMENT_ID_1);
        createEmpEntity(EMP_ID_3, FILE_DOCUMENT_ID_2);
        flushAndClear();
        assertTrue(repository.existsByIdAndFileDocumentUuid(EMP_ID_1, FILE_DOCUMENT_ID_1));
        assertFalse(repository.existsByIdAndFileDocumentUuid(EMP_ID_1, FILE_DOCUMENT_ID_2));
        assertFalse(repository.existsByIdAndFileDocumentUuid(EMP_ID_3, FILE_DOCUMENT_ID_1));
    }

    @Test
    void findEmpAccountById() {
        createEmpEntity(EMP_ID_1, FILE_DOCUMENT_ID_1);
        flushAndClear();
        assertTrue(repository.findEmpAccountById(EMP_ID_1).isPresent());
        assertThat(repository.findEmpAccountById(EMP_ID_1).get()).isEqualTo(ACCOUNT_ID);
        assertFalse(repository.findEmpAccountById(EMP_ID_2).isPresent());
    }

    private EmissionsMonitoringPlanEntity createEmpEntity(String empId, String fileDocumentUuid) {

        final EmissionsMonitoringPlanContainer container = EmissionsMonitoringPlanContainer.builder()
            .emissionsMonitoringPlan(
                EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID, "1234567")
            ).build();
        container.setEmpAttachments(container.getEmissionsMonitoringPlan().getEmpSectionAttachmentIds().stream()
                .collect(Collectors.toMap(Function.identity(), UUID::toString))
        );

        final EmissionsMonitoringPlanEntity empEntity = EmissionsMonitoringPlanEntity.builder()
                .id(empId)
                .accountId(ACCOUNT_ID)
                .fileDocumentUuid(fileDocumentUuid)
                .empContainer(container)
                .build();

        entityManager.persist(empEntity);
        return empEntity;

    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
