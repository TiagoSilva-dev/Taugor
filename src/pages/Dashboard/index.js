import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';

import './dashboard.css';


export default function Dashboard() {

  const [chamados, setChamados] = useState([1]);
  const [Registro, setRegistro] = useState([]);
  const [searchTerm, setsearchTerm] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();



  useEffect(() => {
    async function loadAtividade() {
      // buscando as atividades cadastradas no banco 
      await firebase.firestore().collection('Registers').orderBy('Cadastrado', 'desc').get().then((snapshot) => {

        let registro = [];
        snapshot.forEach((item) => {
          registro.push({
            id: item.id,
            Usuario: item.data().Usuario,
            Status: item.data().Status,
            Titulo: item.data().Titulo,
            Cadastrado: item.data().Cadastrado,
            Descricao: item.data().Descricao,
            Arquivo: item.data().Arquivo
          })
        })
        setRegistro(registro);
      })
    }
    loadAtividade();
    return () => { }
  }, [])



  function togglePostModal(item) {
    // passando para o modal as informaçoes do registro selecionado
    setShowPostModal(!showPostModal);
    setDetail(item);
  }


  return (
    <div>
      <Header />
      <div className="content">
        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhuma atividade registrado ...</span>
            <Link to="/new" className="new"><FiPlus size={25} />Nova Atividade</Link>
          </div>
        ) : (
          <div>
            <Link to="/new" className="new"><FiPlus size={25} />Nova Atividade</Link>
            <input className="busca" type="text" value={searchTerm} placeholder="Realizar Busca" onChange={(e) => setsearchTerm(e.target.value)} />
            <table>
              <thead>
                <tr>
                  <th scope="col">Usuario</th>
                  <th scope="col">Titulo</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {Registro.filter((item) => {
                  // filtrando os registros pelo status e pela descricao
                  if (searchTerm === '') {
                    return item
                  } else if (item.Status.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return item
                  } else if (item.Descricao.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return item
                  }
                }).map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Cliente">{item.Usuario}</td>
                      <td data-label="Assunto">{item.Titulo}</td>
                      <td data-label="Assunto">{item.Descricao}</td>
                      <td data-label="Status">
                        {
                          <span className="badge" style={{ backgroundColor: item.Status === 'Em Andamento' ? '#5cb85c' : 'silver' }}>{item.Status}</span>
                        }

                      </td>
                      <td data-label="Cadastrado">{item.Cadastrado}</td>
                      <td data-label="#">
                        <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => togglePostModal(item)} >
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      </td>

                    </tr>
                  )
                })}


              </tbody>
            </table>
          </div>
        )}

      </div>
      {showPostModal && (

        <Modal
          conteudo={detail}
          close={togglePostModal}
        />

      )}
    </div>
  )
}