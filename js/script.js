window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsConents = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabsContent(){
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
});