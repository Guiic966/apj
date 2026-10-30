package br.apj;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndJogoId(Long usuarioId, String jogoId);
    @Transactional
    void deleteByUsuarioIdAndJogoId(Long usuarioId, String jogoId);
}
