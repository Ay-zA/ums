<nav class="navbar navbar-inverse navbar-static-top no-margin-bottom" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">UMS-<span>PACS</span></a>


      <ul class="nav nav-xs visible-xs" style="float:left;">
        <li>
          <a id="all-xs" href="#">
            <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>All</a>
        </li>
        <li>
          <a id="today-xs" href="#">
            <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>Today</a>
        </li>
      </ul>
      <ul class="nav nav-xs visible-xs" style="float:right;">
        <li>
          <button type="button" class="searchButton btn btn-default navbar-btn"><span class="glyphicon glyphicon-search"></button>
          </li>
          <li>
            <button type="button" class="searchButton btn btn-default navbar-btn" onclick="window.open('php/logout.php');"><span class="glyphicon glyphicon-log-out"></button>
          </li>
        </ul>

      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li class="active hidden-xs">
            <a id="all" href="#"><div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>All</a>
    </li>
    <li class="hidden-xs">
      <a id="today" href="#">
        <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>Today</a>
    </li>
    <li>
      <a id="yesterday" href="#">
        <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>Yesterday</a>
    </li>
    <li>
      <a id="currentweek" href="#">
        <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>Currentweek</a>
    </li>
    <li>
      <a id="lastweek" href="#">
        <div class="ripples buttonRipples"><span class="ripplesCircle"></span></div>Lastweek</a>
    </li>
    </ul>
    <ul class="nav navbar-nav navbar-right hidden-xs">
      <li>
        <a class="searchButton" href="#">Search</a>
      </li>
      <li class="dropdown">
        <a href="php/logout.php">Logout</a>
      </li>
    </ul>
  </div>
  </div>
</nav>
