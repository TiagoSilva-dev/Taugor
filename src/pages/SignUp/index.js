import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../SignIn/style.css';
import { AuthContext } from '../../contexts/auth';


export default function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();


    if (nome !== '' && email !== '' && password !== '') {
      signUp(email, password, nome);
    }

  }



  return (
    <div className="container-center">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder="nome" value={nome} onChange={(e) => { setNome(e.target.value) }}></input>
          <input type="email" placeholder="teste@teste.com" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
          <input type="password" placeholder="********" value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
          <button type="submit">{loadingAuth ? 'Carregando ... ' : 'Cadastrar'}</button>
        </form>
        <Link to="/">já tem uma conta?</Link>
      </div>
    </div>
  );
}

