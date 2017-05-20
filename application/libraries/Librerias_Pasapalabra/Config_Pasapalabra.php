<?php

class Config_Pasapalabra extends CI_Model {
    
    const GAMESTATE = array(
        "GAME_STARTING" => 0,
        "ANSWERING" => 1,
        "PROCESSING" => 2,
        "GAME_ENDED" => 3
    );
    
    const DIFICULTAD = array(
        "FACIL" => 'Fácil',
        "NORMAL" => 'Normal',
        "DIFICIL" => 'Difícil'
    );
    
    const RESPONSE = array(
        "OK" => "_ok",
        "GAMESTATE" => "_gameState",
        "NUM_INTENTOS" => "_num_intentos",
        "PUNTUACION" => "_puntuacion",
        "PREGUNTA" => "_pregunta",
        "ACERTAR" => "_acertar",
        "GANAR" => "_ganar"
    );
    
    const NUM_INTENTOS_INICIAL = 10;
    const PUNTUACION_INCIAL = 100;
    
}

