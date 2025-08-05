package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpNotificationWaitForFollowUpRequestTaskPayload extends RequestTaskPayload {

    private String followUpRequest;

    private LocalDate followUpResponseExpirationDate;
}
