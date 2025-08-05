package uk.gov.mrtm.api.account.domain;

import io.hypersistence.utils.hibernate.type.basic.YearType;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "account_reporting_status")
public class AccountReportingStatus {

    @Id
    @SequenceGenerator(name = "account_reporting_status_id_generator", sequenceName = "account_reporting_status_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_reporting_status_id_generator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MrtmAccountReportingStatus status;

    private String reason;

    @Type(YearType.class)
    @Column(
        name = "year",
        columnDefinition = "smallint"
    )
    @NotNull
    private Year year;

    @NotNull
    private LocalDateTime lastUpdate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private MrtmAccount account;

    @Builder.Default
    @OneToMany(mappedBy = "accountReportingStatus", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("submissionDate desc")
    private List<AccountReportingStatusHistory> reportingStatusHistoryList = new ArrayList<>();

    public void addReportingStatusHistory(AccountReportingStatusHistory reportingStatusHistory) {
        reportingStatusHistory.setAccountReportingStatus(this);
        this.reportingStatusHistoryList.add(reportingStatusHistory);
    }
}
