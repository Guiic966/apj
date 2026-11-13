package br.apj;

import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PerfilController {
    record ConexaoReq(String conta) {}
    record FavReq(String nome, Integer base) {}

    private static final Set<String> PLATAFORMAS = Set.of("steam", "playstation", "xbox", "epic");
    private final AuthController auth;
    private final FavoritoRepository favoritos;
    private final ConexaoRepository conexoes;
    private final PreferenciaRepository prefs;

    public PerfilController(AuthController auth, FavoritoRepository favoritos, ConexaoRepository conexoes,
                            PreferenciaRepository prefs) {
        this.auth = auth; this.favoritos = favoritos; this.conexoes = conexoes; this.prefs = prefs;
    }

    private ResponseEntity<?> comUsuario(String header, Function<Long, ResponseEntity<?>> acao) {
        Long uid = auth.usuarioDe(header);
        return uid == null ? AuthController.erro(401, "Sessão inválida.") : acao.apply(uid);
    }

    @GetMapping("/favoritos")
    public ResponseEntity<?> listarFavoritos(@RequestHeader(value = "Authorization", required = false) String h) {
        return comUsuario(h, uid -> ResponseEntity.ok(favoritos.findByUsuarioId(uid).stream()
                .map(f -> Map.<String, Object>of("id", f.getJogoId(),
                        "nome", f.getNome() == null ? "" : f.getNome(),
                        "base", f.getPrecoBase() == null ? 0 : f.getPrecoBase())).toList()));
    }

    @PostMapping("/favoritos/{jogoId}")
    public ResponseEntity<?> favoritar(@RequestHeader(value = "Authorization", required = false) String h,
                                       @PathVariable String jogoId,
                                       @RequestBody(required = false) FavReq req) {
        return comUsuario(h, uid -> {
            if (jogoId.length() > 50) return AuthController.erro(400, "Jogo inválido.");
            if (!favoritos.existsByUsuarioIdAndJogoId(uid, jogoId)) {
                String nome = req == null || req.nome() == null ? "" : req.nome();
                favoritos.save(new Favorito(uid, jogoId, nome.length() > 150 ? nome.substring(0, 150) : nome,
                        req == null ? null : req.base()));
            }
            return ResponseEntity.ok(Map.of("ok", true));
        });
    }

    @DeleteMapping("/favoritos/{jogoId}")
    public ResponseEntity<?> desfavoritar(@RequestHeader(value = "Authorization", required = false) String h,
                                          @PathVariable String jogoId) {
        return comUsuario(h, uid -> {
            favoritos.deleteByUsuarioIdAndJogoId(uid, jogoId);
            return ResponseEntity.ok(Map.of("ok", true));
        });
    }

    @GetMapping("/conexoes")
    public ResponseEntity<?> listarConexoes(@RequestHeader(value = "Authorization", required = false) String h) {
        return comUsuario(h, uid -> ResponseEntity.ok(conexoes.findByUsuarioId(uid).stream()
                .map(c -> Map.of("plataforma", c.getPlataforma(), "conta", c.getConta())).toList()));
    }

    @PutMapping("/conexoes/{plataforma}")
    public ResponseEntity<?> conectar(@RequestHeader(value = "Authorization", required = false) String h,
                                      @PathVariable String plataforma, @RequestBody ConexaoReq req) {
        return comUsuario(h, uid -> {
            String conta = req.conta() == null ? "" : req.conta().trim();
            if (!PLATAFORMAS.contains(plataforma)) return AuthController.erro(400, "Plataforma desconhecida.");
            if (conta.length() < 2 || conta.length() > 60)
                return AuthController.erro(400, "Informe o usuário da conta (de 2 a 60 caracteres).");
            Conexao c = conexoes.findByUsuarioIdAndPlataforma(uid, plataforma)
                    .orElse(new Conexao(uid, plataforma, conta));
            c.setConta(conta);
            conexoes.save(c);
            return ResponseEntity.ok(Map.of("plataforma", plataforma, "conta", conta));
        });
    }

    @DeleteMapping("/conexoes/{plataforma}")
    public ResponseEntity<?> desconectar(@RequestHeader(value = "Authorization", required = false) String h,
                                         @PathVariable String plataforma) {
        return comUsuario(h, uid -> {
            conexoes.deleteByUsuarioIdAndPlataforma(uid, plataforma);
            return ResponseEntity.ok(Map.of("ok", true));
        });
    }

    @GetMapping("/preferencias")
    public ResponseEntity<?> lerPreferencias(@RequestHeader(value = "Authorization", required = false) String h) {
        return comUsuario(h, uid -> ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(prefs.findByUsuarioId(uid).map(Preferencia::getDados).orElse("{}")));
    }

    @PutMapping("/preferencias")
    public ResponseEntity<?> salvarPreferencias(@RequestHeader(value = "Authorization", required = false) String h,
                                                @RequestBody String dados) {
        return comUsuario(h, uid -> {
            if (dados.length() > 4000) return AuthController.erro(400, "Dados grandes demais.");
            Preferencia p = prefs.findByUsuarioId(uid).orElse(new Preferencia(uid));
            p.setDados(dados);
            prefs.save(p);
            return ResponseEntity.ok(Map.of("ok", true));
        });
    }
}
