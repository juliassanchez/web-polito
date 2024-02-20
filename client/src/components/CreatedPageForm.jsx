import { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Page, ContentBlock } from '../PCModels';
import dayjs from 'dayjs';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../API';
import '../App.css';

function CreatePageForm(props) {
  let {userId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let editableCreatedPage = false;
  let editableContent = false;
  if(location.state != null){
    editableCreatedPage = location.state[0];
    editableContent = JSON.parse(location.state[1]);
  }
  
  
  const [waiting, setWaiting] = useState(false);
  const [id, setId] = useState(editableCreatedPage ? editableCreatedPage.id : -1);
  const [title, setTitle] = useState(editableCreatedPage ? editableCreatedPage.title : '');
  const [author, setAuthor] = useState(editableCreatedPage ? editableCreatedPage.author : props.user.name);
  const [creation_date, setCreation] = useState(editableCreatedPage ? dayjs(editableCreatedPage.creation_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  const [publication_date, setPublication] = useState(editableCreatedPage ? dayjs(editableCreatedPage.publication_date).format('YYYY-MM-DD') : '');
  const [contentblock, setContentBlock] = useState(editableContent ? editableContent:[{ type: '', text: '', position: '' }]);
  const [newUserId, setnewUserId] = useState(editableCreatedPage ? editableCreatedPage.userId : userId);

  //For checking that the form is valid --> At least a paragraph or an image
  const [isFormValid, setIsFormValid] = useState(true);
  const [alert, setAlert] = useState('');

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContentBlock = [...contentblock];
    updatedContentBlock[index] = { ...updatedContentBlock[index], [name]: value };
    setContentBlock(updatedContentBlock);
    validateForm(updatedContentBlock);
  };

  const handleAddContent = () => {
    const updatedContentBlock = [...contentblock];
    updatedContentBlock.push({ type: '', position: '', text: '' });
    setContentBlock(updatedContentBlock);
  };

  const handleRemoveContent = index => {
    const updatedContentBlock = [...contentblock];
    updatedContentBlock.splice(index, 1);
    setContentBlock(updatedContentBlock);
    validateForm(updatedContentBlock);
  };

  //Checking the position is not repeated
  const isPositionNumbersUnique = (contentBlockArray) => {
    const positionArray = [];
    for (let key in contentBlockArray) {
      if (contentBlockArray.hasOwnProperty(key)) {
        const position = Number(contentBlockArray[key].position);
  
        if (positionArray.includes(position)) {
          return false; // ID is repeated
        }
  
        positionArray.push(position);
      }
    }
    return true; // ID is unique
  };

  const validateForm = (updatedContentBlock) => {
    const hasHeader = updatedContentBlock.some((block) => block.type === 'header');
    const hasParagraphOrImage = updatedContentBlock.some(
      (block) => block.type === 'paragraph' || block.type === 'image'
    );
    const isPositionUnique = isPositionNumbersUnique(updatedContentBlock);
  
    const formIsValid = hasHeader && hasParagraphOrImage && isPositionUnique;
    setIsFormValid(formIsValid);
  
    if (!formIsValid) {
      let alertMessage = '';
  
      if (!hasHeader) {
        alertMessage = 'The page must have at least one header';
      } else if (!hasParagraphOrImage) {
        alertMessage = 'The page must have at least one paragraph or an image block';
      } else if (!isPositionUnique) {
        alertMessage = 'One of the selected positions is selected twice';
      }
  
      setAlert(alertMessage);
    } 
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // create a new page
    const createpage = new Page(id, title, author, creation_date, publication_date, newUserId);
    const contentblocks = contentblock.map(c => new ContentBlock(id, c.type, c.text, c.position));
    setWaiting(true);
 
    if(editableCreatedPage || editableContent) {
      API.updateCreatedPage(createpage, contentblocks)
        .then(() => navigate(`/pages/${newUserId}`));
    }
    else {
      // add the page to the "createdpages" state
      API.addCreatedPage(createpage, contentblocks, newUserId)
        .then(() => navigate(`/pages/${newUserId}`));
    }
  }
  useEffect(() => {
    validateForm(contentblock); // Validate form when contentblock changes
  }, [contentblock]);

  return (
    <>
    {waiting && <Alert variant="secondary">Please, wait for the server's answer...</Alert>}
    <Form onSubmit={handleSubmit} className="fancy-form">
    <h2 className="page-title">Page form</h2>
    <div className="form-section bg-first-section">
      <Row className="mb-3">
      <Form.Group as={Col} md="8">
        <Form.Label className='form-title'>Title</Form.Label>
        <Form.Control className= "form-input" type="text" as="textarea" rows={1} minLength={2} required={true} value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group as={Col} md="4">
        <Form.Label className='form-title'>Author</Form.Label>
        <Form.Select  className= "form-input" aria-label="Default select example" disabled={!props.admin} required={true} value={newUserId} onChange={(event) => setnewUserId(event.target.value)}>
          <option>Open this select menu</option>
          <option value="1">Julia Sánchez</option>
          <option value="2">Alba Condemines</option>
          <option value="3">Irune Monreal</option>
        </Form.Select>
      </Form.Group>
      </Row>
      <Row className='mb-3'>
      <Form.Group as={Col} md="6">
        <Form.Label className='form-title'>Creation</Form.Label>
        <Form.Control className= "form-input" type="date" disabled={!props.admin} required={true} value={creation_date} onChange={(event) => setCreation(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group as={Col} md="6">
        <Form.Label className='form-title'>Publication</Form.Label>
        <Form.Control className= "form-input" type="date" value={publication_date} onChange={(event) => setPublication(event.target.value)}></Form.Control>
      </Form.Group>
      </Row>
      </div>
      <div style={{ marginTop: '10px' }}></div>
      <h3 className= "form-header">Content Blocks</h3>
      <div style={{ marginTop: '10px' }}></div>
      {contentblock.map((field, index) => (
        <div key={index}>
          <div className="form-section bg-section">
          <Row className="mb-3" >
          <Form.Group controlId={`type${index}`} as={Col} md="6">
            <Form.Label className='form-title'>Type</Form.Label>
            <Form.Select className= "form-input" aria-label="Default select example" type="text" name="type" value={field.type} onChange={event => handleInputChange(index, event)}>
              <option>Open this select menu</option>
              <option value="header">Header</option>
              <option value="paragraph">Paragraph</option>
              <option value="image">Image</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId={`position${index}`} as={Col} md="4">
            <Form.Label className='form-title'>Position</Form.Label>
            <Form.Control className= "form-input" type="number" name="position" value={field.position} min="0" max={contentblock.length.toString()}  onChange={event => handleInputChange(index, event)}/>
          </Form.Group>
          </Row>
          <Form.Group controlId={`text${index}`}>
            <Form.Label className='form-title'>Text</Form.Label>
            {(field.type == "image") ? 
            <Form.Select className= "form-input" aria-label="Default select example" type="text" name="text" value={field.text} onChange={event => handleInputChange(index, event)}>
            <option>Open this select menu</option>
            <option value="https://wwfes.awsassets.panda.org/img/panda_gigante_2_98522.jpg">Panda</option>
            <option value="https://img.bleacherreport.net/img/slides/photos/004/240/062/hi-res-86cdc18008aa41ad7071eca5bad03f87_crop_exact.jpg?w=2975&h=2048&q=85">Footballer</option>
            <option value="https://media.traveler.es/photos/613770cb6936668f30c3f03b/16:9/w_1792,h_1008,c_limit/130673.jpg">Ocean</option>
            <option value="https://www.bloomberglinea.com/resizer/aZTUgdPE8Uu5_reCmJQF8Zimzl4=/1440x0/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/bloomberglinea/52NBCCMH3JFPRF2EYMXAH6U5EI.jpg">Singer</option>
          </Form.Select>:
            <Form.Control className= "form-input" type="text" as="textarea" rows={1} name="text" value={field.text} onChange={event => handleInputChange(index, event)}/>
          }
          </Form.Group>
          </div>
          {index >= 0 && (
            <>
            <div style={{ marginTop: '10px' }} className='add-button-container'>
              <Button variant="danger" className="remove-button" onClick={() => handleRemoveContent(index)}>Remove content</Button>
            </div>
            
            </>
          )}
          <hr />
        </div>
        ))}
        
        <div style={{ marginTop: '10px' }} className='add-button-container'>
        <Button variant="success" className="add-content-button" onClick={handleAddContent}>Add New Content</Button>
        </div>
        <hr />
      
      {(!isFormValid) && <Alert variant="danger" className="mt-3">{alert}</Alert>}
      {editableCreatedPage ? 
        <div className='add-button-container'><Button variant="primary" className='update-button' type="submit" disabled={!isFormValid}>Update Content</Button> &nbsp; &nbsp; <Link to={`../..`} relative='path' className='btn btn-danger cancel-button'>Cancel</Link></div> :
        <div className='add-button-container'><Button variant="primary" className='add-button' type="submit" disabled={waiting}>Add Content</Button> &nbsp; &nbsp;<Link to={`../`} relative='path' className='btn btn-danger cance-button'>Cancel</Link></div>
      }
    </Form>
    
    </>
  );
}

export default CreatePageForm;