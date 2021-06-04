import React, { useContext} from 'react';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import './profile.css';

export default function Profile() {
  const { signOut } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="content">
        <div className="container">
          <button className="logout-btn" onClick={() => signOut()}>Sair</button>
        </div>
      </div>
    </div>
  );
}