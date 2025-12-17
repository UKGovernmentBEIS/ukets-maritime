package uk.gov.mrtm.api.integration.external.emp.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;

@SequenceGenerator(name = "default_staging_id_generator", sequenceName = "emp_staging_seq", allocationSize = 1, schema = "sch_third_party_data")
@SuperBuilder
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@Table(name = "emp_staging", schema="sch_third_party_data")
public class StagingEmissionsMonitoringPlanEntity extends BaseStagingEntity {
}
