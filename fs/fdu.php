<?php

  if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    $file = $_FILES['file']['tmp_name'];
    $file_path = $_POST['path'];
    $data_folder = '../data/';
    
    !is_dir($data_folder) && mkdir($data_folder, 0777);

    function uploadFormFile($file, $path) {
      move_uploaded_file($file, $path);
      // if ( move_uploaded_file($file, $path) ) {
      //   echo 'Done';
      // } else {
      //   echo 'Failed to upload';
      // }
    }
    uploadFormFile($file, $data_folder . $file_path);
  }
?>