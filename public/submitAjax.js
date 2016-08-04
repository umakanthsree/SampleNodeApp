// $(function(){
		 	// 95a37b6434214428bae3d4a4d5deb386
$('#submitBtn').on('click',function(){
	var fN = $('#first_name').val();
	var lN = $('#last_name').val();
	var data ={
		'first_name' : fN,
		'last_name' : lN
	}
	console.log(data);
	$.ajax({
	  type: "POST",
	  contentType: 'application/json',
	  url: '/form_post',
	  data: JSON.stringify(data),
	  dataType: 'json'
	}).success(function(result){
		console.log(result);
		// $('#result').html(result.first_name + result.last_name);
		$('#result').html(result.result);
	});
});

		 // });