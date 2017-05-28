<?php

class Pregunta extends CI_Model implements JsonSerializable {
    
    //const $LETRAS_ROSCO = range('A', 'Z');
    
    private $_letra;
    private $_dificultad;
    private $_definicion;
    private $_solucion;
    private $_acertada;
    
    function __construct() {
        parent::__construct();
        $this->_acertada = null;
    }
    
    function get_letra() {
        return $this->_letra;
    }

    function get_dificultad() {
        return $this->_dificultad;
    }

    function get_definicion() {
        return $this->_definicion;
    }

    function set_letra($_letra) {
        $this->_letra = $_letra;
    }

    function set_dificultad($_dificultad) {
        $this->_dificultad = $_dificultad;
    }

    function set_definicion($_definicion) {
        $this->_definicion = $_definicion;
    }
    
    function get_solucion() {
        return $this->_solucion;
    }

    function set_solucion($_solucion) {
        $this->_solucion = $_solucion;
    }
    
    function get_acertada() {
        return $this->_acertada;
    }

    function set_acertada($_acertada) {
        $this->_acertada = $_acertada;
    }
        
    public function jsonSerialize() {
        return [
            '_letra' => $this->_letra,
            '_definicion' => $this->_definicion
        ];
    }
    
    public function jsonSerialize_all() {
        return [
            '_letra' => $this->_letra,
            '_definicion' => $this->_definicion,
            '_solucion' => $this->_solucion,
            '_acertada' => $this->_acertada
        ];
    }

}

