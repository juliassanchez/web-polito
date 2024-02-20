import { Row, Col, Table, Button, Image, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';

function PageList(props) {
  return (
    <>
      <Row className="title-container">
        <Col as="h2" className='page-title'>Published Pages </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          <PageTable pages={props.pages} loggedIn={props.loggedIn} admin={props.admin} user={props.user}></PageTable>
        </Col> 
      </Row>
    </>
  );

  
}

function PageTable(props) {
  const [sortOrder, setSortOrder] = useState('none');

  const sortedPages = [...props.pages];
  if (sortOrder === 'asc')
    sortedPages.sort((a,b) => dayjs(a.publication_date)- dayjs(b.publication_date));
  else if (sortOrder === 'desc')
    sortedPages.sort((a,b) => dayjs(b.publication_date) - dayjs(a.publication_date));

  const sortByDate = () => {
    setSortOrder((oldOrder) => oldOrder === 'asc' ? 'desc' : 'asc');
  }
  
  return (
    <>
      <Table striped >
        <thead className="thead">
          <tr>
            
            <th className='table-title'>Title</th>
            <th className='table-title'>Author </th>
            <th className='table-title'>Creation Date</th>
            <th className='table-title'>Publication Date <Button variant="link" onClick={sortByDate} style={{color: 'black'}}><i className={sortOrder === 'asc' ? 'bi bi-sort-numeric-up' : 'bi bi-sort-numeric-down'}></i></Button></th>
            <th className='table-title'>View Page</th>

          </tr>
        </thead>
        <tbody>
          {
            sortedPages.map((p) => 
            <PageRow pages={p} key={p.id} loggedIn={props.loggedIn} admin={props.admin}/>)
          }
        </tbody>
      </Table>
      
    </>
  );
}

function PageRow(props) {
  return(
    <tr><PageData pages={props.pages}/><PageActions  pages={props.pages} loggedIn={props.loggedIn} admin={props.admin}/></tr>
  );
}

//POR AQUI

function PageData(props) {
  return(
    <>
      <td className='table-content'>{props.pages.title}</td>
      <td className='table-content'>{props.pages.author}</td>
      <td className='table-content'>{props.pages.creation_date.format('YYYY-MM-DD')}</td>
      <td className='table-content'>{(props.pages.publication_date == null) ? props.pages.publication_date : props.pages.publication_date.format('YYYY-MM-DD')}</td>
      
    </>
  );
}
//props.pages.created || 

function PageActions(props) {
  return <td className='add-button-container'>
    
    <Link to={`pages/viewPage/${props.pages.id}`} className='btn btn-dark view-button'><i className='bi bi-eye'></i></Link>
    </td>
}
export default PageList;
