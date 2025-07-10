<?php
$name=$_POST['name'];
$email=$_POST['email'];
$message=$_POST['message'];


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../libraries/PHPMailer/src/Exception.php';
require '../../libraries/PHPMailer/src/SMTP.php';
require '../../libraries/PHPMailer/src/PHPMailer.php';
require dirname(__DIR__, 2) . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2)); 
$dotenv->load();



$mail = new PHPMailer(true);

try {
    //Paramètres du serveur
    $mail->isSMTP();                                            // Envoi via SMTP
    $mail->Host       = 'smtp.gmail.com';                       // Définir le serveur SMTP à utiliser
    $mail->CharSet    = 'UTF-8';
    $mail->SMTPAuth   = true;                                   // Activer l'authentification SMTP 
    $mail->Username   = $_ENV['EMAIL_ADDRESS'];                 // Nom d'utilisateur SMTP 
    $mail->Password   = $_ENV['EMAIL_PASSWORD'];                // Mot de passe SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            
    $mail->Port       = 465;                                    

    //Destinataires
    $mail->setFrom($email, $name);
    $mail->addAddress($_ENV['EMAIL_ADDRESS_DESTINATION']);     //Ajouter un destinataire
    //$mail->addAddress('japheth@example.com');               //Le nom est facultatif
    $mail->addReplyTo($email,$name);
    /*$mail->addCC('cc@example.com');
    $mail->addBCC('bcc@example.com'); */

     /* //Pièces jointes 
    $mail->addAttachment('/var/tmp/file.tar.gz');         //Ajouter des pièces jointes
    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Le nom est facultatif */

    //Contenu
    $mail->isHTML(true);                                  // Définissez le format de l'e-mail sur HTML
    $mail->Subject = 'Sujet';
    $mail->Body    = $message;
    $mail->AltBody = 'Ceci est le corps en texte brut pour les clients de messagerie non-HTML';

    $mail->send();
    echo 'Votre message a bien été envoyé';
} catch (Exception $e) {
    echo "Votre message n'a pas pu être envoyé. Erreur Mailer : {$mail->ErrorInfo}";}