var cookies = document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) =>
    ({...accumulator, [key.trim()]: decodeURIComponent(value) }),
    {});

console.log(cookies.id)

login_btn.addEventListener('click', (e) => {
  if (cookies.id !== ''){
    window.location.assign("e-GCMS_LoginAdmin.html");
  }
  else{
    window.location.assign("e-GCMS_Lihat Data.html");
  }
})

async function DataAdmin() {
    fetch("http://localhost:3000/api/Balita")
    .then((response) => response.json())
    .then((data) => {
        LoginAdminPosyandu(data.User)
        console.log(data.User)
    })
    .catch((error) => {
        console.log('not found', error);
    });
}


DataAdmin();

function LoginAdminPosyandu(dataposyandu) {
    sub_btn.addEventListener('click', (e) => {
        var email = document.getElementById('emailadmin').value;
        var password = document.getElementById('passadmin').value;
        var email_lower = email.toLowerCase()

        for (var x = 0; x < dataposyandu.length; x++) {
            uname = dataposyandu[x].username
            uname_lower = uname.toLowerCase()

            if (email_lower==uname_lower && password==dataposyandu[x].password) {
                alert('Akun posyandu berhasil masuk.');
                setCookie("id", dataposyandu[x].id, 1)

                window.location.assign("e-GCMS_Lihat Data.html");

                return;
            }
            if (x==(dataposyandu.length-1)){
                alert('Username atau Password tidak sesuai!');
            }
        }
        
    })
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();       //"expires=Thu, 01 Jan 1970 00:00:00 UTC"
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/*
function cek_login() {
    if (cookies.id !== ""){
        window.location.assign("e-GCMS_Lihat Data.html");
    } else {
        window.location.assign("e-GCMS_LoginAdmin.html")
    }
}
*/