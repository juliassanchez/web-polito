import { Row, Col, Image, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../API';

//Function to see pages layouit
export default function ViewPage(props) {
  const params = useParams();
  const page = props.pages[params.id-1];
  const [gottenpage, setPages] = useState("");
  const [pageContent, setPageContent] = useState([]);
  
  const getPage = async () => {
    const gottenpage = await API.getPage(params.id);
    setPages(gottenpage[0]);
    setPageContent(gottenpage[1]);
    
  }

  useEffect(()=> {
    // get all the pages of this user from API
    getPage();
  }, []);

  const renderContentBlocks = () => {
    return pageContent.map((block) => {
      if (block.type === 'paragraph') {
        return (
          <div className='paragraph-container'>
            <p className="page-paragraph" key={block.position}>{block.text}</p>
          </div>
        );
      } 
      else if (block.type === 'header') {
        return (
          <div className='header-container'>
            <h2 className="page-header" key={block.position}>{block.text}</h2>
          </div>
        );
      }
      else if (block.type === 'image') {
        return (
          <div className="image-container">
          <Image key={block.position} src={block.text} alt="Image" className="page-image" style={{ width: '600px', height: 'auto' }} />
        </div>
        )
        
        
      }
    });
  };

  return (
    <>
    <Container className='page-container'>
      <h1 className="page-title">{gottenpage.title}</h1>
      <Row>
        <Col>{renderContentBlocks()}</Col>
      </Row>
      &nbsp;
    </Container>
    &nbsp;
    <div className="back-button">
    <Link to={`../`} className='btn btn-dark back-button'>Back to the home page</Link>
    </div>
    &nbsp;
    </>
  );
}

