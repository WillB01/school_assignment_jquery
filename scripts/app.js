import $ from 'jquery';
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

// Ni ska skapa en sida där en användare anger en SL-hållplats i ett sökfält för att sedan presentera alla dess 
//avgångar efter klockslaget sökningen sker på. Dvs nästa avgång(ar).

// Ni ska använda minst två av SLs api-metoder. En för att hämta hållplatser och en för att visa avgångar för given hållplats.

// Sökningen ska returnera en lista av hållplatser som matchar det användaren har skrivit fältet. Om den angivna hållplatsen inte finns så visa ingen lista.

// Användaren ska välja en av dessa hållplatser och sedan ska alla avgångar för den hållplatsen presenteras i en tabell. Varje avgång i tabellen ska presentera slutstation, klockslag och vilket fordon det gäller.

// Det ska finnas en Sök-knapp för att söka på hållplats men användaren ska också söka genom att trycka på Enter när denne har textfältet aktivt/fokuserat.

// Tillhörande tabellen av avgångar ska det finnas alternativ för att filtrera listan på fordon (tåg, buss, pendel). Vid filtrering så ska avgångarna uppdateras direkt (dvs, man ska inte behöva söka på hållplatsen igen).

// Det ska finnas en möjlighet att rensa sökfältet och alla avgångar.

// Sök-knappen ska vara avaktiverad tills användaren har fyllt i något i fältet.


// VG VG VG

// Visa en spinner eller progress bar när man söker på hållplatser och visar avgångar. Se till att spinner/progress bar är logiskt placerade relaterat till sökningen och laddningen av hållplatser och avgångar.

// * Utökad validering: Om den angivna hållplatsen inte finns så markera sök-fältet med röd färg och med text nedanför som säger ”Hållplatsen finns inte”.

// * Utökad validering: sök-knappen ska vara avaktiverad tills användaren har fyllt i fältet med en giltig avgång, dvs avgångar som endast finns i SLs databas.

// * Lägg till en knapp som uppdaterar avgångarna för en given hållplats utifrån klockslaget som uppdateringen skedde.

// * Användaren ska kunna klicka på en avgång för att se hela dess färd, alla hållplatser mellan start och slut-station. (Tips: Använd en modal. Det går dock att göra det på andra sätt som är mer UX-vänliga).

// * Visa matchande resultat i sökfälten medan användaren fyller i bokstav för bokstav. Detta kallas typeahead (bra att veta för google-sökning). (Tips! Börja denna sökning när användaren har angett minst tre bokstäver. Kan du se vilka fördelar det ger?)

// * Implementera sökhistorik i sökfältet för hållplatser. Den ska endast visa en lista av 5 senaste sökningarna när sökfältet är aktiverat. Listan försvinner när användaren börjar skriva i sökfältet. Om en ny hållplats tillkommer så ska den senast sparade hållplatsen försvinna och den nya läggs till överst (first in last out). (Tips! Använd sessionStorage. Det finns också localStorage, men varför rekommenderar vi inte det?)
let searchRealTime = "api/realtime/";
let searchStopsUrl = "api/search/";
let userSearchInput = "";
let output = "";
let isBuss = false;
let isPendel = false;
let isTunnelbana = false;


//data-loaded PARENT
//toggle display none



