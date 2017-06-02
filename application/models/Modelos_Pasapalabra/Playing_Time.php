<?php

class Playing_Time extends CI_Model implements JsonSerializable {
    
    private $_tiempo_inicio;
    private $_tiempo_maximo;
    private $_playing_time;
    private $_duracion_juego;
 
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
    
    function get_duracion_juego() {
        return $this->_duracion_juego;
    }

    function set_duracion_juego($_duracion_juego) {
        $this->_duracion_juego = $_duracion_juego;
    }
    
    function get_tiempo_maximo() {
        return $this->_tiempo_maximo;
    }

    function set_tiempo_maximo($_tiempo_maximo) {
        $this->_tiempo_maximo = $_tiempo_maximo;
    }
               
    public function jsonSerialize() {
        return [
            '_playing_time' => $this->_playing_time
        ];
    }
    
}

