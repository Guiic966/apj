package br.apj;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenciaRepository extends JpaRepository<Preferencia, Long> {
    Optional<Preferencia> findByUsuarioId(Long usuarioId);
}
