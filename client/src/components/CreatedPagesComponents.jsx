import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function CreatedPages(props) {
  return (
    <>
      <Row>
        <Col as="h2" className='page-title'>Created Pages</Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          <CreatedPageTable createdpages={props.createdpages} content={props.content} addCreatedPage={props.addCreatedPage} updateCreatedPage={props.updateCreatedPage} deleteCreatedPage = {props.deleteCreatedPage} loggedIn={props.loggedIn} user={props.user}></CreatedPageTable>
        </Col> 
      </Row>
    </>
  );
}

function CreatedPageTable(props) {
  const [sortOrder, setSortOrder] = useState('none');

  const sortedCreatedPages = [...props.createdpages];
  if (sortOrder === 'asc')
    sortedCreatedPages.sort((a,b) => dayjs(a.creation_date)- dayjs(b.creation_date));
  else if (sortOrder === 'desc')
    sortedCreatedPages.sort((a,b) => dayjs(b.creation_date) - dayjs(a.creation_date));

  const sortByDate = () => {
    setSortOrder((oldOrder) => oldOrder === 'asc' ? 'desc' : 'asc');
  }

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th className='table-title'>Title</th>
            <th className='table-title'>Author </th>
            <th className='table-title'>Creation Date <Button variant="link" onClick={sortByDate} style={{color: 'black'}}><i className={sortOrder === 'asc' ? 'bi bi-sort-numeric-up' : 'bi bi-sort-numeric-down'}></i></Button></th>
            <th className='table-title'>Publication Date</th>
            <th className='table-title'>Actions</th>
          
          </tr>
        </thead>
        <tbody>
          {
            sortedCreatedPages.map((cpage) => <CreatedPageRow createdpage={cpage} key={cpage.id} content={props.content} deleteCreatedPage={props.deleteCreatedPage} loggedIn={props.loggedIn} user={props.user}/>)
          }
        </tbody>
      </Table>
      <div className="add-button-container">
        <Link to='addCreatedPage' className='btn btn-success add-content-button' role='button'>Add new page</Link>
      </div>
    </>
  );
}

function CreatedPageRow(props) {

  return(
    <tr><CreatedPageData createdpage={props.createdpage}/>
    <CreatedPageActions  deleteCreatedPage = {props.deleteCreatedPage} content={props.content} createdpage={props.createdpage} loggedIn={props.loggedIn} user={props.user}/>
    
    </tr>
  );
}

function CreatedPageData(props) {
  return(
    <>
      <td className='table-content'>{props.createdpage.title}</td>
      <td className='table-content'>{props.createdpage.author}</td>
      <td className='table-content'>{props.createdpage.creation_date.format('YYYY-MM-DD')}</td>
      <td className='table-content'>{(props.createdpage.publication_date == null) ? props.createdpage.publication_date :props.createdpage.publication_date.format('YYYY-MM-DD')}</td>
      
      
    </>
  );
}

function CreatedPageActions(props) {
  const contentbyPage = props.content.filter((item) => item.id === props.createdpage.id).map(({ id, ...rest }) => Object.assign({}, rest));
  return (
    (props.user.admin == 1 ) ?
    <>
    <td>
    <Link to={`../pages/viewPage/${props.createdpage.id}`} className='btn btn-dark view-button'><i className='bi bi-eye'></i></Link>
    &nbsp; 
    <Link to={`editCreatedPage/${props.createdpage.id}`} className='btn btn-primary update-button' state={[props.createdpage.serialize(), JSON.stringify(contentbyPage)]}><i className='bi bi-pencil-square'></i></Link>
    &nbsp;
    <Button variant='danger' className= "cancel-button" onClick={() => props.deleteCreatedPage(props.createdpage.id)}><i className="bi bi-trash"/></Button>
    </td>
    </>
    : (props.createdpage.userId == props.user.id) ? 
      <>
    <td>
    <Link to={`../pages/viewPage/${props.createdpage.id}`} className='btn btn-dark view-button'><i className='bi bi-eye'></i></Link>
    &nbsp; 
    <Link to={`editCreatedPage/${props.createdpage.id}`}  className='btn btn-primary update-button'  state={[props.createdpage.serialize(), JSON.stringify(contentbyPage)]}><i className='bi bi-pencil-square'></i></Link>
    &nbsp; 
    <Button variant='danger' className= "cancel-button" disabled={props.createdpage.userId == props.user.id ? false : true} onClick={() => props.deleteCreatedPage(props.createdpage.id)}><i className="bi bi-trash"/></Button>    
    </td>
    </>
    : <td>
      <Link to={`../pages/viewPage/${props.createdpage.id}`} className='btn btn-dark view-button'><i className='bi bi-eye'></i></Link>
    </td>
    
    
    
  )
    
}

export default CreatedPages;