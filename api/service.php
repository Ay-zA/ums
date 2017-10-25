<?php

  header('Content-Type: application/json');
  require_once "../php/db.php";
  require_once "../php/common.php";
  $response = "";

  function returnAllStudies()
  {
      $result = getAllPatient();
      return $result;
  }

  function returnAllSeries($study_pk)
  {
      $result = getAllSeries($study_pk);
      return $result;
  }

  function returnAllInstances($serie_pk)
  {
      $result = getAllInstances($serie_pk);
      return $result;
  }

  function returnInstitutionName($study_pk)
  {
      $result = getInstitutionName($study_pk);
      return $result;
  }

  if (isset($_GET['action'])) {
      $action = strtolower($_GET['action']);
      switch ($action) {
      case 'getinstitutionname':
        $response = returnInstitutionName($_GET['study_pk']);
        break;
      case 'getallseries':
        $response = returnAllSeries($_GET['study_pk']);
        break;
      case 'getallinstances':
        $response = returnAllInstances($_GET['serie_pk']);
        break;
      case 'getallstudies':
        $response = returnAllStudies();
        break;
      case 'searchstudies':
        // echo  $_GET['id'] . "<br>" . $_GET['name']. '<br> ' . $_GET['modality']. '<br> ' . $_GET['from']. '<br> ' . $_GET['to'];
        $id       = is_valid($_GET['id'])        ? $_GET['id']                 : null;
        $name     = is_valid($_GET['name'])      ? $_GET['name']               : null;
        $modality = is_valid($_GET['modality'])  ? $_GET['modality']           : null;
        $from     = is_valid($_GET['from'])      ? $_GET['from'] . ' 00:00:00' : null;
        $to       = is_valid($_GET['to'])        ? $_GET['to'] . ' 23:59:59'   : null;
        $limit    = is_valid($_GET['limit'])     ? $_GET['limit']              : 20;
        $offset   = is_valid($_GET['offset'])    ? $_GET['offset']             : 0;

        $response = searchStudies($id, $name, $modality, $from, $to, $limit, $offset);
        break;
    }
  }

 exit(json_encode($response));
