///////////////////////////////Audios/////////////////////////////
// var backgrounAudio = new Audio('media/background.mp3');
var correct = new Audio('media/correct.wav');
var fail = new Audio('media/fail.wav');
var finish = new Audio('media/finish.wav');
var filpCard = new Audio('media/flip-card.mp3')

var cards = document.getElementsByClassName("cards");
///////////this for add two cards with mobile for responsive //////////////////////

if(screen.width < 500)
{
    var newCard = document.createElement("div");
        newCard.classList.add('card');
        newCard.setAttribute('data-img',"img9");
        newCard.innerHTML = `<div class="front face"></div>
            <div class="back face">
                <img src="images/9.png" alt="">
            </div>`;
        var newCard2 = document.createElement("div");
        newCard2.classList.add('card');
        newCard2.setAttribute('data-img',"img9");
        newCard2.innerHTML = `<div class="front face"></div>
            <div class="back face">
                <img src="images/9.png" alt="">
            </div>`;
        console.log(newCard2);
        cards[0].append(newCard);
        cards[0].append(newCard2);
}

/////////////////////////////////////////////////////
var card = document.getElementsByClassName("card");
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
        playerName = prompt("enter name of player : ");
        if(playerName == null)
        {//if click on cancel
            location.reload();
            break;
        }
        playerName = typeof playerName =="string" ? playerName.trim():false ;
    }while(!playerName);
    // backgrounAudio.play();
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
    }, 1500);

    
    // add event for all cards in the start
    card.forEach(function(x){
        x.addEventListener('click' , isTheSame);
    });

});

/////////// when click on any card /////////////////

function isTheSame()
{
    filpCard.play();
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
                fail.play();
            }
            else
            {
                correct.play();
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
                finish.play();
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

    points.parentElement.childNodes[0].nodeValue = '';
    console.log(points.parentElement.childNodes[0].nodeValue)
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
    
    var playerExit = Score.filter(function(x){
        if(x.name == playerName ){
            x.points = point;
        }
        return x.name == playerName;
    });
    console.log(playerExit);    
    if(playerExit.length == 0)
    {
        Score.push({name:playerName , points:point , timer:doTimer.innerText});
    }
    else {

    }
    Score.sort(function(a,b){return (b.points - a.points)});
    localStorage.Score = JSON.stringify(Score);
    renderTable();
    
}

/////////////////////////////localStorage//////////////////////////
var Score = [{name:'Nosa' , points:97 , timer:"00:30"} ,
 {name:'Trika' , points:94, timer:"00:35"},
 {name:'Zizo' , points:90, timer:"00:25"},
 {name:'Sika' , points:85, timer:"00:33"},
 {name:'Elmor' , points:82, timer:"03:40"}
]
if(localStorage.Score)
{
    Score = JSON.parse(localStorage.Score);
    renderTable();
}

////////////////////this to show the sort table of players ////////////////////
function renderTable()
{
    var count = 0;
    rows.innerHTML = "";
    Score.forEach(function(s){
        if(count < 6){
            rows.innerHTML += `
            <tr>
                <td>${++count}</td>
                <td>${s.name}</td>
                <td>${s.timer}</td>
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
