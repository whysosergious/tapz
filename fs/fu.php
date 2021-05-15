<?php

  if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    // $response = [];
    
    // recieve json
    // TODO adapt for separate files ( pages, lazy loaded content, etc )
    $post_data = json_decode(file_get_contents('php://input'));
    
    // dir
    // $dir = $post_data->{'dir'};
    // $data_folder = $dir === 'root' ? "../data/" : "../data/{$dir}/";


    $file = base64_decode(explode(',', $post_data->{'file'})[1]);
    file_put_contents('../data/' . $post_data->{'path'}, $file);


    function deleteFiles($data, $album) {
      $file_name = $data->{'file_name'};
      $file_ext = $data->{'file_ext'};
      $full_file_name = $file_name . $file_ext;

      unlink("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}");
    }

    function uploadImages($data, $album) {
			$file = explode( ',', $data->{'url'} );
			$file_name = $data->{'file_name'};
			$file_ext = $data->{'file_ext'};
			$full_file_name = $file_name . $file_ext;

			$data->{'url'} = "{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}";
			!is_dir("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}") && mkdir("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}", 0777);
			$decoded = base64_decode($file[1]);
			file_put_contents("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}", $decoded);
		}


    function staticEntryLoop($data_array, $pa='nomad') {
      
      
      function loop($data, $pa='nomad') {
        $album = $data[0]->{'album'} ?? $pa;
        foreach ($data as $entry) {
          deleteFiles($entry, $album);
          isset($entry->{'album'}) && loop($entry->{'sizes'}, $album);

        }
      }
      loop($data_array);
    }
    
    // staticEntryLoop($post_data->{'delete'});
  }
?>