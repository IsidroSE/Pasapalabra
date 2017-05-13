<?php

class OK extends CI_Model implements JsonSerializable {
    
    private $_ok;
    
    function __construct() {
        parent::__construct();
    }
    
    function get_ok() {
        return $this->_ok;
    }

    function set_ok($_ok) {
        $this->_ok = $_ok;
    }
    
    public function jsonSerialize() {
        return [
            '_ok' => $this->_ok
        ];
    }
    
    public static function createFromJson( $jsonString ) {
        $object = json_decode( $jsonString );
        return new self( $object->_ok );
    }

}

