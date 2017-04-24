<?php

class Rol_model extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    //Dada la id del rol, devuelve el nivel de permisos de este
    public function getPermissions($id) {
        
        $sql = "SELECT * FROM roles WHERE rol_id = $id";
        
        $query = $this->db->query($sql);
        
        $fila = $query->row();
            
        $rol = $fila->rol_level;
        
        return $rol;
    }

}
