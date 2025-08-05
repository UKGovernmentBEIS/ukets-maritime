package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

import java.util.Map;
import java.util.UUID;

public interface NonComplianceRequestTaskAttachable {

    Map<UUID, String> getNonComplianceAttachments();
}
