var thumb = $('#thumb-div');
var modal = $('#myModal .modal-body');
var modalHeader = $('#myModal .modal-title');
var patient_table = $('#patient-table tbody');
var series_table = $('#series-table tbody');
var result_section = $('#result-section');
var seriesSectionHeader = $('#result-section .section-header h4');

var series_data = new Object();
var instance_data = new Object();

function patientRowClicked() {
  clearInstance();
  var rows = $('#patient-table tbody tr');
  rows.removeClass('active');
  $(this).addClass('active');
}

function openWeasis(e) {
  var id = $(e.target)
    .closest('tr')
    .children('td[data-type="pat_id"]')
    .text();
  var url = generateWeasisUrl('patient', id);
  window.open(url);
}

function searchByInput() {
  var id = $('#searchById').val();
  var name = $('#searchByName').val();
  var modality = $('#searchByModality').val();
  var institution = $('#searchByInstitution').val();
  var from_date = $('#searchByFrom').val();
  var to_date = $('#searchByTo').val();

  from_date = is_valid_date(from_date) ? to_gregorian_date(from_date) : '';
  to_date = is_valid_date(to_date) ? to_gregorian_date(to_date) : '';

  searchStudies(id, name, modality, from_date, to_date);
}

function loadAll(e) {
  changeTab('#all');
  clearSearchInputs();
  clearInstance();
  searchStudies();
}

function loadToday() {
  changeTab('#today');
  var today = new Date();
  today = get_date(today);
  searchStudyByDate(today, today);
}

function loadYesterday() {
  changeTab('#yesterday');
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = get_date(yesterday);
  searchStudyByDate(yesterday, yesterday);
}

function loadWeek() {
  changeTab('#currentweek');

  var curr = new Date();
  var firstDayOfWeek = curr.getDate() - curr.getDay();
  var lastDayOfWeek = firstDayOfWeek + 6;

  firstDayOfWeek = new Date(curr.setDate(firstDayOfWeek));
  lastDayOfWeek = new Date(curr.setDate(lastDayOfWeek));

  firstDayOfWeek = get_date(firstDayOfWeek);
  lastDayOfWeek = get_date(lastDayOfWeek);

  searchStudyByDate(firstDayOfWeek, lastDayOfWeek);
}

function loadLastWeek() {
  changeTab('#lastweek');

  var curr = new Date();
  var firstDayOfWeek = curr.getDate() - curr.getDay() - 7;
  var lastDayOfWeek = firstDayOfWeek + 6;

  firstDayOfWeek = new Date(curr.setDate(firstDayOfWeek));
  lastDayOfWeek = new Date(curr.setDate(lastDayOfWeek));

  firstDayOfWeek = get_date(firstDayOfWeek);
  lastDayOfWeek = get_date(lastDayOfWeek);

  searchStudyByDate(firstDayOfWeek, lastDayOfWeek);
}

function serieRowClicked() {
  var rows = $('#series-table tbody tr');
  rows.removeClass('active');
  $(this).addClass('active');
}

function showInstance(data) {
  var output = '';
  $.each(data, function(i, obj) {
    var request = generateRequestURL(selected_study_uid, selected_serie_uid, obj.sop_iuid);
    output += '<div class="col-sm-12 full-height"><img class="img-responsive thumb-img" src="' + request + '" /></div>';
  });

  thumb.html(output);
  var $selected_serie = $('#series-table tbody tr.active');

  $selected_serie.attr('loaded', 'true');
  var seried_id = $selected_serie.attr('data-id');
  // console.log(seried_id);
  instance_data[seried_id] = output;
  // console.log(instance_data);
  var rowoutput = '<div class="row">' + output + '</div>';
  modal.html(rowoutput);
}

function loadInstanceData() {
  var $selected_serie = $('#series-table tbody tr.active');
  var serie_id = $selected_serie.attr('data-id');
  // console.log(serie_id);
  thumb.html(instance_data[serie_id]);

  var rowoutput = '<div class="row">' + instance_data[serie_id] + '</div>';
  modal.html(rowoutput);
}

