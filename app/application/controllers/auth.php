<?php 
	
class Auth extends CI_Controller {
	
	function index() {
		
	}
	
	function login() {
		$username = $this->input->post('username');
		$password = $this->input->post('password');
		$result = $this->db->query("SELECT * FROM `user` WHERE `username`='{$username}'")->row();
		
		if ($result && $result->password == MD5($password)) {
			/* yeah! */
			$data['status'] = 'SUCCESS';
			$user['username'] = $username;
			$user['userid'] = $result->id;
			$data['message'] = $user;
			/* prepare markers if user logged in */
			$data['markers'] = $this->db->get_where('place', array('project' => $result->id))->result_array();
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = 'Username or password is wrong.';
		}
		
		echo json_encode($data);
	}
	
	function register() {
		$username = $this->input->post('username');
		$password = $this->input->post('password');
		
		$result = $this->db->get_where('user', array('username' => $username));
		
		$data = array();
		if ($result->num_rows > 0) {
			$data['status'] = 'FAILED';
			$data['message'] = 'The username has been used.';
		} else {
			$this->db->set('username', $username);
			$this->db->set('password', "MD5('{$password}')", false);
			$this->db->set('createdate', 'NOW()', false);
			$result = $this->db->insert('user');
			if (!$this->db->_error_number()) {
				$data['status'] = 'SUCCESS';
				$user['username'] = $username;
				$user['userid'] = $this->db->insert_id();
				$data['message'] = $user;
			} else {
				$data['status'] = 'FAILED';
				$data['message'] = 'An unknown error occured.';
			}
		}
		$data['markers'] = array();
		
		echo json_encode($data);
	}
}

?>