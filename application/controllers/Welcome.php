<?php
defined('BASEPATH') OR exit('No direct script access allowed');

define('GAMESTATE', 4); 

class Welcome extends CI_Controller {
    
    private $letras_rosco;

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
        $this->load->helper('url');
        $this->load->model("Rol_model");
        $this->load->model("Questions_model");
        
        //Clases de Pasapalabra
        $this->load->model("Modelos_Pasapalabra/Dificultad");
        $this->load->model("Modelos_Pasapalabra/Pregunta");
        $this->load->model("Modelos_Pasapalabra/OK");
        $this->load->model("Modelos_Pasapalabra/Rosco");
        $this->load->model("Modelos_Pasapalabra/Jugador");
        
        //Librerías del juego
        $this->load->library('Librerias_Pasapalabra/Config_Pasapalabra');
        
        $this->load->library('session');
        $this->session->N_USUARIOS = 1;
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

            $crud->field_type('question_definition', 'text');
            $crud->unset_texteditor('question_definition','full_text');
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
    
    public function test() {
//        $post = $this->Questions_model->getQuestion("A", "Normal");
//        echo $post->get_definicion();
//        echo Config_Pasapalabra::GAMESTATE["GAME_STARTING"];
        echo Config_Pasapalabra::NUM_INTENTOS_INICIAL;
        echo Config_Pasapalabra::PUNTUACION_INCIAL;
        
    }
    
    /*Mediante una petición AJAX desde el cliente, el cual envia un JSON con la 
     * dificultad elegida por el jugador, crea un rosco de 27 preguntas y le 
     * devuelve la primera de todas al jugador*/
    public function empezar_juego() {
        
        //Obtiene el JSON obtenido de la petición AJAX
        $json = file_get_contents('php://input');
        
        /*Se le pasa como parámetro un JSON con la dificultad seleccionada y lo 
         * convierte en objeto.*/
        $dificultad = Dificultad::createFromJson($json);
        
        //Valida si la dificultad enviada es correcta
        if ($dificultad->get_dificultad_seleccionada() == Config_Pasapalabra::DIFICULTAD["FACIL"] || 
            $dificultad->get_dificultad_seleccionada() == Config_Pasapalabra::DIFICULTAD["NORMAL"] ||
            $dificultad->get_dificultad_seleccionada() == Config_Pasapalabra::DIFICULTAD["DIFICIL"]) {
            
            //Se preparan los parámetros del rosco
            $letras_rosco = range('A', 'Z');
            $index_rosco = -1;
            $dificultad_rosco = $dificultad;
            
            //Se crea el rosco
            $rosco = new $this->Rosco();
            $rosco->setLetras($letras_rosco);
            $rosco->setIndex($index_rosco);
            $rosco->setDificultad_rosco($dificultad_rosco);
            
            //Se crea el jugador
            $jugador = new $this->Jugador();
            $jugador->set_rosco($rosco);
            $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["PROCESSING"]);
            $jugador->set_num_intentos(Config_Pasapalabra::NUM_INTENTOS_INICIAL);
            $jugador->set_puntuacion(Config_Pasapalabra::PUNTUACION_INCIAL);
            
            //Guardamos el jugador en una variable de sesión
            $this->session->JUGADOR = $jugador;
            
            //Los datos son correctos
            $validacion_correcta = true;
            
        }
        else {
            //Los datos NO son correctos
            $validacion_correcta = false;
        }
        
        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new OK();
        $ok->set_ok($validacion_correcta);
        
        //Creamos un vector donde enviaremos los parámetros necesarios para iniciar el juego
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["NUM_INTENTOS"] => $jugador->get_num_intentos(),
            Config_Pasapalabra::RESPONSE["PUNTUACION"] => $jugador->get_puntuacion()
        );
        
        //Enviamos la respuesta al cliente
        echo json_encode($response);
        
    }
    
    public function get_pregunta() {
        
        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {
            
            //Obtenemos la letra  dificultad de la palabra que queramos a obtener
            $jugador = $this->session->JUGADOR;
            
            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["PROCESSING"]) {
                
                $rosco_jugador = $jugador->get_rosco();
                $rosco_jugador->incrementar_index();
                $index = $rosco_jugador->getIndex();
                $letra_actual_rosco = $rosco_jugador->getLetra($index);
                $dificultad_rosco = $rosco_jugador->getDificultad_rosco();

                //Obtenemos la pregunta de la BD
                $pregunta = $this->Questions_model->getQuestion($letra_actual_rosco, 
                    $dificultad_rosco->get_dificultad_seleccionada());

                //Agregamos la pregunta al rosco e incrementamos el index para obtener
                $rosco_jugador->addPregunta($pregunta);
                $jugador->set_rosco($rosco_jugador);
                $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["ANSWERING"]);
                $this->session->JUGADOR = $jugador;
                
                //Todo es correcto
                $error = false;
                
            }
            else {
                $error = true;
            }  
        }
        else {
            $error = true;  
        }
        
        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new OK();
        $ok->set_ok(!$error);
        
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["PREGUNTA"] => $pregunta
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
        
    }
    
    public function comprobar_pregunta() {
        
    }
	
}
