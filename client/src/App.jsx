import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import NavHeader from './components/NavbarComponents';
import NotFound from './components/NotFoundComponent';
import SinglePage from './components/SinglePageComponent';
import ViewPage from './components/ViewPageLayout';
import CreatedPageForm from './components/CreatedPageForm';
import PageList from './components/PagesListComponent';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import API from './API';
import { LoginForm } from './components/AuthComponents';

function App() {
  const [pages, setPages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [admin, setAdmin] = useState(false);

  useEffect(()=> {
    // get all the published pages from API
    const getPublishedPages = async () => {
      const pages = await API.getPublishedPages();
      setPages(pages);
    }
    getPublishedPages();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      if(user.admin == 1){setAdmin(true);}
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      if(user.admin == 1){setAdmin(true);}
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setAdmin(false);
    // clean up everything
    setMessage('');
  };

  return (
    <BrowserRouter>
        <Routes>
          {/* 
          - / (index) -> all the published pages
          - /pages/viewPage/:id -> view the page with the :id 
          - /pages/:userId/addCreatedPage -> the form to add a new page
          - /pages/:userId/editCreatedPage/:pageId -> the form to update the :pageId page
          - * -> not found
          */}
          <Route element={
            <>
              <NavHeader pages={pages} admin={admin} loggedIn={loggedIn} user={user} handleLogout={handleLogout}/>
              <Container fluid className="mt-3">
                {message && <Row>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row> }
                <Outlet/>
              </Container>
            </>} >
            <Route index 
              element={ <PageList pages={pages} loggedIn={loggedIn} admin={admin} user={user}/> } />
            <Route path='pages/:userId' 
              element={ loggedIn ? <SinglePage pages={pages} user={user} admin={admin}/>: <Navigate replace to='/' /> } />
            <Route path='pages/:userId/addCreatedPage' 
              element={<CreatedPageForm admin={admin} user={user}/>} />
            <Route path='pages/:userId/editCreatedPage/:pageId' 
              element={<CreatedPageForm admin={admin}/>} />
            <Route path='pages/viewPage/:id'
              element={<ViewPage pages={pages} />} />
            <Route path='*' element={ <NotFound/> } />
            <Route path='/login' element={
              loggedIn ? <Navigate replace to={`../`} /> : <LoginForm login={handleLogin} />
            } />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App;
