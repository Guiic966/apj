package br.apj;

import jakarta.persistence.*;

@Entity
@Table(name = "favoritos", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "jogo_id"}))
public class Favorito {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "jogo_id", nullable = false, length = 50)
    private String jogoId;

    protected Favorito() {}
    public Favorito(Long usuarioId, String jogoId) { this.usuarioId = usuarioId; this.jogoId = jogoId; }
    public String getJogoId() { return jogoId; }
}
