

function databalita_p() {
  fetch("http://localhost:3000/api/balita")
  .then((response) => response.json())
  .then((data) => {
    banner(data.User, data.Puskesmas)
    detail(data.Balita)
    grafik_berat(data.Measurements, data.Balita)
    //status_bb_u(data.status)
    //status_tb_u(data.status)
    //status_bb_tb(data.status)
    console.log(data.Balita)
  })
  .catch((error) => {
      console.log('not found', error);
  });

}

function coba() {
  fetch('./klasifikasi/wfa_girls_0-to-5-years_zscores.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    });
}

databalita_p();
//coba();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var x = urlParams.get('id')


var cookies = document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) =>
    ({...accumulator, [key.trim()]: decodeURIComponent(value) }),
    {});


async function detail(data) {

  var j = data.findIndex(obj => obj.id==x);
  //console.log("index detail = " + j)
  //console.log(data[j])

  var mdate = data[j].birthDate;  
  var dobYear = parseInt(mdate.substring(0,4), 10);  
  var dobMonth = parseInt(mdate.substring(5,7), 10);  
  var dobDate = parseInt(mdate.substring(8,10), 10);  

  var today = new Date();   
  var birthday = new Date(dobYear, dobMonth-1, dobDate);

  var diffInMillisecond = today.valueOf() - birthday.valueOf();        
  var year_age = Math.floor(diffInMillisecond / 31536000000);  
  var day_age = Math.floor((diffInMillisecond % 31536000000) / 86400000);

  var month_age = Math.floor(day_age/30);          
  day_ageday_age = day_age % 30;  
          
  var tMnt= (month_age + (year_age*12));  
  var tDays =(tMnt*30) + day_age;

  var mainContainer = document.getElementById("biobalita");
  mainContainer.innerHTML=`
  <h1 id="namabalita">${data[j].name}</h1>

  <table>
    <tr>
      <th>No. KK</th>
      <th>:</th>
      <th>${data[j].kk}</th>
    </tr>

    <tr>
      <th>NIK</th>
      <th>:</th>
      <th>${data[j].id}</th>
    </tr>

    <tr>
      <th>Usia</th>
      <th>:</th>
      <th>${year_age} tahun ${month_age} bulan</th>
    </tr> 

    <tr>
      <th>JK</th>
      <th>:</th>
      <th>${data[j].sex}</th>
    </tr>
  </table>

  <a href="e-GCMS_EditBalita.html" class="btnew" id="btn_update">Edit Data</a>`

}



