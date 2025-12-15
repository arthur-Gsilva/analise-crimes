import { createUser, logUser, getUserIdByToken } from '../services/userServices';
import pool from '../services/db';

describe("Testando funções de usuário no BANCO REAL", () => {

  beforeAll(async () => {
    const client = await pool.connect();
    await client.query(`DELETE FROM "User";`);
    client.release();
  });

  afterAll(async () => {
    await pool.end();
  });

 
  it("createUser deve criar um usuário no banco real", async () => {
    const result = await createUser(
      "Maria",
      "maria@test.com",
      "senha123"
    );

    expect(result).not.toBeNull();
    expect(result?.email).toBe("maria@test.com");
  });

  it("createUser deve retornar null se email já existir", async () => {
    const result = await createUser(
      "Maria",
      "maria@test.com",
      "senha123"
    );

    expect(result).toBeNull();
  });

  

  it("logUser deve retornar null com senha incorreta", async () => {
    const token = await logUser("maria@test.com", "senhaErradaaa");

    expect(token).toBeNull();
  });

  it("logUser deve retornar null se email não existir", async () => {
    const token = await logUser("naoexiste@teste.com", "123");
    expect(token).toBeNull();
  });

 

  it("getUserIdByToken deve retornar null para token inválido", async () => {
    const id = await getUserIdByToken("TOKEN_INVALIDO");
    expect(id).toBeNull();
  });

});
