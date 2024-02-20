import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials);
      
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group controlId='username'>
          <Form.Label className='form-title'>email</Form.Label>
          <Form.Control type='email' className='form-input' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
      </Form.Group>
      &nbsp;
      <Form.Group controlId='password'>
          <Form.Label className='form-title'>Password</Form.Label>
          <Form.Control type='password' className='form-input' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
      </Form.Group>
      <div style={{ marginTop: '10px' }}>
      <Button type="submit" variant='success' className='add-content-button'>Login</Button>
      </div>
      
  </Form>
  )
};

function LogoutButton(props) {
  return(
    <Button variant='dark'className='logout-button' onClick={props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };