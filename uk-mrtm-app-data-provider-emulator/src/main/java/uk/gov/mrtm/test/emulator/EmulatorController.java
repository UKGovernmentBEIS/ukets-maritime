package uk.gov.mrtm.test.emulator;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
public class EmulatorController {

  private final KeyManagementService keyManagementService;
  private final JwtService jwtService;
  private final RestTemplate restTemplate;
  private final String keycloakTokenUrl;
  private final Logger logger = LoggerFactory.getLogger(EmulatorController.class);

  public EmulatorController(KeyManagementService keyManagementService, JwtService jwtService,
      @Value("${keycloak.token-url}") String keycloakTokenUrl) {
    this.keyManagementService = keyManagementService;
    this.jwtService = jwtService;
    this.restTemplate = new RestTemplate();
    this.keycloakTokenUrl = keycloakTokenUrl;
  }

  @PostConstruct
  public void init() {
    logger.info("Initializing EmulatorController");
  }

  /**
   * JWKS (JSON Web Key Set) endpoint - exposes public keys for JWT signature verification.
   *
   * <p><b>Purpose:</b><br>
   * This endpoint is called by the authorization server (Keycloak) to retrieve the client's
   * public keys. The authorization server uses these keys to verify the signature of client assertion
   * JWTs during the authentication process.
   *
   * <p><b>Access:</b>
   * <ul>
   *   <li>This endpoint is publicly accessible (no authentication required)</li>
   *   <li>Returns only public key material - private keys are never exposed</li>
   * </ul>
   *
   * @return JSON object containing the public JWK Set
   */
  @GetMapping("/jwks")
  public Map<String, Object> getJwks() {
    logger.info("Serving jwk public key");
    return keyManagementService.getPublicJwkSet().toJSONObject();
  }

  @GetMapping(path ="/retrieve-access-token/{client-id}")
  public ResponseEntity<String> getAccessToken(@PathVariable("client-id") String clientId) throws Exception {
    logger.info("Retrieving access token for client ID {}", clientId);
    String clientAssertion = jwtService.generateAndSignJwt(clientId, keyManagementService.getSigningKey());
    return retrieveAccessToken(clientId, clientAssertion);
  }

  @GetMapping("/jwks/{key-pair-no}")
  public Map<String, Object> getJwksForKeyPair(@PathVariable("key-pair-no") Integer keyPairNo) {
    logger.info("Serving jwk public key {}", keyPairNo);
    return keyManagementService.getJwkSetMap().get(keyPairNo).toJSONObject();
  }

  @GetMapping(path ="/retrieve-access-token/{key-pair-no}/{client-id}")
  public ResponseEntity<String> getAccessTokenForKeyPair(@PathVariable("client-id") String clientId, @PathVariable("key-pair-no") Integer keyPairNo) throws Exception {
    logger.info("Retrieving access token for client ID {}", clientId);
    String clientAssertion = jwtService.generateAndSignJwt(clientId, keyManagementService.getJwkSetMap().get(keyPairNo).getKeys().get(0).toRSAKey());
    return retrieveAccessToken(clientId, clientAssertion);
  }

  /**
   *
   * <p>This method performs the token request for OAuth 2.0 Private Key JWT Client Authentication.
   *
   * <p><b>Token Request Parameters (RFC 7523):</b>
   * <ul>
   *   <li><b>grant_type:</b> "client_credentials" - indicates this is a client credentials flow</li>
   *   <li><b>client_id:</b> The OAuth client identifier</li>
   *   <li><b>client_assertion_type:</b> "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
   *       - specifies that authentication uses a JWT</li>
   *   <li><b>client_assertion:</b> The signed JWT token that proves the client's identity</li>
   * </ul>
   *
   * <p><b>Response:</b><br>
   * On success, returns a JSON response containing the access token, token type, and expiration time.
   *
   * @param clientId the OAuth client ID
   * @param clientAssertion the signed JWT client assertion
   * @return ResponseEntity containing the token response or error details
   *
   *
   */
  private ResponseEntity<String> retrieveAccessToken(String clientId, String clientAssertion) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
    map.add("grant_type", "client_credentials");
    map.add("client_id", clientId);
    map.add("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
    map.add("client_assertion", clientAssertion);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

    try {
      return restTemplate.postForEntity(keycloakTokenUrl, request, String.class);
    } catch (HttpClientErrorException e) {
      logger.error("Failed to retrieve access token for client ID {}: {} - {}", clientId, e.getStatusCode(), e.getResponseBodyAsString());
      return new ResponseEntity<>(e.getResponseBodyAsString(), e.getStatusCode());
    } catch (Exception e) {
      logger.error("Unexpected error retrieving access token for client ID {}", clientId, e);
      return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}