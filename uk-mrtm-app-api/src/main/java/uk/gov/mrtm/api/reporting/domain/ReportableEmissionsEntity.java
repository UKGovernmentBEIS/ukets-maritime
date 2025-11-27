package uk.gov.mrtm.api.reporting.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uk.gov.netz.api.common.config.YearAttributeConverter;

import java.math.BigDecimal;
import java.time.Year;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "rpt_reportable_emissions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"account_id", "year"})
    })
public class ReportableEmissionsEntity {

    @Id
    @SequenceGenerator(name = "rpt_reportable_emissions_id_generator", sequenceName = "rpt_reportable_emissions_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rpt_reportable_emissions_id_generator")
    private Long id;

    @EqualsAndHashCode.Include()
    @Column(name = "account_id")
    @NotNull
    private Long accountId;

    @EqualsAndHashCode.Include()
    @Column(name = "year")
    @Convert(converter = YearAttributeConverter.class)
    @NotNull
    private Year year;

    @Column(name = "surrender_emissions")
    @NotNull
    private BigDecimal surrenderEmissions;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 4)
    @Column(name = "total_emissions")
    private BigDecimal totalEmissions;

    @Column(name = "less_voyages_in_northern_ireland_deduction")
    private BigDecimal lessVoyagesInNorthernIrelandDeduction;

    @Column(name = "is_from_doe", columnDefinition = "boolean default false")
    private boolean isFromDoe;

    @Column(name = "is_exempted", columnDefinition = "boolean default false")
    private boolean isExempted;
}
