package br.apj;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jogos")
public class JogosController {
    interface Consulta { Object executar() throws Exception; }

    private final SteamService steam;
    public JogosController(SteamService steam) { this.steam = steam; }

    private ResponseEntity<?> consultar(Consulta c) {
        try {
            Object r = c.executar();
            return r == null ? AuthController.erro(404, "Jogo não encontrado.") : ResponseEntity.ok(r);
        } catch (Exception e) {
            return AuthController.erro(502, "Não foi possível consultar a Steam agora. Verifique a internet e tente de novo.");
        }
    }

    @GetMapping("/promocoes")
    public ResponseEntity<?> promocoes() { return consultar(steam::promocoes); }

    @GetMapping("/busca")
    public ResponseEntity<?> busca(@RequestParam String q) {
        return consultar(() -> q.trim().length() < 2 ? List.of() : steam.busca(q.trim()));
    }

    @GetMapping("/precos")
    public ResponseEntity<?> precos(@RequestParam String ids) {
        if (!ids.matches("[0-9,]{1,300}")) return AuthController.erro(400, "Ids inválidos.");
        return consultar(() -> steam.precos(ids));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalhe(@PathVariable String id) {
        if (!id.matches("\\d{1,10}")) return AuthController.erro(400, "Id inválido.");
        return consultar(() -> steam.detalhe(id));
    }
}
