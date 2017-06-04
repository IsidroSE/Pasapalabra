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
    
    //Inserta un record en la base de datos
    public function insert_record($record) {
        
        $data = array(
            'record_player' => $record->get_player_name(),
            'record_points' => $record->get_points(),
            'record_dificultad' => $record->get_dificultad(),
            'record_time' => $record->get_time()
        );
        
        return $this->db->insert('records', $data);
        
    }
    
    //Obtiene el top 10 de una dificultad
    public function get_top10($dificultad) {
        
        $sql = "SELECT * FROM `records` WHERE `record_dificultad` = '" . $dificultad . "' "
            . "ORDER BY record_points DESC, record_time LIMIT 10";
        $query = $this->db->query($sql);
        $result = $query->result();
        
        return $result;
        
    }
    
}
