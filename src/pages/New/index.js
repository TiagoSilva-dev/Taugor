import React, { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import Header from '../../components/Header';
import { FiUpload } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './new.css';

export default function New() {
  var data = new Date(); var dia = data.getDate(); var mes = data.getMonth(); var ano = data.getFullYear();
  const diaAtual = `${dia}/${mes}/${ano}`;

  const [status, setStatus] = useState('Em Andamento');
  const [customerSelected, setCustomerSelected] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [pdfurl, setPdfUrl] = useState('');
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(true);
  const [idcustomer, setIdCustomer] = useState(false);
  const [upload, setUpload] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // lista de usuarios cadastrados
    async function loadCustomers() {
      await firebase.firestore().collection('users').get().then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            usuario: doc.data().nome
          });
        })
        setCustomers(lista);
        setLoading(false);
        // se tiver algo no id quer dizer que o usuario quer alterar alguma informaçao
        if (id) {
          loadId(lista);
        }
      })
    }
    loadCustomers();

  }, [id])

  async function loadId(lista) {
    // buscando no banco as informaçoes que esse id cadastrou
    await firebase.firestore().collection('Registers').doc(id).get()
      .then((snapshot) => {
        setStatus(snapshot.data().Status);
        setTitulo(snapshot.data().Titulo);
        setDescricao(snapshot.data().Descricao);

        let index = lista.findIndex(item => item.id === snapshot.data().UsuarioId)
        setCustomerSelected(index);
        setIdCustomer(true);
      }).catch((error) => {
        alert('Usuario nao encontrado')
        console.log(error);
      })
  }

  function handleRegister(e) {
    e.preventDefault();
    // adicionando as informaçoes do formulario no firebase
    firebase.firestore().collection('Registers').add({
      UsuarioId: customers[customerSelected].id,
      Status: status,
      Titulo: titulo,
      Descricao: descricao,
      Usuario: customers[customerSelected].usuario,
      Arquivo: pdfurl,
      Cadastrado: diaAtual
    }).then(() => {
      toast.success('Atividade Cadastrada com sucesso');
    }).catch((error) => {
      toast.error(error);
    })
  }


  function handleStatus(e) {
    setStatus(e.target.value)
  }

  function handleClientes(e) {
    setCustomerSelected(e.target.value);
  }

  async function handleFile(e) {
    if (e.target.files[0]) {
      const arquivo = e.target.files[0];
      
      if (arquivo.type === 'application/pdf' || arquivo.type === 'text/plain') {
        await firebase.storage().ref(`arquivos/${customers[customerSelected].id}/${arquivo.name}`).put(arquivo)
          .then(async () => {
            // pegando o link de donwload do arquivo 
            await firebase.storage().ref(`arquivos/${customers[customerSelected].id}/${arquivo.name}`).getDownloadURL().then((response) => {
              toast.success('Fazendo upload do arquivo');
              setPdfUrl(response);
              setUpload(true);
            })

          }).catch((error) => {
            toast.error(error);
          })
      }
    }
  }


  return (
    <div>
      <Header />
      <div className="content">
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Pendente"
                onChange={handleStatus}
                checked={status === 'Pendente'} />
              <span>Pendente</span>

              <input
                type="radio"
                name="radio"
                value="Em Andamento"
                onChange={handleStatus}
                checked={status === 'Em Andamento'} />
              <span>Em Andamento</span>

              <input
                type="radio"
                name="radio"
                value="Finalizada"
                onChange={handleStatus}
                checked={status === 'Finalizada'} />
              <span>Finalizada</span>

              <input
                type="radio"
                name="radio"
                value="Cancelada"
                onChange={handleStatus}
                checked={status === 'Cancelada'} />
              <span>Cancelada</span>

            </div>
            <label>Titulo</label>
            <input
              type="text"
              placeholder="Insira o titulo."
              onChange={(e) => { setTitulo(e.target.value) }}
              value={titulo}
            />
            <label>Descricao</label>
            <textarea
              type="text"
              placeholder="Descrição."
              value={descricao}
              onChange={(e) => { setDescricao(e.target.value) }}

            />

            <label>Usuario Responsavel</label>
            {loading ? (
              <input type="text" disabled={true} value="Carregando Usuarios ..." />) : (
              <select value={customerSelected} onChange={handleClientes}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.usuario}
                    </option>)
                })}
              </select>
            )}
            <label>
              <span>
                <FiUpload color="#000" size={25} />
              </span>
              <input type="file" accept="pdf/txt" onChange={handleFile} required /><br />
            </label>

            {upload ? (
              <button type="submit" >Registrar</button>) : ''}
          </form>

        </div>
      </div>
    </div>
  );
}