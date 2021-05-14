<?php

// if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
  $data_folder = '../data/menu/menu.pdf';
  $data_folder2 = '../data/menu/img.jpg';
  // $post_data = file_get_contents('php://input');
  
  print_r($_FILES);


  function uploadImages($data, $path, $type) {
    if ( $type === 'b64' ) {
      $file = base64_decode(explode(',', $data->{'url'})[1]);
      file_put_contents($path, $file);
    }

    if ( $type === 'pdf' ) {
      move_uploaded_file($file, $path);
    }
  }
  // uploadImages($_FILES['upload']['pdf']['tmp_name'], $data_folder, 'pdf');
  // uploadImages($_FILES['upload']['images']['image'], $data_folder2, 'b64');
?>