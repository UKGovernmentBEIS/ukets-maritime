package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

public interface NonComplianceRequestTaskClosable extends NonComplianceRequestTaskAttachable {
    
    void setCloseJustification(NonComplianceCloseJustification justification);
}
