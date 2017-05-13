<?php

class Jugador extends CI_Model {
    
    private $_gameState;
    private $_rosco;
    private $_num_intentos;
    private $_puntuacion;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_gameState() {
        return $this->_gameState;
    }

    function get_rosco() {
        return $this->_rosco;
    }

    function get_num_intentos() {
        return $this->_num_intentos;
    }

    function get_puntuacion() {
        return $this->_puntuacion;
    }

    function set_gameState($_gameState) {
        $this->_gameState = $_gameState;
    }

    function set_rosco($_rosco) {
        $this->_rosco = $_rosco;
    }

    function set_num_intentos($_num_intentos) {
        $this->_num_intentos = $_num_intentos;
    }

    function set_puntuacion($_puntuacion) {
        $this->_puntuacion = $_puntuacion;
    }
    
}
