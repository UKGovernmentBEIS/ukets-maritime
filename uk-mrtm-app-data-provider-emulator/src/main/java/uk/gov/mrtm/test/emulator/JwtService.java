package uk.gov.mrtm.test.emulator;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

  private final KeyManagementService keyManagementService;
  private final String keycloakAudience;


  public JwtService(KeyManagementService keyManagementService, @Value("${keycloak.audience}") String keycloakAudience) {
    this.keyManagementService = keyManagementService;
    this.keycloakAudience = keycloakAudience;
  }

  public String generateAndSignJwt(String clientId, RSAKey rsaKey) throws Exception {
    Instant now = Instant.now();

    // 1. Create the JWT claims
    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
        .issuer(clientId)
        .subject(clientId)
        .audience(keycloakAudience)
        .jwtID(UUID.randomUUID().toString())
        .issueTime(Date.from(now))
        .expirationTime(Date.from(now.plus(1, ChronoUnit.DAYS)))
        .build();

    // 2. Create the JWS header
    JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
        .keyID(rsaKey.getKeyID())
        .type(com.nimbusds.jose.JOSEObjectType.JWT)
        .build();

    // 3. Create the signer using the private key
    JWSSigner signer = new RSASSASigner(rsaKey);

    // 4. Sign the JWT
    SignedJWT signedJWT = new SignedJWT(header, claimsSet);
    signedJWT.sign(signer);

    // 5. Serialize to compact form
    return signedJWT.serialize();
  }
}