package br.apj;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/steam")
public class SteamLoginController {
    private static final String OPENID = "https://steamcommunity.com/openid/login";
    private final AuthController auth;
    private final ConexaoRepository conexoes;
    private final HttpClient http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
    private final Map<String, Long> pendentes = new ConcurrentHashMap<>(); // código -> usuário

    public SteamLoginController(AuthController auth, ConexaoRepository conexoes) {
        this.auth = auth; this.conexoes = conexoes;
    }

    private static String form(Map<String, String> campos) {
        StringJoiner sj = new StringJoiner("&");
        campos.forEach((k, v) -> sj.add(URLEncoder.encode(k, StandardCharsets.UTF_8) + "=" + URLEncoder.encode(v, StandardCharsets.UTF_8)));
        return sj.toString();
    }

    @PostMapping("/iniciar")
    public ResponseEntity<?> iniciar(@RequestHeader(value = "Authorization", required = false) String h,
                                     HttpServletRequest req) {
        Long uid = auth.usuarioDe(h);
        if (uid == null) return AuthController.erro(401, "Sessão inválida.");
        String codigo = UUID.randomUUID().toString();
        pendentes.put(codigo, uid);
        String base = req.getScheme() + "://" + req.getHeader("Host");
        Map<String, String> c = new LinkedHashMap<>();
        c.put("openid.ns", "http://specs.openid.net/auth/2.0");
        c.put("openid.mode", "checkid_setup");
        c.put("openid.return_to", base + "/api/steam/retorno?n=" + codigo);
        c.put("openid.realm", base);
        c.put("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
        c.put("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");
        return ResponseEntity.ok(Map.of("url", OPENID + "?" + form(c)));
    }

    @GetMapping("/retorno")
    public ResponseEntity<?> retorno(@RequestParam Map<String, String> p) {
        Long uid = pendentes.remove(p.getOrDefault("n", ""));
        String reivindicado = p.getOrDefault("openid.claimed_id", "");
        String steamId = reivindicado.substring(reivindicado.lastIndexOf('/') + 1);
        boolean ok = uid != null && steamId.matches("\\d{17}") && validar(p);
        if (ok) {
            String conta = nomePerfil(steamId);
            Conexao c = conexoes.findByUsuarioIdAndPlataforma(uid, "steam").orElse(new Conexao(uid, "steam", conta));
            c.setConta(conta);
            conexoes.save(c);
        }
        return ResponseEntity.status(302).header("Location", ok ? "/?steam=ok" : "/?steam=erro").build();
    }

    private boolean validar(Map<String, String> p) {
        try {
            Map<String, String> c = new LinkedHashMap<>();
            p.forEach((k, v) -> { if (k.startsWith("openid.")) c.put(k, v); });
            c.put("openid.mode", "check_authentication");
            HttpRequest r = HttpRequest.newBuilder(URI.create(OPENID))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form(c))).build();
            return http.send(r, HttpResponse.BodyHandlers.ofString()).body().contains("is_valid:true");
        } catch (Exception e) {
            return false;
        }
    }

    private String nomePerfil(String steamId) {
        try {
            HttpRequest r = HttpRequest.newBuilder(URI.create("https://steamcommunity.com/profiles/" + steamId + "?xml=1")).build();
            String xml = http.send(r, HttpResponse.BodyHandlers.ofString()).body();
            Matcher m = Pattern.compile("<steamID><!\\[CDATA\\[(.*?)\\]\\]></steamID>").matcher(xml);
            if (m.find() && !m.group(1).isBlank()) return m.group(1);
        } catch (Exception e) { /* usa o ID */ }
        return steamId;
    }
}
