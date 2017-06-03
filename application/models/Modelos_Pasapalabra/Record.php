<?php

/**
 * Description of Record
 *
 * @author Isidro
 */
class Record extends CI_Model {
    
    private $_player_name; 
    private $_points; 
    private $_dificultad;
    private $_time;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_player_name() {
        return $this->_player_name;
    }

    function get_points() {
        return $this->_points;
    }

    function get_dificultad() {
        return $this->_dificultad;
    }

    function get_time() {
        return $this->_time;
    }

    function set_player_name($_player_name) {
        $this->_player_name = $_player_name;
    }

    function set_points($_points) {
        $this->_points = $_points;
    }

    function set_dificultad($_dificultad) {
        $this->_dificultad = $_dificultad;
    }

    function set_time($_time) {
        $this->_time = $_time;
    }
        
    public static function createFromJson( $jsonString ) {
        $object = json_decode( $jsonString );
        $instance = new self();
        if (isset($object->_player_name)) {
            $instance->set_player_name( $object->_player_name );
        }
        return $instance;
    }
    
}
