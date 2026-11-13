package br.apj;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class SteamService {
    private static final String LOJA = "https://store.steampowered.com/api/";
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
    private final ObjectMapper json = new ObjectMapper();
    private final Map<String, Object[]> cache = new ConcurrentHashMap<>(); // url -> {expira, resposta}

    private JsonNode get(String url, long ttlSegundos) throws Exception {
        Object[] c = cache.get(url);
        if (c != null && (long) c[0] > System.currentTimeMillis()) return (JsonNode) c[1];
        HttpRequest req = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(12))
                .header("User-Agent", "APJ/1.0").header("Accept-Language", "pt-BR").build();
        HttpResponse<String> r = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (r.statusCode() != 200) throw new IllegalStateException("Steam respondeu " + r.statusCode());
        JsonNode n = json.readTree(r.body());
        cache.put(url, new Object[]{System.currentTimeMillis() + ttlSegundos * 1000, n});
        return n;
    }

    private Map<String, Object> jogo(String id, String nome, int atual, int inicial) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("nome", nome);
        m.put("imagem", "https://cdn.cloudflare.steamstatic.com/steam/apps/" + id + "/header.jpg");
        m.put("preco", atual / 100.0);
        m.put("original", Math.max(inicial, atual) / 100.0);
        m.put("desconto", inicial > atual ? (int) Math.round((1 - (double) atual / inicial) * 100) : 0);
        return m;
    }

    public List<Map<String, Object>> promocoes() throws Exception {
        JsonNode raiz = get(LOJA + "featuredcategories?cc=br&l=portuguese", 600);
        Map<String, Map<String, Object>> lista = new LinkedHashMap<>();
        for (String chave : List.of("specials", "top_sellers", "new_releases")) {
            for (JsonNode i : raiz.path(chave).path("items")) {
                int atual = i.path("final_price").asInt(0);
                if (atual <= 0) continue;
                String id = i.path("id").asText();
                lista.putIfAbsent(id, jogo(id, i.path("name").asText(), atual, i.path("original_price").asInt(atual)));
            }
        }
        return new ArrayList<>(lista.values());
    }

    public List<Map<String, Object>> busca(String q) throws Exception {
        JsonNode raiz = get(LOJA + "storesearch/?term=" + URLEncoder.encode(q, StandardCharsets.UTF_8)
                + "&cc=br&l=portuguese", 600);
        List<Map<String, Object>> r = new ArrayList<>();
        for (JsonNode i : raiz.path("items")) {
            JsonNode p = i.path("price");
            int atual = p.path("final").asInt(0);
            r.add(jogo(i.path("id").asText(), i.path("name").asText(), atual, p.path("initial").asInt(atual)));
        }
        return r;
    }

    public Map<String, Object> precos(String ids) throws Exception {
        JsonNode raiz = get(LOJA + "appdetails?appids=" + ids + "&filters=price_overview&cc=br", 300);
        Map<String, Object> r = new LinkedHashMap<>();
        raiz.fields().forEachRemaining(e -> {
            JsonNode p = e.getValue().path("data").path("price_overview");
            if (p.isMissingNode()) return;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("preco", p.path("final").asInt() / 100.0);
            m.put("original", p.path("initial").asInt() / 100.0);
            m.put("desconto", p.path("discount_percent").asInt());
            r.put(e.getKey(), m);
        });
        return r;
    }

    public Map<String, Object> detalhe(String id) throws Exception {
        JsonNode raiz = get(LOJA + "appdetails?appids=" + id + "&cc=br&l=portuguese", 3600);
        JsonNode d = raiz.path(id).path("data");
        if (!raiz.path(id).path("success").asBoolean(false) || !d.isObject()) return null;
        JsonNode p = d.path("price_overview");
        int atual = p.path("final").asInt(0);
        Map<String, Object> m = new LinkedHashMap<>(jogo(id, d.path("name").asText(), atual, p.path("initial").asInt(atual)));
        m.put("imagem", d.path("header_image").asText((String) m.get("imagem")));
        m.put("descricao", d.path("short_description").asText(""));
        List<String> generos = new ArrayList<>();
        for (JsonNode g : d.path("genres")) generos.add(g.path("description").asText());
        m.put("generos", generos);
        m.put("desenvolvedora", d.path("developers").path(0).asText(""));
        m.put("lancamento", d.path("release_date").path("date").asText(""));
        m.put("nota", d.path("metacritic").path("score").asInt(0));
        return m;
    }
}