//window START
$(function () {

   

    let userTime = new Date($.now());

    $("#search-input").click(() => {
        $("#fieldset").removeClass("hidden");
        $("#fieldset").addClass("show");
    });

    $("#search-input").keyup((e) => {
        let key = event.which;
        if (key === 27) {
            alert('msg');
        }
    });
    $("#search-input").keyup(function (e) { //Get value from input and send with key ENTER
        resetShowData();
        userSearchInput = e.target.value;
        searchWithEnterKey(getStopLocation, e);
        $(document).ajaxStart(function () {
            $(".loader").addClass("start");
        });
        $(document).ajaxComplete(function () {
            $(".loader").removeClass("start");
        });

    });


    $("#form-stop").submit(function (e) { //Prevent key ENTER to submit
        e.preventDefault();
    });


    $("#search-btn").on("click", function () { //Get Stops
        resetShowData();
        getStopLocation();
        
        $(document).ajaxStart(function () {
            $(".loader").addClass("start");
        });
        $(document).ajaxComplete(function () {
            $(".loader").removeClass("start");
        });
    });

    



    let searchWithEnterKey = (search, event) => {
        let key = event.which;
        if (key == 13) // the enter key code
        {
            search();
        };
    };

    let getRealTime = () => {
        $.get(searchRealTime + use)
    };


    // buttonCounter++;
    // console.log(buttonCounter);
    // buttonCounter === 1 ?  getDepatureTime(stopAndId, e.target.innerHTML) : $(".depature").toggle();
    // buttonCounter === 2 ? 0 : 1;



    //------------------------------Get Stops

    let getStopLocation = () => { // Get STOPS

        $.get(searchStopsUrl + userSearchInput, function (response) {
            let stopAndId = [];
            output +=
                `
        
                <fieldset id="fieldset">
                   
              

                    <div id="checkbox-container">
                    
                        <input type="checkbox" id="checkbox-tbanna" />
                        <label for="checkbox-tbanna" class="checkbox-tbanna-class checkbox-all">
                            <i class="far fa-square"></i><span class="checkboxText">tunnelbanna</span>
                        </label>

                        <input type="checkbox" id="checkbox-buss" />
                        <label for="checkbox-buss" class="checkbox-buss-class checkbox-all">
                            <i id="fa-square-buss" class="far fa-square"></i><span class="checkboxText">buss</span>
                        </label>
                        <input type="checkbox" id="checkbox-pendel" />
                        <label for="checkbox-pendel" class="checkbox-pendel-class checkbox-all">
                            <i class="far fa-square"></i><span class="checkboxText">pendel</span>
                        </label>

                    </div>
                    <a class="update-data hidden" href="#">updatera</a>
                   
                   
                </fieldset>
                
                <div class="show-time-container">
                    <a href="#" class="info"></a>
                    
                </div>
                
                <div>
                
            `;
            $.each(response, function (key, value) {
                for (let i = 0; i < value.length; i++) {
                    output +=
                        `
                        <div class="${value[i].name}-container dim">
                        <div class="stop-container">
                        
                        <a href="#" class="specific-station ${value[i].id} ${value[i].name} dim" data-type="unloaded">${value[i].name}</a>  
                              
                        </div>
                    </div>
                    `
                    ;
                    stopAndId.push({
                        'name': value[i].name,
                        'id': value[i].id
                    });
                }
            });


            output += "</div>"
            document.querySelector("#show-data").innerHTML = output;

            console.log(stopAndId[0]);

            $('.dim').click(function (event) {
                $(document).ajaxStart(function () {
                    $(".loader").addClass("start");
                    $("#show-data").css("display", "none");
                });
                $(document).ajaxComplete(function () {
                    $("#show-data").css("display", "block");
                    $(".loader").removeClass("start");
                    $(`.stations`).html(`Hållplats: ${event.target.innerHTML}`);
                    $(`.${event.target.classList[1]}`).css("color", "#47D98B");
                    $(`.${event.target.classList[1]}`).children.removeClass("stop-container") //TODO//////////////////////////////////////////
                 
                });

                if ($(this).attr("data-type") === "unloaded") {
                    $(this).attr("data-type", "loaded");
                    getDepatureTime(stopAndId, event.target.innerHTML);


                }
                var isDim = $(event.target).is('.dim');
                if (isDim) { //make sure I am a dim element
                    $('.hidden', this).toggle(); // p00f
                }


            });

            // $(`.specific-station`).click(function (e) {
            //     if ($(this).attr("data-type") === "unloaded") {
            //         $(this).attr("data-type", "loaded");
            //         getDepatureTime(stopAndId, e.target.innerHTML);
            //     }
            // });


        }).fail(function (response) {
            console.log("fail");
            console.log(response);
        });;
    };
});

