<?php
	
class Project extends CI_Controller {
	
	function index() {
		
	}
	
	function create() {
		/* create project */
		$this->db->set('create', 'NOW()', false);
		$this->db->insert('project', $this->input->post());
		
		$insert_id = $this->db->insert_id();
		
		/* link to user */
		$data = array ('uid' => $this->input->cookie('userid'),
					   'pid' => $insert_id);
		$this->db->insert('userproject', $data);
		
		$data = array();
		if (!$this->db->_error_message()) {
			$data['status']	= 'SUCCESS';
			$data['project'] = $this->db->get_where('project', array ('id' => $insert_id))->result();
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = $this->db->_error_message();
		}
		
		echo json_encode($data);
	}
	
	function resetCenter() {
		$this->db->where('id', $this->input->cookie('projectid'));
		$this->db->update('project', $this->input->post());
		
		$data = array();
		if (!$this->db->_error_number()) {
			$data['status'] = 'SUCCESS';
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = $this->db->_error_message();
		}
		
		echo json_encode($data);
	}
	
	function rename() {
		$this->db->where('id', $this->input->cookie('projectid'));
		$this->db->update('project', $this->input->post());
		
		$data = array();
		if (!$this->db->_error_message()) {
			$data['status']	= 'SUCCESS';
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = $this->db->_error_message();
		}
		
		echo json_encode($data);
	}
	
	function participant() {
		$data = array();
		
		$query = "SELECT `id`, `username` FROM `user` WHERE `id` IN (SELECT `uid` FROM `userproject` WHERE `pid` = '{$this->input->post('id')}')";
		$data['participant'] = $this->db->query($query)->result();
		
		if (!$this->db->_error_message()) {
			$data['status']	= 'SUCCESS';
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = $this->db->_error_message();
		}
		
		echo json_encode($data);
	}
	
	function join() {
		$data = array();
		
		$this->db->select('id');
		$this->db->select('username');
		$result = $this->db->get_where('user', array('username' => $this->input->post('participant')))->row();
		
		if ($result) {
			$insert = array('uid' => $result->id,
							'pid' => $this->input->cookie('projectid'));
			if ($this->db->get_where('userproject', $insert)->num_rows()) {
				$data['status'] = 'FAILED';
				$data['message'] = 'User is participating this project.';
			} else {
				$something = $this->db->insert('userproject', $insert);				
				
				if (!$this->db->_error_message()) {
					$data['status']	= 'SUCCESS';
					$data['participant'] = $result;
				} else {
					$data['status'] = 'FAILED';
					$data['message'] = $this->db->_error_message();
				}
			}
		} else {
			$data['status'] = 'FAILED';
			$data['message'] = 'User not found.';
		}
		
		echo json_encode($data);
	}
}

?>