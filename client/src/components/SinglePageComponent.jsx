import { Row, Col } from 'react-bootstrap';
import CreatedPages from './CreatedPagesComponents';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../API';

function SinglePage(props) {
  // get the userId from the URL to retrieve the right user and its pages
  const params = useParams();
  const page = props.pages[params.userId-1];
  const [createdpages, setCreatedPages] = useState([]);
  const [content, setContent] = useState([]);
  
  const getCreatedPages = async () => {
    const user_id = params.userId;
    const data = await API.getCreatedPages(user_id);
    setCreatedPages(data[0]);
    setContent(data[1]);
  }

  useEffect(()=> {
    // get all the pages of this user from API
    getCreatedPages();
  }, []);


  const deleteCreatedPage = (pageId) => {
    // temporary update
    API.deleteCreatedPage(pageId)
      .then(() => getCreatedPages())
      .catch(e => console.log(e)); 
  }

  
  return (
    <>
    {/* The check on "page" is needed to intercept errors due to invalid URLs */}
    {page ? <>
      <PageDescription user={props.user} page={page}/>
      <CreatedPages createdpages={createdpages} content={content} deleteCreatedPage={deleteCreatedPage} loggedIn={props.loggedIn} user={props.user}></CreatedPages></> :
      <p className='lead'>The selected page does not exist!</p>
    } 
    </>
  );
}

function PageDescription(props) {
  return (
    <>
      <Row>
        <PageHeader userId={props.user.id} author={props.user.name} />
      </Row>
      <Row>
        <PageTitle text={props.page.title} />
      </Row>
    </>
  );
}

function PageHeader(props) {
  return (
    <>
      <Col className="text-end">
        <span className="badge text-bg-secondary text-end user-display">{props.author}</span>
      </Col>
    </>
  );
}

function PageTitle(props) {
  return (
    <Col as="p" className="lead">{props.title}</Col>
  );
}

export default SinglePage;