//----------------------------
let getDepatureTime = (stopAndId, userClickStation) => {
    let id;
    let product;
    let productTwo;;
    let checkT = $("#checkbox-tbanna").prop("checked");
    let checkB = $("#checkbox-tbanna").prop("checked");
    let checkP = $("#checkbox-tbanna").prop("checked");

    for (const key in stopAndId) {
        if (stopAndId.hasOwnProperty(key)) {
            if (userClickStation === stopAndId[key].name) {
                id = stopAndId[key].id;
                console.log(id);
                break;
            }


        }
    }

    const BUS = 128;
    const PENDEL = 16;
    const TUNNELBANA = 32;
    if (isBuss && isPendel && isTunnelbana) {
        product;
        productTwo;
    }
    if (isBuss && !isPendel && !isTunnelbana) {
        product = BUS;
    }
    if (!isBuss && isPendel && !isTunnelbana) {
        product = PENDEL;
    }
    if (!isBuss && !isPendel && isTunnelbana) {
        product = TUNNELBANA;
    }
    //buss------------------------------------
    if (isBuss && isPendel && !isTunnelbana) {
        product = BUS;
        productTwo = PENDEL;
    }
    if (isBuss && !isPendel && isTunnelbana) {
        product = BUS;
        productTwo = TUNNELBANA;
    }
    if (!isBuss && isPendel && isTunnelbana) {
        product = PENDEL;
        productTwo = TUNNELBANA;
    }
  

    
    console.log(product + " " + productTwo);
    $.get(searchRealTime + id + "/" + product + "/" + productTwo, function (response) {
        $.each(response, function (key, value) {
            for (let i = 0; i < value.length; i++) {
                console.log(value[i].time + " " + value[i].name);
                output = `<p class="depature hidden">${value[i].time} ${value[i].direction} ${value[i].name}</p>
                
                `;
                $(`.${id}`).after(`<div>${output}</div> `);
            }
        });

    });

    console.log(id);

};




let resetShowData = () => {
    $("#show-data").html("");
    output = "";
};

$(".specific-station").click(function () {
    $("specific-station").addClass("specific-station-effect");
});




///////////////////////CHECKBOX
$(document).ajaxComplete(checkboxLogic);
$(document).ajaxComplete(atctivateRefreshData);
$(document).ajaxComplete(() =>{
    $( ".stop-container" ).click(function() {
        let text = $(".stop-container").text();
         $(".update-data").html(text);
      });
      
      
      
});

function atctivateRefreshData(){
    $(".update-data").click(() => {
        alert("message");
        getStopLocation();
    });
    
};


function showUpdate(){
    if(isBuss || isPendel || isTunnelbana){
        $(".update-data").removeClass("hidden");
        
        $(".update-data").html("refresh");
    }else{
        $(".update-data").addClass("hidden");
    }
}


function checkboxLogic(){
   
    $("#checkbox-tbanna").on("click", function () {
        let check = $("#checkbox-tbanna").prop("checked");

        if (check) {
            if ($('.checkbox-tbanna-class i').hasClass('fa-square')) {
                $('.checkbox-tbanna-class i').removeClass('fa-square').addClass('fa-check-square');
                isTunnelbana = true;
                console.log(isTunnelbana);
                showUpdate();
                

            }
        } else {
            if ($('.checkbox-tbanna-class i').hasClass('fa-check-square')) {
                $('.checkbox-tbanna-class i').removeClass('fa-check-square').addClass('fa-square');
               
                isTunnelbana = false;
                console.log(isTunnelbana);
                showUpdate();
            }
        }

    });
 
    $("#checkbox-pendel").on("click", function () {
        let check = $("#checkbox-pendel").prop("checked");
       
        if (check) {
            if ($('.checkbox-pendel-class i').hasClass('fa-square')) {
                $('.checkbox-pendel-class i').removeClass('fa-square').addClass('fa-check-square');
                isPendel = true;
                showUpdate();

              
            }
        } else {
            if ($('.checkbox-pendel-class i').hasClass('fa-check-square')) {
                $('.checkbox-pendel-class i').removeClass('fa-check-square').addClass('fa-square');
                isPendel = false;
                showUpdate();
            }
        }

    });
    $("#checkbox-buss").on("click", function () {
        let check = $("#checkbox-buss").prop("checked");

        if (check) {
            if ($('.checkbox-buss-class i').hasClass('fa-square')) {
                $('.checkbox-buss-class i').removeClass('fa-square').addClass('fa-check-square');
                isBuss = true;
                showUpdate();

            }
        } else {
            if ($('.checkbox-buss-class i').hasClass('fa-check-square')) {
                $('.checkbox-buss-class i').removeClass('fa-check-square').addClass('fa-square');
                isBuss = false;
                showUpdate();
            }
        }

    });
}