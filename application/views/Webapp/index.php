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
                <div class="fondo_azul" id="A">A</div>
                <div class="fondo_azul" id="B">B</div>
                <div class="fondo_azul" id="C">C</div>
                <div class="fondo_azul" id="D">D</div>
                <div class="fondo_azul" id="E">E</div>
                <div class="fondo_azul" id="F">F</div>
                <div class="fondo_azul" id="G">G</div>
                <div class="fondo_azul" id="H">H</div>
                <div class="fondo_azul" id="I">I</div>
                <div class="fondo_azul" id="J">J</div>
                <div class="fondo_azul" id="K">K</div>
                <div class="fondo_azul" id="L">L</div>
                <div class="fondo_azul" id="M">M</div>
                <div class="fondo_azul" id="N">N</div>
                <div class="fondo_azul" id="O">O</div>
                <div class="fondo_azul" id="P">P</div>
                <div class="fondo_azul" id="Q">Q</div>
                <div class="fondo_azul" id="R">R</div>
                <div class="fondo_azul" id="S">S</div>
                <div class="fondo_azul" id="T">T</div>
                <div class="fondo_azul" id="U">U</div>
                <div class="fondo_azul" id="V">V</div>
                <div class="fondo_azul" id="W">W</div>
                <div class="fondo_azul" id="X">X</div>
                <div class="fondo_azul" id="Y">Y</div>
                <div class="fondo_azul" id="Z">Z</div>
            </article>
            
            <article id="formulario_juego">
                
                <table>
                    <tr>
                        <td colspan="2">
                            <p id="p_posicion_letra">letra</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <p id="p_pregunta">descrpcion</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input type="text" id="input_respuesta_pregunta" disabled="disabled"/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div id="error_respuesta" class="error">Esto es un error.</div>
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
            
            <article id="resultados">
                
                <section id="resultado_container">
                    <div id="div_resultado">¡No te quedan intentos para seguir jugando!</div>
                </section>
                
                <section id="resultado_rosco">

                    <h4>Resultado:</h4>

                    <table>
                        <thead>
                            <tr>
                                <th>Letra</th>
                                <th>Definición</th>
                                <th>Solución</th>
                                <th>Respuesta del jugador</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>A</td>
                                <td>definicion pregunta</td>
                                <td>una solucion</td>
                                <td>V</td>
                            </tr>
                            <tr>
                                <td>B</td>
                                <td>definicion pregunta</td>
                                <td>una solucion</td>
                                <td>V</td>
                            </tr>
                            <tr>
                                <td>C</td>
                                <td>definicion pregunta</td>
                                <td>una solucion</td>
                                <td>V</td>
                            </tr>
                            <tr>
                                <td>D</td>
                                <td>definicion pregunta</td>
                                <td>una solucion</td>
                                <td>V</td>
                            </tr>
                            <tr>
                                <td>E</td>
                                <td>definicion pregunta</td>
                                <td>una solucion</td>
                                <td>V</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <a href="#" class="myButton_enabled" id="boton_nueva_partida">Nueva partida</a>

                </section>
                
                
            </article>
            
        </section>

        <section id="records">
            
            <h4>10 mejores resultados</h4>
            
            <select id="select_dificultad_record">
                <option value="201">Fácil</option>
                <option value="202" selected="selected">Normal</option>
                <option value="203">Difícil</option>
            </select>
            
            <table id="records_facil">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Puntos</th>
                        <th>Tiempo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        for ($x = 0; $x <= count($facil) - 1; $x++) {
                            echo "<tr>";
                            echo "<td>" . ($x+1) . "</td>";
                            echo "<td>" . $facil[$x]->record_player . "</td>";
                            echo "<td>" . $facil[$x]->record_points . "</td>";
                            $duracion = $facil[$x]->record_time . "";
                            echo "<td>" . substr($duracion, 3) . "</td>";
                            echo "<td>" . $facil[$x]->record_date . "</td>";
                            echo "</tr>";
                        }
                    ?>
                </tbody>
            </table>
            
            <table id="records_normal">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Puntos</th>
                        <th>Tiempo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        for ($x = 0; $x <= count($normal) - 1; $x++) {
                            echo "<tr>";
                            echo "<td>" . ($x+1) . "</td>";
                            echo "<td>" . $normal[$x]->record_player . "</td>";
                            echo "<td>" . $normal[$x]->record_points . "</td>";
                            $duracion = $normal[$x]->record_time . "";
                            echo "<td>" . substr($duracion, 3) . "</td>";
                            echo "<td>" . $normal[$x]->record_date . "</td>";
                            echo "</tr>";
                        }
                    ?>
                </tbody>
            </table>
            
            <table id="records_dificil">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Puntos</th>
                        <th>Tiempo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        for ($x = 0; $x <= count($dificil) - 1; $x++) {
                            echo "<tr>";
                            echo "<td>" . ($x+1) . "</td>";
                            echo "<td>" . $dificil[$x]->record_player . "</td>";
                            echo "<td>" . $dificil[$x]->record_points . "</td>";
                            $duracion = $dificil[$x]->record_time . "";
                            echo "<td>" . substr($duracion, 3) . "</td>";
                            echo "<td>" . $dificil[$x]->record_date . "</td>";
                            echo "</tr>";
                        }
                    ?>
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
        
        <section id="guardar_record_container">

            <section id="resultados_puntuacion">
                <article>
                    <div class="resultados_puntuacion" id="div_resultados_puntuacion">000</div>
                    <div>PUNTOS</div>
                </article>
                <article>
                    <div class="resultados_puntuacion" id="div_resultados_tiempo">00:00</div>
                    <div>TIEMPO</div>
                </article>
                <article>
                    <div>
                        <div class="resultados_puntuacion" id="div_resultados_intentos">00</div>
                        <span>/10</span>
                    </div>
                    <div>NUM. INTENTOS</div>
                </article>
            </section>

            <section id="guardar_record">
                <table>
                    <tr>
                        <td colspan="2">
                            <div>¿Quieres guardar tu record?</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input type="text" id="input_nick_introducido" placeholder="Escribe tu nick" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#" class="myButton_enabled" id="boton_no_guardar_record">No guardar</a>
                        </td>
                        <td>
                            <a href="#" class="myButton_enabled" id="boton_guardar_record">Guardar</a>
                        </td>
                    </tr>
                </table>
            </section>
            
        </section>
        
        <script src="<?php echo base_url(); ?>assets/Webapp/js/index.js"></script>
        <?php
        // put your code here
        ?>
    </body>
</html>