function grafik_berat(data, data2) {

  console.log(data.length)

  berat = []
  usia = []
  tinggi = []

  for (var i = 0; i < data.length; i++) {
    //console.log(data[i].balitaId)
    if (data[i].balitaId == x) {
      berat.push(data[i].weight)
      usia.push(data[i].ageInMonth)
      tinggi.push(data[i].height)

      var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      function convertDate(date_str) {
        temp_date = date_str.split("-");
        return temp_date[2] + " " + months[Number(temp_date[1]) - 1] + " " + temp_date[0];
      }

      let tgl_ukur = data[i].timestamp ? data[i].timestamp.substring(0, 10): "";
      var age = data[i].ageInMonth / 12
      parseInt(age)
      var ageInMonth = data[i].ageInMonth % 12

      var mainContainer = document.getElementById("BioBalita");
      mainContainer.innerHTML+= `
        <div class="table-sortable">
                <td>${convertDate(tgl_ukur)}</td>
                <td>${parseInt(age)} tahun ${ageInMonth} bulan</td>
                <td>${data[i].weight} kg</td>
                <td>${data[i].height} cm</td>
        </div>`
    }
  }

  //console.log(berat)
  //console.log(usia)
  //console.log(tinggi)
  update_bb_u(data, data2)
  update_tb_u(data, data2)
  update_bb_tb(data, data2)


  //usia = usia.map(i => i + ' bulan')
  var ctx = document.getElementById('lineChartBer').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: usia,
      datasets: [{
        label: 'Berat Badan (kg)',
        data: berat,
        backgroundColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });

  var ctx = document.getElementById('lineChartTing').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: usia,
      datasets: [{
        label: 'Tinggi Badan (cm)',
        data: tinggi,
        backgroundColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });

  //tinggi = tinggi.map(i => i + ' cm')
  var ctx = document.getElementById('lineChartBerTing').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tinggi,
      datasets: [{
        label: 'Berat Badan (kg)',
        data: berat,
        backgroundColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderColor: [
          'rgba(29, 13, 236, 0.6)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });

}



//////////////////////////////////////////////////////////////////////////////////
/////////// BERAT BADAN TERHADAP UMUR ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function update_bb_u(data, data2) {
  var j = data2.findIndex(obj => obj.id == x);
  if (data2[j].sex == 'P') {
    fetch('./klasifikasi/wfa_girls_0-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_bb_u = bb_u_girls(data, json)
        console.log("status_tb_u_girls: " + status_bb_u)
        fe_bb_u(status_bb_u)
      })
  } else if (data2[j].sex == 'L') {
    fetch('./klasifikasi/wfa_boys_0-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_bb_u = bb_u_boys(data, json)
        console.log("status_tb_u_boys: " + status_bb_u)
        fe_bb_u(status_bb_u)
      });
  }
}
function bb_u_girls(data, json) {
  b = berat.length-1
  if (data[b].weight > json[usia[b]].SD2) {
    return "Gizi Lebih"
  } else if (data[b].weight >= json[usia[b]].SD2neg) {
    return "Gizi Baik"
  } else if (data[b].weight >= json[usia[b]].SD3neg) {
    return "Gizi Kurang"
  } else {
    return "Gizi Buruk"
  }
}
function bb_u_boys(data, json) {
  b = berat.length-1
  if (data[b].weight > json[usia[b]].SD2) {
    return "Gizi Lebih"
  } else if (data[b].weight >= json[usia[b]].SD2neg) {
    return "Gizi Baik"
  } else if (data[b].weight >= json[usia[b]].SD3neg) {
    return "Gizi Kurang"
  } else {
    return "Gizi Buruk"
  }
}
function fe_bb_u(status) {
  var kategori = document.getElementById("status_balita");
  if(status == 'Gizi Lebih') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn1">Gizi Lebih</div>
    `
  }
  if(status == 'Gizi Baik') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn2">Gizi Baik</div>
    `
  }
  if(status == 'Gizi Kurang') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Gizi Kurang</div>
    `
  }
  if(status == 'Gizi Buruk') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Gizi Buruk</div>
    `
  }
}



//////////////////////////////////////////////////////////////////////////////////
/////////// TINGGI BADAN TERHADAP UMUR ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function update_tb_u(data, data2) {
  var j = data2.findIndex(obj => obj.id == x);
  if (data2[j].sex == 'P') {
    fetch('./klasifikasi/lhfa_girls_2-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_tb_u = tb_u_girls(data, json)
        console.log("status_tb_u_girls: " + status_tb_u)
        fe_tb_u(status_tb_u)
      });
  } else if (data2[j].sex == 'L') {
    fetch('./klasifikasi/lhfa_boys_2-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_tb_u = tb_u_boys(data,json)
        console.log("status_tb_u_boys: " + status_tb_u)
        fe_tb_u(status_tb_u)
      });
  }
}

function tb_u_girls(data, json) {
  s = tinggi.length-1
  bulan = usia[b] - 24
  if (data[s].height > json[bulan].SD2) {
    return "Tinggi"
  } else if (data[s].height >= json[bulan].SD2neg) {
    return "Normal"
  } else if (data[s].height >= json[bulan].SD3neg) {
    return "Pendek"
  } else {
    return "Sangat Pendek"
  }
}

function tb_u_boys(data, json) {
  s = tinggi.length-1
  bulan = usia[b] - 24
  if (data[s].height > json[bulan].SD2) {
    return "Tinggi"
  } else if (data[s].height >= json[bulan].SD2neg) {
    return "Normal"
  } else if (data[s].height >= json[bulan].SD3neg) {
    return "Pendek"
  } else {
    return "Sangat Pendek"
  }
}

function fe_tb_u(status) {
  var kategori = document.getElementById("status_balita_tbu");
  if(status == 'Sangat Pendek') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn1">Sangat Pendek</div>
    `
  }
  if(status == 'Pendek') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn2">Pendek</div>
    `
  }
  if(status == 'Normal') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Normal</div>
    `
  }
  if(status == 'Tinggi') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Tinggi</div>
    `
  }
}



