import React, { Component } from 'react';
// import MiscStyles from './Misc.module.css';
import Gallery, {Photo} from "react-photo-gallery";
import Modals from 'react-bootstrap/Modal'
import Carousel, { Modal, ModalGateway } from "react-images";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Spinner from 'react-bootstrap/Spinner'
// import NavDropdown from 'react-bootstrap/NavDropdown'

// const CustomPhoto = ({  index,
//   src,
//   photo,
//   margin,
//   direction,
//   top,
//   left,
//   selected}) => {
//     return <Photo src={src} index={index} photo={photo} margin={margin} direction={direction} top={top} left={left} selected={selected}/>
// }
const CustomPhoto = ({top, left, ...props}) => <div style={{position: "absolute", top, left}}>
  <Photo {...props} />
  <div style={{
    position: "absolute", 
    padding: "0.5em", 
    width: props.photo.width+2,
  }}>
    <div style={{
      borderRadius: "0.25em",
      padding: "0.25em",
      background: "rgba(255, 255, 255, 0.8)",
    }}>
      {props.photo.tags.map(({tag}) => (tag && tag.replaceAll) ? tag.replaceAll('_', ' ') : '').join(', ')}
    </div>
  </div>
  {console.log(props)}
</div>

class NewGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      startSlide: 0,
      currentUpload: '',
      showUploadModal: false,
      currentImageTags: null,
      photos: [],
      uploadSpinnerVisible: false
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL+"/api/images").then(x => x.json()).then(images => {
      this.setState({
        photos: images.map(({id, width, height, tags}) => ({
          src: process.env.REACT_APP_API_URL+'/api/images/'+id,
          width: width,
          height: height,
          tags: tags,
          alt: tags.map(({tag}) => tag).join(' ')
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
            <button className="btn btn-primary" type="submit" onClick={this.toggleUploadModal}>
              Upload
            </button>
          </Nav>
        </Navbar.Collapse>
        </Navbar>

        {this.state.photos.length > 0 
        ? <Gallery 
          photos={this.state.photos} 
          direction={"column"} 
          onClick={this.openLightbox} 
          id="lightbox"
          renderImage={CustomPhoto}
        />
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
              Upload image
            </Modals.Title>
          </Modals.Header>
          <Modals.Body>
            <div>
            <img src={this.state.currentUpload} width="200px" className="d-block pt-2 pb-4 mx-auto" style={{borderRadius: "0.5em"}}/>
            <div className={"w-100 flex-column justify-content-center align-items-center m-4 "+(this.state.uploadSpinnerVisible ? "d-flex" : "d-none")}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Predicting tags for uploaded image</span>
              </Spinner>
              <span className="text-center mt-4">Uploading file and processing tags...</span>
            </div>
            <form 
              action={process.env.REACT_APP_API_URL+"/api/images/upload"} 
              method="POST" encType="multipart/form-data"
              onSubmit={() => {
                this.setState({uploadSpinnerVisible: true})
                
              }}
            >
              <input type='file' name='img' onChange={(e) => this.openFile(e)}/>
              <button className="btn btn-primary" type="submit" disabled={!this.state.currentUpload}>Submit this image</button>
            </form>
            </div>

          </Modals.Body>
         
      </Modals>



      </div>
    );
  }
}

export default NewGallery;
