<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     *	- or -
     * 		http://example.com/index.php/welcome/index
     *	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see https://codeigniter.com/user_guide/general/urls.html
     */


    public function __construct() {
    parent::__construct();
        $this->load->database();
        $this->load->library("grocery_CRUD");
        date_default_timezone_set('Europe/Madrid');
        $this->load->library('session');
        $this->load->helper('url');
        $this->load->model("Rol_model");
        $this->load->model("Questions_model");
    }

    public function index() {
        $this->load->view('Webapp/index');
    }
    
    public function login() {
        $this->load->view("Webapp/login");
    }
    
    //Valida el usuario del login
    public function validar_usuario() {
        
        $email = $this->input->post('user_email');
        $pass = $this->input->post('user_pass');
        
        $sql = "SELECT * FROM users WHERE user_email = '$email' ";
        
        $query = $this->db->query($sql);
        
        if ($query->num_rows() == 1) {
            
            $hash_pass = sha1($pass);
            
            $fila = $query->row();
            
            $hash_bd = $fila->user_password;
            
            if ($hash_pass == $hash_bd) {
                
                $rol_id = $fila->user_rol_id;
            
                $rol = $this->Rol_model->getPermissions($rol_id);
                
                $variablesDeSesion = array(
                    'email' => $email,
                    'pass' => $pass,
                    'rol_id' => $rol_id,
                    'rol' => $rol,
                    'logged_in' => TRUE
                );
                
                $this->session->set_userdata($variablesDeSesion);
                
                redirect("preguntas");
                
            }
            else {
                redirect("login");
            }
            
        }
        else {
            redirect("login");
        }
        
    }
    
    //Cierra la sesión
    public function cerrar_sesion() {
        
        $variablesDeSesion = array(
            'email' => '',
            'pass' => '',
            'rol_id' => '',
            'rol' => '',
            'logged_in' => NULL
        );
        
        $this->session->unset_userdata($variablesDeSesion);
        
        $this->session->sess_destroy();
        
        redirect("login");
        
    }

    public function usuarios() {

        if ($this->session->has_userdata('email') && $this->session->rol == 1) {
            
            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("users");
            $crud->set_subject('usuarios');

            $crud->field_type('user_password', 'password');
            $crud->set_relation('user_rol_id','roles','rol_name');

            $crud   ->display_as('user_name','Nombre de usuario')
                    ->display_as('user_email','Email')
                    ->display_as('user_password','Contraseña')
                    ->display_as('user_rol_id','Permisos');

            $crud->required_fields('user_email','user_password');

            $crud->callback_before_insert(array($this,'hash_password_callback'));
            $crud->callback_before_update(array($this,'hash_password_callback'));

            $datos['topic'] = 'usuarios';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
            
        }
        else {
            redirect("login");
        }
        
    }
    
    //Devuelve un hash de la contraseña dada
    public function hash_password_callback ($post_array) {
        $post_array['user_password'] = sha1($post_array['user_password']);
        return $post_array;
    }
    
    public function roles() {
        
        if ($this->session->has_userdata('email') && $this->session->rol == 1) {
            
            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("roles");

            $crud   ->display_as('rol_level','Nivel de permisos')
                    ->display_as('rol_name','Rol');

            $crud->required_fields('rol_name');

            $datos['topic'] = 'roles';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
            
        }
        else {
            redirect("login");
        }
    }

    public function preguntas() {
        
        if ($this->session->has_userdata('email') && $this->session->rol <= 2) {
            
            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("questions");

            $crud->field_type('question_difficulty_level','enum', array("Fácil", "Normal", "Difícil"));

            $crud   ->display_as('question_letter','Letra')
                    ->display_as('question_difficulty_level','Dificultad')
                    ->display_as('question_definition','Definición')
                    ->display_as('question_answer','Solución');

            $crud->required_fields('question_letter','question_definition', 'question_answer');

            $datos['topic'] = 'preguntas';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        
        }
        else {
            redirect("login");
        }
    }
    
    public function records_jugadores() {
        
        if ($this->session->has_userdata('email') && $this->session->rol == 1) {
            
            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("records");

            $crud   ->display_as('record_player','Jugador')
                    ->display_as('record_points','Puntos obtenidos')
                    ->display_as('record_time','Tiempo tardado')
                    ->display_as('record_date','Fecha');

            $crud->required_fields('record_player','record_points', 'record_time');

            $datos['topic'] = 'records_jugadores';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        
        }
        else {
            redirect("login");
        }
        
    }
    
    public function getData() {
        $post = $this->Questions_model->getQuestions();
        echo json_encode($post);
    }
    
    public function get_dificultad_seleccionada() {
//        print_r($_REQUEST);
//        print_r($_POST);
        
        $data = json_decode(file_get_contents('php://input'), true);
        print_r($data);
        echo $data["_dificultad_seleccionada"];
        echo "finished";
        
//        if (isset($_REQUEST['_dificultad_seleccionada'])) {
//            echo 'funciona<br>';
//            echo $_REQUEST['_dificultad_seleccionada'];
//        }
//        else {
//            echo 'no funciona';
//        }
        //echo json_encode($dificultad);
    }
	
}
