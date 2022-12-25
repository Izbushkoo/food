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

    // Modal

    const btns = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');


    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    btns.forEach(item => {
        item.addEventListener('click', openModal); 
    }); 

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === ''){
            closeModal();
        }
        
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);
          

    function showModalByScroll() {
    
        if (window.pageYOffset + document.documentElement.clientHeight >= 
            document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Menu

    class MenuItem {
        constructor(src, alt, title, description, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.transfer = 37;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
        }

        convertToUAH(price){
            return Math.round(price * this.transfer);
        }

        render(){
            const element = document.createElement('div');
            if (this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));

            }
            
            element.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total">
                    <span>${this.convertToUAH(this.price)}</span> грн/день
                    </div>`;

            this.parent.append(element);

        }
    }

    const getResourse = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };
    
    // getResourse('http://localhost:3000/menu')
    //     .then(data => {
    //         createCard(data);
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuItem(img, altimg, title, descr, price, '.menu .container').render();
            });
        });
    
    function convertToUAH(price, current){
        return Math.round(price * current);
    }

    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement('div');

            element.classList.add('menu__item');

            element.innerHTML = `
            <img src="${img}" alt="${altimg}">
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total">
                    <span>${convertToUAH(price, 37)}</span> грн/день
                    </div>
                    `;
            
            document.querySelector('.menu .container').append(element);
            
        });
    }
    // Forms

    const forms = document.querySelectorAll('form');
    
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thanks.We will call you back soon.',
        failure: 'Something went wrong.'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();

    };

    function bindPostData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

        });
    }

    function showThanksModal(message){

        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();
        
        const thanksModal = document.createElement('div');
        
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close="">×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider

    const slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          offerSlides = slidesWrapper.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let currentNum = 1,
        offset = 0;

    if (offerSlides.length < 10) {
        total.textContent = `0${offerSlides.length}`;
        current.textContent = `0${currentNum}`;
    } else {
        total.textContent = offerSlides;
        current.textContent = `currentNum`;
    }

    slidesField.style.width = 100 * offerSlides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';
    
    offerSlides.forEach(slide => {
        slide.style.width = width;
    });

    next.addEventListener('click', () => {

        if (offset == +width.slice(0, width.length - 2) * (offerSlides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
        
        if (currentNum  == offerSlides.length) {
            currentNum = 1;
        } else {
            currentNum++;
        }

        if (offerSlides.length < 10) {
            current.textContent = `0${currentNum}`;
        } else {
            current.textContent = offerSlides;
        }
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (offerSlides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (currentNum  == 1) {
            currentNum = offerSlides.length;
        } else {
            currentNum--;
        }

        if (offerSlides.length < 10) {
            current.textContent = `0${currentNum}`;
        } else {
            current.textContent = offerSlides;
        }
    });
    // function formCounter(currNum) {

    //     function checkNumber(num) {
    //         if (num < 10) {
    //             return `0${num}`;
    //         } else {return num;}
    //     }

    //     total.innerHTML = checkNumber(offerSlides.length);
    //     current.innerHTML = checkNumber(currNum);

    // }

    // formCounter(currentNum);

    // function showSlide(number) {

    //     function hideSlides(){
    //         offerSlides.forEach(item => {
    //             item.classList.add('hide');
    //             item.classList.remove('show', 'fade');
    //         });
    //     }
    //     hideSlides();
    //     offerSlides[number - 1].classList.add('show', 'fade');
    //     offerSlides[number - 1].classList.remove('hide');
    // }

    // sliderNext.addEventListener('click', () => {

    //     if (currentNum + 1 > totalNumber) {
    //         currentNum = 1;
    //         formCounter(currentNum);
    //     } else {
    //         currentNum++;
    //         formCounter(currentNum);
    //     }

    //     showSlide(currentNum);
    // });
    
    // sliderPrev.addEventListener('click', () => {

    //     if (currentNum - 1 <= 0) {
    //         currentNum = totalNumber;
    //         formCounter(currentNum);
    //     } else {
    //         currentNum--;
    //         formCounter(currentNum);
    //     }

    //     showSlide(currentNum);
    // });

    
    });