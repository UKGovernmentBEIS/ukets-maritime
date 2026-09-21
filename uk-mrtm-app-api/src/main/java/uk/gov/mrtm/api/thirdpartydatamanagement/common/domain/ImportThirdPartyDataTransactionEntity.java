package uk.gov.mrtm.api.thirdpartydatamanagement.common.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataTransactionStatus;
import uk.gov.netz.api.common.config.YearAttributeConverter;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
@Table(name = "import_third_party_data_transaction", schema = "sch_third_party_data")
public class ImportThirdPartyDataTransactionEntity {

    @Id
    @SequenceGenerator(name = "import_third_party_data_transaction_id_generator", sequenceName = "import_third_party_data_transaction_seq", allocationSize = 1, schema = "sch_third_party_data")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_third_party_data_transaction_id_generator")
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @NotNull
    private ThirdPartyDataTransactionStatus status;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    @NotNull
    private ThirdPartyDataRequestType type;

    @Column(name = "process_instance_id", unique = true)
    private String processInstanceId;

    @Column(name = "year")
    @Convert(converter = YearAttributeConverter.class)
    private Year year;

    @Column(name = "created_on")
    @NotNull
    private LocalDateTime createdOn;

    @Column(name = "submitter_id")
    @NotNull
    private String submitterId;

    @Column(name = "submitter_name")
    @NotNull
    private String submitterName;

    @Builder.Default
    @OneToMany(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImportThirdPartyDataJobEntity> jobs = new ArrayList<>();

}
