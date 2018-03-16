var jobs, edu, skillTags = [];
var accentText = "orange-text text-darken-2";

function reachedSection(parallaxElement){
	var img = $(parallaxElement).find('img.parallax-image')[0];
	$(img).addClass('focused');
}

function pastSection(parallaxElement){
	var img = $(parallaxElement).find('img.parallax-image')[0];
	$(img).removeClass('focused');
}

(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    Materialize.scrollFire([
    { selector: '#hd2', offset: 190, callback: reachedSection },
    { selector: '#hd2', offset: window.innerHeight, callback: pastSection },
    { selector: '#hd3', offset: 190, callback: reachedSection },
    { selector: '#hd3', offset: window.innerHeight, callback: pastSection },
    { selector: '#hd4', offset: 190, callback: reachedSection },
    { selector: '#hd4', offset: window.innerHeight, callback: pastSection }
    ]);

    fetchJobs();
    fetchEdu();

  }); // end of document ready
})(jQuery); // end of jQuery name space

function fetchEdu() {
	$.get('edu.js', function(data){
		edu = $.parseJSON(data);
		edu.map(readEdu);
	});
}

function readEdu(exp){
	if (!exp.show) return;
	var col = $('<div class="col m6 s12"></div>');
	var card = $('<div class="card-panel"></div>');
	card.append('<p class="center-align allcaps '+accentText+'">'+exp.major+'</p>');
	card.append('<p class="light tight left-align">'
		+exp.degree+' from '+exp.school
		+'</p><p class="light tight right-align">'
		+exp.start +' - ' + exp.end+'</p>');

	if (exp.extra.length > 0){
		var ul = $('<ul class="card-list"></ul>');
		for(var i=0; i<exp.extra.length; i++){
			 var club = exp.extra[i];
			 ul.append('<li class="light"><span class="'+accentText+'">'+club.position+'</span> of '+club.club+'</li>');
		}
		card.append(ul);
	}

	col.append(card);
	$('#schools').prepend(col);
}

function fetchJobs() {
	$.get('jobs.js', function(data){
		jobs = $.parseJSON(data);
		jobs = jobs.reverse();
		listJobs();
	}).fail(function(data){
		console.log('something bad happend!');
	});
}

function listJobs(){

	var jobsLength = jobs.length;
	var shortlist = 4;
	var col = $('<div class="col m6 s12"></div>');
	for(var i=0; i<shortlist; i++){
		$('#jobs').append( col.clone().append(readJob(jobs[i])) );
	}
	for(var j=shortlist; j<jobsLength; j++){
		$('#morejobs').append( col.clone().append(readJob(jobs[j])) );
	}

	$('#showmorejobs').click(function(){
		$('#morejobs').show();
		$(this).hide();
	});
}

function my(date){
	return dateFormat(date, 'mmm yyyy');
}

function readJob(job) {
	var jobCard = $('<div class="card job"></div>');

	var cardContent = $('<div class="card-content"></div>');
	var cardTitle = $('<p class="title center-align allcaps '+accentText+'"></p>');
	cardTitle.text(job.title);
	cardContent.append(cardTitle);

	var company = $('<p class="light tight left-align">');
	company.text(job.company);
	cardContent.append(company);

	var timeRange = $('<p class="light tight right-align"></p>');
	var end = job.end === 'NOW' ? job.end : my(job.end);
	var start = my(job.start);
	timeRange.text(start+' - '+end);
	cardContent.append(timeRange);

	var does = $('<ul class="card-list"></ul>');
	for(var i=0; i<job.details.length; i++){
		var li = $('<li class="light"></li>');
		li.text(job.details[i]);
		does.append(li);
	}
	cardContent.append(does);

	var tagSection = $('<div class="card-action light"></div>');

	jobCard.append(cardContent);
	jobCard.append(tagSection);
	tagSection.text(job.tags.join(", "));
	//registerSkills(job.tags, tagSection);

	return jobCard;
}

function registerSkills(tags, section){
	var len = tags.length;
	for(var t=0; t<len; t++){
		var tag = tags[t];
		var htag = $('<div class="chip"></div>');
			htag.text(tag);
		
		if(skillTags.indexOf(tag) === -1) {
			skillTags.push(tag);
			$('#skilltags').append(htag.clone());
		}
		
		section.append(htag);
	}
}