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
        "JUGADOR" => "_jugador",
        "ROSCO" => "_rosco",
        "PREGUNTA" => "_pregunta",
        "ACERTAR" => "_acertar",
        "GANAR" => "_ganar",
        "PLAYING_TIME" => "_playing_time",
        "TIEMPO_PARTIDA" => "_tiempo_partida"
    );
    
    const NUM_INTENTOS_INICIAL = 10;
    const PUNTUACION_INCIAL = 100;
    
}

