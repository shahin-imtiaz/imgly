import React, { Component } from 'react';
// import MiscStyles from './Misc.module.css';
import Gallery from "react-photo-gallery";
import Modals from 'react-bootstrap/Modal'
import Carousel, { Modal, ModalGateway } from "react-images";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

class NewGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      startSlide: 0,
      currentUpload: '',
      showUploadModal: false,
      currentImageTags: null,
      photos: [],
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL+"/api/images").then(x => x.json()).then(images => {
      this.setState({
        photos: images.map(id => ({
          src: process.env.REACT_APP_API_URL+'/api/images/'+id,
          width: 3,
          height: 4
        }))
      });
    });
  }

  setCurrentImage = (index) => {
    this.setState({
      currentImage: index
    })
  }

  setViewerIsOpen = (bool) => {
    this.setState({
      viewerIsOpen: bool
    })
  }


  openLightbox = (event, { photo, index }) => {
    this.setCurrentImage(index);
    this.setViewerIsOpen(true);
  };

  closeLightbox = () => {
    this.setCurrentImage(0);
    this.setViewerIsOpen(false);
  };

  openFile = (e) => {
  this.setState({
    currentUpload: URL.createObjectURL(e.target.files[0])
  })
  }

  toggleUploadModal = () => {
    console.log('hello');
    this.setState({
      showUploadModal: !this.state.showUploadModal
    })
  }

 tags = () => {
    if (this.state.currentImageTags) {
      // show tags
      return (<div> tag, tag </div>)
    } else {
      // show a loading icon
      return (<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif"/>)
    }
 }

  render() {
    return (
      <div className="hello">
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">IMGLY</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <button class="btn btn-primary" type="submit" onClick={this.toggleUploadModal}>
              Upload
            </button>
          </Nav>
        </Navbar.Collapse>
        </Navbar>

        {this.state.photos.length > 0 
        ? <Gallery photos={this.state.photos} direction={"column"} onClick={this.openLightbox} id="lightbox"/>
        : null}
        <ModalGateway>
          {this.state.viewerIsOpen ? (
            <Modal onClose={this.closeLightbox}>
              <Carousel
                currentIndex={this.state.currentImage}
                views={this.state.photos.map(x => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>


        <Modals
          show={this.state.showUploadModal}
          onHide={this.toggleUploadModal}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modals.Header closeButton>
            <Modals.Title id="example-custom-modal-styling-title">
              Custom Modal Styling
            </Modals.Title>
          </Modals.Header>
          <Modals.Body>
            <p>
            <img src={this.state.currentUpload} width="200px"/>
            <form action={process.env.REACT_APP_API_URL+"/api/images/upload"} method="POST" encType="multipart/form-data">
              <input type='file' name='img' onChange={(e) => this.openFile(e)}/>
              <button type='submit'>Submit the image</button>
            </form>
            </p>
          </Modals.Body>
      </Modals>



      </div>
    );
  }
}

export default NewGallery;
