const menutoggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-menu');

nav.addEventListener("click", function(){
    nav.classList.toggle("active");
    menutoggle.classList.remove("active")
});

menutoggle.addEventListener("click", function(){
    menutoggle.classList.toggle("active")
    nav.classList.toggle("active")
});


// ===== Change Color of navigation bar when triggered ==== //
window.addEventListener('scroll', function(){
    const header = document.querySelector('header');
    header.classList.toggle("sticky", window.scrollY > 0);
});
