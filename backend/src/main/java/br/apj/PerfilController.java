package br.apj;

import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PerfilController {
    record ConexaoReq(String conta) {}

    private static final Set<String> PLATAFORMAS = Set.of("steam", "playstation", "xbox", "epic");
    private final AuthController auth;
    private final FavoritoRepository favoritos;
    private final ConexaoRepository conexoes;

    public PerfilController(AuthController auth, FavoritoRepository favoritos, ConexaoRepository conexoes) {
        this.auth = auth; this.favoritos = favoritos; this.conexoes = conexoes;
    }

    // Só executa a ação se o token enviado pertencer a um usuário logado.
    private ResponseEntity<?> comUsuario(String header, Function<Long, ResponseEntity<?>> acao) {
        Long uid = auth.usuarioDe(header);
        return uid == null ? AuthController.erro(401, "Sessão inválida.") : acao.apply(uid);
    }

    // ----- Favoritos -----
    @GetMapping("/favoritos")
    public ResponseEntity<?> listarFavoritos(@RequestHeader(value = "Authorization", required = false) String h) {
        return comUsuario(h, uid -> ResponseEntity.ok(
                favoritos.findByUsuarioId(uid).stream().map(Favorito::getJogoId).toList()));
    }

    @PostMapping("/favoritos/{jogoId}")
    public ResponseEntity<?> favoritar(@RequestHeader(value = "Authorization", required = false) String h,
                                       @PathVariable String jogoId) {
        return comUsuario(h, uid -> {
            if (jogoId.length() > 50) return AuthController.erro(400, "Jogo inválido.");
            if (!favoritos.existsByUsuarioIdAndJogoId(uid, jogoId)) favoritos.save(new Favorito(uid, jogoId));
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

    // ----- Plataformas conectadas -----
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
}
