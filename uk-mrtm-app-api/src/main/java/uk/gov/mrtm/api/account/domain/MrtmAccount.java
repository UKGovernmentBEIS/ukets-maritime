package uk.gov.mrtm.api.account.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.RegisteredAddressState;
import uk.gov.netz.api.account.domain.Account;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Entity(name = "account_mrtm")
@Table(name = "account_mrtm",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"imoNumber"}),
            @UniqueConstraint(columnNames = {"registry_id"}),
        })
@NamedQuery(
        name = MrtmAccount.NAMED_QUERY_FIND_BY_IMO_NUMBER,
        query = "select acc "
                + "from account_mrtm acc "
                + "where acc.imoNumber = :imoNumber"
)
@NamedQuery(
        name = MrtmAccount.NAMED_QUERY_FIND_BY_USER_ID,
        query = "select acc "
                + "from account_mrtm acc "
                + "inner join acc.contacts contacts "
                + "where contacts = :userId"
)
public class MrtmAccount extends Account {

    public static final String NAMED_QUERY_FIND_BY_IMO_NUMBER = "MrtmAccount.findByImoNumber";
    public static final String NAMED_QUERY_FIND_BY_USER_ID = "MrtmAccount.findByUserId";

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @NotNull
    private MrtmAccountStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "emission_trading_scheme")
    @NotNull
    private MrtmEmissionTradingScheme emissionTradingScheme;

    @Column(name = "imo_number")
    @NotBlank
    private String imoNumber;

    @Embedded
    @NotNull
    @Valid
    private AddressState address;

    @Column(name = "first_maritime_activity_date")
    @NotNull
    private LocalDate firstMaritimeActivityDate;

    @Column(name = "sop_id")
    @Min(0)
    @Max(9999999999L)
    private Long sopId;

    @Column(name = "registry_id")
    @Min(1000000)
    @Max(9999999)
    private Integer registryId;

    @Column(name = "closing_date")
    private LocalDateTime closingDate;

    @Column(name = "closed_by")
    private String closedBy;

    @Column(name = "closed_by_name")
    private String closedByName;

    @Column(name = "closure_reason")
    private String closureReason;

    @Embedded
    @Valid
    private RegisteredAddressState registeredAddress;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private String createdByUserId;

    @Column(name = "last_updated_date")
    private LocalDateTime lastUpdatedDate;

    @Column(name = "last_updated_by")
    private String updatedBy;

    @Builder.Default
    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("year desc")
    private List<AccountReportingStatus> reportingStatusList = new ArrayList<>();

    public void addReportingStatus(AccountReportingStatus reportingStatus) {
        reportingStatus.setAccount(this);
        this.reportingStatusList.add(reportingStatus);
    }
}
