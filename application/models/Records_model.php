<?php

/**
 * Description of Records_model
 *
 * @author Isidro
 */
class Records_model extends CI_Model {
    
    function __construct() {
        parent::__construct();
        $this->load->model("Modelos_Pasapalabra/Pregunta");
    }
    
    public function insert_record($record) {
        
        $data = array(
            'record_player' => $record->get_player_name(),
            'record_points' => $record->get_points(),
            'record_dificultad' => $record->get_dificultad(),
            'record_time' => $record->get_time()
        );
        
        return $this->db->insert('records', $data);
        
    }
    
}
