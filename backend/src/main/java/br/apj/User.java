package br.apj;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(unique = true)
    private String email;
    private String senhaHash;

    protected User() {}
    public User(String nome, String email, String senhaHash) {
        this.nome = nome; this.email = email; this.senhaHash = senhaHash;
    }
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getSenhaHash() { return senhaHash; }
}
