package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;

import java.util.HashSet;
import java.util.Set;

@UtilityClass
public class AerReviewUtils {

    public Set<AerReviewGroup> getDeprecatedAerDataReviewGroups(AerRequestPayload requestPayload,
                                                                AerApplicationAmendsSubmitRequestTaskPayload amendsSubmitRequestTaskPayload) {
        Boolean reportingRequiredInRequestPayload = requestPayload.getReportingRequired();
        boolean hasPortsInRequestPayload = requestPayload.getAer() != null
            && requestPayload.getAer().getPortEmissions() != null
            && !requestPayload.getAer().getPortEmissions().getPorts().isEmpty();
        boolean hasVoyagesInRequestPayload = requestPayload.getAer() != null
            && requestPayload.getAer().getVoyageEmissions() != null
            && !requestPayload.getAer().getVoyageEmissions().getVoyages().isEmpty();

        Boolean reportingRequiredInRequestTaskPayload = amendsSubmitRequestTaskPayload.getReportingRequired();
        boolean hasPortsInRequestTaskPayload = amendsSubmitRequestTaskPayload.getAer() != null
            && amendsSubmitRequestTaskPayload.getAer().getPortEmissions() != null
            && !amendsSubmitRequestTaskPayload.getAer().getPortEmissions().getPorts().isEmpty();
        boolean hasVoyagesInRequestTaskPayload = amendsSubmitRequestTaskPayload.getAer() != null
            && amendsSubmitRequestTaskPayload.getAer().getVoyageEmissions() != null
            && !amendsSubmitRequestTaskPayload.getAer().getVoyageEmissions().getVoyages().isEmpty();

        Set<AerReviewGroup> existingReviewGroups = new HashSet<>(AerReviewGroup
            .getAerDataReviewGroups(reportingRequiredInRequestPayload, hasPortsInRequestPayload, hasVoyagesInRequestPayload));

        Set<AerReviewGroup> newReviewGroupsNeeded = new HashSet<>(AerReviewGroup
            .getAerDataReviewGroups(reportingRequiredInRequestTaskPayload, hasPortsInRequestTaskPayload, hasVoyagesInRequestTaskPayload));

        existingReviewGroups.removeAll(newReviewGroupsNeeded);

        return existingReviewGroups;
    }
}
