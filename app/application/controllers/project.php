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
}

?>