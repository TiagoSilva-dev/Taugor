import React from 'react';
import './modal.css';
import { FiX } from 'react-icons/fi';
export default function Modal({ conteudo, close }) {



  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={23} color="#000" />
        </button>
        <div className="">
          <h2>Detalhes da atividade</h2>

          <div className="row">
            <span>
              Usuario: <i>{conteudo.Usuario}</i>
              {console.log(conteudo)}
            </span>
          </div>

          <div className="row">
            <span>
              Titulo: <i>{conteudo.Titulo}</i>
            </span>
            <span>
              Cadastrado em: <i>{conteudo.Cadastrado}</i>
            </span>
          </div>


          <div className="row">
            <span>
              Status: <i style={{ color: '#FFF', backgroundColor: conteudo.Status === 'Em Andamento' ? '#5cb85c' : '#999' }}>{conteudo.Status}</i>
            </span>
          </div>
          {conteudo.Descricao !== '' && (
            <>
              <h3>Descrição</h3>
              <p>{conteudo.Descricao}</p>
            </>
          )}
          <a href={conteudo.Arquivo} target="_blank">Visualizar Arquivo</a>

        </div>
      </div>
    </div>
  );
}