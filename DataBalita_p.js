
function databalita_p() {
    fetch("http://localhost:3000/api/Balita")
    .then((response) => response.json())
    .then((data) => {
        bio(data.User, data.Puskesmas)
        banner(data.User, data.Puskesmas)
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

var cookies = document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) =>
    ({...accumulator, [key.trim()]: decodeURIComponent(value) }),
    {});

function bio(data, data2) {
    var j = data.findIndex(obj => obj.id==cookies.id);
    var puskesmas_id = data[j].puskesmasId
    console.log("id upuskesmas = " + puskesmas_id)
    var k = data2.findIndex(obj => obj.id==puskesmas_id)
    console.log("id puskesmas = " + k)

    console.log(data2[k].Balita)

    var mainContainer = document.getElementById("BioBalita");
    for (var i = 0; i < data2[k].Balita.length; i++) {
        var mdate = data2[k].Balita[i].birthDate; 

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
        console.log(day_age)
          
        var tMnt= (month_age + (year_age*12));  
        var tDays =(tMnt*30) + day_age;  

        mainContainer.innerHTML+= `
        <div class="table-sortable">
                <td>${data2[k].Balita[i].name}</td>
                <td>${year_age} tahun ${month_age} bulan</td>
                <td>${data2[k].Balita[i].id}</td>
                <td><a href="e-GCMS_DataBalita.html?id=${data2[k].Balita[i].id}" class="btn"><img src="Aset/PNG/next.png" alt="" id="btn_data"></a></td>
        </div>`
       
    }
    
}


function banner(data, data2) {
    console.log(data)
    var j = data.findIndex(obj => obj.id==cookies.id);
    var puskesmas_id = data[j].puskesmasId
    console.log("id puskesmas = " + puskesmas_id)
    var k = data2.findIndex(obj => obj.id==puskesmas_id)
    console.log("id puskesmas = " + k)
    
    var bannerposyandu = document.getElementById("infoposyandu");
    bannerposyandu.innerHTML= `
    <div class="box">
        <div class="content">
            <h3>${data2[k].name}</h3>
                <p>${data2[k].address}<p>
            </div>
        </div>`
}

function geser_geser() {
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
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