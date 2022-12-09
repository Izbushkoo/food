window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsConents = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabsContent() {
        tabsConents.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(index = 0){
        tabsConents[index].classList.add('show', 'fade');
        tabsConents[index].classList.remove('hide');
        tabs[index].classList.add('tabheader__item_active');
    }
    
    hideTabsContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {

        const target = event.target;

        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item){
                    hideTabsContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2022-12-12';

    function getTimeRest(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(total / (1000 * 60 * 60 * 24)),
              hours = Math.floor((total / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((total / 1000 / 60) % 60),
              seconds = Math.floor((total / 1000) % 60);

        return {
            'total': total,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
    function addZero(number){
        if (number > 0 && number < 10) {
            return `0${number}`;
            
        } else {
            return number;
        }
    }

    function setClock(selector, endtime){
        
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateTimerClock, 1000);
        
              updateTimerClock();

        function updateTimerClock() {
            const t = getTimeRest(endtime);

            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds); 

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
        }
        
    }

    setClock('.timer', deadline);
});