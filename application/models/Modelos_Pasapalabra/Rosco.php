<?php

class Rosco extends CI_Model {
    
    private $preguntas;
    private $letras;
    private $index;
    private $dificultad_rosco;
    
    
    function __construct() {
        parent::__construct();
        $preguntas = [];
    }
    
    function getPreguntas() {
        return $this->preguntas;
    }

    function setPreguntas($preguntas) {
        $this->preguntas = $preguntas;
    }
    
    function addPregunta($pregunta) { print_r($this->preguntas);
        $this->preguntas[] = $pregunta;
    }
    
    function getLetras() {
        return $this->letras;
    }

    function getIndex() {
        return $this->index;
    }

    function getDificultad_rosco() {
        return $this->dificultad_rosco;
    }

    function setLetras($letras) {
        $this->letras = $letras;
    }

    function setIndex($index) {
        $this->index = $index;
    }
    
    function incrementar_index() {
        
        $ok = false;
        
        if ($this->index < count($this->letras)) {
            $this->index++;
            $ok = true;
        }
        
        return $ok;
    }

    function setDificultad_rosco($dificultad_rosco) {
        $this->dificultad_rosco = $dificultad_rosco;
    }
    
    function getLetra($index) {
        return $this->letras[$index];
    }

}

