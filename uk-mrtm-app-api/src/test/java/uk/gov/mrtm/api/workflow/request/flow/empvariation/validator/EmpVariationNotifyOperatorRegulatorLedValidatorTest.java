package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationNotifyOperatorRegulatorLedValidatorTest {

    @InjectMocks
    private EmpVariationNotifyOperatorRegulatorLedValidator cut;

    @Mock
    private EmpVariationRegulatorLedValidator empValidator;

    @Mock
    private DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    @Test
    void validate() {
        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .empVariationDetails(EmpVariationDetails.builder()
                        .reason("reason")
                        .build())
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .request(Request.builder()
                        .requestResources(List.of(RequestResource.builder().resourceId("1").resourceType(ResourceType.ACCOUNT).build()))
                        .build())
                .build();

        NotifyOperatorForDecisionRequestTaskActionPayload taskActionPayload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                .decisionNotification(DecisionNotification.builder()
                        .operators(Set.of("op1"))
                        .build())
                .build();

        AppUser appUser = AppUser.builder().userId("userId").build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, taskActionPayload.getDecisionNotification(),
                appUser)).thenReturn(true);

        cut.validate(requestTask, taskActionPayload, appUser);

        verify(empValidator, times(1)).validateEmp(taskPayload, requestTask.getRequest().getAccountId());
        verify(decisionNotificationUsersValidator, times(1)).areUsersValid(requestTask,
                taskActionPayload.getDecisionNotification(), appUser);
    }

    @Test
    void validate_invalid_users() {
        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .empVariationDetails(EmpVariationDetails.builder()
                        .reason("reason")
                        .build())
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .request(Request.builder()
                        .requestResources(List.of(RequestResource.builder().resourceId("1").resourceType(ResourceType.ACCOUNT).build()))
                        .build())
                .build();

        NotifyOperatorForDecisionRequestTaskActionPayload taskActionPayload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                .decisionNotification(DecisionNotification.builder()
                        .operators(Set.of("op1"))
                        .build())
                .build();

        AppUser appUser = AppUser.builder().userId("userId").build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, taskActionPayload.getDecisionNotification(),
                appUser)).thenReturn(false);

        BusinessException be = assertThrows(BusinessException.class, () -> cut.validate(requestTask, taskActionPayload, appUser));
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);

        verify(empValidator, times(1)).validateEmp(taskPayload, requestTask.getRequest().getAccountId());
        verify(decisionNotificationUsersValidator, times(1)).areUsersValid(requestTask,
                taskActionPayload.getDecisionNotification(), appUser);
    }
}
