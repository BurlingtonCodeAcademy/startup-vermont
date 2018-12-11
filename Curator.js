import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import './Curator.css';

class Curator extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.handleHide = this.handleHide.bind(this);

		this.state = {
			show: false
		};
	}
	handleHide() {
		this.setState({ show: false });
	}

	render() {
		return (
			<div className="modal-container" style={{ height: 200 }}>
				<Button
					bsStyle="submit"
					bsStyle="primary"
					bsSize="large"
					onCLick={() => this.setState({ show: true })}
				>
					Launch Curator Login
				</Button>

				<Modal
					show={this.state.show}
					onHide={this.handleHide}
					container={this}
					aria-labelledby="contained-modal-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">Curator Login</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							<div id="login">
								<input type="username" id="username" placeholder="Username" />
								<input type="password" id="password" placeholder="Password" />
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="submit" onClick={this.handleHide}>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
	close = () => {
		this.setState({ showModal: false });
	};
	open = () => {
		this.setState({ showModal: true });
	};
}

export default Curator;
