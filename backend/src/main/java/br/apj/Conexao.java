package br.apj;

import jakarta.persistence.*;

@Entity
@Table(name = "conexoes", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "plataforma"}))
public class Conexao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "plataforma", nullable = false, length = 30)
    private String plataforma;
    @Column(name = "conta", nullable = false, length = 100)
    private String conta;

    protected Conexao() {}
    public Conexao(Long usuarioId, String plataforma, String conta) {
        this.usuarioId = usuarioId; this.plataforma = plataforma; this.conta = conta;
    }
    public String getPlataforma() { return plataforma; }
    public String getConta() { return conta; }
    public void setConta(String conta) { this.conta = conta; }
}
