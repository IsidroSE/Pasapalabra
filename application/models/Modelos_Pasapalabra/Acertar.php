<?php

class Acertar extends CI_Model implements JsonSerializable {
    
    private $_letra;
    private $_acertar;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_letra() {
        return $this->_letra;
    }

    function get_acertar() {
        return $this->_acertar;
    }

    function set_letra($_letra) {
        $this->_letra = $_letra;
    }

    function set_acertar($_acertar) {
        $this->_acertar = $_acertar;
    }
    
    public function jsonSerialize() {
        return [
            '_letra' => $this->_letra,
            '_acertar' => $this->_acertar
        ];
    }
    
}
