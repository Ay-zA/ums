<?php
static $char_set;
function connect($dbname)
{
    global $char_set;
    $servername = 'localhost';
    $username = 'root';
    $password = '';

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        echo 'Error: '.$e->getMessage();
        return;
    }
}

function getAllPatient()
{
    $conn = connect('pacsdb');
    $query = $conn->prepare('SELECT patient.pk, patient.pat_id, patient.pat_name, patient.pat_sex, study.num_series,
                          study.pk AS study_pk, study.mods_in_study, study.num_instances, study.study_iuid,
                          patient.pat_birthdate ,study.study_id, study.study_datetime, study.study_desc, study.study_status
                          FROM patient INNER JOIN study ON patient.pk = study.patient_fk ORDER BY study.study_datetime DESC;');
    $query->execute();
    $result = $query->fetchAll();

    return $result;
}

function searchByStudyId($studyId)
{
    $conn = connect('pacsdb');
    $query = $conn->prepare('SELECT patient.pk AS pat_pk, patient.pat_id, patient.pat_name, patient.pat_sex, study.pk AS study_pk,
                  study.study_id, study.study_datetime, study.study_desc, study.study_status
                  FROM patient INNER JOIN study ON patient.pk = study.patient_fk
                  WHERE  study.study_id = :study_id;');
    $query->bindParam(':study_id', $studyId);
    $query->execute();

    $result = $query->fetchAll();

    return $result;
}

function getStudyId($studyPk)
{
    $conn = connect('pacsdb');
    $query = $conn->prepare('SELECT study_iuid FROM study WHERE pk = :studyPk;');
    $query->bindParam(':studyPk', $studyPk);
    $query->execute();

    $result = $query->fetch(PDO::FETCH_ASSOC);

    return $result;
}

function getAllSeries($study_pk)
{
    $conn = connect('pacsdb');
    $query = $conn->prepare('SELECT series.pk, series.modality, series.body_part,
                                    series.num_instances, series.series_desc,
                                    series.study_fk, series.series_iuid
                           FROM series WHERE series.study_fk = :study_pk;');
    $query->bindParam(':study_pk', $study_pk);
    $query->execute();
    $result = $query->fetchAll();

    return $result;
}

function getAllInstances($serie_pk)
{
    $conn = connect('pacsdb');
    $query = $conn->prepare('SELECT instance.sop_iuid, instance.sop_cuid
                           FROM instance WHERE series_fk = :serie_pk;');
    $query->bindParam(':serie_pk', $serie_pk);
    $query->execute();
    $result = $query->fetchAll();

    return $result;
}

function searchStudies($patient_id = null, $name = null, $modality = null, $from = null, $to = null, $limit = 20, $offset = 0)
{
    global $char_set;
    $conn = connect('pacsdb');
    $limit = (int)$limit;
    $offset = (int)$offset;

    $query = 'SELECT patient.pk,
                     patient.pat_id,
                     patient.pat_name,
                     patient.pat_sex,
                     study.num_series,
                     study.pk AS study_pk,
                     study.mods_in_study,
                     study.num_instances,
                     study.study_iuid,
                     patient.pat_birthdate,
                     study.study_id,
                     study.study_datetime,
                     study.study_desc,
                     study.study_status
              FROM patient INNER JOIN study
              ON patient.pk = study.patient_fk';

    if (isset($patient_id)) {
        $patient_id = strtolower($patient_id);
        $query = $query.' AND LOWER(patient.pat_id) LIKE CONCAT (:id,"%")';
    }

    if (isset($name)) {
        $name = strtolower($name);
        $query = $query.' AND LOWER(patient.pat_name) LIKE CONCAT ("%",:name,"%")';
    }

    if (isset($modality)) {
        $modality = strtolower($modality);
        $query = $query.' AND LOWER(study.mods_in_study) LIKE CONCAT ("%",:modality,"%")';
    }

    if (isset($from)) {
        $query = $query.' AND study.study_datetime >= :from';
    }

    if (isset($to)) {
        $query = $query.' AND study.study_datetime <= :to';
    }

    $query = $query.' ORDER BY study.study_datetime DESC LIMIT :limit OFFSET :offset;';// LIMIT :limit OFFSET :offset;';
    $query = $conn->prepare($query);


    if (isset($patient_id)) {
        $query->bindParam(':id', $patient_id);
    }
    if (isset($name)) {
        $query->bindParam(':name', $name);
    }
    if (isset($modality)) {
        $query->bindParam(':modality', $modality);
    }
    if (isset($from)) {
        $query->bindParam(':from', $from);
    }
    if (isset($to)) {
        $query->bindParam(':to', $to);
    }

    $query->bindParam(':limit', $limit, PDO::PARAM_INT);
    $query->bindParam(':offset', $offset, PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll();
    return $result;
    // return $char_set . "_ci";
}

function getInstitutionName($study_pk)
{
    $conn = connect('pacsdb');
    $query = "SELECT series.institution FROM series WHERE series.study_fk = :study_pk ;";
    $query = $conn->prepare($query);

    $query->bindParam(':study_pk', $study_pk);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    return $result;
}
?>
