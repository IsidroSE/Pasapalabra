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
        $this->load->model("Modelos_Pasapalabra/Playing_Time");
        $this->load->model("Modelos_Pasapalabra/Tiempo_Partida");
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
//        echo Config_Pasapalabra::NUM_INTENTOS_INICIAL;
//        echo Config_Pasapalabra::PUNTUACION_INCIAL;

        $tiempo_juego = $this->obtener_tiempo_juego(time(), (time() + (5 * 60)));
        echo $tiempo_juego->get_minutos() . "<br>";
        echo $tiempo_juego->get_segundos() . "<br>";
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
            
            //Guardamos el tiempo de cuando empieza el juego y el tiempo limite de la partida
            $tiempo_juego = new $this->Playing_Time();
            $tiempo_inicio = new DateTime();
            $tiempo_juego->set_tiempo_inicio($tiempo_inicio);
            $tiempo_juego->set_playing_time(true);
            
            $tiempo_maximo = clone $tiempo_inicio;
            $tiempo_maximo->modify('+5 minutes');
            $tiempo_juego->set_tiempo_maximo($tiempo_maximo);
            
            $jugador->set_playing_time($tiempo_juego);

            //Guardamos el jugador en una variable de sesión
            $this->session->JUGADOR = $jugador;

            //Los datos son correctos
            $validacion_correcta = true;
            
        } else {
            //Los datos NO son correctos
            $validacion_correcta = false;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new $this->OK();
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
                
                //Obtenemos el tiempo limite de la partida
                $playing_time = $jugador->get_playing_time();
                $tiempo_maximo = $playing_time->get_tiempo_maximo();
                
                //Obtenemos el tiempo actual
                $duracion_juego = new DateTime();
                $playing_time->set_duracion_juego($duracion_juego);
                
                //Comprobamos si aún queda tiempo
                $is_playing_time = $this->is_playing_time($tiempo_maximo, $duracion_juego);
                $playing_time->set_playing_time($is_playing_time, $duracion_juego);
                
                //Guardamos estos datos para futuras consultas
                $jugador->set_playing_time($playing_time);

                //Comprobaremos si aún queda tiempo para efectuar la acción
                if ($is_playing_time) {

                    //Obtenemos la letra de la palabra que queramos a obtener
                    $rosco_jugador = $jugador->get_rosco();
                    $letra_actual_rosco = $this->buscar_letra_siguiente($rosco_jugador);

                    //Si el rosco no esta lleno, extraeremos una nueva pregunta de la base de datos
                    if ($letra_actual_rosco != "") {

                        //Obtenemos la dificultad elegda por el jugador
                        $dificultad_rosco = $rosco_jugador->getDificultad_rosco();

                        /* Obtenemos una pregunta aleatoria de la BD que tenga esta letra y esta dificultad */
                        $pregunta = $this->Questions_model->getQuestion($letra_actual_rosco, $dificultad_rosco->get_dificultad_seleccionada());

                        //Agregamos la pregunta al rosco, cambiamos el gamestate y guardamos los cambios en la sesión
                        $rosco_jugador->addPregunta($pregunta);
                        $jugador->set_rosco($rosco_jugador);
                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["ANSWERING"]);
                        $this->session->JUGADOR = $jugador;
                        
                    }
                    //Si el rosco ya está lleno...
                    else {

                        //Buscaremos la siguiente pregunta sin contestar en el rosco
                        $rosco_jugador = $this->buscar_pregunta_siguiente($rosco_jugador);

                        //Si ha encontrado una pregunta sin contestar, se la pasaremos al jugador
                        if ($rosco_jugador->getIndex() != null) {

                            //Obtenemos el index de la siguiente pregunta sin contestar en el rosco
                            $index = $rosco_jugador->getIndex();

                            //Obtenemos la pregunta con el index indicado
                            $pregunta = $rosco_jugador->getPregunta($index);

                            //Y lo guardamos en la sección
                            $jugador->set_rosco($rosco_jugador);
                            $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["ANSWERING"]);
                            $this->session->JUGADOR = $jugador;
                        }
                        /* Si no se ha encontrado ninguna, la partida habrá terminado y habrá que avisar al jugador */ 
                        else {
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
                }
                //En el caso de que el tiempo se haya acabado, terminaremos la partida
                else {
                    $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["GAME_ENDED"]);
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

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["PLAYING_TIME"] => $playing_time,
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

    
    //Dado un rosco, busca la siguiente pregunta sin contestar
    private function buscar_pregunta_siguiente($rosco_jugador) {

        //Obtenemos el index actual del rosco
        $index = $rosco_jugador->getIndex();
        //Obtenemos todas las preguntas del rosco
        $preguntas = $rosco_jugador->getPreguntas();

        /* Recorremos todo el vector de preguntas a partir de la posición del index 
         * hasta la misma posición, osea que le daremos la vuelta completa al rosco */
        $i = $index;
        $index_siguiente_pregunta = null;
        do {

            /* Si el index + 1 es mayor que el count del vector, volveremos a la 
             * posición 0, así podremos seguir recorriendo preguntas hasta llegar 
             * al index inicial*/
            if ($i + 1 < count($rosco_jugador->getPreguntas())) {
                $i++;
            } else {
                $i = 0;
            }

            //Si la pregunta seleccionada no tiene definido el atributo "acertada", quiere decir que aún no ha sido contestada
            if ($preguntas[$i]->get_acertada() === null) {
                $index_siguiente_pregunta = $i;
                break;
            }
        } while ($index != $i);

        //Guardamos el index obtenido en el rosco y lo devolvemos
        $rosco_jugador->setIndex($index_siguiente_pregunta);

        return $rosco_jugador;
    }

    
    /* Petición de tipo POST a la que el cliente le enviará la respuesta a una 
     * pregunta para comprobar que la ha acertado o no. El método se encargará de 
     * buscar la pregunta que el jugador quiere contestar del rosco y comprobar la
     * respuesta del cliente con la solucion de la pregunta. */
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
                    $preguntas_rosco[$index]->set_respuesta_jugador($respuesta->get_respuesta());
                    $jugador->set_puntuacion($puntuacion);

                    //Cambiaremos el estado del juego según el resultado de la operación y actualizaremos el jugador en la sesión
                    if ($num_intentos > 0) {
                        $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["PROCESSING"]);
                    }
                    else {
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
        $ok = new $this->OK();
        $ok->set_ok(!$error);

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["JUGADOR"] => $jugador,
            Config_Pasapalabra::RESPONSE["ACERTAR"] => $resultado,
            Config_Pasapalabra::RESPONSE["GANAR"] => $ganar
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    
    /* Método privado que llamará comprobar_pregunta() para saber si la respuesta 
     * y la pregunta son iguales o no. El método ignorará los acentos y tratará las
     * letras mayúsculas y minúsculas de igual forma. */
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

    
    /* Petición de tipo GET a la que el cliente llamará cuando no quiera contestar 
     * a una pregunta. El método obtendrá la letra de la pregunta que el jugador
     * no quiere contestar, cambiará el estado del juego y devolverá al jugador le letra
     * de esta pregunta. */
    public function saltar_pregunta() {

        //Creamos un objeto acertar donde guardaremos el resultado de la operación
        $resultado = new $this->Acertar();

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["ANSWERING"]) {

                //Obtenemos la letra actual del rosco
                $rosco_jugador = $jugador->get_rosco();
                $index = $rosco_jugador->getIndex();
                $letra = $rosco_jugador->getLetra($index);

                //La guardamos para enviarsela al cliente
                $resultado->set_letra($letra);

                /* Y cambiaremos el estado del juego para que el cliente pueda 
                 * obtener otra pregunta en su respectiva petición AJAX */
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
        $ok = new $this->OK();
        $ok->set_ok(!$error);

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["ACERTAR"] => $resultado
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    
    /* Petición de tipo GET a la que el cliente llamará una vez se haya acabado 
     * el juego para obtener los resultados de la partida. */
    public function obtener_resultados() {

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["GAME_ENDED"]) {
                
                //Obtenemos el tiempo de inicio y el tiempo límite de la partida
                $playing_time = $jugador->get_playing_time();
                $tiempo_inicio = $playing_time->get_tiempo_inicio();
                $tiempo_maximo = $playing_time->get_tiempo_maximo();
                
                //Obtenemos el tiempo que ha durado la partida
                $tiempo_juego = $this->obtener_tiempo_juego($tiempo_inicio, $tiempo_maximo, new DateTime());
                
                //Lo guardamos en la sesion para no tener que volver a calcularlo
                $jugador->set_tiempo_partida($tiempo_juego);
                $this->session->JUGADOR = $jugador;
                
                /* Obtenemos el rosco y todas sus preguntas con sus soluciones 
                 * para enviarlas al jugador */
                $rosco_jugador = $jugador->get_rosco();
                $datos_preguntas = $this->get_all_questions($rosco_jugador->getPreguntas());

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

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok,
            Config_Pasapalabra::RESPONSE["JUGADOR"] => $jugador,
            Config_Pasapalabra::RESPONSE["TIEMPO_PARTIDA"] => $tiempo_juego,
            Config_Pasapalabra::RESPONSE["ROSCO"] => $datos_preguntas
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    
    /* Dado un rosco, devuelve todas sus preguntas en formato serializable para 
     * poder enviarlas al cliente */
    private function get_all_questions($preguntas) {

        $datos_preguntas = array();

        foreach ($preguntas as $pregunta) {

            $datos_preguntas[] = $pregunta->jsonSerialize_all();
        }

        return $datos_preguntas;
    }

    
    /* Petición de tipo GET a la que el cliente llamará antes de reiniciar el juego. 
     * El método destruirá la variable de sesión que guarda la información del usuario. */
    public function acabar_partida() {

        //Comprobamos si el jugador existe
        if (isset($this->session->JUGADOR)) {

            $jugador = $this->session->JUGADOR;

            if ($jugador->get_gameState() == Config_Pasapalabra::GAMESTATE["GAME_ENDED"]) {

                //Destruimos el jugador guardado en la sesión
                $jugador = null;
                $this->session->JUGADOR = $jugador;

                //Lo deshabilitaremos de la sesión
                $this->session->unset_userdata($this->session->JUGADOR);

                //Y destuiremos la sesión entera
                $this->session->sess_destroy();

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

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
    }

    
    //Método que comprobará si aún no se ha acabado el tiempo
    private function is_playing_time($tiempo_maximo, $duracion_juego) {
        
        /* Si la duración del juego es mayor que el tiempo límite, se habrá 
         * acabado el tiempo */
        if ($duracion_juego > $tiempo_maximo) {
            $playing_time = false;
        } else {
            $playing_time = true;
        }

        return $playing_time;
    }
    
    
    /* Dado un tiempo inicial, un tiempo límite y el tiempo del jugador, se
     * obtiene el tiempo que ha tardado el jugador en acabar la partida. */
    private function obtener_tiempo_juego($tiempo_inicial, $tiempo_maximo, $duracion_juego) {
        
        /* Si el tiempo del jugador es mayor que el tiempo límite, el tiempo final 
         * será el límite. De este modo si el tiempo límite son 5:00 minutos no 
         * podremos tener una partida de 5:05 minutos. */
        if ($duracion_juego > $tiempo_maximo) {
            $tiempo_final = $tiempo_maximo;
        }
        /* En caso contrario, el tiempo final será el tiempo que el jugador ha 
         * tardado en acabar la partida */
        else {
            $tiempo_final = $duracion_juego;
        }
        
        //Calculamos la diferencia entre el tiempo inicial y el tiempo final
        $interval = $tiempo_inicial->diff($tiempo_final);
        
        //Obtenemos de esta diferencia los minutos y segundos
        $minutos = $interval->format('%i');
        $segundos = $interval->format('%s');
                
        //Guardamos estos datos y los devolvemos
        $tiempo_juego = new $this->Tiempo_Partida();
        $tiempo_juego->set_minutos($minutos);
        $tiempo_juego->set_segundos($segundos);
        
        return $tiempo_juego;
        
    }
    
    /* Petición de tipo GET a la que el cliente llamará de forma automática si 
     * se acaba el tiempo en su timer local. La función terminará la partida 
     * también en el servidor. */
    public function finish_game() {
        
        if (isset($this->session->JUGADOR)) {
            
            $jugador = $this->session->JUGADOR;
            
            //Cambiaremos el estado del juego y actualizaremos el jugador en la sesión
            $jugador->set_gameState(Config_Pasapalabra::GAMESTATE["GAME_ENDED"]);
            $this->session->JUGADOR = $jugador;
            
            $error = false;
        } else {
            $error = true;
        }

        //Crearemos un objeto de la clase OK con el resultado de la validación
        $ok = new $this->OK();
        $ok->set_ok(!$error);

        //Preparemos la información que le enviaremos al cliente
        $response = array(
            Config_Pasapalabra::RESPONSE["OK"] => $ok
        );

        //Enviamos la respuesta al cliente
        echo json_encode($response);
        
    }

}
