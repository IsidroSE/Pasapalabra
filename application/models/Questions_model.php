<?php

class Questions_model extends CI_Model {

    function __construct() {
        parent::__construct();
        $this->load->model("Modelos_Pasapalabra/Pregunta");
    }

    
    public function getQuestions() {  
        return $this->db->get("questions")->result();
    }
    
    //Dada una letra y un nivel de dificultad, obtiene una pregunta aleatoria que coincida con ambos apartados
    public function getQuestion($letra, $dificultad) {
        
        $sql = "SELECT * FROM `questions` "
            . "WHERE `question_letter` = '" . $letra . "' AND `question_difficulty_level` = '" . $dificultad . "'"; 
        $query = $this->db->query($sql);
        $result = $query->result();
        
        $index = rand(1, count($result));
        $p = $result[$index-1];
        
        $pregunta = new Pregunta();
        $pregunta->set_letra($p->question_letter);
        $pregunta->set_dificultad($p->question_difficulty_level);
        $pregunta->set_definicion($p->question_definition);
        $pregunta->set_solucion($p->question_answer);
        
        return $pregunta;
        
    }

}

