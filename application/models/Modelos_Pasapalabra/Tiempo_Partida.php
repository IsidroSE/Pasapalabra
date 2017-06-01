<?php

class Tiempo_Partida extends CI_Model implements JsonSerializable {
    
    private $_minutos;
    private $_segundos;
 
    function __construct() {
        parent::__construct();
    }
    
    function get_minutos() {
        return $this->_minutos;
    }

    function get_segundos() {
        return $this->_segundos;
    }

    function set_minutos($_minutos) {
        $this->_minutos = $_minutos;
    }

    function set_segundos($_segundos) {
        $this->_segundos = $_segundos;
    }
           
    public function jsonSerialize() {
        return [
            '_minutos' => $this->_minutos,
            '_segundos' => $this->_segundos
        ];
    }
    
}

