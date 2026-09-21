package uk.gov.mrtm.api.thirdpartydatamanagement.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
@Table(name = "import_third_party_data_job", schema="sch_third_party_data")
public class ImportThirdPartyDataJobEntity {

    @Id
    @SequenceGenerator(name = "import_third_party_data_job_id_generator", sequenceName = "import_third_party_data_job_seq", allocationSize = 1, schema = "sch_third_party_data")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_third_party_data_job_id_generator")
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @NotNull
    private ThirdPartyDataManagementImportResult status;

    @Column(name = "staging_data_id")
    @NotNull
    private Long stagingDataId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_third_party_data_transaction_id")
    private ImportThirdPartyDataTransactionEntity transaction;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private MrtmAccount account;
}
