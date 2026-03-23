package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskViewService;

import java.util.HashSet;
import java.util.Set;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeOutstandingRequestTasksReportServiceTest {

    @InjectMocks
    private MaritimeOutstandingRequestTasksReportService service;

    @Mock
    private RequestTaskViewService requestTaskViewService;

    @Test
    void getRequestTasks() {
        final String user = "user";
        final AppUser appUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleTypeConstants.REGULATOR).build();
        Set<String> expectedRequestTaskTypes = new HashSet<>(Set.of(
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT,
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS,
                MrtmRequestTaskType.DOE_TRACK_PAYMENT
        ));

        when(requestTaskViewService.getRequestTaskTypes(RoleTypeConstants.REGULATOR)).thenReturn(expectedRequestTaskTypes);

        Set<String> actualRequestTasks =
                service.getRequestTaskTypesByRoleType(appUser.getRoleType());

        Assertions.assertThat(actualRequestTasks.size()).isEqualTo(expectedRequestTaskTypes.size() - 2);
        Assertions.assertThat(actualRequestTasks).containsAll(Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT,
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW));
    }
}
