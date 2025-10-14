package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpMandate;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpRegisteredOwner;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.RegisteredOwnerShipDetails;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpMandateValidator implements EmpContextValidator {

    @Override
    public EmissionsMonitoringPlanValidationResult validate(EmissionsMonitoringPlanContainer empContainer, Long accountId) {
        List<EmissionsMonitoringPlanViolation> empViolations = new ArrayList<>();

        final EmpMandate mandate = empContainer.getEmissionsMonitoringPlan().getMandate();

        final Set<String> allIsmShips = getAllIsmShips(empContainer);
        if (!allIsmShips.isEmpty() && Boolean.FALSE.equals(mandate.getExist())) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_ISM_SHIPS_AND_REGISTERED_OWNERS,
                    allIsmShips.toArray()));
        }

        if (Boolean.TRUE.equals(mandate.getExist()) && !mandate.getRegisteredOwners().isEmpty()) {

            final boolean imoNumberExists = validateImoNumberUniqueness(empContainer);
            if (imoNumberExists) {
                empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                        EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_REGISTERED_OWNER_IMO_NUMBER));
            }

            final Set<String> invalidShipImoNumbers = validateShipImoNumbers(empContainer);
            if (!invalidShipImoNumbers.isEmpty()) {
                empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                        EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_REGISTERED_OWNER_SHIP,
                        invalidShipImoNumbers.toArray()));
            }

            final Set<String> duplicateShipImoNumbers = validateDuplicateShipsAcrossOwners(mandate);
            if (!duplicateShipImoNumbers.isEmpty()) {
                empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                        EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_SHIP_IMO_ACROSS_REGISTERED_OWNERS,
                        duplicateShipImoNumbers.toArray()));
            }
            final Set<String> invalidShipNamesImoNumbers = validateShipNames(empContainer);
            if (!invalidShipNamesImoNumbers.isEmpty()) {
                empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                        EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_REGISTERED_OWNER_SHIP_NAME,
                        invalidShipNamesImoNumbers.toArray()));
            }
            final boolean allShipsAssociated = validateAllShipsAssociated(empContainer);
            if (!allShipsAssociated) {
                empViolations.add(new EmissionsMonitoringPlanViolation(EmpMandate.class.getSimpleName(),
                        EmissionsMonitoringPlanViolation.ViolationMessage.SHIP_NOT_ASSOCIATED_WITH_REGISTERED_OWNER));
            }
        }

        return EmissionsMonitoringPlanValidationResult.builder()
                .valid(empViolations.isEmpty())
                .empViolations(empViolations)
                .build();
    }

    private boolean validateImoNumberUniqueness(EmissionsMonitoringPlanContainer empContainer) {
        final Set<String> imoNumbers = empContainer.getEmissionsMonitoringPlan().getMandate().getRegisteredOwners().stream()
                .map(EmpRegisteredOwner::getImoNumber)
                .collect(Collectors.toSet());
        return imoNumbers.contains(empContainer.getEmissionsMonitoringPlan().getOperatorDetails().getImoNumber());
    }

    private Set<String> validateShipImoNumbers(EmissionsMonitoringPlanContainer empContainer) {
        final Set<String> allShipImoNumbers = empContainer.getEmissionsMonitoringPlan().getEmissions().getShips().stream()
                .map(EmpShipEmissions::getDetails)
                .filter(shipDetails -> ReportingResponsibilityNature.ISM_COMPANY.equals(shipDetails.getNatureOfReportingResponsibility()))
                .map(ShipDetails::getImoNumber)
                .collect(Collectors.toSet());

        return empContainer.getEmissionsMonitoringPlan().getMandate().getRegisteredOwners().stream()
                .flatMap(empRegisteredOwner -> empRegisteredOwner.getShips().stream())
                .map(RegisteredOwnerShipDetails::getImoNumber)
                .filter(shipImo -> !allShipImoNumbers.contains(shipImo))
                .collect(Collectors.toSet());
    }

    private Set<String> validateDuplicateShipsAcrossOwners(EmpMandate mandate) {
        Set<String> seenShipImoNumbers = new HashSet<>();

        return mandate.getRegisteredOwners().stream()
                .flatMap(owner -> owner.getShips().stream())
                .map(RegisteredOwnerShipDetails::getImoNumber)
                .filter(imoShip -> !seenShipImoNumbers.add(imoShip))
                .collect(Collectors.toSet());
    }

    private Set<String> validateShipNames(EmissionsMonitoringPlanContainer empContainer) {
        final Map<String, String> allShipImoNames = empContainer.getEmissionsMonitoringPlan().getEmissions().getShips().stream()
                .map(EmpShipEmissions::getDetails)
                .collect(Collectors.toMap(ShipDetails::getImoNumber, ShipDetails::getName));

        return empContainer.getEmissionsMonitoringPlan().getMandate().getRegisteredOwners().stream()
                .flatMap(owner -> owner.getShips().stream())
                .filter(shipDetails -> allShipImoNames.containsKey(shipDetails.getImoNumber())
                        && !allShipImoNames.get(shipDetails.getImoNumber()).equals(shipDetails.getName()))
                .map(RegisteredOwnerShipDetails::getImoNumber)
                .collect(Collectors.toSet());
    }

    private boolean validateAllShipsAssociated(EmissionsMonitoringPlanContainer empContainer) {

        final Set<String> allShipImoNumbers = empContainer.getEmissionsMonitoringPlan().getEmissions().getShips().stream()
                .map(EmpShipEmissions::getDetails)
                .filter(shipDetails -> ReportingResponsibilityNature.ISM_COMPANY.equals(shipDetails.getNatureOfReportingResponsibility()))
                .map(ShipDetails::getImoNumber)
                .collect(Collectors.toSet());

        final Set<String> associatedShipImoNumbers = empContainer.getEmissionsMonitoringPlan().getMandate().getRegisteredOwners().stream()
                .flatMap(owner -> owner.getShips().stream())
                .map(RegisteredOwnerShipDetails::getImoNumber)
                .filter(allShipImoNumbers::contains)
                .collect(Collectors.toSet());

        return allShipImoNumbers.size() == associatedShipImoNumbers.size();
    }

    private Set<String> getAllIsmShips(EmissionsMonitoringPlanContainer empContainer) {
        return empContainer.getEmissionsMonitoringPlan().getEmissions().getShips().stream()
                .map(EmpShipEmissions::getDetails)
                .filter(shipDetails -> ReportingResponsibilityNature.ISM_COMPANY.equals(shipDetails.getNatureOfReportingResponsibility()))
                .map(ShipDetails::getImoNumber)
                .collect(Collectors.toSet());
    }
}
