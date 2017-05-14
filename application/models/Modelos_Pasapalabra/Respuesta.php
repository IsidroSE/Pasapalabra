<?php

class Respuesta extends CI_Model {
    
    private $_letra;
    private $_respuesta;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_letra() {
        return $this->_letra;
    }

    function get_respuesta() {
        return $this->_respuesta;
    }

    function set_letra($_letra) {
        $this->_letra = $_letra;
    }

    function set_respuesta($_respuesta) {
        $this->_respuesta = $_respuesta;
    }
    
    public static function createFromJson( $jsonString ) {
        $object = json_decode( $jsonString );
        $instance = new self();
        if (isset($object->_letra) && isset($object->_respuesta)) {
            $instance->set_letra( $object->_letra );
            $instance->set_respuesta( $object->_respuesta );
        }
        return $instance;
    }
    
}
