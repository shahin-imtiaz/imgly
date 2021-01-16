import React, { Component } from 'react';
// import MiscStyles from './Misc.module.css';
import Gallery from "react-photo-gallery";
import Modals from 'react-bootstrap/Modal'
import Carousel, { Modal, ModalGateway } from "react-images";

export const photos = [
  
  {
    src: '/assets/images/photos/1.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/2.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/3.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/4.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/5.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/6.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/7.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/8.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/9.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/10.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/11.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/12.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/13.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/14.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/15.jpg',
    width: 3,
    height: 4
  },
  {
    src: '/assets/images/photos/16.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/17.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/18.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/19.jpg',
    width: 4,
    height: 3
  },
  {
    src: '/assets/images/photos/20.jpg',
    width: 3,
    height: 4
  },
  
];

class NewGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      startSlide: 0,
      currentUpload: '',
      showUploadModal: false,
      currentImageTags: null,
    }
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
        <button onClick={this.toggleUploadModal}>Upload</button>
        <Gallery photos={photos} direction={"column"} onClick={this.openLightbox} id="lightbox"/>
        <ModalGateway>
          {this.state.viewerIsOpen ? (
            <Modal onClose={this.closeLightbox}>
              <Carousel
                currentIndex={this.state.currentImage}
                views={photos.map(x => ({
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
          <input type='file' onChange={(e) => this.openFile(e)}/>
          Tags will be here:
          {this.tags()}
          </p>
        </Modals.Body>
      </Modals>



      </div>
    );
  }
}

export default NewGallery;
