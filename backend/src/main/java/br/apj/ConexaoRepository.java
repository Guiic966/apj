package br.apj;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ConexaoRepository extends JpaRepository<Conexao, Long> {
    List<Conexao> findByUsuarioId(Long usuarioId);
    Optional<Conexao> findByUsuarioIdAndPlataforma(Long usuarioId, String plataforma);
    @Transactional
    void deleteByUsuarioIdAndPlataforma(Long usuarioId, String plataforma);
}
