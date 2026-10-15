package br.apj;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    record LoginReq(String email, String senha) {}
    record CadastroReq(String nome, String email, String senha) {}

    private final UserRepository repo;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
    private final Map<String, Long> sessoes = new ConcurrentHashMap<>();

    public AuthController(UserRepository repo) { this.repo = repo; }

    private static ResponseEntity<?> erro(int status, String msg) {
        return ResponseEntity.status(status).body(Map.of("erro", msg));
    }

    private ResponseEntity<?> sessao(int status, User u) {
        String token = UUID.randomUUID().toString();
        sessoes.put(token, u.getId());
        return ResponseEntity.status(status).body(Map.of("token", token, "nome", u.getNome()));
    }

    @PostMapping("/auth/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody CadastroReq req) {
        String nome = req.nome() == null ? "" : req.nome().trim();
        String email = req.email() == null ? "" : req.email().trim().toLowerCase();
        String senha = req.senha() == null ? "" : req.senha();

        if (nome.length() < 2) return erro(400, "Informe seu nome.");
        if (!email.matches("^\\S+@\\S+\\.\\S+$")) return erro(400, "Digite um e-mail válido.");
        if (senha.length() < 6) return erro(400, "A senha deve ter pelo menos 6 caracteres.");
        if (repo.findByEmail(email).isPresent()) return erro(409, "Este e-mail já está cadastrado.");

        try {
            User novo = repo.save(new User(nome, email, enc.encode(senha)));
            return sessao(201, novo); // já entra logado após criar a conta
        } catch (DataIntegrityViolationException e) {
            return erro(409, "Este e-mail já está cadastrado.");
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginReq req) {
        if (req.email() == null || req.senha() == null)
            return erro(400, "Informe e-mail e senha.");

        var user = repo.findByEmail(req.email().trim().toLowerCase());
        if (user.isEmpty() || !enc.matches(req.senha(), user.get().getSenhaHash()))
            return erro(401, "E-mail ou senha inválidos.");

        return sessao(200, user.get());
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        Long id = auth == null ? null : sessoes.get(auth.replace("Bearer ", ""));
        if (id == null) return erro(401, "Sessão inválida.");
        return repo.findById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of("nome", u.getNome(), "email", u.getEmail())))
                .orElse(erro(401, "Sessão inválida."));
    }
}
