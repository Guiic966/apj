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
    @Column(name = "nome", length = 150)
    private String nome;
    @Column(name = "preco_base") // preço em centavos quando o jogo foi favoritado
    private Integer precoBase;

    protected Favorito() {}
    public Favorito(Long usuarioId, String jogoId, String nome, Integer precoBase) {
        this.usuarioId = usuarioId; this.jogoId = jogoId; this.nome = nome; this.precoBase = precoBase;
    }
    public String getJogoId() { return jogoId; }
    public String getNome() { return nome; }
    public Integer getPrecoBase() { return precoBase; }
}
