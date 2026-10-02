package uk.gov.mrtm.api.integration.common;

import io.awspring.cloud.autoconfigure.core.AwsAutoConfiguration;
import io.awspring.cloud.autoconfigure.core.CredentialsProviderAutoConfiguration;
import io.awspring.cloud.autoconfigure.core.RegionProviderAutoConfiguration;
import io.awspring.cloud.autoconfigure.s3.S3AutoConfiguration;
import io.awspring.cloud.s3.S3Operations;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import uk.gov.netz.api.files.storage.FileStorageService;
import uk.gov.netz.autoconfigure.files.S3FileStorageAutoConfiguration;
import uk.gov.netz.autoconfigure.notification.EmailFileStorageAutoConfiguration;
import uk.gov.netz.api.notificationapi.mail.service.EmailLinkedFileStorageService;
import uk.gov.netz.docgenerator.client.aws.DocGenClientAwsAutoConfiguration;
import uk.gov.netz.docgenerator.client.storage.DocumentStorageClient;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class DocumentGenerationS3ConfigurationTest {

    @TempDir
    private Path configDirectory;

    @ParameterizedTest
    @CsvSource({"dev", "production"})
    void publicUrlDefaultIsConsistentAcrossProfiles(String profile) throws Exception {
        applicationConfig(profile).run(context -> assertThat(context.getEnvironment()
                .getProperty("notification.email-link.public-base-url")).isEqualTo("http://localhost:4566/uk-ets-files"));
    }

    @ParameterizedTest
    @CsvSource({"dev", "production"})
    void existingEnvironmentOverridesRemainSupported(String profile) throws Exception {
        applicationConfig(profile).withPropertyValues(
                "EMAIL_LINK_PUBLIC_BASE_URL=https://files.example.test/downloads",
                "EMAIL_LINK_BUCKET_NAME=custom-bucket", "EMAIL_LINK_OBJECT_KEY_PREFIX=custom-prefix")
                .run(context -> {
                    assertThat(context.getEnvironment().getProperty("notification.email-link.public-base-url"))
                            .isEqualTo("https://files.example.test/downloads");
                    assertThat(context.getEnvironment().getProperty("notification.email-link.container")).isEqualTo("custom-bucket");
                    assertThat(context.getEnvironment().getProperty("notification.email-link.prefix")).isEqualTo("custom-prefix");
                });
    }

    private ApplicationContextRunner applicationConfig(String profile) throws Exception {
        // Load only tracked configuration, independent of personal application-dev.properties settings.
        Path config = configDirectory.resolve("application.properties");
        Files.copy(Path.of("src/main/resources/application.properties"), config);
        return new ApplicationContextRunner()
                .withInitializer(new ConfigDataApplicationContextInitializer())
                .withPropertyValues("spring.config.location=" + config.toUri(), "spring.profiles.active=" + profile);
    }

    @Test
    void documentGenerationAndEmailLinksShareSpringCloudOperationsAndCredentials() {
        new ApplicationContextRunner()
                .withConfiguration(AutoConfigurations.of(AwsAutoConfiguration.class, CredentialsProviderAutoConfiguration.class,
                        RegionProviderAutoConfiguration.class, S3AutoConfiguration.class,
                        DocGenClientAwsAutoConfiguration.class, S3FileStorageAutoConfiguration.class,
                        EmailFileStorageAutoConfiguration.class))
                .withPropertyValues(
                        "spring.cloud.aws.endpoint=http://localhost:4566",
                        "spring.cloud.aws.credentials.access-key=spring-configured-access",
                        "spring.cloud.aws.credentials.secret-key=spring-configured-secret",
                        "spring.cloud.aws.region.static=eu-west-2",
                        "spring.cloud.aws.s3.path-style-access-enabled=true",
                        "docgen.client.storage-container=doc-gen",
                        "notification.email-link.enabled=true",
                        "notification.email-link.container=uk-ets-files",
                        "notification.email-link.prefix=mrtm",
                        "notification.email-link.public-base-url=http://localhost:4566/uk-ets-files")
                .run(context -> {
                    assertThat(context).hasNotFailed();
                    assertThat(context).hasSingleBean(S3Client.class).hasSingleBean(S3Operations.class);
                    assertThat(context).hasSingleBean(DocumentStorageClient.class);
                    assertThat(context).hasSingleBean(FileStorageService.class).hasSingleBean(EmailLinkedFileStorageService.class);
                    S3Operations operations = context.getBean(S3Operations.class);
                    assertThat(ReflectionTestUtils.getField(context.getBean(DocumentStorageClient.class), "s3Operations"))
                            .isSameAs(operations);
                    FileStorageService storage = context.getBean(FileStorageService.class);
                    assertThat(ReflectionTestUtils.getField(storage, "operations")).isSameAs(operations);
                    assertThat(ReflectionTestUtils.getField(context.getBean(EmailLinkedFileStorageService.class), "storage"))
                            .isSameAs(storage);
                    var clientConfiguration = context.getBean(S3Client.class).serviceClientConfiguration();
                    assertThat(clientConfiguration.endpointOverride()).contains(URI.create("http://localhost:4566"));
                    assertThat(clientConfiguration.region()).isEqualTo(Region.EU_WEST_2);
                    AwsCredentialsProvider credentials = context.getBean(AwsCredentialsProvider.class);
                    assertThat(clientConfiguration.credentialsProvider()).isSameAs(credentials);
                    assertThat(credentials.resolveCredentials().accessKeyId()).isEqualTo("spring-configured-access");
                    assertThat(credentials.resolveCredentials().secretAccessKey()).isEqualTo("spring-configured-secret");
                });
    }
}
