<!DOCTYPE html>
<html >
    <head>
        <meta charset="UTF-8">
        <title>Flat HTML5/CSS3 Login Form</title>
        <link type="image/x-icon" href="<?php echo base_url(); ?>assets/images/logo.png" rel="icon" />
        <link type="image/x-icon" href="<?php echo base_url(); ?>assets/images/logo.png" rel="shortcut icon" />
        <link rel="stylesheet" href="<?php echo base_url(); ?>assets/Webapp/css/login_style.css">
    </head>
    <body>
        <div class="login-page">
            <div class="form">
                <form class="login-form" method="post" action="<?php echo site_url("welcome/validar_usuario") ?>">
                    <img id="logo-login" src="<?php echo base_url(); ?>assets/images/banner.jpg" />
                    <input type="email" placeholder="Correo electrónico" name="user_email" required/>
                    <input type="password" placeholder="Contraseña" name="user_pass" required/>
                    <button>Ingresar</button>
                </form>
            </div>
        </div>
    </body>
</html>
