package uk.gov.mrtm.test.emulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot application for testing OAuth 2.0 Private Key JWT Client Authentication with Keycloak.
 *
 * <p>This emulator is used for end-to-end testing of the Private Key JWT Client Authentication flow.
 * It provides HTTP endpoints that create and sign client assertion JWTs, exchange them for access tokens,
 * and expose public keys via a JWKS endpoint.
 *
 * <p><b>WARNING:</b> This is a testing and development tool only. Do not use in production.
 *
 */
@SpringBootApplication
public class DataProviderEmulatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(DataProviderEmulatorApplication.class, args);
	}

}
