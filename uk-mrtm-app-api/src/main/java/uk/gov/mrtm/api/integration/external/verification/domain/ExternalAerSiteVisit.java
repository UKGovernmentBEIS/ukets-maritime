package uk.gov.mrtm.api.integration.external.verification.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.verification.AerSiteVisitType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{(" +
    "#type eq 'IN_PERSON' " +
    "&& #teamMembers != null " +
    "&& #siteVisitDetails?.size() gt 0 " +
    "&& #inPersonVisitReason == null " +

    ")||(" +

    "#type eq 'VIRTUAL' " +
    "&& #teamMembers == null " +
    "&& (#siteVisitDetails == null OR #siteVisitDetails?.size() eq 0) " +
    "&& #inPersonVisitReason != null " +
    ")}",
    message = "aerVerificationData.external.site.visit.invalid")
public class ExternalAerSiteVisit {

    @NotNull
    @Schema(description = "Site visit kind")
    private AerSiteVisitType type;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @Schema(description = "In person site visits details. Provide only when visit type is 'IN_PERSON'")
    private List<@Valid @NotNull ExternalAerInPersonSiteVisitDatesDetails> siteVisitDetails = new ArrayList<>();

    @Size(max = 10000)
    @Schema(description = "The names of the lead auditors and any technical experts involved. Separate the names with a comma, for example John Smith, Jane Smith. Provide only when visit type is 'IN_PERSON'")
    private String teamMembers;

    @Size(max = 10000)
    @Schema(description = "Reasons for making a virtual visit. Provide only when visit type is 'VIRTUAL'")
    private String inPersonVisitReason;
}
