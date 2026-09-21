package uk.gov.mrtm.api.integration.external.common.domain;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@MappedSuperclass
public abstract class BaseStagingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "default_staging_id_generator")
    private Long id;

    @Column(name = "account_id")
    @NotNull
    private Long accountId;

    @Basic(fetch = FetchType.LAZY)
    @Type(JsonType.class)
    @Column(name = "payload", columnDefinition = "jsonb")
    @NotNull
    private ThirdPartyDataProviderPayload payload;

    @Column(name = "provider_name")
    @NotNull
    private String providerName;

    @Column(name = "created_on")
    @NotNull
    private LocalDateTime createdOn;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @Column(name = "imported_on")
    private LocalDateTime importedOn;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "import_status")
    private StagingImportStatus importStatus;

    @NotNull
    @Column(name = "import_in_progress")
    private boolean importInProgress;
}
