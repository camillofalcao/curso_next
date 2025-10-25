'use server'

import { User } from "next-auth";

export async function userLogin(email: string, senha: string): Promise<User | null> {
  if (!email || !senha) {
    return Promise.resolve(null);
  }

  let usuario = usuarios.find(x => email === x.email && senha === x?.password);

  if (usuario) {
    return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
  }
  
  return Promise.resolve(null);
}

export async function getUser(email: string): Promise<User | null> {
  if (!email) {
    return Promise.resolve(null);
  }

  let usuario = usuarios.find(x => email === x.email);

  if (usuario) {
    return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
  }
  
  return Promise.resolve(null);
}

export async function userAdd(name: string, email: string, role: string) : Promise<User> {
  const usuario = { id: new Date().getTime().toString(), name, email, role, password: '' };

  usuarios.push(usuario);

  return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
}

let usuarios = [
  { id: "1", name: "Usuário Admin", password: '123456', email: "admin@email.com", role: "admin" },
  { id: "2", name: "Usuário Teste", password: '123456', email: "teste@email.com", role: "user" },
]