//////////////////////////////////////////////////////////////////////////////////
/////////// BERAT BADAN TERHADAP TINGGI BADAN ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function update_bb_tb(data, data2) {
  var j = data2.findIndex(obj => obj.id == x);
  if (data2[j].sex == 'P') {
    fetch('./klasifikasi/wfh_girls_2-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_bb_tb = bb_tb_girls(data, json)
        console.log("status_bb_tb_girls: " + status_bb_tb)
        fe_bb_tb(status_bb_tb)
        //window.location.reload();
      });
  } else if (data2[j].sex == 'L') {
    fetch('./klasifikasi/wfh_boys_2-to-5-years_zscores.json')
      .then((response) => response.json())
      .then((json) => {
        var status_bb_tb = bb_tb_boys(data, json)
        console.log("status_bb_tb_boys: " + status_bb_tb)
        fe_bb_tb(status_bb_tb)
        //window.location.reload();
      });
  }
}

function bb_tb_girls(data, json) {
  for (let i = 0; i < json.length; i++) {
    s = tinggi.length - 1
    if (data[s].height <= json[i].Height) {
      var hasil
      if (data[s].weight > json[i].SD2) {
        return hasil = "Gemuk"
      } else if (data[s].weight >= json[i].SD2neg) {
        return hasil = "Normal"
      } else if (data[s].weight >= json[i].SD3neg) {
        return hasil = "Kurus"
      } else {
        return hasil = "Kurus Sekali"
      }
    } else {
    }
  }
}

function bb_tb_boys(data, json) {
  for (let i = 0; i < json.length; i++) {
    s = height.length - 1
    if (data[s].height <= json[i].Height) {
      var hasil
      if (data[s].weight > json[i].SD2) {
        return hasil = "Gemuk"
      } else if (data[s].weight >= json[i].SD2neg) {
        return hasil = "Normal"
      } else if (data[s].weight >= json[i].SD3neg) {
        return hasil = "Kurus"
      } else {
        return hasil = "Kurus Sekali"
      }
    } else {
    }
  }
}

function fe_bb_tb(status_balita) {
  var kategori = document.getElementById("status_balita_bbtb");
  if(status_balita == 'Gemuk') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn1">Gemuk</div>
    `
  }
  if(status_balita == 'Normal') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn2">Normal</div>
    `
  }
  if(status_balita == 'Kurus') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Kurus</div>
    `
  }
  if(status_balita == 'Kurus Sekali') {
    kategori.innerHTML=`
    <span> HASIL PEMERIKSAAN </span>
    <div class="btn3">Kurus Sekali</div>
    `
  }
}


/**
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
 function sortTableByColumn(table, column, asc = true) {
	const dirModifier = asc ? 1 : -1;
	const tBody = table.tBodies[0];
	const rows = Array.from(tBody.querySelectorAll("tr"));

	// Sort each row
	const sortedRows = rows.sort((a, b) => {
		const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
		const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

		return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
	});

	// Remove all existing TRs from the table
	while (tBody.firstChild) {
		tBody.removeChild(tBody.firstChild);
	}

	// Re-add the newly sorted rows
	tBody.append(...sortedRows);

	// Remember how the column is currently sorted
	table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
	headerCell.addEventListener("click", () => {
		const tableElement = headerCell.parentElement.parentElement.parentElement;
		const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
		const currentIsAscending = headerCell.classList.contains("th-sort-asc");

		sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
	});
});

log_out.addEventListener('click', (e) => {
  document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
})

function banner(data, data2) {
  var j = data.findIndex(obj => obj.id==cookies.id);
  var puskesmas_id = data[j].puskesmasId
  console.log("id upuskesmas = " + puskesmas_id)
  var k = data2.findIndex(obj => obj.id==puskesmas_id)
  console.log("id puskesmas = " + k)

  var bannerposyandu = document.getElementById("infoposyandu");
  bannerposyandu.innerHTML= `
  <div class="box">
      <div class="content">
          <h3>${data2[j].name}</h3>
              <p>${data2[j].address}<p>
          </div>
      </div>`
}
