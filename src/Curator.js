import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class Curator extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			show: false
		};
	}
	handleHide = () => {
		this.setState({ show: false });
	}

	close = () => {
		this.setState({ showModal: false });
	};
	open = () => {
		this.setState({ showModal: true });
	};

	render() {
		return (
			<div className="modal-container" style={{ height: 200 }}>
				<Button
					bsStyle="primary"
					bsSize="large"
					onClick={() => this.setState({ show: true })}
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
						<Button type="submit" bsStyle="primary" onClick={() => {
							this.handleHide()
							let username = document.getElementById('username').value
							let password = document.getElementById('username').value
							fetch('/user', {
                method: 'POST',
                username: username,
                password: password
            })
						}}>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default Curator;
