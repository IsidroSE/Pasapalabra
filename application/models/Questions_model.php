<?php

class Questions_model extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    
    public function getQuestions() {  
        return $this->db->get("questions")->result();
    }

}

