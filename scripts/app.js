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
let isClicked = false;
let buttonCounter = 0;

//data-loaded PARENT
//toggle display none



//window START
$(function () {



    let userTime = new Date($.now());

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

    });


    $("#form-stop").submit(function (e) { //Prevent key ENTER to submit
        e.preventDefault();
    });


    $("#search-btn").on("click", function () { //Get Stops
        resetShowData();
        getStopLocation();
        $(document).ajaxStart(function() {
            $(".loader").addClass("start");
          });
          $(document).ajaxComplete(function() {
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
            `<h3>Hållplatser:</h3>
                <div class="show-time-container">
                    <a href="#" class="info"></a>
                </div>
                
                <div>
                
            `;
            $.each(response, function (key, value) {
                for (let i = 0; i < value.length; i++) {
                    output +=
                        `<div class="${value[i].name}-container dim">
                        <a href="#" class="specific-station ${value[i].id} ${value[i].name} dim" data-type="unloaded">${value[i].name}</a>        
                    </div>`;
                    stopAndId.push({
                        'name': value[i].name,
                        'id': value[i].id
                    });
                }
            });
            

            output += "</div>"
            document.querySelector("#show-data").innerHTML = output + " " + userTime;

            console.log(stopAndId[0]);
            
            $('.dim').click(function (event) {
                $(document).ajaxStart(function() {
                    // $( ".info" ).text( "Loading" );
                    $(".loader").addClass("start");
                    $("#show-data").css("display","none");
                  });
                  $(document).ajaxComplete(function() {
                    $("#show-data").css("display","block");
                    
                    // $(`.info`).text( "Visa tider" );
                    
                    $(".loader").removeClass("start");
                    $(`.${event.target.classList[1]}`).css("color","red");
                    $(`.${event.target.classList[1]}`).append("v");
                    // $(".info").click(function(e) {
                    //     $(`.${event.target.innerHTML}`).click(function(e){
                    //         e.target.innerHTML = "kewl";
                    //     }); 
                    //         return false;
                    //   });
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

    for (const key in stopAndId) {
        if (stopAndId.hasOwnProperty(key)) {
            if (userClickStation === stopAndId[key].name) {
                id = stopAndId[key].id;
                console.log(id);
                break;
            }


        }
    }
    $.get(searchRealTime + id, function (response) {
        $.each(response, function (key, value) {
            for (let i = 0; i < value.length; i++) {
                console.log(value[i].time + " " + value[i].name);
                output = `<p class="depature hidden">${value[i].time} ${value[i].direction} ${value[i].name}</p>`;
                $(`.${id}`).after(`<div>${output}</div>`);
              
                // $(`.${id}`).after($(`<p class="depature">${value[i].time} ${value[i].direction}</p>` ));
                // $(`<p class="depature">${value[i].time} ${value[i].direction}</p>` ).insertAfter(`.${id}`);
            }
        });
       
    });
    console.log(id);
};




let resetShowData = () => {
    $("#show-data").html("");
    output = "";
};
