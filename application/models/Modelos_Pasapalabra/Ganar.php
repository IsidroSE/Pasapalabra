<?php

class Ganar extends CI_Model implements JsonSerializable {
    
    private $_ganar;
 
    function __construct() {
        parent::__construct();
        $this->_ganar = null;
    }
    
    function get_ganar() {
        return $this->_ganar;
    }

    function set_ganar($_ganar) {
        $this->_ganar = $_ganar;
    }
   
    public function jsonSerialize() {
        return [
            '_ganar' => $this->_ganar
        ];
    }
    
}

