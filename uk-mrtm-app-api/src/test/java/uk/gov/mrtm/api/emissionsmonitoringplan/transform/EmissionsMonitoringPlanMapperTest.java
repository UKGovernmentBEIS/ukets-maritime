package uk.gov.mrtm.api.emissionsmonitoringplan.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class EmissionsMonitoringPlanMapperTest {

    private final EmissionsMonitoringPlanMapper mapper = Mappers.getMapper(EmissionsMonitoringPlanMapper.class);

    @Test
    void toEmissionsMonitoringPlanDTO() {

        String empId = "empId";
        Long accountId = 1L;

        final EmissionsMonitoringPlanEntity empEntity = EmissionsMonitoringPlanEntity.builder()
                .id(empId)
                .accountId(accountId)
                .empContainer(EmissionsMonitoringPlanContainer.builder()
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder()
                                        .exist(false)
                                        .build())
                                .additionalDocuments(AdditionalDocuments.builder()
                                        .exist(false)
                                        .build())
                                .build())
                        .build())
                .build();
        EmissionsMonitoringPlanDTO actual = mapper.toEmissionsMonitoringPlanDTO(empEntity);

        final EmissionsMonitoringPlan emissionsMonitoringPlan = actual.getEmpContainer().getEmissionsMonitoringPlan();

        assertThat(actual.getId()).isEqualTo(empId);
        assertThat(actual.getAccountId()).isEqualTo(accountId);
        assertThat(emissionsMonitoringPlan).isNotNull();

    }

    @Test
    void toEmpDetailsDTO() {

        String empId = "empId";
        Long accountId = 1L;
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "attachment 1", UUID.randomUUID(), "attachment 2");
        final EmissionsMonitoringPlanEntity empEntity = EmissionsMonitoringPlanEntity.builder()
                .id(empId)
                .accountId(accountId)
                .empContainer(EmissionsMonitoringPlanContainer.builder()
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder()
                                        .exist(false)
                                        .build())
                                .additionalDocuments(AdditionalDocuments.builder()
                                        .exist(false)
                                        .build())
                                .build())
                        .empAttachments(empAttachments)
                        .build())
                .build();
        FileInfoDTO fileInfoDTO = FileInfoDTO.builder()
                .name("name")
                .uuid(UUID.randomUUID().toString())
                .build();
        EmpDetailsDTO actual = mapper.toEmpDetailsDTO(empEntity, fileInfoDTO);

        assertThat(actual.getId()).isEqualTo(empId);
        assertThat(actual.getEmpAttachments()).isEqualTo(empAttachments);
        assertThat(actual.getFileDocument()).isEqualTo(fileInfoDTO);

    }

}
