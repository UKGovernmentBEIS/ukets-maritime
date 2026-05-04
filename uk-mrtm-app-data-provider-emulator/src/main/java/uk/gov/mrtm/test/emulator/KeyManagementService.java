package uk.gov.mrtm.test.emulator;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service for managing cryptographic keys used in OAuth 2.0 Private Key JWT Client Authentication.
 *
 * <p>Manages RSA key pairs for signing client assertions and provides public keys via JWKS
 * for the authorization server to verify JWT signatures.
 *
 */
@Service
public class KeyManagementService {

  private final Logger logger = LoggerFactory.getLogger(KeyManagementService.class);

  private RSAKey signingKey;
  private JWKSet jwkSet;
  private Map<Integer, JWKSet> jwkSetMap = new HashMap<>();

  @Value("${emulator.jwkSet.json}")
  private String jwkSetJon;

  @Value("${emulator.jwkSet.count}")
  private int jwkSetCount;

  @PostConstruct
  private void initialize() throws Exception {
    loadKeysFromApplicationProperties();
    initializeJwkSetMap();
    //createKeysFile(); uncomment if you want to create a key.json file
  }

  private void loadKeysFromApplicationProperties() throws ParseException {
    if (jwkSetJon != null && !jwkSetJon.isEmpty()) {
      this.jwkSet = JWKSet.parse(this.jwkSetJon);
      this.signingKey = (RSAKey) jwkSet.getKeys().get(0);
    }
  }

  private void initializeJwkSetMap() throws JOSEException {
    for (int i = 1; i <= jwkSetCount; i++) {
      RSAKey rsaKey = new RSAKeyGenerator(4096)
          .keyUse(KeyUse.SIGNATURE)
          .keyID(UUID.randomUUID().toString())
          .generate();
      this.jwkSetMap.put(i, new JWKSet(rsaKey));
      logger.info("Generated JWK Set number {}", i);
    }
    logger.info("Initialized JWK Set Map with {} entries", this.jwkSetMap.size());
  }

  private void generateAndSaveKeys(File keysFile) throws Exception {
    this.signingKey = new RSAKeyGenerator(4096)
        .keyUse(KeyUse.SIGNATURE)
        .keyID(UUID.randomUUID().toString())
        .generate();
    this.jwkSet = new JWKSet(this.signingKey);
    Files.write(keysFile.toPath(), this.jwkSet.toString(false).getBytes());
  }

  private void createKeysFile() throws Exception {
    File keysFile = new File("keys.json");
    generateAndSaveKeys(keysFile);
  }

  public RSAKey getSigningKey() {
    return signingKey;
  }

  /**
   * Returns the public JWK Set to be exposed at the JWKS endpoint.
   *
   * <p>The authorization server fetches public keys from this set to verify the signature
   * of client assertion JWTs. Only public key material is returned; private keys are never exposed.
   *
   * @return the public JWK Set (without private key material)
   */
  public JWKSet getPublicJwkSet() {
    return jwkSet.toPublicJWKSet();
  }

  public Map<Integer, JWKSet> getJwkSetMap() {
    return jwkSetMap;
  }
}