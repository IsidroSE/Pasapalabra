<?php

class Dificultad extends CI_Model {
    
    private $_dificultad_seleccionada;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_dificultad_seleccionada() {
        return $this->_dificultad_seleccionada;
    }

    function set_dificultad_seleccionada($_dificultad_seleccionada) {
        $this->_dificultad_seleccionada = $_dificultad_seleccionada;
    }
    
    public static function createFromJson( $jsonString ) {
        $object = json_decode( $jsonString );
        $instance = new self();
        if (isset($object->_dificultad_seleccionada)) {
            $instance->set_dificultad_seleccionada( $object->_dificultad_seleccionada );
        }
        return $instance;
    }

}

