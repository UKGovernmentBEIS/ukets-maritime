package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationReviewExpirationDateServiceTest {

    @InjectMocks
    private EmpNotificationApplicationReviewExpirationDateService service;

    @Test
    void expirationDate() {
        Optional<Date> date = service.expirationDate();

        assertThat(date.isPresent()).isTrue();

        LocalDate localDate = date.get().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        long daysDifference = ChronoUnit.DAYS.between(LocalDate.now(), localDate);

        assertThat(daysDifference).isEqualTo(14);
    }


    @Test
    void getTypes() {
        assertThat(service.getTypes()).containsExactlyInAnyOrderElementsOf(Set.of(MrtmRequestType.EMP_NOTIFICATION));
    }

}