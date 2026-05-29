package com.damy.tareareact.service;

import com.damy.tareareact.model.User;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final String secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    public String createToken(User user) {
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long expiration = Instant.now().getEpochSecond() + expirationSeconds;
        String payload = base64Url("{\"sub\":" + user.getId()
                + ",\"username\":\"" + user.getUsername()
                + "\",\"exp\":" + expiration + "}");
        String unsignedToken = header + "." + payload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public boolean isValid(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        String[] parts = token.split("\\.");

        if (parts.length != 3) {
            return false;
        }

        String unsignedToken = parts[0] + "." + parts[1];

        if (!sign(unsignedToken).equals(parts[2])) {
            return false;
        }

        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        MatcherResult expiration = findExpiration(payload);

        return expiration.exists() && expiration.value() >= Instant.now().getEpochSecond();
    }

    private String base64Url(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) {
            throw new IllegalStateException("No fue posible firmar el token", error);
        }
    }

    private MatcherResult findExpiration(String payload) {
        String marker = "\"exp\":";
        int start = payload.indexOf(marker);

        if (start < 0) {
            return new MatcherResult(false, 0);
        }

        int numberStart = start + marker.length();
        int numberEnd = numberStart;

        while (numberEnd < payload.length() && Character.isDigit(payload.charAt(numberEnd))) {
            numberEnd++;
        }

        return new MatcherResult(true, Long.parseLong(payload.substring(numberStart, numberEnd)));
    }

    private record MatcherResult(boolean exists, long value) {
    }
}
