
function databalita_p() {

    fetch("http://localhost:3000/api/Balita")
    .then((response) => response.json())
    .then((data) => {
        tambah(data.User)
    })
    .catch((error) => {
        console.log('not found', error);
    });
}

databalita_p()

function tambah(data) {

    var cookies = document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) =>
    ({...accumulator, [key.trim()]: decodeURIComponent(value) }),
    {});
    
const form = document.querySelector("#regis-balita")
form.addEventListener('submit', async (event) =>{
  //event.preventDefault()

  var id = document.getElementById("nomor_nik").value
  var kk = document.getElementById("KK").value
  var nama_balita = document.getElementById("nama_balita").value
  var birthdate = document.getElementById("tanggal_lahir").value
  var sex = document.querySelector('input[name="gender"]:checked').value;

  console.log(id + kk + nama_balita + birthdate)

  var j = data.findIndex(obj => obj.id==cookies.id);
  var puskesmas_id = data[j].puskesmasId

  let input_balita =
  {
    "id": id,
    "sex": sex,
    "kk": kk,
    "name": nama_balita,
    "birthDate": birthdate+"T00:00:00.000Z",
    "puskesmasId": puskesmas_id
  }

  fetch("http://localhost:3000/api/Balita",{
    method : 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(input_balita)
  })
  .then((response) => response.json())
  .then((teks) => {console.log(teks)})
  .catch(err => console.log(err));

  if (error) {
      alert('Penyimpanan gagal!')
  } else {
      alert('Data berhasil disimpan.')
      berhasil(submision);
      //window.location.assign("e-GCMS_Lihat Data.html");
  }

})
}
