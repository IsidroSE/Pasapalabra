<?php

class Playing_Time extends CI_Model implements JsonSerializable {
    
    private $_tiempo_inicio;
    private $_playing_time;
    private $_tiempo_fin;
 
    function __construct() {
        parent::__construct();
    }
    
    function get_tiempo_inicio() {
        return $this->_tiempo_inicio;
    }

    function set_tiempo_inicio($_tiempo_inicio) {
        $this->_tiempo_inicio = $_tiempo_inicio;
    }
        
    function get_playing_time() {
        return $this->_playing_time;
    }

    function set_playing_time($_playing_time) {
        $this->_playing_time = $_playing_time;
    }
    
    function get_tiempo_fin() {
        return $this->_tiempo_fin;
    }

    function set_tiempo_fin($_tiempo_fin) {
        $this->_tiempo_fin = $_tiempo_fin;
    }
           
    public function jsonSerialize() {
        return [
            '_playing_time' => $this->_playing_time
        ];
    }
    
}

