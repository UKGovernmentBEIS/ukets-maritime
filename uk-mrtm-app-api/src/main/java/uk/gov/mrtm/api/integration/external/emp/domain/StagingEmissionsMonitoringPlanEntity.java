package uk.gov.mrtm.api.integration.external.emp.domain;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode
@Table(name = "emp_staging", schema="sch_third_party_data")
public class StagingEmissionsMonitoringPlanEntity {

    @Id
    @SequenceGenerator(name = "emp_staging_id_generator", sequenceName = "emp_staging_seq", allocationSize = 1, schema = "sch_third_party_data")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emp_staging_id_generator")
    private Long id;

    @Column(name = "account_id")
    @EqualsAndHashCode.Include()
    private Long accountId;

    @Basic(fetch = FetchType.LAZY)
    @Type(JsonType.class)
    @Column(name = "payload", columnDefinition = "jsonb")
    private StagingEmissionsMonitoringPlan payload;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @Column(name = "imported_on")
    private LocalDateTime importedOn;
}
