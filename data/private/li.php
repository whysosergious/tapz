<?php

	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
    $response = new \stdClass;
    $post_data = json_decode(file_get_contents('php://input'));
    $zcm = json_decode(file_get_contents('ZCM.json'));

    function staticEntryLoop($post_data, $zcm, $response) {
      foreach ( $zcm->{'users'} as $user ) {
        if ( $post_data->{'username'} === $user->{'username'} && $post_data->{'password'} === $user->{'password'} ) {
          $timestamp = time();
          $response->{'status'} = 'success';
          $response->{'sessiontoken'} = "st{$timestamp}{$user->{'id'}}";
          $response->{'userid'} = $user->{'id'};
          $response->{'zcm'} = $zcm;

          echo json_encode($response);
          return;
        }
      }
      $response->{'attempt'} = 'failed';
      echo json_encode($response);
    }
    staticEntryLoop($post_data, $zcm, $response);
  }

?>