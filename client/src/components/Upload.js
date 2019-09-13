import React, { Component } from 'react'
import { Alert, Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            organization: '',
            file: '',
            message: '',
            submitted: false,
            submitStatus: 'success'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addFile = this.addFile.bind(this);

    }
 
    handleSubmit(e) {
        console.log('Submit clicked');
        e.preventDefault();
        

        const data = new FormData();
        data.append('email', this.state.email);
        data.append('name', this.state.name);
        data.append('organization', this.state.organization);
        data.append('file', this.state.file);
        if (!this.state.file.name.endsWith("pdf")) {
            this.setState({message: 'The uploaded file must be a PDF', submitStatus: 'danger', submitted: true});
        } else {
            console.log(`API URL ${process.env.REACT_APP_API_URL}`);
            axios.post(process.env.REACT_APP_API_URL, data)
                .then(res => {
                    this.setState({message: `The upload was a success. Now converting, you will be emailed at ${this.state.email} when it is ready for download.`,
                                    email: '',
                                    name: '',
                                    organization: '',
                                    submitted: true,
                                    submitStatus: 'success',
                                    file: ''});
                    
                })
                .catch(error => {
                    console.log(`Error for form: ${error}`);
                    this.setState({message: 'The upload failed. Please try again.',
                        submitStatus: 'danger',
                        submitted: true});
                });
        }
        
        
    }

    addFile(e) {
        e.preventDefault();
        this.setState({file: e.target.files[0]});
    }

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value });
    }

    render() {
        return (
            <div>
                <Alert key={0} variant={this.state.submitStatus} show={this.state.submitted}>{this.state.message}</Alert>
                <Container>
                    <Row className="justify-content-md-center"> 
                        <Col md="auto">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} type="email" placeholder="Email" name="email" required={true} onChange={this.handleChange} />
                                <Form.Control value={this.state.name} type="text" placeholder="Name" name="name" required={true} onChange={this.handleChange} />
                                <Form.Control value={this.state.organization} type="text" placeholder="Organization" name="organization" onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="formBasicFile">
                                <Form.Label>GeoPDF File to Convert</Form.Label>
                                <Form.Control type="file" accepts=".pdf" text="Choose File..." onChange={this.addFile} required={true} />
                            </Form.Group>
                            <Button type="submit">Submit</Button>
                        </Form>
                        </Col>
                    </Row>    
                </Container>
                
            </div>
        )
    }
}