function printSeries(data) {
  var output = '';

  $.each(data, function(i, obj) {
    output += '<tr loaded="false" data-id=' + obj.pk + ' data-serie=' + obj.series_iuid + '>';
    output += '<td>' + (obj.body_part !== null ? obj.body_part : 'N/A') + '</td>';
    output += '<td>' + obj.num_instances + '</td>';
    output += '<td>' + obj.series_desc + '</td>';
    output += '<td>' + obj.series_desc + '</td>';
    var url = generateWeasisUrl('serie', obj.series_iuid);
    output += '<td><a class="weasis-btn flat-btn" href="' + url + '"><span class="glyphicon glyphicon-eye-open"></span></button><td>';
    output += '</tr>';
  });
  var pat_name = $("#patient-table tr.active td[data-type='pat_name']").text();
  seriesSectionHeader.html(pat_name);
  modalHeader.html(pat_name);
  series_table.html(output);
  var $selected_patient = $('#patient-table tbody tr.active');
  $selected_patient.attr('loaded', 'true');

  var selected_patient_id = $selected_patient.children('td[data-type="pat_id"]').text();
  series_data[selected_patient_id] = output;
  showResultSection();
}

function loadSeriesData() {
  var $selected_patient = $('#patient-table tbody tr.active');
  var selected_patient_id = $selected_patient.children('td[data-type="pat_id"]').text();
  series_table.html(series_data[selected_patient_id]);
  showResultSection();
}

function printStudies(data) {
  console.log(':|');
  var page = 1;
  var page_size = 20;
  var output = '';
  for (var i = (page - 1) * page_size; i < page * page_size; i++) {
    if (!data[i]) break;

    output += '<tr loaded="false" data-iuid=' + data[i].study_iuid + ' data-study-id=' + data[i].study_pk + ' onclick="onSelectStudie(' + data[i].study_iuid + ');">';
    output += '<td data-type="pat_id">' + data[i]['pat_id'] + '</td>';
    output += '<td data-type="pat_name">' + fix_name(data[i]['pat_name']) + '</td>';

    var response = getInstitutionName(data[i]['study_pk']);
    var ins_name = response.institution != null ? fix_name(response.institution) : 'N/A';

    output += '<td data-type="institution">' + ins_name + '</td>';
    output += '<td data-type="modality">' + data[i]['mods_in_study'] + '</td>';
    output += '<td data-type="study_time">' + to_persian_date(data[i]['study_datetime']) + '</td>';
    output += '<td class="hidden-xs" data-type="num_series">' + data[i]['num_series'] + '</td>';
    output += '<td class="hidden-xs" data-type="num_instances">' + data[i]['num_instances'] + '</td>';
    var url = generateWeasisUrl('patient', data[i]['pat_id']);

    output += '<td><a class="weasis-btn flat-btn" href="' + url + '"><span class="glyphicon glyphicon-eye-open"></span></button><td>';
    output += '</tr>';
  }
  console.log(output);
  patient_table.html(output);
}

function onSelectStudie(iuid) {
  selected_study_uid = iuid;
}

function toggleModal(modalId) {
  $('#myModal').modal('toggle');
}

function clearInstance() {
  thumb.html('');
  modal.html('');
}

function changeTab(tab_id) {
  $('nav li>a')
    .parent()
    .removeClass('active');
  $(tab_id)
    .parent()
    .addClass('active');
  $(tab_id + '-xs')
    .parent()
    .addClass('active');
}

function hideResultSection() {
  $.when(result_section.fadeOut()).done(function() {
    $('#study-section').removeClass('under-result');
  });
}

function showResultSection() {
  result_section.fadeIn();
  $('#study-section').addClass('under-result');
}

function clearSearchInputs() {
  $('#search-from input').val('');
}

function hideSearchSection() {
  $('#search-section').slideUp();
}

function showSearchSection() {
  $('#search-section').slideDown();
}

function toggleSearchSection() {
  $('#search-section').slideToggle();
}

function closeNavbar(event) {
  var clickover = $(event.target);
  var _opened = $('.navbar-collapse').hasClass('in');
  if (_opened === true && !clickover.hasClass('navbar-toggle')) $('button.navbar-toggle').click();
}
