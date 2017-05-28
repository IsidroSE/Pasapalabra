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
     * 	- or -
     * 		http://example.com/index.php/welcome/index
     * 	- or -
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
        $this->load->model("Modelos_Pasapalabra/Respuesta");
        $this->load->model("Modelos_Pasapalabra/Acertar");
        $this->load->model("Modelos_Pasapalabra/OK");
        $this->load->model("Modelos_Pasapalabra/Rosco");
        $this->load->model("Modelos_Pasapalabra/Jugador");
        $this->load->model("Modelos_Pasapalabra/Ganar");

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
            } else {
                redirect("login");
            }
        } else {
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
            $crud->set_relation('user_rol_id', 'roles', 'rol_name');

            $crud->display_as('user_name', 'Nombre de usuario')
                    ->display_as('user_email', 'Email')
                    ->display_as('user_password', 'Contraseña')
                    ->display_as('user_rol_id', 'Permisos');

            $crud->required_fields('user_email', 'user_password');

            $crud->callback_before_insert(array($this, 'hash_password_callback'));
            $crud->callback_before_update(array($this, 'hash_password_callback'));

            $datos['topic'] = 'usuarios';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        } else {
            redirect("login");
        }
    }

    //Devuelve un hash de la contraseña dada
    public function hash_password_callback($post_array) {
        $post_array['user_password'] = sha1($post_array['user_password']);
        return $post_array;
    }

    public function roles() {

        if ($this->session->has_userdata('email') && $this->session->rol == 1) {

            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("roles");

            $crud->display_as('rol_level', 'Nivel de permisos')
                    ->display_as('rol_name', 'Rol');

            $crud->required_fields('rol_name');

            $datos['topic'] = 'roles';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        } else {
            redirect("login");
        }
    }

    public function preguntas() {

        if ($this->session->has_userdata('email') && $this->session->rol <= 2) {

            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("questions");

            $crud->field_type('question_definition', 'text');
            $crud->unset_texteditor('question_definition', 'full_text');
            $crud->field_type('question_difficulty_level', 'enum', array("Fácil", "Normal", "Difícil"));

            $crud->display_as('question_letter', 'Letra')
                    ->display_as('question_difficulty_level', 'Dificultad')
                    ->display_as('question_definition', 'Definición')
                    ->display_as('question_answer', 'Solución');

            $crud->required_fields('question_letter', 'question_definition', 'question_answer');

            $datos['topic'] = 'preguntas';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        } else {
            redirect("login");
        }
    }

    public function records_jugadores() {

        if ($this->session->has_userdata('email') && $this->session->rol == 1) {

            $crud = new Grocery_CRUD();
            $crud->set_theme('datatables');
            $crud->set_table("records");

            $crud->display_as('record_player', 'Jugador')
                    ->display_as('record_points', 'Puntos obtenidos')
                    ->display_as('record_time', 'Tiempo tardado')
                    ->display_as('record_date', 'Fecha');

            $crud->required_fields('record_player', 'record_points', 'record_time');

            $datos['topic'] = 'records_jugadores';
            $datos['output'] = $crud->render();

            $this->load->view('frontoffice/vm_grocery_crud', $datos);
        } else {
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

    /* Mediante una petición AJAX desde el cliente, el cual envia un JSON con la 
     * dificultad elegida por el jugador, crea un rosco vacío que iremos llenando
     * conforme avance el juego. */

    public function empezar_juego() {

        //Obtiene el JSON recibido de la petición AJAX
        $json = file_get_contents('php://input');

        /* Se le pasa como parámetro un JSON con la dificultad seleccionada y lo 
         * convierte en un objeto Dificultad. */
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
        } else {
            //Los datos NO son correctos
            $validacion_correcta = false;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new OK();
        $ok->set_ok($validacion_correcta);

        //Creamos un vector donde enviaremos los parámetros necesarios para iniciar el juego
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["JUGADOR"] => $jugador
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    /* Petición de tipo GET que enviará el cliente mediante AJAX para obtener la siguiente pregunta. El método
      se encargará de buscar la pregunta correspondiente según la letra por la que vaya el jugador. */

    public function get_pregunta() {

        $ganar = new $this->Ganar();
        $pregunta = null;

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            //Obtenemos el jugador existente
            $jugador = $this->session->JUGADOR;

            //Comprobamos que el jugador está en el estado correcto
            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["PROCESSING"]) {

                //Obtenemos la letra de la palabra que queramos a obtener
                $rosco_jugador = $jugador->get_rosco();
                $letra_actual_rosco = $this->buscar_letra_siguiente($rosco_jugador);

                //Si el rosco no esta lleno, extraeremos una nueva pregunta de la base de datos
                if ($letra_actual_rosco != "") {

                    $dificultad_rosco = $rosco_jugador->getDificultad_rosco();

                    /* Obtenemos una pregunta aleatoria de la BD que tenga esta letra y esta dificultad */
                    $pregunta = $this->Questions_model->getQuestion($letra_actual_rosco, $dificultad_rosco->get_dificultad_seleccionada());

                    //Agregamos la pregunta al rosco, cambiamos su gamestate y guardamos los cambios en la sesión
                    $rosco_jugador->addPregunta($pregunta);
                    $jugador->set_rosco($rosco_jugador);
                    $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["ANSWERING"]);
                    $this->session->JUGADOR = $jugador;
                }
                //Si el rosco ya está lleno, buscaremos la siguiente pregunta sin contestar en el rosco
                else {

                    $rosco_jugador = $this->buscar_pregunta_siguiente($rosco_jugador);

                    //Si ha encontrado una pregunta sin contestar, se la pasaremos al jugador
                    if ($rosco_jugador->getIndex() != null) {

                        //Obtenemos el index de la siguiente pregunta sin contestar en el rosco
                        $index = $rosco_jugador->getIndex();

                        //Obtenemos la pregunta con el index indicado
                        $pregunta = $rosco_jugador->getPregunta($index);

                        $jugador->set_rosco($rosco_jugador);
                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["ANSWERING"]);
                        $this->session->JUGADOR = $jugador;
                    }
                    /* Si no se ha encontrado ninguna, la partida habrá terminado y habrá que avisar al jugador
                     * de que la partida ha terminado */ else {

                        //Ha ganado
                        if ($jugador->get_num_intentos() > 0) {
                            $ganar->set_ganar(true);
                        }
                        //Ha perdido
                        else {
                            $ganar->set_ganar(false);
                        }

                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["GAME_ENDED"]);
                    }
                }

                //Todo es correcto
                $error = false;
            } else {
                $error = true;
            }
        } else {
            $error = true;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new $this->OK();
        $ok->set_ok(!$error);

        //Creamos un vector donde enviaremos un objeto ok y una pregunta
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["PREGUNTA"] => $pregunta,
            Config_Pasapalabra::RESPONSE["GANAR"] => $ganar
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    /* Busca la letra de la siguiente pregunta en el rosco. En el caso de que el rosco ya esté lleno, 
     * devolverá un string vacío. */

    private function buscar_letra_siguiente($rosco_jugador) {

        /* En el caso de que el rosco aún no esté completo, incrementaremos el index y lo usaremos para 
          obtener la siguiente letra del abecedario */
        if (count($rosco_jugador->getPreguntas()) < count($rosco_jugador->getLetras())) {
            $rosco_jugador->incrementar_index();
            $index = $rosco_jugador->getIndex();
            $letra_actual_rosco = $rosco_jugador->getLetra($index);
        } else {
            $letra_actual_rosco = "";
        }

        return $letra_actual_rosco;
    }

    private function buscar_pregunta_siguiente($rosco_jugador) {

        $index = $rosco_jugador->getIndex();
        $preguntas = $rosco_jugador->getPreguntas();

        $i = $index;
        $index_siguiente_pregunta = null;
        do {

            if ($i + 1 < count($rosco_jugador->getPreguntas())) {
                $i++;
            } else {
                $i = 0;
            }

            if ($preguntas[$i]->get_acertada() === null) {
                $index_siguiente_pregunta = $i;
                break;
            }
        } while ($index != $i);

        $rosco_jugador->setIndex($index_siguiente_pregunta);

        return $rosco_jugador;
    }

    public function comprobar_pregunta() {

        //Creamos un objeto acertar donde guardaremos el resultado de la operación
        $resultado = new $this->Acertar();
        $ganar = new $this->Ganar();

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["ANSWERING"]) {

                /* Obtenemos la letra de la pregunta para asegurarnos de que el jugador está por la misma
                  pregunta que le hemos asignado y no en otra */
                $rosco_jugador = $jugador->get_rosco();
                $index = $rosco_jugador->getIndex();
                $preguntas_rosco = $rosco_jugador->getPreguntas();
                $pregunta_actual_rosco = $preguntas_rosco[$index];


                //Obtiene el JSON obtenido de la petición AJAX
                $json = file_get_contents('php://input');

                //Convertimos el json en la respuesta enviada por el jugador
                $respuesta = Respuesta::createFromJson($json);

                /* Comprobamos si la letra de la pregunta que quiere contestar el jugador es la misma que 
                 * la que tiene el servidor, en el caso de que sea la misma, procederemos a comprobar la
                 * respuesta, en caso de que sean diferentes querra decir que algo ha salido mal y enviaremos
                 * un error */
                if ($pregunta_actual_rosco->get_letra() == $respuesta->get_letra()) {

                    //Verificamos si la respuesta es correcta
                    $acertar = $this->verificar_respuesta($pregunta_actual_rosco, $respuesta);

                    //Obtendremos la puntuación del jugador
                    $puntuacion = $jugador->get_puntuacion();

                    /* Comprobaremos si la pregunta fue acertada o no y se actualizaran el número de
                     *  intentos y puntuaciones */
                    $num_intentos = $jugador->get_num_intentos();
                    if ($acertar) {
                        $puntuacion += 10;
                    } else {
                        $puntuacion -= 10;
                        $num_intentos--;
                        $jugador->set_num_intentos($num_intentos);
                    }

                    //Guardaremos en el rosco si esta pregunta ha sido acertada o no y la puntuación del jugador
                    $preguntas_rosco[$index]->set_acertada($acertar);
                    $jugador->set_puntuacion($puntuacion);

                    //Cambiaremos el estado del juego y actualizaremos el jugador en la sesión
                    if ($num_intentos > 0) {
                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["PROCESSING"]);
                    } else {
                        $ganar->set_ganar(false);
                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["GAME_ENDED"]);
                    }
                    $this->session->JUGADOR = $jugador;

                    /* Obtenemos la letra de la pregunta y lo guardamos en el objeto Acertar 
                     * creado anteriormente junto con el resultado */
                    $letra = $respuesta->get_letra();
                    $resultado->set_letra($letra);
                    $resultado->set_acertar($acertar);

                    //Todo es correcto
                    $error = false;
                } else {
                    $error = true;
                }
            } else {
                $error = true;
            }
        } else {
            $error = true;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new OK();
        $ok->set_ok(!$error);

        /* Creamos un vector donde enviaremos el número de intentos, puntuación y si se ha acertado 
         * o no la pregunta para que se actualice en le cliente */
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["JUGADOR"] => $jugador,
            Config_Pasapalabra::RESPONSE["ACERTAR"] => $resultado,
            Config_Pasapalabra::RESPONSE["GANAR"] => $ganar
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    //Método privado que llamará comprobar_pregunta() para saber si la respuesta y la pregunta son iguales o no
    private function verificar_respuesta($pregunta, $respuesta) {

        $no_permitidas = array(
            "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ñ", "À", "Ã", "Ì", "Ò", "Ù", "Ã™",
            "Ã ", "Ã¨", "Ã¬", "Ã²", "Ã¹", "ç", "Ç", "Ã¢", "ê", "Ã®", "Ã´", "Ã»", "Ã‚", "ÃŠ", "ÃŽ",
            "Ã”", "Ã›", "ü", "Ã¶", "Ã–", "Ã¯", "Ã¤", "«", "Ò", "Ã", "Ã„", "Ã‹");

        $permitidas = array(
            "a", "e", "i", "o", "u", "A", "E", "I", "O", "U", "n", "N", "A", "E", "I", "O", "U",
            "a", "e", "i", "o", "u", "c", "C", "a", "e", "i", "o", "u", "A", "E", "I", "O", "U",
            "u", "o", "O", "i", "a", "e", "U", "I", "A", "E");

        $_solucion = str_replace($no_permitidas, $permitidas, $pregunta->get_solucion());
        $_respuesta = str_replace($no_permitidas, $permitidas, $respuesta->get_respuesta());

        if (strcasecmp($_solucion, $_respuesta) == 0) {
            $acertar = true;
        } else {
            $acertar = false;
        }

        return $acertar;
    }

    public function saltar_pregunta() {

        //Creamos un objeto acertar donde guardaremos el resultado de la operación
        $resultado = new $this->Acertar();

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["ANSWERING"]) {

                $rosco_jugador = $jugador->get_rosco();
                $index = $rosco_jugador->getIndex();
                $letra = $rosco_jugador->getLetra($index);

                $resultado->set_letra($letra);

                //Cambiaremos el estado del juego y actualizaremos el jugador en la sesión
                $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["PROCESSING"]);
                $this->session->JUGADOR = $jugador;

                $error = false;
            } else {
                $error = true;
            }
        } else {
            $error = true;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new OK();
        $ok->set_ok(!$error);

        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["ACERTAR"] => $resultado
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    public function obtener_resultados() {

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["GAME_ENDED"]) {
                
                $rosco_jugador = $jugador->get_rosco();
                $datos_preguntas = $this->get_all_questions($rosco_jugador->getPreguntas());
                
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

        /* Creamos un vector donde enviaremos el número de intentos, puntuación y si se ha acertado 
         * o no la pregunta para que se actualice en le cliente */
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["JUGADOR"] => $jugador,
            Config_Pasapalabra::RESPONSE["ROSCO"] => $datos_preguntas
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }
    
    private function get_all_questions($preguntas) {
        
        $datos_preguntas = array();
        
        foreach ($preguntas as $pregunta) {
            
            $datos_preguntas[] = $pregunta->jsonSerialize_all();
            
        }
        
        return $datos_preguntas;
        
    }

}
