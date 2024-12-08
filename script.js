// Todo List App
// Team Project
// 
// Zac Finger, et al.
// Georgia Tech Online MS in Computer Science
// CS 6750: Human Computer Interaction
// Dr. Joyner
// 2024-12-06

// The following resources were helpful in building this application
// https://codepen.io/deepakkadarivel/pen/LrGEdL
// https://zzzcode.ai/answer-question
// https://www.w3schools.com/css/css_tooltip.asp
// https://www.w3schools.com/howto/howto_js_rangeslider.asp
// https://medium.com/@jmatix/javascript-one-liners-for-zero-padding-short-format-date-908318ccf315

var modalOpen = false;
var firstTooltip = true;
var secondTooltip = true;
var weekMultiplier = 1;

window.onload = function() {
    const cards = document.querySelectorAll('.card');
    const newTaskBtns = document.querySelectorAll('.new-task-btn');
    const calendarIcons = document.querySelectorAll('.calendar-icon');
    const modal = document.getElementById('sliderModal');
    const intervalBtns = document.querySelectorAll('.interval');
    const slider = document.getElementById('numberSlider');

    cards.forEach(card => {

        card.addEventListener('touchstart', touchStart);
        card.addEventListener('touchmove', touchMove);
        card.addEventListener('touchend', touchEnd);
    });

    calendarIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            // show modal
            modal.classList.remove('d-none');
            modalOpen = true;
            // detect which listnum from event.target.getAttr(data-list
            var listNum = event.target.parentNode.parentNode.getAttribute('data-list');
            var myList = document.getElementById('list'+listNum);
            var tooltip = myList.querySelector('.first-tooltip');
            tooltip.classList.add('d-none');
            // add event listener to modal "save"
            document.getElementById("modalSave").onclick = function() {
                convertToCard(listNum);
            };
            // add listener for user clicks out of modal
            // detect which list num and change vh of list
        })
    });

    intervalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if(!this.classList.contains('selected'))
            {
                if(this.classList.contains('weeks'))
                {
                    // swap the css views on buttons
                    var otherBtn = this.parentNode.querySelector('.days');
                    otherBtn.classList.remove('selected');
                    this.classList.add('selected');

                    // change values of input slider
                    var slider = document.getElementById('numberSlider');
                    slider.setAttribute('max', '52');
                    slider.setAttribute('value','0');
                    var sliderLabels = document.querySelector('.labels');
                    sliderLabels.innerHTML = "<span></span><span>13</span><span>26</span><span>39</span><span>52</span>";

                    weekMultiplier = 7;
                }
                else {
                    // swap the css views on buttons
                    var otherBtn = this.parentNode.querySelector('.weeks');
                    otherBtn.classList.remove('selected');
                    this.classList.add('selected');

                    // change values of input slider
                    var slider = document.getElementById('numberSlider');
                    slider.setAttribute('max', '25');
                    slider.setAttribute('value','0');
                    var sliderLabels = document.querySelector('.labels');
                    sliderLabels.innerHTML = "<span></span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>";

                    weekMultiplier = 1;
                }
                
            }
            
        })
    });

    // Prevent background dragging when slider is active
    slider.addEventListener('touchstart', function(event) {
        event.stopPropagation();
    });

    function enterInsertMode(myTarget)
    {
        var newTaskDiv = myTarget.querySelector('.new-task-btn');
        newTaskDiv.classList.add('d-none');
        var addTaskDiv = myTarget.querySelector('.add-task');
        addTaskDiv.classList.remove('d-none');

        if(firstTooltip)
        {
            // get the input field's position
            var inputField = myTarget.querySelector('.insert-card'); // should only be one
            var rect = inputField.getBoundingClientRect();

            // position tooltip above input field
            var tooltip = myTarget.querySelector('.first-tooltip');
            tooltip.classList.remove('d-none');
            var toolTipRect = tooltip.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - toolTipRect.width/2}px`;
            tooltip.style.top = `${rect.top - toolTipRect.height + window.scrollY}px`;

            firstTooltip = false;   // never show it again
        }
    }

    newTaskBtns.forEach(div => {
        div.addEventListener('click', function() {
            var listNum = this.parentNode.getAttribute("data-list");
            var newCard = document.createElement('textarea');
            newCard.classList.add('card');
            //newCard.setAttribute('type','textarea');
            newCard.classList.add('insert-card');
            newCard.setAttribute('id','insert-card-'+listNum);

            newCard = insertCard(this.parentNode, newCard);

            enterInsertMode(this.parentNode);

            // attach save event to save button

            document.addEventListener('click', (event) => {
                //debugger;

                var userClickedInputField = newCard.contains(event.target);
                var userClickedNewTaskBtnOfCurrentList = event.target.classList.contains('new-task-btn')
                    && event.target.hasAttribute("data-list") 
                    && event.target.getAttribute("data-list") == listNum;
                var userClickedCalendarIcon = event.target.classList.contains('fa-calendar');
                var userClickedModal = document.getElementById('sliderModal').contains(event.target);

                if(!userClickedInputField && !userClickedNewTaskBtnOfCurrentList 
                    && !userClickedCalendarIcon && !userClickedModal && !modalOpen)
                {
                    //debugger;
                    // user clicked outside input field
                    exitInsertMode(this.parentNode);

                    var firstToolTips = document.querySelectorAll('.first-tooltip');
                    firstToolTips.forEach(function(item) {
                        item.classList.add('d-none');
                    });
                    var secondTooltips = document.querySelectorAll('.second-tooltip');
                    secondTooltips.forEach(function(item) {
                        item.classList.add('d-none');
                    });
                    document.getElementById('insert-card-'+listNum).remove();
                }
            });

            newCard.focus();
        });
    });
}

function exitInsertMode(myTarget)
{
    var addTaskDiv = myTarget.querySelector('.add-task');
    addTaskDiv.classList.add('d-none');
    var newTaskDiv = myTarget.querySelector('.new-task-btn');
    newTaskDiv.classList.remove('d-none');
}

function touchStart(e){
    e.preventDefault();
}

function touchMove(e) {
    var card = e.changedTouches[0].target;

    if(card.classList.contains("card") && !modalOpen)
    {

        card.classList.add("card-dragover");

        // grab the location of touch
        var touchLocation = e.targetTouches[0];
        
        // assign box new coordinates based on the touch.
        card.style.left = touchLocation.pageX + 'px';
        card.style.top = touchLocation.pageY + 'px';
        
    }
}

function touchEnd(e) {
    var card = e.changedTouches[0].target;

    // current box position
    var cardX = parseInt(card.style.left);
    var cardY = parseInt(card.style.top);

    var cardContent = e.changedTouches[0].target.innerHTML;

    // Check for drop targets
    var droppableElements = document.querySelectorAll('.droppable-element');
    droppableElements.forEach(function(droppableElement) {
      var element = droppableElement.getBoundingClientRect();
      if (cardX >= element.left && cardX <= element.right &&
          cardY >= element.top && cardY <= element.bottom) {
        var newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.setAttribute('draggable', 'true');

        if(card.classList.contains("d-flex-flex-direction-column"))
        {
            newCard.classList.add("d-flex-flex-direction-column");
        }

        newCard.innerHTML = cardContent;
        
        newCard = insertCard(droppableElement, newCard);

        newCard.addEventListener('touchstart', touchStart);
        newCard.addEventListener('touchmove', touchMove);
        newCard.addEventListener('touchend', touchEnd);
        
        card.remove();
      }
    });
}

function insertCard(myTarget, newCard)
{
    // find last element in target of class card
    var listCards = myTarget.querySelectorAll('.card');
    if (listCards.length > 0) {
        var lastCardInList = listCards[listCards.length-1];
        // Insert the new div after the last child with the specified class
        lastCardInList.parentNode.insertBefore(newCard, lastCardInList.nextSibling);
    } else {
        // If no child with the specified class is found, append the new div after the list title
        var listTitle = myTarget.querySelector('.list-title');
        listTitle.parentNode.insertBefore(newCard, listTitle.nextSibling);
    }

    return newCard;
}

function saveEvent(listNum)
{
    var list = document.getElementById('list'+listNum);
    var card = document.getElementById('insert-card-'+listNum);

    var firstTooltip = list.querySelector('.first-tooltip');
    firstTooltip.classList.add('d-none');

    var newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('draggable', 'true');
    // check if card is textarea or div
    var isDiv = card.tagName.toLowerCase() == "div";
    newCard.innerHTML = isDiv
        ? card.innerHTML : card.value;
    if(isDiv) {
        newCard.classList.add('d-flex-flex-direction-column');
    }

    newCard = insertCard(list, newCard);

    newCard.addEventListener('touchstart', touchStart);
    newCard.addEventListener('touchmove', touchMove);
    newCard.addEventListener('touchend', touchEnd);

    if(secondTooltip)
    {

        var tooltip = list.querySelector('.second-tooltip');
        tooltip.classList.add('d-none');
        secondTooltip = false;
    }

    if(isDiv)
    {
        //card.remove();
        exitInsertMode(list);    
    }

    // reset slider
    var selectedInterval = document.querySelector('.weeks');
    selectedInterval.classList.remove('selected');
    var daysBtn = document.querySelector('.days');
    daysBtn.classList.add('selected');

    var slider = document.getElementById('numberSlider');
    slider.setAttribute('max', '25');
    slider.setAttribute('value','0');
    var sliderLabels = document.querySelector('.labels');
    sliderLabels.innerHTML = "<span></span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>";

    weekMultiplier = 1;
}

function dateFormatted(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const year = date.getFullYear(); 

    return `${month}/${day}/${year}`;
}

// called when date is selected
function convertToCard(listNum)
{
    var list = document.getElementById('list'+listNum);
    var card = document.getElementById('insert-card-'+listNum);
    var slider = document.getElementById('numberSlider');
    var isDiv = card.tagName.toLowerCase() == "div";

    // retrieve user input from textarea
    // create new card div
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    var cardContent = document.createElement('div');
    cardContent.innerHTML = isDiv 
        ? card.firstChild.innerHTML : card.value;
    newCard.appendChild(cardContent);
    newCard.classList.add('d-flex-flex-direction-column');

    // get slider value and create new datetime add to card
    var days = slider.value * weekMultiplier;
    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(days));
    var dateDiv = document.createElement('div');
    dateDiv.classList.add('m-t-auto');
    dateDiv.innerHTML = `Due ${dateFormatted(dueDate)} (${days} days)`;
    // add event listener to div to allow it to be edited again when clicked
    newCard.appendChild(dateDiv);
    newCard.setAttribute('id','insert-card-'+listNum);

    // hide modal, remove card
    card.remove();
    newCard = insertCard(list, newCard);
    document.getElementById('sliderModal').classList.add('d-none');
    modalOpen = false;

    if(secondTooltip)
    {
        // display tooltip over "add task"
        var addBtn = list.querySelector('.column.right');
        
        var rect = addBtn.getBoundingClientRect();

        // position tooltip above input field
        var tooltip = list.querySelector('.second-tooltip');
        tooltip.classList.remove('d-none');
        var toolTipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - toolTipRect.width/2}px`;
        tooltip.style.top = `${rect.top - (toolTipRect.height + 15) + window.scrollY}px`;

    }
 
}