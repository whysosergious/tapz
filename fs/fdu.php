<?php

  if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    $file = $_FILES['file']['tmp_name'];
    $file_path = $_POST['path'];
    $data_folder = '../data/';
    
    // TODO check isdir!!!
    function uploadFormFile($file, $path) {
      // if ( $type === 'b64' ) {
      //   $file = base64_decode(explode(',', $data->{'url'})[1]);
      //   file_put_contents($path, $file);
      // }

      if ( move_uploaded_file($file, $path) ) {
        echo 'Done';
      } else {
        echo 'Failed to upload';
      }
    }
    uploadFormFile($file, $data_folder . $file_path);
  }
  
  // uploadImages($_FILES['upload']['images']['image'], $data_folder2, 'b64');
?>