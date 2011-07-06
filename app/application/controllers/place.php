<?php

class Place extends CI_Controller {
	

	function index() {
		
	}
	
	function save() {
		$projectid = $this->input->cookie('projectid');
		$data = json_decode($this->input->post('data'));
		
		/* delete the old data first */
		$this->db->delete('place', array('project' => $projectid));
		
		$sorting = 0;
		foreach ($data as $item) {
			/* prepare for the position */
			$position = substr($item->position, 1, -1);
			$position = explode(', ', $position);
			
			$save = array('project' => $projectid,
						  'title' => $item->title,
						  'address' => $item->address,
						  'lat' => $position[0],
						  'lng' => $position[1],
						  'sorting' => $sorting++);
			
			$this->db->insert('place', $save);
		}
		
		$message = array();
		if (!$this->db->_error_number()) {
			$message['status'] = 'SUCCESS';
			$message['message'] = 'Saved';
		} else {
			$message['status'] = 'FAILED';
			$message['message'] = 'Cannot be saved.';
		}
		
		echo json_encode($message);
	}
	
	function read() {
		$this->db->order_by('sorting', 'asc');
		$data['markers'] = $this->db->get_where('place', array('project' => $this->input->post('id')))->result();
		echo json_encode($data);
	}
}

?>