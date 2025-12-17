package uk.gov.mrtm.api.integration.external.aer.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;
import uk.gov.netz.api.common.config.YearAttributeConverter;

import java.time.Year;

@SequenceGenerator(name = "default_staging_id_generator", sequenceName = "aer_staging_seq", allocationSize = 1, schema = "sch_third_party_data")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@Table(name = "aer_staging", schema="sch_third_party_data")
public class StagingAerEntity extends BaseStagingEntity {

    @Column(name = "year")
    @EqualsAndHashCode.Include()
    @Convert(converter = YearAttributeConverter.class)
    private Year year;
}
