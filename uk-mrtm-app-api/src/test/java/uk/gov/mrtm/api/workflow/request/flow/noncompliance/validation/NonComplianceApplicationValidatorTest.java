package uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.application.taskview.RequestInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceApplicationValidatorTest {

    @InjectMocks
    private NonComplianceApplicationValidator validator;

    @Mock
    private DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    @Test
    void validateApplication_whenInvalidId_thenThrowException() {

        final NonComplianceApplicationSubmitRequestTaskPayload payload =
            NonComplianceApplicationSubmitRequestTaskPayload.builder()
                .availableRequests(List.of(RequestInfoDTO.builder().id("id_exists").build()))
                .selectedRequests(Set.of("id_exists", "id_not_exists"))
                .build();

        final BusinessException be = assertThrows(BusinessException.class, () -> validator.validateApplication(payload));

        assertEquals(ErrorCode.FORM_VALIDATION, be.getErrorCode());
    }

    @Test
    void validateApplication_whenValidId_thenOk() {

        final NonComplianceApplicationSubmitRequestTaskPayload payload =
            NonComplianceApplicationSubmitRequestTaskPayload.builder()
                .availableRequests(List.of(RequestInfoDTO.builder().id("id_exists").build()))
                .selectedRequests(Set.of("id_exists"))
                .build();

        assertDoesNotThrow(() -> validator.validateApplication(payload));
    }

    @Test
    void validateUsers_whenValid_thenOk() {

        final RequestTask requestTask = RequestTask.builder().build();
        final Set<Long> externalContacts = Set.of(1L, 2L);
        final Set<String> operators = Set.of("op1", "op2");
        final AppUser appUser = AppUser.builder().build();
        final DecisionNotification decisionNotification = DecisionNotification.builder()
            .operators(operators)
            .externalContacts(externalContacts)
            .build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)).thenReturn(true);

        validator.validateUsers(requestTask, operators, externalContacts, appUser);

        verify(decisionNotificationUsersValidator, times(1)).areUsersValid(requestTask, decisionNotification, appUser);
    }

    @Test
    void validateUsers_whenInvalidId_thenThrowException() {

        final RequestTask requestTask = RequestTask.builder().build();
        final Set<Long> externalContacts = Set.of(1L, 2L);
        final Set<String> operators = Set.of("op1", "op2");
        final AppUser appUser = AppUser.builder().build();
        final DecisionNotification  decisionNotification = DecisionNotification.builder()
            .operators(operators)
            .externalContacts(externalContacts)
            .build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)).thenReturn(false);

        final BusinessException be = assertThrows(BusinessException.class, () -> validator.validateUsers(requestTask, operators, externalContacts, appUser));

        assertEquals(ErrorCode.FORM_VALIDATION, be.getErrorCode());

        verify(decisionNotificationUsersValidator, times(1)).areUsersValid(requestTask, decisionNotification, appUser);
    }
}