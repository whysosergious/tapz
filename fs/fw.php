<?php

	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

		// get manager settings
		// TODO separate this
		// $settings = json_decode(file_get_contents('../settings.json'));
		// $history_cap = $settings->{'history_cap'};
		// $app = $settings->{'active_app'};
		$history_cap = 10;

    // *** main
		// write to file
		function writeFile($folder, $file, $data) {
      $write = json_decode($data)->{'write'};
      if ( $write !== 'all' ) {
        $data = json_decode($data)->{$write};
      }
			$filename = $folder . $file;
			$filetask = fopen($filename, 'w');
			fwrite($filetask, $data);
			fclose($filetask);
		}


		// recieve json
		// TODO adapt for separate files ( pages, lazy loaded content, etc )
		$post_data = file_get_contents('php://input');
		$file_name = json_decode($post_data)->{'filename'};
    $save_history = json_decode($post_data)->{'history'};
    $dir = json_decode($post_data)->{'dir'};
		$file_ext = json_decode($post_data)->{'ext'};
		$full_file_name = $file_name . $file_ext;
		
		// folders .. folders
		$data_folder = $dir === 'root' ? "../data/" : "../data/{$dir}/";

    if ( $save_history ) {
      $history_folder = $dir === 'root' ? "../data/history/" : "../data/{$dir}/history";

      $history_data = file_exists( "{$data_folder}History{$full_file_name}" ) ? 
        json_decode(file_get_contents( "{$data_folder}History{$full_file_name}" )) : 
        [];
  
      $history_count = count($history_data);
      $history_entry['time_stamp'] = time();
      $history_entry['human_date'] = date('H:i - j/n/y', $history_entry['time_stamp']);
      $history_entry['file_name'] = $file_name . $history_entry['time_stamp'];
      $history_entry['file_ext'] = $file_ext;
  
  
      $history_data[] = $history_entry;
      if ( $history_count >= $history_cap ) {
        $oldest_file = "{$history_folder}{$history_data[0]->{'file_name'}}{$history_data[0]->{'file_ext'}}";
        unlink($oldest_file);
        array_splice($history_data, 0, 1);
      }

      !is_dir($history_folder) && mkdir($history_folder, 0777);
      writeFile($history_folder, "{$history_entry['file_name']}{$file_ext}", $post_data);
      writeFile($data_folder, "History{$full_file_name}", json_encode($history_data));
    }

    !is_dir($data_folder) && mkdir($data_folder, 0777);
		writeFile($data_folder, $full_file_name, $post_data);
  }
?>