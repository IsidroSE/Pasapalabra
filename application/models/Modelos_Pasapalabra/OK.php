<?php

class OK extends CI_Model implements JsonSerializable {
    
    private $id_cliente;
    private $_ok;
    
    function __construct() {
        parent::__construct();
        $this->id_cliente = -1;
    }
    
    function getId_cliente() {
        return $this->id_cliente;
    }

    function setId_cliente($id_cliente) {
        $this->id_cliente = $id_cliente;
    }
    
    function get_ok() {
        return $this->_ok;
    }

    function set_ok($_ok) {
        $this->_ok = $_ok;
    }
    
    public function jsonSerialize() {
        return [
            'id_cliente' => $this->id_cliente,
            '_ok' => $this->_ok
        ];
    }
    
    public static function createFromJson( $jsonString ) {
        $object = json_decode( $jsonString );
        return new self( $object->id_cliente, $object->_ok );
    }

}

