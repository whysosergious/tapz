<?php

  if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
    
    // recieve json
    // TODO adapt for separate files ( pages, lazy loaded content, etc )
    $post_data = json_decode(file_get_contents('php://input'));
    
    $dir = $post_data->{'dir'};
    $data_folder = $dir === 'root' ? "../data/" : "../data/{$dir}/";
    !is_dir($data_folder) && mkdir($data_folder, 0777);

    $files_to_delete = $post_data->{'delete'};
    $files_to_upload = $post_data->{'upload'};

    function deleteEntryLoop($files) {
      function delete($files) {
        foreach ($files as $file) {
          unlink("{$GLOBALS['data_folder']}{$file}");
        }
      }
      delete($files);
    }

    function uploadBase64EntryLoop($data) {
      function upload($data) {
        foreach ($data as $file_data) {
          $file = base64_decode(explode( ',', $file_data->{'file'} )[1]);
          $path = $GLOBALS['data_folder'] . $file_data->{'path'};
          file_put_contents($path, $file);
        }
      }
      upload($data);
    }
    
    deleteEntryLoop($files_to_delete);
    uploadBase64EntryLoop($files_to_upload);
  }
?>