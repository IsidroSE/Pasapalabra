<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Pasapalabra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!--
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> -->
        <script src="<?php echo base_url(); ?>assets/Webapp/js/jquery.min.js"></script>
        <link type="image/x-icon" href="<?php echo base_url(); ?>assets/images/logo.png" rel="icon" />
        <link type="image/x-icon" href="<?php echo base_url(); ?>assets/images/logo.png" rel="shortcut icon" />
        <link href="https://fonts.googleapis.com/css?family=Aclonica" rel="stylesheet">
        <link rel="stylesheet" href="<?php echo base_url(); ?>assets/Webapp/css/index_style.css">
    </head>
    <body>
        <section id="puntuacion">

            <article>
                <div><div class="datos_puntuacion" id="div_num_intentos">--</div><span>/10</span></div>
                <div>NUM. INTENTOS</div>
            </article>
            <article>
                <div class="datos_puntuacion" id="div_puntuacion">---</div>
                <div>PUNTOS</div>
            </article>
            <article>
                <div class="datos_puntuacion" id="div_tiempo_restante">00:00</div>
                <div>TIEMPO RESTANTE</div>
            </article>

        </section>

        <section id="juego">
            <article id="rosco">
                <div class="fondo_azul">A</div>
                <div class="fondo_azul">B</div>
                <div class="fondo_azul">C</div>
                <div class="fondo_azul">D</div>
                <div class="fondo_azul">E</div>
                <div class="fondo_azul">F</div>
                <div class="fondo_azul">G</div>
                <div class="fondo_azul">H</div>
                <div class="fondo_azul">I</div>
                <div class="fondo_azul">J</div>
                <div class="fondo_azul">K</div>
                <div class="fondo_azul">L</div>
                <div class="fondo_azul">M</div>
                <div class="fondo_azul">N</div>
                <div class="fondo_azul">Ñ</div>
                <div class="fondo_azul">O</div>
                <div class="fondo_azul">P</div>
                <div class="fondo_azul">Q</div>
                <div class="fondo_azul">R</div>
                <div class="fondo_azul">S</div>
                <div class="fondo_azul">T</div>
                <div class="fondo_azul">U</div>
                <div class="fondo_azul">V</div>
                <div class="fondo_azul">W</div>
                <div class="fondo_azul">X</div>
                <div class="fondo_azul">Y</div>
                <div class="fondo_azul">Z</div>
            </article>
            <article id="formulario_juego">
                
                <table>
                    <tr>
                        <td colspan="2">
                            <p id="p_posicion_letra">EMPIEZA POR LA A</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <p id="p_pregunta">un dels elements de l'opera</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input type="text" id="input_respuesta_pregunta" disabled="disabled"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#" class="myButton_enabled" id="boton_saltar">Saltar</a>
                        </td>
                        <td>
                            <a href="#" class="myButton_enabled" id="boton_comprobar">Comprobar</a>
                        </td>
                    </tr>
                </table>
                
            </article>
        </section>

        <section id="records">
            
            <h4>10 mejores resultados</h4>
            
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>10 mejores resultados</th>
                        <th>Puntos</th>
                        <th>Tiempo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Pepe</td>
                        <td>100</td>
                        <td>02:22 min.</td>
                        <td>05/03/2017</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Paco</td>
                        <td>100</td>
                        <td>02:36 min.</td>
                        <td>13/03/2017</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Palomo</td>
                        <td>100</td>
                        <td>03:59 min.</td>
                        <td>14/03/2017</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Tobías</td>
                        <td>90</td>
                        <td>02:49 min.</td>
                        <td>07/03/2017</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Alfonso</td>
                        <td>80</td>
                        <td>03:55 min.</td>
                        <td>01/03/2017</td>
                    </tr>
                </tbody>
            </table>
            
        </section>
        
        <section id="elegir_dificultad">
            
            <article id="info_juego">
                <div class="info_datos">
                    <p>05:00</p>
                    <p>TIEMPO MÁXIMO</p>
                </div>
                <div class="info_datos">
                    <p>10</p>
                    <p>NUM. INTENTOS</p>
                </div>
            </article>
            
            <article id="seleccion_dificultad">
                <p>
                    <span>Dificultad:</span>
                    <select id="select_dificultad">
                        <option value="11">Fácil</option>
                        <option value="12" selected="selected">Normal</option>
                        <option value="13">Difícil</option>
                    </select>
                </p>
                <a href="#" class="myButton_enabled" id="boton_seleccion_dificultad">Comenzar</a>
            </article>
            
            <article id="info_autor">
                <p>Autor: Isidro Sotoca Estruch</p>
            </article>
            
        </section>
        <script src="<?php echo base_url(); ?>assets/Webapp/js/index.js"></script>
        <?php
        // put your code here
        ?>
    </body>
</html>