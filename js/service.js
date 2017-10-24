var hostname = window.location.hostname;
var baseURL = window.location.pathname.split('/')[1];
var selected_study_uid;

function getSeriesData() {
  var studyId = $(this).attr('data-study-id');
  var url = 'api/service.php?action=getallseries&study_pk=' + studyId;
  $.getJSON(url, printSeries);
}

function getInstanceData() {
  var seriePk = $(this).attr('data-id');
  selected_serie_uid = $(this).attr('data-serie');

  var url = 'api/service.php?action=getallinstances&serie_pk=' + seriePk;
  // console.log(url);
  $.getJSON(url, showInstance);
}

function getInstitutionName(studyId) {
  var url = 'api/service.php?action=getInstitutionName&study_pk=' + studyId;
  // console.log(url);
  var res = $.ajax({
    url: url,
    async: false,
    dataType: 'jsone'
  });
  return $.parseJSON(res.responseText);
}

function generateRequestURL(study_UID, serie_UID, instance_UID, frame = 1) {
  // console.log(study_UID);
  // console.log(serie_UID);
  // console.log(instance_UID);
  // console.log(frame);
  // console.log(hostname);

  var url = 'http://' + hostname + ':8080/wado?requestType=WADO' + '&studyUID=' + study_UID + '&seriesUID=' + serie_UID + '&objectUID=' + instance_UID + '&frameNumber=' + frame;

  // console.log(url);
  return url;
}

function searchStudies(pat_id = '', pat_name = '', modality = '', from_date = '', to_date = '') {
  // console.log(from_date);
  url = 'api/service.php?action=searchstudies&id=' + pat_id + '&name=' + pat_name + '&modality=' + modality + '&from=' + from_date + '&to=' + to_date;
  console.log(url);

  $.getJSON(url, printStudies);
}

function searchStudyByDate(from_date, to_date) {
  searchStudies(undefined, undefined, undefined, from_date, to_date);
}

function generateWeasisUrl(type, id) {
  var url = 'http://' + hostname + ':8080/weasis-pacs-connector/viewer?';
  switch (type) {
    case 'patient':
      url += 'patientID=' + id;
      break;
    case 'serie':
      url += 'seriesUID=' + id;
      break;
    default:
      url = '#';
  }
  return url;
}

function getModalities() {}
// Help method

/*
var tableOffset = 20;
var $header = $("#patient-table > thead").clone();
var $fixedHeader = $(".header-fixed").append($header);
console.log(tableOffset);

$("#patient-table-div").bind("scroll", function() {
    var offset = $(this).scrollTop();
    console.log(offset);
    console.log(tableOffset);
    if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
        $fixedHeader.show();
    }
    else if (offset <= tableOffset) {
        $fixedHeader.hide();
    }
});
*/
