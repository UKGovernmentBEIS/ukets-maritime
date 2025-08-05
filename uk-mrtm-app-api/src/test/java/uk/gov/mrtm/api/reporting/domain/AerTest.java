package uk.gov.mrtm.api.reporting.domain;

import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AerTest {

    @Test
    void getAerSectionAttachmentIds() {
        final UUID documentUUID = UUID.randomUUID();
        Set<UUID> documents = Set.of(documentUUID);
        final UUID evidenceFile1UUID = UUID.randomUUID();
        final UUID evidenceFile2UUID = UUID.randomUUID();
        final UUID evidenceFile3UUID = UUID.randomUUID();
        final UUID evidenceFile4UUID = UUID.randomUUID();

        Aer aer = Aer.builder()
                .additionalDocuments(AdditionalDocuments.builder()
                        .documents(documents)
                        .build())
                .smf(AerSmf.builder()
                        .smfDetails(AerSmfDetails.builder()
                                .purchases(List.of(AerSmfPurchase.builder()
                                                .evidenceFiles(Set.of(evidenceFile1UUID, evidenceFile2UUID))
                                                .build(),
                                        AerSmfPurchase.builder()
                                                .evidenceFiles(Set.of(evidenceFile3UUID, evidenceFile4UUID))
                                                .build()))
                                .build())
                        .build())
                .build();

        assertThat(aer.getAerSectionAttachmentIds()).containsExactlyInAnyOrder(
                documentUUID,evidenceFile1UUID, evidenceFile2UUID, evidenceFile3UUID, evidenceFile4UUID);
    }
}
