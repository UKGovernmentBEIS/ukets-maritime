package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.service.CalculateApplicationReviewExpirationDateService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpNotificationApplicationReviewExpirationDateService
    implements CalculateApplicationReviewExpirationDateService {

    @Override
    public Optional<Date> expirationDate() {
        LocalDate expiration = LocalDate.now().plusWeeks(2L);
        Date date = Date.from(expiration.atTime(LocalTime.MIN).atZone(ZoneId.systemDefault()).toInstant());
        return Optional.of(date);
    }

    @Override
    public Set<String> getTypes() {
        return Set.of(MrtmRequestType.EMP_NOTIFICATION);
    }
}
