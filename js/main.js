var card = document.getElementsByClassName("card");
var cards = document.getElementsByClassName("cards");
var count = document.getElementById("count");
var player = document.getElementById("player");
var start = document.getElementById("start");
var divStart = document.getElementById("divStart");
var points = document.getElementById("points");
var rows = document.getElementById("rows");

/////////////////////////variables timer/////////////////////////////

var doTimer = document.getElementById("doTimer");
doTimer.style.fontSize = "2rem";
var flagTimer ;
var sec = 0;
var min = 0;
/////////////////////////////////////////////////////

//////////////////////variables cards///////////////
var count_tries = 0;
var flag=1 ;
var that = "";

console.log(card);
card = Array.from(card);
console.log(card);



///////////////////////start play /////////////////////////////////
var playerName = ""//to enter player name
start.addEventListener('click' , function(){
    divStart.style.display = 'none';//to hidden start page
    count.innerText = count_tries;
    do{
        playerName = prompt("enter name of student : ");
        playerName = typeof playerName =="string" ? playerName.trim():false ;
    }while(!playerName);

    //start timer
    flagTimer = setInterval(timer , 1000);
    // console.log(sec);

    player.innerText = playerName;

    // to random sort all elements
    card.forEach(function(x){
        var target = Math.floor(Math.random() * (card.length-1));
        x.before(card[target]);
    });


    card.forEach(function(x){
        x.classList.add('isflipped');
    });

    //when star -> show all cards for 0.5 sec
    setTimeout(function(){
        card.forEach(function(x){
            x.classList.remove('isflipped');
        });
    }, 1000);

    
    // add event for all cards in the start
    card.forEach(function(x){
        x.addEventListener('click' , isTheSame);
    });

});

/////////// when click on any card /////////////////

function isTheSame()
{
    console.log(sec);
    this.classList.add('isflipped');
    
    if(flag == 2)
    {
        //this for stop if you click card3 after the two click
        card.forEach(function(x){
            x.removeEventListener('click' , isTheSame);
        });

        flag =1 ;
        var thiis = this;

        setTimeout(function(){
            // console.log(thiis);
            if(thiis.getAttribute('data-img') != that.getAttribute('data-img'))
            {
                thiis.classList.remove('isflipped');
                that.classList.remove('isflipped');
                count_tries++;
                count.innerText = count_tries;
            }

            //to add event for disapper cards
            card = card.filter(function(x){
                // console.log(x.getAttribute('class'))
                //to not add two cards if the two cards are the same 
                return !(x.getAttribute('class').includes('isflipped')) ;
            });
            card.forEach(function(x){
                x.addEventListener('click' , isTheSame);
            });
            //////////////////////////////////////////////////////////

            if(card.length == 0)
            {
                clearInterval(flagTimer);
                showRank();
            }

        },500);
    }
    else{/////////first click card///////////
        flag++;
        that = this;
        // console.log(that);
        this.removeEventListener('click',isTheSame);
    }

}

//////////////////////call after finsh the game//////////////////////////////////////////
function showRank(){
    //calc the points on timer and wrong tries
    var point = 100 - count_tries - (min+1)*2 ;
    sec=min = hour=0;//to start timer

    points.innerText = point;
    var contant = document.createTextNode("Your Points :")
    points.parentElement.prepend(contant);
    points.parentElement.style.cssText=`
    color : #19c8fa;
    font-size:30px;
    z-index : 20;
    `;

    points.style.cssText = `font-weight:bold`;

    divStart.style.display = 'flex';

    card = cards[0].children;
    card = Array.from(card);

    count_tries = 0;
    

    score.push({name:playerName , points:point});
    score.sort(function(a,b){return (b.points - a.points)});
    localStorage.score = JSON.stringify(score);
    renderTable();
    
}

/////////////////////////////localStorage//////////////////////////
var score = [{name:'Nosa' , points:97} ,
 {name:'Trika' , points:94},
 {name:'Zizo' , points:90},
 {name:'Sika' , points:85},
 {name:'Elmor' , points:82}
]
if(localStorage.score)
{
    score = JSON.parse(localStorage.score);
    renderTable();
}

////////////////////this to show the sort table of players ////////////////////
function renderTable()
{
    var count = 0;
    rows.innerHTML = "";
    score.forEach(function(s){
        if(count < 6){
            rows.innerHTML += `
            <tr>
                <td>${++count}</td>
                <td>${s.name}</td>
                <td>${s.points}</td>
            </tr>
            `
        }
    })
}


//////////////////////////////////Timer///////////////////////////////////////////

function timer()
{
   sec++;
   if(sec>59)
   {
        min++;
        sec = 0;
   }

    show();
    // console.log(sec);
   
}

show();

function show()
{
   if(parseInt(min) < 10)
   {
        min = '0'+ parseInt(min); 
   }
   if(parseInt(sec) < 10)
   {
        sec = '0'+ parseInt(sec); 
   }

   doTimer.innerText = min + ":" + sec;
//    console.log(sec);
}