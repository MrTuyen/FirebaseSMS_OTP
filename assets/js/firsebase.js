$(document).ready(() => {
    //toastr option
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }

    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyC2_nldZbtHdlCzTxd7MJElUPqqeIux6_Q",
        authDomain: "oauth-client-1602512905874.firebaseapp.com",
        projectId: "oauth-client-1602512905874",
        storageBucket: "oauth-client-1602512905874.appspot.com",
        messagingSenderId: "641314615471",
        appId: "1:641314615471:web:ad4e2c3356797c76f1645a",
        measurementId: "G-T6XDEXQLPX"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': function (response) {
              console.log(response);
              // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
      });
      onSignInSubmit();
})
function onSignInSubmit() {
    $('#verifPhNum').on('click', function() {
        let phoneNo = '';
        var code = $('#codeToVerify').val();
        console.log(code);
        if(!code || isNaN(code)) return toastr["error"]("please code... ")
        $(this).attr('disabled', 'disabled');
        $(this).text('Processing..');
        confirmationResult.confirm(code).then(function (result) {
            $(this).text('Verify Phone no')
            //process after success
            //call Xhr server ..
            toastr["success"]("Succecss verify phone")
            var user = result.user;
            console.log(user);
        }.bind($(this))).catch(function (error) {
            // error code ...
            toastr["error"]("Invalid Code")
            $(this).removeAttr('disabled');
            $(this).text('Invalid Code');
            console.log(error);
        }.bind($(this)));

    });


    $('#getcode').on('click', function () {
        var phoneNo = $('#number').val();
        if(!phoneNo) return toastr["error"]("please number phone")
        // call to firebase get code ....
        getCode(phoneNo);
        var appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNo, appVerifier)
        .then(function (confirmationResult) {
            window.confirmationResult=confirmationResult;
            coderesult=confirmationResult;
        }).catch(function (error) {
            console.log(error);
        });
    });
}



function getCode(phoneNumber) {
    var appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        $('#getcode').removeAttr('disabled');
        $('#getcode').text('RESEND');
    }).catch(function (error) {
        // error format number phone
        if(error.code == "auth/invalid-phone-number"){
            return toastr["error"]("error format number phone .. example : +84779330932")
        }
    });
}