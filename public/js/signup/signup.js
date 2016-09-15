
$(function(){
  console.log("Running");
  $.validator.addMethod('pwCheck', function( val ){
    console.log( val );
    return (/[A-Z]/.test(val) && /[0-9]/.test(val));
  });
  $('.signup-form').validate({
    rules:{
      password:{
        required: true,
        pwCheck: true,
        minlength: 8
      },
      confirmPassword:{
        required: true,
        pwCheck: true,
        minlength:8,
        equalTo: '#password'
      }
    },
    messages:{
      password:{
        required: "Password is required",
        pwCheck: "Password needs at least one uppercase character and one number",
      },
      confirmPassword:{
        required: "Password is required",
        pwCheck: "Password needs at least one uppercase character and one number",
      }
    }

  });
});
