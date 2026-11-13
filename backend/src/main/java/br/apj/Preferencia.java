package br.apj;

import jakarta.persistence.*;

@Entity
@Table(name = "preferencias")
public class Preferencia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false, unique = true)
    private Long usuarioId;
    @Column(name = "dados", columnDefinition = "TEXT")
    private String dados;

    protected Preferencia() {}
    public Preferencia(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getDados() { return dados; }
    public void setDados(String dados) { this.dados = dados; }
}
